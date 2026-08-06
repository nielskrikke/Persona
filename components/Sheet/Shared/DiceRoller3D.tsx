import React, { useEffect, useRef, useState } from 'react';
import DiceBox, { DiceBoxGroupResult } from '@3d-dice/dice-box';
import { DiceCustomizationOptions } from '@/types';
import { normalizeDiceCustomization, resolveDiceTheme } from '@/utils/diceThemes';

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
  const fadeTimeoutRef = useRef<number | null>(null);
  const clearTimeoutRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);

  const clearPendingTimers = () => {
    if (fadeTimeoutRef.current !== null) {
      window.clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    if (clearTimeoutRef.current !== null) {
      window.clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }
  };

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

    return () => {
      clearPendingTimers();
    };
  }, []);

  useEffect(() => {
    if (!request || handledRequestRef.current === request.id) return;
    const requestId = request.id;
    handledRequestRef.current = requestId;

    // Clear any previous fade/clear timers when a new roll starts
    clearPendingTimers();

    (async () => {
      try {
        if (!initRef.current) {
          throw new Error('Dice Box initialization failed');
        }

        const normalized = normalizeDiceCustomization(request.customization, request.color);
        const resolved = resolveDiceTheme(normalized.theme);

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Dice Box timeout')), 10000)
        );

        const rollPromise = (async () => {
          const box = await initRef.current;
          if (!box) throw new Error('Dice Box unavailable');

          try {
            await box.clear();
          } catch (_) {
            // ignore clear error
          }

          setActive(true);

          const configObj: Record<string, any> = {
            theme: resolved.runtimeTheme,
            enableShadows: normalized.enableShadows,
            shadowTransparency: normalized.shadowTransparency,
            lightIntensity: normalized.lightIntensity,
            scale: normalized.scale,
            spinForce: normalized.spinForce,
            throwForce: normalized.throwForce,
          };

          if (resolved.supportsThemeColor) {
            configObj.themeColor = normalized.color;
          }

          if (resolved.preloadThemes && resolved.preloadThemes.length > 0) {
            configObj.preloadThemes = resolved.preloadThemes;
          }

          try {
            await box.updateConfig(configObj as any);

            const rollOpts: Record<string, any> = {
              theme: resolved.runtimeTheme,
            };
            if (resolved.supportsThemeColor) {
              rollOpts.themeColor = normalized.color;
            }

            return await box.roll(request.notation, rollOpts as any);
          } catch (themeErr) {
            console.warn(`Failed to roll with theme ${resolved.runtimeTheme}. Retrying with default theme:`, themeErr);
            await box.updateConfig({
              theme: 'default',
              themeColor: normalized.color,
              enableShadows: normalized.enableShadows,
              shadowTransparency: normalized.shadowTransparency,
              lightIntensity: normalized.lightIntensity,
              scale: normalized.scale,
              spinForce: normalized.spinForce,
              throwForce: normalized.throwForce,
            } as any);

            return await box.roll(request.notation, {
              theme: 'default',
              themeColor: normalized.color,
            } as any);
          }
        })();

        const results = await Promise.race([rollPromise, timeoutPromise]);

        onComplete(requestId, results);

        // Extended hold duration of rolled 3D dice on screen to 3 seconds post-roll
        fadeTimeoutRef.current = window.setTimeout(() => {
          fadeTimeoutRef.current = null;
          // Begin smooth 700ms ease-out opacity transition
          setActive(false);

          // Clear physics scene after 700ms opacity fade out completes to prevent pop-out artifacting
          clearTimeoutRef.current = window.setTimeout(() => {
            clearTimeoutRef.current = null;
            boxRef.current?.clear();
          }, 700);
        }, 3000);
      } catch (cause) {
        onError(requestId, cause instanceof Error ? cause : new Error(String(cause)));
        setActive(false);
        boxRef.current?.clear();
      }
    })();
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
        className={`fixed inset-0 z-[1000] pointer-events-none overflow-hidden transition-opacity duration-700 ease-out ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}
