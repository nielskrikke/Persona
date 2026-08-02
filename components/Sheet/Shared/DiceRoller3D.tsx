import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Workaround for JSX elements in R3F environment
const Mesh = 'mesh' as any;
const MeshPhysicalMaterial = 'meshPhysicalMaterial' as any;
const LineSegments = 'lineSegments' as any;
const EdgesGeometry = 'edgesGeometry' as any;
const LineBasicMaterial = 'lineBasicMaterial' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const DirectionalLight = 'directionalLight' as any;

// --- UTILS ---

const getContrastingColor = (hex: string) => {
    if (!hex || hex.length < 6) return '#ffffff';
    const c = hex.replace('#', '');
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 120 ? '#fbfbfe' : '#111827';
};

// --- GEOMETRY FACTORY ---

const BASE_RADIUS = 0.45;

export interface FaceInfo {
    center: THREE.Vector3;
    normal: THREE.Vector3;
    up: THREE.Vector3;
    label: string;
}

const createDiceGeometryAndFaces = (type: string): { geometry: THREE.BufferGeometry, faces: FaceInfo[] } => {
    let geometry: THREE.BufferGeometry;

    switch (type) {
        case 'd4':
            geometry = new THREE.TetrahedronGeometry(BASE_RADIUS * 1.1);
            break;
        case 'd6':
            geometry = new THREE.BoxGeometry(BASE_RADIUS * 1.3, BASE_RADIUS * 1.3, BASE_RADIUS * 1.3);
            break;
        case 'd8':
            geometry = new THREE.OctahedronGeometry(BASE_RADIUS * 1.1);
            break;
        case 'd10':
            geometry = new THREE.IcosahedronGeometry(BASE_RADIUS);
            break;
        case 'd12':
            geometry = new THREE.DodecahedronGeometry(BASE_RADIUS);
            break;
        case 'd20':
        default:
            geometry = new THREE.IcosahedronGeometry(BASE_RADIUS);
            break;
    }

    geometry.computeVertexNormals();

    // Extract unique faces by grouping triangle normals
    const rawFaces: { center: THREE.Vector3; normal: THREE.Vector3; count: number }[] = [];
    const posAttr = geometry.attributes.position;
    const indexAttr = geometry.index;

    if (posAttr) {
        const triangleCount = indexAttr ? indexAttr.count / 3 : posAttr.count / 3;

        const getVertex = (i: number) => {
            const idx = indexAttr ? indexAttr.getX(i) : i;
            return new THREE.Vector3().fromBufferAttribute(posAttr, idx);
        };

        for (let i = 0; i < triangleCount; i++) {
            const v1 = getVertex(i * 3);
            const v2 = getVertex(i * 3 + 1);
            const v3 = getVertex(i * 3 + 2);

            const triCenter = new THREE.Vector3().add(v1).add(v2).add(v3).divideScalar(3);
            const triNormal = new THREE.Vector3()
                .crossVectors(new THREE.Vector3().subVectors(v2, v1), new THREE.Vector3().subVectors(v3, v1))
                .normalize();

            // Group adjacent triangles with near-identical normals (d12 pentagons)
            let found = false;
            for (const f of rawFaces) {
                if (f.normal.dot(triNormal) > 0.96) {
                    f.center.add(triCenter);
                    f.count++;
                    found = true;
                    break;
                }
            }

            if (!found) {
                rawFaces.push({ center: triCenter.clone(), normal: triNormal.clone(), count: 1 });
            }
        }
    }

    // Average cluster centers
    rawFaces.forEach(f => f.center.divideScalar(f.count));

    // Sort faces deterministically so layout is stable
    rawFaces.sort((a, b) => {
        if (Math.abs(a.normal.y - b.normal.y) > 0.05) return b.normal.y - a.normal.y;
        if (Math.abs(a.normal.z - b.normal.z) > 0.05) return b.normal.z - a.normal.z;
        return b.normal.x - a.normal.x;
    });

    // Determine total number of face labels
    const totalFaces = rawFaces.length;

    // Create FaceInfo objects with upright local directions and labels
    const faces: FaceInfo[] = rawFaces.map((f, i) => {
        const norm = f.normal.clone().normalize();
        
        // Calculate local "up" vector on face
        let up = new THREE.Vector3(0, 1, 0);
        if (Math.abs(norm.y) > 0.92) {
            up = new THREE.Vector3(0, 0, -1);
        }
        up.sub(norm.clone().multiplyScalar(up.dot(norm))).normalize();

        let label = (i + 1).toString();
        if (type === 'd10') {
            const d10Val = (i % 10) + 1;
            label = d10Val === 10 ? '0' : d10Val.toString();
        }

        return {
            center: f.center,
            normal: norm,
            up: up,
            label
        };
    });

    return { geometry, faces };
};

