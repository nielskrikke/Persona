
import React, { useState, useEffect, useRef } from 'react';
import { WIDGET_LABELS, ALL_WIDGETS, WIDGET_METADATA } from '../../../data/constants';
import { CharacterState } from '@/types';

const WidgetCard = ({ id, onRemove }: { id: string, onRemove?: () => void }) => {
    const meta = WIDGET_METADATA[id] || { icon: '?', desc: 'Widget', color: 'text-gray-400' };
    return (
        <div className={`bg-[#1b1c20] border border-gray-700 rounded-lg p-3 cursor-move hover:border-dnd-gold transition-all shadow-sm group flex flex-col w-full relative`}>
            {onRemove && (
                <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    &times;
                </button>
            )}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className={`text-lg ${meta.color}`}>{meta.icon}</span>
                    <span className="font-bold text-gray-200 text-sm group-hover:text-white">{WIDGET_LABELS[id]}</span>
                </div>
                <span className="text-gray-600 text-xs">☰</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-tight">{meta.desc}</p>
        </div>
    );
};

const LayoutManagerModal = ({ 
    isOpen, onClose, layout, onSave, character 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    layout: {left: string[], right: string[], mobile: string[]}, 
    onSave: (layout: {left: string[], right: string[], mobile: string[]}) => void,
    character: CharacterState 
}) => {
    const [tab, setTab] = useState<'desktop' | 'mobile'>('desktop');
    const [leftCol, setLeftCol] = useState<string[]>([]);
    const [rightCol, setRightCol] = useState<string[]>([]);
    const [mobileLayout, setMobileLayout] = useState<string[]>([]);
    const [unused, setUnused] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const dragItem = useRef<{col: string, idx: number} | null>(null);

    // Filter Widgets based on class/level requirements
    const isArtillerist = character.classes.some(c => c.definition.index === 'artificer' && c.subclass?.index === 'artillerist' && c.level >= 3);
    const visibleWidgets = ALL_WIDGETS.filter(id => {
        if (id === 'eldritchCannon' && !isArtillerist) return false;
        return true;
    });

    useEffect(() => {
        if (isOpen) {
            const dedupe = (arr: string[]) => Array.from(new Set(arr || []));
            setLeftCol(dedupe(layout.left));
            setRightCol(dedupe(layout.right));
            setMobileLayout(dedupe(layout.mobile));
            
            refreshUnused(dedupe(layout.left), dedupe(layout.right));
            setSearch('');
        }
    }, [isOpen, layout]);

    const refreshUnused = (left: string[], right: string[]) => {
        const used = new Set([...left, ...right]);
        setUnused(visibleWidgets.filter(w => !used.has(w)));
    };

    if (!isOpen) return null;

    const handleDragStart = (e: React.DragEvent, col: string, idx: number) => {
        dragItem.current = { col, idx };
    };

    const handleDrop = (e: React.DragEvent, targetCol: string) => {
        e.preventDefault();
        const src = dragItem.current;
        if (!src) return;

        let item = '';
        const newLeft = [...leftCol];
        const newRight = [...rightCol];
        const newUnused = [...unused];

        // Remove from source
        if (src.col === 'left') { item = newLeft.splice(src.idx, 1)[0]; }
        else if (src.col === 'right') { item = newRight.splice(src.idx, 1)[0]; }
        else if (src.col === 'unused') { 
            const filteredUnused = unused.filter(w => WIDGET_LABELS[w].toLowerCase().includes(search.toLowerCase()));
            item = filteredUnused[src.idx];
            const realIdx = newUnused.indexOf(item);
            if (realIdx > -1) newUnused.splice(realIdx, 1);
        }

        // Add to target
        if (targetCol === 'left') { newLeft.push(item); }
        else if (targetCol === 'right') { newRight.push(item); }
        else { newUnused.push(item); }

        setLeftCol(newLeft);
        setRightCol(newRight);
        setUnused(newUnused);
        dragItem.current = null;
    };

    const handleSave = () => {
        onSave({ left: leftCol, right: rightCol, mobile: mobileLayout });
        onClose();
    };

    const toggleMobileWidget = (id: string) => {
        setMobileLayout(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
    };

    const filteredUnused = unused.filter(w => WIDGET_LABELS[w].toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-[#121316] border border-dnd-gold rounded-xl w-full max-w-6xl shadow-2xl relative flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-6 text-gray-500 hover:text-white text-2xl transition-colors z-30">&times;</button>
                
                <div className="p-6 border-b border-gray-800 bg-[#1b1c20] rounded-t-xl shrink-0">
                    <h2 className="text-2xl font-serif text-dnd-gold mb-4">Layout Manager</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setTab('desktop')}
                            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${tab === 'desktop' ? 'bg-dnd-gold text-black' : 'bg-gray-800 text-gray-500'}`}
                        >
                            Desktop Layout
                        </button>
                        <button 
                            onClick={() => setTab('mobile')}
                            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${tab === 'mobile' ? 'bg-dnd-gold text-black' : 'bg-gray-800 text-gray-500'}`}
                        >
                            Mobile Layout
                        </button>
                    </div>
                </div>

                <div className="flex-grow flex overflow-hidden">
                    {tab === 'desktop' ? (
                        <>
                        <div className="w-1/3 border-r border-gray-800 flex flex-col bg-[#16171a]">
                            <div className="p-4 border-b border-gray-800">
                                <input 
                                    type="text" 
                                    placeholder="Search widgets..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-[#0b0c0e] border border-gray-700 rounded p-2 text-white text-sm focus:border-dnd-gold outline-none"
                                />
                            </div>
                            <div 
                                className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-3"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, 'unused')}
                            >
                                {filteredUnused.map((item, idx) => (
                                    <div 
                                        key={item} 
                                        draggable 
                                        onDragStart={(e) => dragItem.current = { col: 'unused', idx }}
                                    >
                                        <WidgetCard id={item} />
                                    </div>
                                ))}
                                {filteredUnused.length === 0 && (
                                    <div className="text-center text-gray-600 text-xs italic py-10">No widgets found.</div>
                                )}
                            </div>
                        </div>

                        <div className="w-2/3 flex flex-col p-6 bg-[#121316]">
                            <div className="grid grid-cols-2 gap-6 h-full">
                                <div className="flex flex-col h-full">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">Left Column</h3>
                                    <div 
                                        className="flex-grow bg-[#0b0c0e] border-2 border-dashed border-gray-800 rounded-xl p-3 overflow-y-auto custom-scrollbar space-y-3"
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, 'left')}
                                    >
                                        {leftCol.map((item, idx) => (
                                            <div key={item} draggable onDragStart={(e) => handleDragStart(e, 'left', idx)}>
                                                <WidgetCard id={item} onRemove={() => setLeftCol(prev => prev.filter((_, i) => i !== idx))} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col h-full">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">Right Column</h3>
                                    <div 
                                        className="flex-grow bg-[#0b0c0e] border-2 border-dashed border-gray-800 rounded-xl p-3 overflow-y-auto custom-scrollbar space-y-3"
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, 'right')}
                                    >
                                        {rightCol.map((item, idx) => (
                                            <div key={item} draggable onDragStart={(e) => handleDragStart(e, 'right', idx)}>
                                                <WidgetCard id={item} onRemove={() => setRightCol(prev => prev.filter((_, i) => i !== idx))} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col p-8 bg-[#121316] overflow-y-auto custom-scrollbar">
                            <h3 className="text-xl font-serif text-white mb-2">Configure Mobile View</h3>
                            <p className="text-sm text-gray-400 mb-8">Select the widgets you want to appear on your mobile home screen ("Stats" tab).</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {visibleWidgets.map(id => {
                                    const active = mobileLayout.includes(id);
                                    const meta = WIDGET_METADATA[id] || { icon: '?', desc: 'Widget', color: 'text-gray-400' };
                                    return (
                                        <button 
                                            key={id}
                                            onClick={() => toggleMobileWidget(id)}
                                            className={`p-4 rounded-xl border text-left transition-all relative ${active ? 'bg-dnd-gold/10 border-dnd-gold shadow-[0_0_15px_rgba(201,173,106,0.2)]' : 'bg-gray-800 border-gray-700 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-2xl ${active ? meta.color : 'text-gray-500'}`}>{meta.icon}</span>
                                                {active && <span className="text-dnd-gold text-lg">✓</span>}
                                            </div>
                                            <div className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-400'}`}>{WIDGET_LABELS[id]}</div>
                                            <div className="text-[9px] text-gray-500 uppercase mt-1 leading-tight">{meta.desc}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-800 bg-[#1b1c20] rounded-b-xl flex justify-end gap-4 shrink-0">
                    <button onClick={onClose} className="px-6 py-3 text-gray-500 hover:text-white font-bold uppercase text-xs tracking-widest">Cancel</button>
                    <button onClick={handleSave} className="bg-dnd-gold hover:bg-yellow-600 text-black px-8 py-3 rounded font-bold uppercase text-sm shadow-lg transition-colors">
                        Save Layout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LayoutManagerModal;
