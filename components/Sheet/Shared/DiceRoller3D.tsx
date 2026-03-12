
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Workaround for R3F types in this specific environment
const Mesh = 'mesh' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const LineSegments = 'lineSegments' as any;
const EdgesGeometry = 'edgesGeometry' as any;
const LineBasicMaterial = 'lineBasicMaterial' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const DirectionalLight = 'directionalLight' as any;
const SpotLight = 'spotLight' as any;

// --- UTILS ---

const getContrastingColor = (hex: string) => {
    // Remove hash
    const c = hex.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; 
    return luma < 100 ? '#ffffff' : '#000000';
};

// --- GEOMETRY FACTORY ---

// Smaller radius for less intrusive dice
const BASE_RADIUS = 0.35;

const createDiceGeometry = (type: string): THREE.BufferGeometry => {
    let geom;
    switch (type) {
        case 'd4':
            geom = new THREE.TetrahedronGeometry(BASE_RADIUS * 1.2);
            break;
        case 'd6':
            geom = new THREE.BoxGeometry(BASE_RADIUS * 1.6, BASE_RADIUS * 1.6, BASE_RADIUS * 1.6);
            break;
        case 'd8':
            geom = new THREE.OctahedronGeometry(BASE_RADIUS);
            break;
        case 'd10':
            // Use Icosahedron (20 faces) for D10 to give it a rounder, more readable shape
            // We will map digits 0-9 twice
            geom = new THREE.IcosahedronGeometry(BASE_RADIUS); 
            break;
        case 'd12':
            geom = new THREE.DodecahedronGeometry(BASE_RADIUS);
            break;
        case 'd20':
        default:
            geom = new THREE.IcosahedronGeometry(BASE_RADIUS);
            break;
    }
    geom.computeVertexNormals();
    return geom;
};

// --- DICE MESH COMPONENT ---

interface DieProps {
    type: string;
    result: number;
    color: string;
    position: [number, number, number];
    onComplete: () => void;
}