// --- DIE COMPONENT ---

interface DieProps {
    type: string;
    result: number;
    color: string;
    position: [number, number, number];
    onComplete: () => void;
}

const Die: React.FC<DieProps> = ({ type, result, color, position, onComplete }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [landed, setLanded] = useState(false);
    const contrastColor = useMemo(() => getContrastingColor(color), [color]);

    const { geometry, faces } = useMemo(() => createDiceGeometryAndFaces(type), [type]);

    // Find face index matching the result
    const targetFaceIndex = useMemo(() => {
        if (faces.length === 0) return 0;

        let formattedResult = result.toString();
        if (type === 'd10' && result === 10) formattedResult = '0';

        const matchIdx = faces.findIndex(f => f.label === formattedResult);
        if (matchIdx !== -1) return matchIdx;

        return Math.min(faces.length - 1, Math.max(0, result - 1));
    }, [faces, result, type]);

    // Target quaternion so that target face normal points directly at camera, with top pointing screen-up
    const targetQuaternion = useMemo(() => {
        if (!faces[targetFaceIndex]) return new THREE.Quaternion();

        const targetFace = faces[targetFaceIndex];
        const diePos = new THREE.Vector3(...position);
        const camPos = new THREE.Vector3(0, 6, 6);

        // Vector from die to camera
        const targetDir = new THREE.Vector3().subVectors(camPos, diePos).normalize();

        // Screen up vector
        const worldUp = new THREE.Vector3(0, 1, 0);
        const camUpWorld = worldUp.clone().sub(targetDir.clone().multiplyScalar(worldUp.dot(targetDir))).normalize();
        const camRightWorld = new THREE.Vector3().crossVectors(camUpWorld, targetDir).normalize();

        // Local face directions
        const N_local = targetFace.normal.clone().normalize();
        const Up_local = targetFace.up.clone().normalize();
        const Right_local = new THREE.Vector3().crossVectors(Up_local, N_local).normalize();

        // Matrix mapping local face basis to camera basis
        const mLocal = new THREE.Matrix4().makeBasis(Right_local, Up_local, N_local);
        const mWorld = new THREE.Matrix4().makeBasis(camRightWorld, camUpWorld, targetDir);

        // R = mWorld * mLocal^T
        const mRotation = new THREE.Matrix4().multiplyMatrices(mWorld, mLocal.invert());
        return new THREE.Quaternion().setFromRotationMatrix(mRotation);
    }, [faces, targetFaceIndex, position]);

    // Animation variables
    const [rotationSpeed] = useState(() => new THREE.Vector3(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35
    ));

    const [startOffset] = useState(() => new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        7 + Math.random() * 3,
        (Math.random() - 0.5) * 2
    ));

    const startTime = useRef(Date.now());
    const duration = 1800; // ms

    useFrame(() => {
        if (!meshRef.current || landed) return;

        const elapsed = Date.now() - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        if (progress < 1) {
            // Spinning phase
            if (progress < 0.55) {
                const spinFactor = (1 - progress / 0.55);
                meshRef.current.rotation.x += rotationSpeed.x * spinFactor * 0.08;
                meshRef.current.rotation.y += rotationSpeed.y * spinFactor * 0.08;
                meshRef.current.rotation.z += rotationSpeed.z * spinFactor * 0.08;
            } else {
                // Slerp into exact target quaternion
                const slerpFactor = Math.min(1, (progress - 0.55) / 0.45);
                meshRef.current.quaternion.slerp(targetQuaternion, 0.25 + slerpFactor * 0.2);
            }

            // Position & bounce
            const targetPos = new THREE.Vector3(...position);
            const startPos = startOffset.clone().add(targetPos);
            const currentPos = new THREE.Vector3().lerpVectors(startPos, targetPos, easeOut);

            // Bouncing arc
            const bounce = Math.abs(Math.sin(progress * Math.PI * 3.5)) * (1 - progress) * 2.2;
            currentPos.y += bounce;

            meshRef.current.position.copy(currentPos);
        } else {
            // Landed cleanly
            meshRef.current.position.set(...position);
            meshRef.current.quaternion.copy(targetQuaternion);
            setLanded(true);
            setTimeout(onComplete, 1200);
        }
    });

    return (
        <Mesh ref={meshRef} geometry={geometry}>
            <MeshPhysicalMaterial 
                color={color}
                roughness={0.15}
                metalness={0.25}
                clearcoat={0.6}
                clearcoatRoughness={0.1}
                reflectivity={0.9}
            />

            {/* Sharp Metallic Bevel Edges */}
            <LineSegments>
                <EdgesGeometry args={[geometry, 20]} />
                <LineBasicMaterial color={contrastColor} linewidth={2} opacity={0.5} transparent />
            </LineSegments>

            {/* Upright Text Labels on Each Face */}
            {faces.map((face, i) => {
                const labelText = face.label;

                // Create local quaternion for text child to align text +Z with face normal and text +Y with face up
                const N_local = face.normal.clone().normalize();
                const Up_local = face.up.clone().normalize();
                const Right_local = new THREE.Vector3().crossVectors(Up_local, N_local).normalize();

                const textMatrix = new THREE.Matrix4().makeBasis(Right_local, Up_local, N_local);
                const textQuat = new THREE.Quaternion().setFromRotationMatrix(textMatrix);

                // Offset text slightly outside face to avoid z-fighting
                const textPos = face.center.clone().add(N_local.clone().multiplyScalar(0.015));

                const fontSize = type === 'd6' || type === 'd4' ? BASE_RADIUS * 0.75 : BASE_RADIUS * 0.48;

                return (
                    <Text
                        key={i}
                        position={textPos}
                        quaternion={textQuat}
                        fontSize={fontSize}
                        color={contrastColor}
                        anchorX="center"
                        anchorY="middle"
                        font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
                    >
                        {labelText}
                    </Text>
                );
            })}
        </Mesh>
    );
};

