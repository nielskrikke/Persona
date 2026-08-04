import React, { useEffect, useRef, useState } from 'react';
import DiceBox from '@3d-dice/dice-box';
import { CharacterState, DiceCustomizationOptions } from '@/types';
import { Dices, Palette, Volume2, VolumeX, Check, RotateCcw, Sliders, Sun } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterState;
  onUpdate: (updates: Partial<CharacterState>) => void;
}

const DEFAULT_CUSTOMIZATION: DiceCustomizationOptions = {
  color: '#eab308',
  finish: 'metallic',
  scale: 6,
  lightIntensity: 1.4,
  shadowTransparency: 0.7,
  spinForce: 6,
  throwForce: 5,
  soundEnabled: true,
};

const QUICK_COLORS = [
  '#c9ad6a', '#eab308', '#dc2626', '#991b1b', '#2563eb', 
  '#7e22ce', '#059669', '#0891b2', '#f43f5e', '#18181b', 
  '#f8fafc', '#71717a'
];

export default function DiceCustomizerModal({ isOpen, onClose, character, onUpdate }: Props) {
  const [config, setConfig] = useState<DiceCustomizationOptions>(() => {
    const baseColor = character.diceColor || DEFAULT_CUSTOMIZATION.color;
    return {
      ...DEFAULT_CUSTOMIZATION,
      color: baseColor,
      ...(character.diceCustomization || {}),
    };
  });

  const [activeTab, setActiveTab] = useState<'colors' | 'lighting' | 'physics'>('colors');
  const [previewResult, setPreviewResult] = useState<string | null>(null);
  const [isRollingPreview, setIsRollingPreview] = useState(false);

  const previewBoxRef = useRef<DiceBox | null>(null);
  const initRef = useRef<Promise<DiceBox> | null>(null);

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
          shadowTransparency: config.shadowTransparency ?? 0.7,
          lightIntensity: config.lightIntensity ?? 1.4,
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
    const activeCfg = overrideConfig || config;
    if (isRollingPreview) return;
    setIsRollingPreview(true);
    setPreviewResult(null);

    try {
      if (!initRef.current) {
        throw new Error('Preview not ready');
      }
      const box = await initRef.current;
      box.clear();

      await box.updateConfig({
        theme: 'default',
        themeColor: activeCfg.color || '#eab308',
        scale: 10,
        lightIntensity: activeCfg.lightIntensity ?? 1.4,
        shadowTransparency: activeCfg.shadowTransparency ?? 0.7,
        spinForce: activeCfg.spinForce || 6,
        throwForce: activeCfg.throwForce || 5,
      } as any);

      const results = await box.roll(['1d20', '1d6'], {
        theme: 'default',
        themeColor: activeCfg.color || '#eab308',
      } as any);

      if (results && results.length > 0) {
        const values = results.map((r: any) => r.value || 0);
        const total = values.reduce((a: number, b: number) => a + b, 0);
        setPreviewResult(`Rolled: ${values.join(' + ')} = ${total}`);
      }
    } catch (err) {
      console.warn('Preview roll error:', err);
    } finally {
      setIsRollingPreview(false);
    }
  };

  const handleSave = () => {
    onUpdate({
      diceColor: config.color,
      diceCustomization: config,
      show3DDice: true,
    });
    onClose();
  };

  if (!isOpen) return null;

  // Compute container overlay filter
  const getFilterStyle = () => {
    let filterStr = '';

    switch (config.finish) {
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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[500] flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-[#121318] border border-dnd-gold/40 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
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
                  Studio
                </span>
              </h2>
              <p className="text-xs text-gray-400">Customize dice colors, material finishes, lighting and physics</p>
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
          <div className="lg:col-span-5 bg-[#0a0b0e] p-6 flex flex-col justify-between items-center border-b lg:border-b-0 lg:border-r border-gray-800/80 relative min-h-[300px]">
            
            {/* Background Canvas Host */}
            <div className="w-full flex-1 relative flex items-center justify-center min-h-[240px] overflow-hidden rounded-xl border border-gray-800/60 bg-gradient-to-b from-gray-950 via-[#0d0f14] to-black">
              
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
                style={{ filter: getFilterStyle() }}
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

              {/* Center Roll Prompt if empty */}
              {!previewResult && !isRollingPreview && (
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
                { id: 'colors', label: 'Colors & Finish', icon: Palette },
                { id: 'lighting', label: 'Lighting & Shadow', icon: Sun },
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
            <div className="flex-1 space-y-6 min-h-[280px]">

              {/* COLORS & FINISH TAB */}
              {activeTab === 'colors' && (
                <div className="space-y-5">
                  {/* Main Dice Color */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Main Dice Color
                    </label>
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-gray-800 flex-1">
                        <input 
                          type="color" 
                          value={config.color || '#eab308'} 
                          onChange={e => setConfig(prev => ({ ...prev, color: e.target.value }))}
                          className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={config.color || '#eab308'} 
                          onChange={e => setConfig(prev => ({ ...prev, color: e.target.value }))}
                          className="bg-transparent text-xs font-mono text-gray-300 outline-none uppercase w-full"
                        />
                      </div>
                    </div>
                    {/* Swatches */}
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_COLORS.map(hex => (
                        <button
                          key={hex}
                          onClick={() => setConfig(prev => ({ ...prev, color: hex }))}
                          className={`w-7 h-7 rounded-lg border transition-transform ${
                            config.color === hex ? 'border-white scale-110 shadow-md' : 'border-black/40 hover:scale-105'
                          }`}
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Material Finish Shader */}
                  <div className="pt-2 border-t border-gray-800/60">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Material Finish
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'solid', name: 'Solid' },
                        { id: 'metallic', name: 'Metallic' },
                        { id: 'glossy', name: 'Glossy' },
                        { id: 'shadow', name: 'Dark Shadow' },
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setConfig(prev => ({ ...prev, finish: f.id as any }))}
                          className={`py-3 px-3 rounded-xl border text-center font-bold text-xs transition-all ${
                            config.finish === f.id
                              ? 'bg-dnd-gold text-black border-dnd-gold shadow-md'
                              : 'bg-gray-900/50 border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800/50'
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LIGHTING & SHADOW TAB */}
              {activeTab === 'lighting' && (
                <div className="space-y-6">
                  {/* Light Intensity */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Key Light Intensity
                      </label>
                      <span className="text-xs font-mono text-dnd-gold font-bold">{config.lightIntensity ?? 1.4}x</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="2.5" step="0.1" 
                      value={config.lightIntensity ?? 1.4}
                      onChange={e => setConfig(prev => ({ ...prev, lightIntensity: parseFloat(e.target.value) }))}
                      className="w-full accent-dnd-gold cursor-pointer"
                    />
                  </div>

                  {/* Shadow Transparency */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Surface Shadow Opacity
                      </label>
                      <span className="text-xs font-mono text-dnd-gold font-bold">{Math.round((config.shadowTransparency ?? 0.7) * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0.0" max="1.0" step="0.05" 
                      value={config.shadowTransparency ?? 0.7}
                      onChange={e => setConfig(prev => ({ ...prev, shadowTransparency: parseFloat(e.target.value) }))}
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
                      <span className="text-xs font-mono text-dnd-gold font-bold">{config.scale || 6}x</span>
                    </div>
                    <input 
                      type="range" min="4.0" max="10.0" step="0.5" 
                      value={config.scale || 6}
                      onChange={e => setConfig(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                      className="w-full accent-dnd-gold cursor-pointer"
                    />
                  </div>

                  {/* Throw Force */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Throw Velocity
                      </label>
                      <span className="text-xs font-mono text-dnd-gold font-bold">{config.throwForce || 5}x</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="1" 
                      value={config.throwForce || 5}
                      onChange={e => setConfig(prev => ({ ...prev, throwForce: parseInt(e.target.value) }))}
                      className="w-full accent-dnd-gold cursor-pointer"
                    />
                  </div>

                  {/* Spin Force */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Spin / Tumble Torque
                      </label>
                      <span className="text-xs font-mono text-dnd-gold font-bold">{config.spinForce || 6}x</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" step="1" 
                      value={config.spinForce || 6}
                      onChange={e => setConfig(prev => ({ ...prev, spinForce: parseInt(e.target.value) }))}
                      className="w-full accent-dnd-gold cursor-pointer"
                    />
                  </div>

                  {/* Sound Effect Toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-gray-900/50 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3">
                      {config.soundEnabled ? <Volume2 size={20} className="text-dnd-gold" /> : <VolumeX size={20} className="text-gray-500" />}
                      <div>
                        <div className="text-xs font-bold text-white uppercase">Dice Roll Sound FX</div>
                        <div className="text-[10px] text-gray-400">Audible clatter audio effects when dice impact the surface</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        config.soundEnabled ? 'bg-dnd-gold' : 'bg-gray-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black transition-transform ${
                        config.soundEnabled ? 'translate-x-6' : 'translate-x-0'
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
                  const resetCfg = { ...DEFAULT_CUSTOMIZATION, color: character.diceColor || DEFAULT_CUSTOMIZATION.color };
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
