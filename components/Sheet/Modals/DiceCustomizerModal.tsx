import React, { useEffect, useRef, useState } from 'react';
import DiceBox from '@3d-dice/dice-box';
import { CharacterState, DiceCustomizationOptions, OfficialDiceThemeId } from '@/types';
import {
  normalizeDiceCustomization,
  resolveDiceTheme,
  OFFICIAL_DICE_THEMES,
  DiceThemeDefinition,
} from '@/utils/diceThemes';
import { Dices, Palette, Volume2, VolumeX, Check, RotateCcw, Sliders, Sun, Info, Moon, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterState;
  onUpdate: (updates: Partial<CharacterState>) => void;
}

const QUICK_COLORS = [
  '#c9ad6a', '#eab308', '#dc2626', '#991b1b', '#2563eb', 
  '#7e22ce', '#059669', '#0891b2', '#f43f5e', '#18181b', 
  '#f8fafc', '#71717a'
];

export default function DiceCustomizerModal({ isOpen, onClose, character, onUpdate }: Props) {
  const [config, setConfig] = useState<DiceCustomizationOptions>(() => {
    return normalizeDiceCustomization(character.diceCustomization, character.diceColor);
  });

  const [activeTab, setActiveTab] = useState<'theme' | 'lighting' | 'physics'>('theme');
  const [previewResult, setPreviewResult] = useState<string | null>(null);
  const [isRollingPreview, setIsRollingPreview] = useState(false);
  const [previewNotice, setPreviewNotice] = useState<string | null>(null);

  const previewBoxRef = useRef<DiceBox | null>(null);
  const initRef = useRef<Promise<DiceBox> | null>(null);
  const rollDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rollRequestIdRef = useRef(0);

  // Initialize preview DiceBox
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const containerEl = document.querySelector('#dice-preview-host');
      if (!containerEl || previewBoxRef.current) return;

      try {
        const box = new DiceBox({
          container: '#dice-preview-host',
          assetPath: '/assets/dice-box/',
          theme: 'default',
          enableShadows: true,
          shadowTransparency: config.shadowTransparency ?? 0.8,
          lightIntensity: config.lightIntensity ?? 1,
          scale: 10,
          delay: 10,
          offscreen: true,
        });
        previewBoxRef.current = box;
        initRef.current = box.init().then(() => box);
      } catch (err) {
        console.error('Failed to init preview dice box:', err);
      }
    }, 120);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen && previewBoxRef.current) {
      try {
        previewBoxRef.current.clear();
      } catch (_) {}
      previewBoxRef.current = null;
      initRef.current = null;
    }
  }, [isOpen]);

  // Roll preview dice
  const handleRollPreview = async (overrideConfig?: DiceCustomizationOptions) => {
    rollRequestIdRef.current += 1;
    const currentRequestId = rollRequestIdRef.current;

    const activeCfg = normalizeDiceCustomization(overrideConfig || config);
    const resolved = resolveDiceTheme(activeCfg.theme);

    setIsRollingPreview(true);
    setPreviewResult(null);
    setPreviewNotice(null);

    try {
      if (!initRef.current) {
        throw new Error('Preview not ready');
      }
      const box = await initRef.current;
      box.clear();

      if (currentRequestId !== rollRequestIdRef.current) return;

      const configObj: Record<string, any> = {
        theme: resolved.runtimeTheme,
        enableShadows: activeCfg.enableShadows,
        shadowTransparency: activeCfg.shadowTransparency,
        lightIntensity: activeCfg.lightIntensity,
        scale: 10,
        spinForce: activeCfg.spinForce,
        throwForce: activeCfg.throwForce,
      };

      if (resolved.supportsThemeColor) {
        configObj.themeColor = activeCfg.color;
      }

      if (resolved.preloadThemes && resolved.preloadThemes.length > 0) {
        configObj.preloadThemes = resolved.preloadThemes;
      }

      await box.updateConfig(configObj as any);

      if (currentRequestId !== rollRequestIdRef.current) return;

      const rollOpts: Record<string, any> = {
        theme: resolved.runtimeTheme,
      };
      if (resolved.supportsThemeColor) {
        rollOpts.themeColor = activeCfg.color;
      }

      const results = await box.roll(['1d20', '1d6'], rollOpts as any);
      if (currentRequestId !== rollRequestIdRef.current) return;

      if (results && results.length > 0) {
        const values = results.map((r: any) => r.value || 0);
        const total = values.reduce((a: number, b: number) => a + b, 0);
        setPreviewResult(`Rolled: ${values.join(' + ')} = ${total}`);
      }
    } catch (err) {
      console.warn('Preview roll error:', err);
      if (currentRequestId === rollRequestIdRef.current) {
        setPreviewNotice('Failed to load theme preview. Recovering with default...');
      }
    } finally {
      if (currentRequestId === rollRequestIdRef.current) {
        setIsRollingPreview(false);
      }
    }
  };

  const updateConfigAndDebounceRoll = (newConfig: DiceCustomizationOptions) => {
    setConfig(newConfig);
    if (rollDebounceTimerRef.current) {
      clearTimeout(rollDebounceTimerRef.current);
    }
    rollDebounceTimerRef.current = setTimeout(() => {
      handleRollPreview(newConfig);
    }, 400);
  };

  const handleSelectTheme = (themeId: OfficialDiceThemeId) => {
    let nextColor = config.color;
    if (themeId === 'rust' && !config.color) {
      nextColor = '#aa4f4a';
    }
    const nextConfig: DiceCustomizationOptions = {
      ...config,
      theme: themeId,
      color: nextColor,
    };
    updateConfigAndDebounceRoll(nextConfig);
  };

  const handleSave = () => {
    const normalized = normalizeDiceCustomization(config);
    onUpdate({
      diceColor: normalized.color,
      diceCustomization: normalized,
      show3DDice: true,
    });
    onClose();
  };

  if (!isOpen) return null;

  const currentNormalized = normalizeDiceCustomization(config);
  const currentResolved = resolveDiceTheme(currentNormalized.theme);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[500] flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-[#121318] border border-dnd-gold/40 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/80 bg-gradient-to-r from-gray-900/90 to-[#161820]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-dnd-gold/10 border border-dnd-gold/30 rounded-xl text-dnd-gold">
              <Dices size={22} />
            </div>
            <div>
              <h2 className="text-xl font-serif text-white font-bold flex items-center gap-2">
                3D Dice Forge
                <span className="text-[10px] font-mono px-2 py-0.5 bg-dnd-gold/20 text-dnd-gold border border-dnd-gold/30 rounded-full uppercase tracking-wider">
                  Official Catalog
                </span>
              </h2>
              <p className="text-xs text-gray-400">Select official 3D themes, material colors, lighting and physics</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg bg-gray-800/60 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors text-lg"
          >
            &times;
          </button>
        </div>

        {/* Modal Body - 2 Columns on Desktop */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Interactive 3D Preview Canvas */}
          <div className="lg:col-span-5 bg-[#0a0b0e] p-6 flex flex-col justify-between items-center border-b lg:border-b-0 lg:border-r border-gray-800/80 relative min-h-[320px]">
            
            {/* Background Canvas Host */}
            <div className="w-full flex-1 relative flex items-center justify-center min-h-[250px] overflow-hidden rounded-xl border border-gray-800/60 bg-gradient-to-b from-gray-950 via-[#0d0f14] to-black">
              
              <style>{`
                #dice-preview-host canvas {
                  width: 100% !important;
                  height: 100% !important;
                  display: block !important;
                  pointer-events: none !important;
                }
              `}</style>

              {/* The 3D Canvas element */}
              <div 
                id="dice-preview-host" 
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Preview Status Banner */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-gray-800">
                  Live Preview
                </div>
                {previewResult && (
                  <div className="text-xs font-bold text-dnd-gold bg-black/85 backdrop-blur-md px-3 py-1 rounded-full border border-dnd-gold/40 shadow-lg animate-in zoom-in-95">
                    {previewResult}
                  </div>
                )}
              </div>

              {/* Notice Overlay */}
              {previewNotice && (
                <div className="absolute bottom-3 left-3 right-3 text-[11px] text-amber-300 bg-black/90 backdrop-blur-md p-2 rounded-lg border border-amber-500/30 z-10 text-center">
                  {previewNotice}
                </div>
              )}

              {/* Center Roll Prompt if empty */}
              {!previewResult && !isRollingPreview && !previewNotice && (
                <p className="text-xs text-gray-500 italic pointer-events-none z-10 text-center px-4">
                  Click 'Roll Test Dice' below to test d20 + d6 in preview
                </p>
              )}
            </div>

            {/* Test Roll Controls */}
            <div className="w-full mt-4 flex items-center gap-3">
              <button
                onClick={() => handleRollPreview()}
                disabled={isRollingPreview}
                className="flex-1 py-3 bg-gradient-to-r from-dnd-gold to-yellow-600 hover:from-yellow-500 hover:to-amber-600 text-black font-black uppercase text-xs tracking-wider rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Dices size={16} className={isRollingPreview ? 'animate-spin' : ''} />
                {isRollingPreview ? 'Rolling Preview Dice...' : 'Roll Test Dice (d20 + d6)'}
              </button>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-6">
            
            {/* Category Tabs */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-gray-800 gap-1">
              {[
                { id: 'theme', label: 'Theme & Color', icon: Palette },
                { id: 'lighting', label: 'Lighting & Shadows', icon: Sun },
                { id: 'physics', label: 'Scale & Physics', icon: Sliders },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      isActive 
                        ? 'bg-dnd-gold text-black shadow-md' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 space-y-6 min-h-[300px]">

              {/* THEME & COLOR TAB */}
              {activeTab === 'theme' && (
                <div className="space-y-5">

                  {/* Official Theme Catalog */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Official Dice Theme
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {OFFICIAL_DICE_THEMES.map((themeDef: DiceThemeDefinition) => {
                        const isSelected = currentNormalized.theme === themeDef.id;

                        return (
                          <button
                            key={themeDef.id}
                            type="button"
                            onClick={() => handleSelectTheme(themeDef.id)}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-dnd-gold/15 border-dnd-gold text-white shadow-md ring-1 ring-dnd-gold'
                                : 'bg-gray-900/50 border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold uppercase tracking-wide text-white">
                                {themeDef.label}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                {themeDef.supportsThemeColor ? (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                                    Colorable
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-gray-800 text-gray-400 border border-gray-700 rounded">
                                    Fixed
                                  </span>
                                )}
                                {themeDef.extends && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                                    Extends {themeDef.extends}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                              {themeDef.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Main Dice Color (Only for Colorable Themes) */}
                  {currentResolved.supportsThemeColor ? (
                    <div className="pt-2 border-t border-gray-800/60">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        Theme Color
                      </label>
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-gray-800 flex-1">
                          <input 
                            type="color" 
                            value={currentNormalized.color} 
                            onChange={e => updateConfigAndDebounceRoll({ ...config, color: e.target.value })}
                            className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                          />
                          <input 
                            type="text" 
                            value={currentNormalized.color} 
                            onChange={e => updateConfigAndDebounceRoll({ ...config, color: e.target.value })}
                            className="bg-transparent text-xs font-mono text-gray-300 outline-none uppercase w-full"
                          />
                        </div>
                      </div>
                      {/* Quick Swatches */}
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_COLORS.map(hex => (
                          <button
                            key={hex}
                            onClick={() => updateConfigAndDebounceRoll({ ...config, color: hex })}
                            className={`w-7 h-7 rounded-lg border transition-transform ${
                              currentNormalized.color === hex ? 'border-white scale-110 shadow-md' : 'border-black/40 hover:scale-105'
                            }`}
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-gray-800/60 p-3 bg-gray-900/60 rounded-xl border border-gray-800 flex items-start gap-2 text-xs text-gray-400">
                      <Info size={16} className="text-dnd-gold shrink-0 mt-0.5" />
                      <span>This official theme uses fixed colors supplied by its asset bundle.</span>
                    </div>
                  )}

                </div>
              )}

              {/* LIGHTING & SHADOW TAB */}
              {activeTab === 'lighting' && (
                <div className="space-y-6">
                  {/* Enable Shadows Toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-gray-900/50 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3">
                      <Moon size={20} className={currentNormalized.enableShadows ? 'text-dnd-gold' : 'text-gray-500'} />
                      <div>
                        <div className="text-xs font-bold text-white uppercase">Cast Directional Shadows</div>
                        <div className="text-[10px] text-gray-400">Render dynamic contact shadows under dice on tray surface</div>
                      </div>
                    </div>
                    <button
                      onClick={() => updateConfigAndDebounceRoll({ ...config, enableShadows: !currentNormalized.enableShadows })}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        currentNormalized.enableShadows ? 'bg-dnd-gold' : 'bg-gray-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black transition-transform ${
                        currentNormalized.enableShadows ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Light Intensity */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Key Light Intensity
                      </label>
                      <span className="text-xs font-mono text-dnd-gold font-bold">{currentNormalized.lightIntensity}x</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="2.5" step="0.1" 
                      value={currentNormalized.lightIntensity}
                      onChange={e => updateConfigAndDebounceRoll({ ...config, lightIntensity: parseFloat(e.target.value) })}
                      className="w-full accent-dnd-gold cursor-pointer"
                    />
                  </div>

                  {/* Shadow Transparency */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Surface Shadow Opacity
                      </label>
                      <span className="text-xs font-mono text-dnd-gold font-bold">{Math.round(currentNormalized.shadowTransparency * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0.0" max="1.0" step="0.05" 
                      value={currentNormalized.shadowTransparency}
                      onChange={e => updateConfigAndDebounceRoll({ ...config, shadowTransparency: parseFloat(e.target.value) })}
                      className="w-full accent-dnd-gold cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* SCALE & PHYSICS TAB */}
              {activeTab === 'physics' && (
                <div className="space-y-5">
                  {/* Dice Scale */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Screen Dice Scale
                      </label>
                      <span className="text-xs font-mono text-dnd-gold font-bold">{currentNormalized.scale}x</span>
                    </div>
                    <input 
                      type="range" min="4.0" max="10.0" step="0.5" 
                      value={currentNormalized.scale}
                      onChange={e => updateConfigAndDebounceRoll({ ...config, scale: parseFloat(e.target.value) })}
                      className="w-full accent-dnd-gold cursor-pointer"
                    />
                  </div>

                  {/* Throw Force */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Throw Velocity
                      </label>
                      <span className="text-xs font-mono text-dnd-gold font-bold">{currentNormalized.throwForce}x</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="1" 
                      value={currentNormalized.throwForce}
                      onChange={e => updateConfigAndDebounceRoll({ ...config, throwForce: parseInt(e.target.value) })}
                      className="w-full accent-dnd-gold cursor-pointer"
                    />
                  </div>

                  {/* Spin Force */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Spin / Tumble Torque
                      </label>
                      <span className="text-xs font-mono text-dnd-gold font-bold">{currentNormalized.spinForce}x</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="1" 
                      value={currentNormalized.spinForce}
                      onChange={e => updateConfigAndDebounceRoll({ ...config, spinForce: parseInt(e.target.value) })}
                      className="w-full accent-dnd-gold cursor-pointer"
                    />
                  </div>

                  {/* Sound Effect Toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-gray-900/50 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3">
                      {currentNormalized.soundEnabled ? <Volume2 size={20} className="text-dnd-gold" /> : <VolumeX size={20} className="text-gray-500" />}
                      <div>
                        <div className="text-xs font-bold text-white uppercase">Dice Roll Sound FX</div>
                        <div className="text-[10px] text-gray-400">Audible clatter audio effects when dice impact the surface</div>
                      </div>
                    </div>
                    <button
                      onClick={() => updateConfigAndDebounceRoll({ ...config, soundEnabled: !config.soundEnabled })}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        currentNormalized.soundEnabled ? 'bg-dnd-gold' : 'bg-gray-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black transition-transform ${
                        currentNormalized.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800/80 gap-3">
              <button
                onClick={() => {
                  const resetCfg = normalizeDiceCustomization(undefined, '#eab308');
                  setConfig(resetCfg);
                  handleRollPreview(resetCfg);
                }}
                className="px-3.5 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/50 text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={14} /> Reset Defaults
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white text-xs font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-dnd-gold hover:bg-yellow-500 text-black font-black uppercase text-xs tracking-wider rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  <Check size={16} /> Save & Apply Custom Dice
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
