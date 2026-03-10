import React, { useState } from 'react';
import { CharacterState } from '@/types';
import { WIDGET_BG } from '../../../data/constants';

interface FeaturesTabProps {
    character: CharacterState;
    setCharacter: React.Dispatch<React.SetStateAction<CharacterState>>;
    getAllFeatures: () => any[];
    setSelectedDetail: (item: any) => void;
    onTabChange?: (tab: any) => void;
    setShowHomebrewModal: (val: boolean, tab?: 'race' | 'class' | 'subclass' | 'background' | 'spell' | 'item' | 'wildshape' | 'familiar' | 'feat') => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({ character, setCharacter, getAllFeatures, setSelectedDetail, onTabChange, setShowHomebrewModal }) => {
    const [featureFilter, setFeatureFilter] = useState('All');
    const [featureSearch, setFeatureSearch] = useState('');

    const filteredFeatures = getAllFeatures().filter(f => (featureFilter === 'All' || f.type === featureFilter) && f.name.toLowerCase().includes(featureSearch.toLowerCase()));

    const updateFeatureUsage = (name: string, used: number) => {
        setCharacter(prev => {
            const usage = prev.featureUsage[name];
            if (!usage) return prev;
            return {
                ...prev,
                featureUsage: {
                    ...prev.featureUsage,
                    [name]: { ...usage, current: usage.max - used }
                }
            };
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {Object.keys(character.featureUsage).length > 0 && (
                <section className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(character.featureUsage).map(([name, usage]: [string, any]) => {
                            const usedCount = usage.max - usage.current;
                            return (
                                <div key={name} className={`${WIDGET_BG} border border-[#3e4149]/50 hover:border-gray-600 rounded-xl p-4 shadow-xl transition-all group`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="overflow-hidden">
                                            <h4 className="font-bold text-white text-sm truncate group-hover:text-dnd-gold transition-colors">{name}</h4>
                                            <div className="text-[9px] text-gray-500 font-bold tracking-tight">Resets on {usage.reset || 'long'} rest</div>
                                        </div>
                                        <div className="bg-black/40 px-2 py-0.5 rounded border border-gray-800 text-[10px] font-bold text-gray-400">
                                            {usage.current} / {usage.max}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {Array.from({ length: usage.max }).map((_, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => {
                                                    const targetUsed = i + 1;
                                                    const finalUsed = usedCount === targetUsed ? i : targetUsed;
                                                    updateFeatureUsage(name, finalUsed);
                                                }}
                                                className={`w-4 h-4 rounded-full border transition-all ${
                                                    i < usedCount 
                                                    ? 'bg-dnd-red border-dnd-red shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]' 
                                                    : 'bg-transparent border-gray-600 hover:border-gray-500'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    {name === 'Arrow Crafting' && onTabChange && (
                                        <button 
                                            onClick={() => onTabChange('inventory')}
                                            className="mt-3 text-[10px] text-dnd-gold hover:text-white uppercase font-black tracking-tighter flex items-center gap-1.5 transition-colors pt-2 border-t border-gray-800/50 w-full"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                                            Manage Quiver
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            <section className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                        <div className="flex gap-2 items-center overflow-x-auto pb-1 no-scrollbar">
                            {['All', 'Class', 'Race', 'Feat'].map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => setFeatureFilter(f)} 
                                    className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors ${featureFilter === f ? 'bg-white text-black border-white' : 'bg-black/40 text-gray-400 border-gray-600'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search features..." 
                            value={featureSearch} 
                            onChange={(e) => setFeatureSearch(e.target.value)} 
                            className="text-[9px] font-bold uppercase px-3 py-1.5 rounded border bg-black/40 text-white border-gray-700 focus:border-dnd-gold outline-none w-full md:w-64 placeholder:text-gray-600" 
                        />
                    </div>
                </div>

                <div className={`${WIDGET_BG} border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-2xl`}>
                    <div className="grid grid-cols-[2fr_1.5fr_60px_2.5fr] gap-4 px-6 py-3 bg-[#121316]/80 border-b border-[#3e4149]/50 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                        <div>Feature</div>
                        <div>Source</div>
                        <div className="text-center">Level</div>
                        <div>Description</div>
                    </div>
                    <div className="divide-y divide-[#2e3036]/60">
                        {filteredFeatures.map(feat => (
                            <div 
                                key={feat.uniqueId} 
                                onClick={() => setSelectedDetail(feat)} 
                                className="grid grid-cols-[2fr_1.5fr_60px_2.5fr] gap-4 px-6 py-4 items-center hover:bg-[#2e3036]/60 cursor-pointer group transition-all"
                            >
                                <div className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">{feat.name}</div>
                                <div className="text-xs text-gray-400">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                                        feat.type === 'Class' ? 'bg-blue-900/20 border-blue-800 text-blue-400' : 
                                        feat.type === 'Race' ? 'bg-green-900/20 border-green-800 text-green-400' : 
                                        'bg-orange-900/20 border-orange-800 text-orange-400'
                                    }`}>
                                        {feat.source || feat.type}
                                    </span>
                                </div>
                                <div className="text-center text-xs text-gray-500 font-mono">{feat.level === '-' ? '-' : `Lvl ${feat.level}`}</div>
                                <div className="text-xs text-gray-500 truncate font-serif italic">
                                    {feat.desc ? feat.desc[0] : ''}
                                </div>
                            </div>
                        ))}
                        {filteredFeatures.length === 0 && (
                            <div className="px-6 py-12 text-center text-gray-600 italic text-sm">
                                No records found in the current archives.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FeaturesTab;