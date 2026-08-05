import React, { useEffect, useRef, useState } from 'react';
import DiceBox, { DiceBoxGroupResult } from '@3d-dice/dice-box';
import { DiceCustomizationOptions } from '@/types';
import { normalizeDiceCustomization, resolvePersonaDiceTheme } from '@/utils/diceThemes';

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

        const normalized = normalizeDiceCustomization(request.customization, request.color);
        const resolvedTheme = resolvePersonaDiceTheme(normalized.surface, normalized.edgeStyle);

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Dice Box timeout')), 10000)
        );

        const rollPromise = (async () => {
          const box = await initRef.current;
          if (!box || cancelled) throw new Error('Dice Box unavailable');
          setActive(true);

          const diceColor = normalized.color;
          const diceScale = normalized.scale;
          const lightIntensity = normalized.lightIntensity;
          const shadowTransparency = normalized.shadowTransparency;

          const configObj: Record<string, any> = {
            theme: resolvedTheme.diceBoxTheme,
            scale: diceScale,
            lightIntensity,
            shadowTransparency,
            spinForce: normalized.spinForce,
            throwForce: normalized.throwForce,
          };
          if (resolvedTheme.supportsThemeColor) {
            configObj.themeColor = diceColor;
          }

          try {
            await box.updateConfig(configObj as any);

            const rollOpts: Record<string, any> = {
              theme: resolvedTheme.diceBoxTheme,
            };
            if (resolvedTheme.supportsThemeColor) {
              rollOpts.themeColor = diceColor;
            }

            return await box.roll(request.notation, rollOpts as any);
          } catch (themeErr) {
            console.warn(`Failed to roll with theme ${resolvedTheme.diceBoxTheme}. Retrying with default theme:`, themeErr);
            // Fallback retry with default theme
            await box.updateConfig({
              theme: 'default',
              themeColor: diceColor,
              scale: diceScale,
              lightIntensity,
              shadowTransparency,
              spinForce: normalized.spinForce,
              throwForce: normalized.throwForce,
            } as any);

            return await box.roll(request.notation, {
              theme: 'default',
              themeColor: diceColor,
            } as any);
          }
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
          }, 1200);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [request, onComplete, onError]);

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
        className={`fixed inset-0 z-[1000] pointer-events-none overflow-hidden transition-opacity duration-200 ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}