const Die: React.FC<DieProps> = ({ type, result, color, position, onComplete }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [landed, setLand] = useState(false);
    const contrastColor = useMemo(() => getContrastingColor(color), [color]);
    
    // Material Properties
    const materialProps = useMemo(() => ({
        color: color,
        roughness: 0.2,
        metalness: 0.3,
        flatShading: false,
    }), [color]);
    
    // Animation State
    const [rotationSpeed] = useState(() => new THREE.Vector3(
        (Math.random() - 0.5) * 30, 
        (Math.random() - 0.5) * 30, 
        (Math.random() - 0.5) * 30
    ));
    
    const [startOffset] = useState(() => new THREE.Vector3(
        (Math.random() - 0.5) * 5, 
        10 + Math.random() * 4, 
        (Math.random() - 0.5) * 2
    ));

    const geometry = useMemo(() => createDiceGeometry(type), [type]);
    
    // Face Calculation
    const faceData = useMemo(() => {
        const uniqueFaces: { pos: THREE.Vector3, normal: THREE.Vector3, id: string }[] = [];
        const posAttr = geometry.attributes.position;
        const indexAttr = geometry.index;
        
        if (!posAttr) return [];

        const count = indexAttr ? indexAttr.count / 3 : posAttr.count / 3;
        
        const getV = (i: number) => {
            const idx = indexAttr ? indexAttr.getX(i) : i;
            return new THREE.Vector3().fromBufferAttribute(posAttr, idx);
        };

        for (let i = 0; i < count; i++) {
            const v1 = getV(i * 3);
            const v2 = getV(i * 3 + 1);
            const v3 = getV(i * 3 + 2);
            
            const center = new THREE.Vector3().add(v1).add(v2).add(v3).divideScalar(3);
            const normal = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(v2, v1), new THREE.Vector3().subVectors(v3, v1)).normalize();
            
            // Round normals to group faces (D12 pentagons are 5 triangles)
            const precision = 1;
            const normalKey = `${normal.x.toFixed(precision)},${normal.y.toFixed(precision)},${normal.z.toFixed(precision)}`;
            
            const existing = uniqueFaces.find(f => f.id === normalKey);
            
            if (!existing) {
                uniqueFaces.push({ pos: center, normal, id: normalKey });
            } else {
                existing.pos.add(center).divideScalar(2);
            }
        }

        // Deterministic Sort
        uniqueFaces.sort((a, b) => {
            if (Math.abs(a.pos.y - b.pos.y) > 0.1) return b.pos.y - a.pos.y;
            return Math.atan2(a.pos.z, a.pos.x) - Math.atan2(b.pos.z, b.pos.x);
        });
        
        const pushOut = 1.05;
        return uniqueFaces.map(f => ({
            pos: f.pos.clone().multiplyScalar(pushOut), 
            normal: f.normal
        }));
    }, [geometry, type]);

    const targetFaceIndex = useMemo(() => {
        if (faceData.length === 0) return 0;
        // Simple modulo mapping to select a face from the sorted list
        return (result - 1) % faceData.length;
    }, [result, faceData.length]);

    const targetQuaternion = useMemo(() => {
        if (!faceData[targetFaceIndex]) return new THREE.Quaternion();
        
        const faceNorm = faceData[targetFaceIndex].normal.clone();
        
        // Point face normal towards CAMERA
        // Camera is fixed at [0, 6, 6] in parent component
        // Die lands at `position`
        const diePos = new THREE.Vector3(...position);
        const camPos = new THREE.Vector3(0, 6, 6);
        const targetDir = new THREE.Vector3().subVectors(camPos, diePos).normalize();
        
        const q = new THREE.Quaternion().setFromUnitVectors(faceNorm, targetDir);
        return q;
    }, [faceData, targetFaceIndex, position]);

    // Animation Loop
    const startTime = useRef(Date.now());
    const duration = 2000;

    useFrame(() => {
        if (!meshRef.current || landed) return;

        const now = Date.now();
        const elapsed = now - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        
        if (progress < 1) {
            // Spin
            if (progress < 0.6) {
                 const spinPower = (1 - progress / 0.6);
                 meshRef.current.rotation.x += rotationSpeed.x * spinPower * 0.1;
                 meshRef.current.rotation.y += rotationSpeed.y * spinPower * 0.1;
                 meshRef.current.rotation.z += rotationSpeed.z * spinPower * 0.1;
            } else {
                 // Align
                 const snapProgress = (progress - 0.6) / 0.4;
                 meshRef.current.quaternion.slerp(targetQuaternion, 0.2); 
            }

            // Position
            const targetPos = new THREE.Vector3(...position);
            const currentStart = startOffset.clone().add(targetPos);
            const currentPos = new THREE.Vector3().lerpVectors(currentStart, targetPos, easeOut);
            
            // Bounce
            const bounce = Math.abs(Math.sin(progress * Math.PI * 3)) * (1 - progress) * 2;
            currentPos.y += bounce;

            meshRef.current.position.copy(currentPos);
        } else {
            meshRef.current.position.set(...position);
            meshRef.current.quaternion.copy(targetQuaternion);
            setLand(true);
            setTimeout(onComplete, 1500); 
        }
    });

    return (
        <Mesh ref={meshRef} geometry={geometry}>
            <MeshStandardMaterial {...materialProps} />
            
            <LineSegments>
                <EdgesGeometry args={[geometry, 25]} /> 
                <LineBasicMaterial color={contrastColor} linewidth={2} opacity={0.6} transparent />
            </LineSegments>
            
            {faceData.map((face, i) => {
                let label = (i + 1).toString();
                
                // Special handling for D10 on Icosahedron (0-9 twice)
                if (type === 'd10') {
                    const val = (i % 10) + 1;
                    label = val === 10 ? '0' : val.toString();
                    
                    if (i === targetFaceIndex) {
                        label = result === 10 ? '0' : result.toString();
                    }
                } else if (i === targetFaceIndex) {
                    label = result.toString();
                }

                // For D20/D12/D10, use smaller font relative to face size
                const fontSize = type === 'd6' || type === 'd4' ? BASE_RADIUS * 0.8 : BASE_RADIUS * 0.5;

                return (
                    <Text
                        key={i}
                        position={face.pos}
                        quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), face.normal)}
                        fontSize={fontSize} 
                        color={contrastColor}
                        anchorX="center"
                        anchorY="middle"
                        font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff" 
                    >
                        {label}
                    </Text>
                );
            })}
        </Mesh>
    );
};

// --- MANAGER COMPONENT ---

export interface QueuedRoll {
    id: string;
    dice: { type: string, result: number }[];
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
             setTimeout(() => setActiveRoll(null), 500); 
         }
    };

    if (!activeRoll) return null;

    const count = activeRoll.dice.length;
    const spread = 1.2; 
    const positions = activeRoll.dice.map((_, i) => {
        const x = (i - (count - 1) / 2) * spread;
        return [x, 0, 0] as [number, number, number];
    });

    return (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
            <Canvas camera={{ position: [0, 6, 6], fov: 35 }} gl={{ alpha: true, antialias: true }}>
                <AmbientLight intensity={0.8} />
                <DirectionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
                <PointLight position={[-5, 5, -5]} intensity={0.5} />
                
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
            </Canvas>
        </div>
    );
};

export default DiceRoller3D;
