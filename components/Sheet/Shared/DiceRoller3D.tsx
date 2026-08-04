import React, { useEffect, useRef, useState } from 'react';
import DiceBox, { DiceBoxGroupResult } from '@3d-dice/dice-box';
import { DiceCustomizationOptions } from '@/types';

export interface DiceBoxRollRequest {
  id: string;
  notation: Array<{ qty: number; sides: number; modifier: number }>;
  color: string;
  customization?: DiceCustomizationOptions;
}

interface Props {
  request: DiceBoxRollRequest | null;
  onComplete: (id: string, results: DiceBoxGroupResult[]) => void;
  onError: (id: string, error: Error) => void;
}

export default function DiceRoller3D({ request, onComplete, onError }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<DiceBox | null>(null);
  const initRef = useRef<Promise<DiceBox> | null>(null);
  const handledRequestRef = useRef<string | null>(null);
  const [active, setActive] = useState(false);
  const [activeCustomization, setActiveCustomization] = useState<DiceCustomizationOptions | null>(null);

  useEffect(() => {
    if (!hostRef.current || boxRef.current || initRef.current) return;

    try {
      const box = new DiceBox({
        container: '#dice-box-host',
        assetPath: '/assets/dice-box/',
        theme: 'default',
        enableShadows: true,
        shadowTransparency: 0.8,
        lightIntensity: 1,
        scale: 5,
        delay: 10,
        offscreen: true,
      });
      boxRef.current = box;
      initRef.current = box.init().then(() => box).catch((err) => {
        initRef.current = null;
        boxRef.current = null;
        throw err;
      });
    } catch (err) {
      initRef.current = null;
      boxRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!request || handledRequestRef.current === request.id) return;
    handledRequestRef.current = request.id;
    let cancelled = false;

    (async () => {
      try {
        if (!initRef.current) {
          throw new Error('Dice Box initialization failed');
        }

        const cust = request.customization || { color: request.color };
        setActiveCustomization(cust);

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Dice Box timeout')), 10000)
        );

        const rollPromise = (async () => {
          const box = await initRef.current;
          if (!box || cancelled) throw new Error('Dice Box unavailable');
          setActive(true);

          const diceColor = cust.color || request.color || '#c9ad6a';
          const diceScale = cust.scale || 5;
          const lightIntensity = cust.lightIntensity ?? 1.2;
          const shadowTransparency = cust.shadowTransparency ?? 0.8;

          await box.updateConfig({
            theme: 'default',
            themeColor: diceColor,
            scale: diceScale,
            lightIntensity,
            shadowTransparency,
            spinForce: cust.spinForce || 6,
            throwForce: cust.throwForce || 5,
          } as any);

          return await box.roll(request.notation, {
            theme: 'default',
            themeColor: diceColor,
          } as any);
        })();

        const results = await Promise.race([rollPromise, timeoutPromise]);
        if (!cancelled) {
          onComplete(request.id, results);
        }
      } catch (cause) {
        if (!cancelled) {
          onError(request.id, cause instanceof Error ? cause : new Error(String(cause)));
        }
      } finally {
        if (!cancelled) {
          window.setTimeout(() => {
            boxRef.current?.clear();
            setActive(false);
            setActiveCustomization(null);
          }, 1200);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [request, onComplete, onError]);

  // Compute container overlay filters for finish shader
  const getFilterStyle = () => {
    const cust = activeCustomization || request?.customization;
    if (!cust) return '';
    let filterStr = '';

    switch (cust.finish) {
      case 'metallic':
        filterStr += 'brightness(1.2) contrast(1.25) saturate(1.2)';
        break;
      case 'glossy':
        filterStr += 'brightness(1.15) saturate(1.3)';
        break;
      case 'shadow':
        filterStr += 'brightness(0.7) contrast(1.35)';
        break;
      default:
        break;
    }

    return filterStr.trim();
  };

  return (
    <>
      <style>{`
        #dice-box-host canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          pointer-events: none !important;
        }
      `}</style>
      <div
        id="dice-box-host"
        ref={hostRef}
        aria-hidden="true"
        style={{ filter: getFilterStyle() }}
        className={`fixed inset-0 z-[1000] pointer-events-none overflow-hidden transition-opacity duration-200 ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}