// --- MANAGER COMPONENT ---

export interface QueuedRoll {
    id: string;
    dice: { type: string; result: number }[];
    color: string;
    effect?: string;
}

const DiceRoller3D = ({ rollQueue, onRollComplete }: { rollQueue: QueuedRoll | null, onRollComplete: (id: string) => void }) => {
    const [activeRoll, setActiveRoll] = useState<QueuedRoll | null>(null);

    useEffect(() => {
        if (rollQueue && rollQueue.id !== activeRoll?.id) {
            setActiveRoll(rollQueue);
        }
    }, [rollQueue]);

    const handleDieComplete = () => {
        if (activeRoll) {
            onRollComplete(activeRoll.id);
            setTimeout(() => setActiveRoll(null), 400);
        }
    };

    if (!activeRoll) return null;

    const count = activeRoll.dice.length;
    const spread = 1.3;
    const positions = activeRoll.dice.map((_, i) => {
        const x = (i - (count - 1) / 2) * spread;
        return [x, 0.2, 0] as [number, number, number];
    });

    return (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
            <Canvas camera={{ position: [0, 6, 6], fov: 35 }} gl={{ alpha: true, antialias: true }}>
                <AmbientLight intensity={1.2} />
                <DirectionalLight position={[6, 12, 6]} intensity={2.0} castShadow />
                <PointLight position={[-6, 6, -4]} intensity={0.8} />

                {activeRoll.dice.map((die, i) => (
                    <Die
                        key={`${activeRoll.id}-${i}`}
                        type={die.type}
                        result={die.result}
                        color={activeRoll.color || '#c9ad6a'}
                        position={positions[i]}
                        onComplete={i === count - 1 ? handleDieComplete : () => {}}
                    />
                ))}

                <ContactShadows position={[0, -0.2, 0]} opacity={0.6} scale={10} blur={2} far={4} />
            </Canvas>
        </div>
    );
};

export default DiceRoller3D;
