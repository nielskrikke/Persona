
import React from 'react';
import { LogEntry, EncounteredCreature, SessionNote } from '@/types';
import { AutoSaveInput, AutoSaveTextarea } from '../Shared/AutoSaveInputs';

export const QuestLogSection = ({ 
    title, 
    items, 
    onUpdate, 
    icon 
}: { 
    title: string, 
    items: LogEntry[], 
    onUpdate: (items: LogEntry[]) => void, 
    icon?: React.ReactNode 
}) => {
    const [selectedItem, setSelectedItem] = React.useState<LogEntry | null>(null);

    const addItem = () => {
        const newItem: LogEntry = { 
            id: Date.now().toString(), 
            name: '', 
            description: '', 
            status: 'active' 
        };
        onUpdate([...items, newItem]);
        setSelectedItem(newItem);
    };
    
    const updateItem = (id: string, updates: Partial<LogEntry>) => {
        onUpdate(items.map(i => i.id === id ? { ...i, ...updates } : i));
        if (selectedItem?.id === id) {
            setSelectedItem(prev => prev ? { ...prev, ...updates } : null);
        }
    };
    
    const removeItem = (id: string) => {
         onUpdate(items.filter(i => i.id !== id));
         if (selectedItem?.id === id) setSelectedItem(null);
    };

    return (
        <div className="bg-[#1b1c20]/95 border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-[#121316] px-6 py-4 flex justify-between items-center shrink-0 border-b border-[#3e4149]/50">
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
                </div>
                <button 
                    onClick={addItem}
                    className="text-[10px] font-bold uppercase text-gray-500 border border-[#3e4149]/50 bg-transparent hover:text-gray-300 hover:border-gray-600 hover:bg-gray-800 px-3 py-1 rounded transition-colors"
                >
                    + Add Quest
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 border-b border-gray-800">
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Quest Name</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 w-32">Status</th>
                            <th className="px-6 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-600 text-xs italic">
                                    No active quests.
                                </td>
                            </tr>
                        ) : (
                            items.map(item => (
                                <tr 
                                    key={item.id} 
                                    onClick={() => setSelectedItem(item)}
                                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-4 text-xs font-medium text-gray-200">{item.name || 'Untitled Quest'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                                            item.status === 'completed' ? 'text-green-500 border-green-500/30 bg-green-500/5' :
                                            item.status === 'failed' ? 'text-red-500 border-red-500/30 bg-red-500/5' :
                                            'text-blue-400 border-blue-400/30 bg-blue-400/5'
                                        }`}>
                                            {item.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                            className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedItem && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1b1c20] border border-[#3e4149] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="bg-[#121316] px-8 py-6 border-b border-[#3e4149] flex justify-between items-center">
                            <AutoSaveInput 
                                value={selectedItem.name} 
                                onSave={(val) => updateItem(selectedItem.id, { name: val })}
                                className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-dnd-gold outline-none text-xl font-bold text-white w-full mr-4"
                                placeholder="Quest Name..."
                            />
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="text-gray-500 hover:text-white transition-colors text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="flex items-center gap-4">
                                <label className="text-[10px] font-black uppercase text-gray-500">Status</label>
                                <select 
                                    value={selectedItem.status || 'active'} 
                                    onChange={(e) => updateItem(selectedItem.id, { status: e.target.value })}
                                    className={`text-xs font-bold uppercase bg-black border border-gray-700 rounded px-3 py-1.5 outline-none cursor-pointer [&>option]:bg-[#1b1c20] [&>option]:text-white ${
                                        selectedItem.status === 'completed' ? 'text-green-500' :
                                        selectedItem.status === 'failed' ? 'text-red-500' :
                                        'text-blue-400'
                                    }`}
                                >
                                    <option value="active">Active</option>
                                    <option value="completed">Complete</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Description & Objectives</label>
                                <AutoSaveTextarea 
                                    value={selectedItem.description}
                                    onSave={(val) => updateItem(selectedItem.id, { description: val })}
                                    className="w-full bg-black/20 border border-gray-800/50 rounded-lg p-4 text-sm text-gray-300 outline-none focus:border-gray-600 min-h-[300px] resize-y"
                                    placeholder="Details, objectives, rewards..."
                                />
                            </div>
                        </div>
                        
                        <div className="bg-[#121316] px-8 py-4 border-t border-[#3e4149] flex justify-end">
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ContactLogSection = ({ 
    title, 
    items, 
    onUpdate, 
    icon 
}: { 
    title: string, 
    items: LogEntry[], 
    onUpdate: (items: LogEntry[]) => void, 
    icon?: React.ReactNode 
}) => {
    const [selectedItem, setSelectedItem] = React.useState<LogEntry | null>(null);

    const addItem = () => {
        const newItem: LogEntry = { 
            id: Date.now().toString(), 
            name: '', 
            description: '', 
            relationship: 'Neutral',
            status: 'Unknown',
            location: ''
        };
        onUpdate([...items, newItem]);
        setSelectedItem(newItem);
    };
    
    const updateItem = (id: string, updates: Partial<LogEntry>) => {
        onUpdate(items.map(i => i.id === id ? { ...i, ...updates } : i));
        if (selectedItem?.id === id) {
            setSelectedItem(prev => prev ? { ...prev, ...updates } : null);
        }
    };
    
    const removeItem = (id: string) => {
         onUpdate(items.filter(i => i.id !== id));
         if (selectedItem?.id === id) setSelectedItem(null);
    };

    return (
        <div className="bg-[#1b1c20]/95 border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-[#121316] px-6 py-4 flex justify-between items-center shrink-0 border-b border-[#3e4149]/50">
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
                </div>
                <button 
                    onClick={addItem}
                    className="text-[10px] font-bold uppercase text-gray-500 border border-[#3e4149]/50 bg-transparent hover:text-gray-300 hover:border-gray-600 hover:bg-gray-800 px-3 py-1 rounded transition-colors"
                >
                    + Add Person
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 border-b border-gray-800">
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Name</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 w-24">Relation</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Location</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 w-24">Status</th>
                            <th className="px-6 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-600 text-xs italic">
                                    No contacts recorded.
                                </td>
                            </tr>
                        ) : (
                            items.map(item => (
                                <tr 
                                    key={item.id} 
                                    onClick={() => setSelectedItem(item)}
                                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-4 text-xs font-medium text-gray-200">{item.name || 'Unknown Person'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                                            item.relationship === 'Ally' ? 'text-green-500 border-green-500/30 bg-green-500/5' :
                                            item.relationship === 'Enemy' ? 'text-red-500 border-red-500/30 bg-red-500/5' :
                                            'text-gray-400 border-gray-700/30 bg-gray-700/5'
                                        }`}>
                                            {item.relationship || 'Neutral'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400 truncate max-w-[120px]">{item.location || '---'}</td>
                                    <td className="px-6 py-4 text-[9px] font-bold uppercase text-gray-500">{item.status || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                            className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedItem && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1b1c20] border border-[#3e4149] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="bg-[#121316] px-8 py-6 border-b border-[#3e4149] flex justify-between items-center">
                            <AutoSaveInput 
                                value={selectedItem.name} 
                                onSave={(val) => updateItem(selectedItem.id, { name: val })}
                                className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-dnd-gold outline-none text-xl font-bold text-white w-full mr-4"
                                placeholder="Name..."
                            />
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="text-gray-500 hover:text-white transition-colors text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500">Relationship</label>
                                    <select 
                                        value={selectedItem.relationship || 'Neutral'} 
                                        onChange={(e) => updateItem(selectedItem.id, { relationship: e.target.value })}
                                        className={`w-full text-xs font-bold uppercase bg-black border border-gray-700 rounded px-3 py-1.5 outline-none cursor-pointer [&>option]:bg-[#1b1c20] [&>option]:text-white ${
                                            selectedItem.relationship === 'Ally' ? 'text-green-500' :
                                            selectedItem.relationship === 'Enemy' ? 'text-red-500' :
                                            'text-gray-400'
                                        }`}
                                    >
                                        <option value="Ally">Ally</option>
                                        <option value="Neutral">Neutral</option>
                                        <option value="Enemy">Enemy</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500">Status</label>
                                    <select 
                                        value={selectedItem.status || 'Unknown'} 
                                        onChange={(e) => updateItem(selectedItem.id, { status: e.target.value })}
                                        className="w-full text-xs font-bold uppercase bg-black border border-gray-700 rounded px-3 py-1.5 outline-none cursor-pointer text-gray-400 [&>option]:bg-[#1b1c20] [&>option]:text-white"
                                    >
                                        <option value="Alive">Alive</option>
                                        <option value="Dead">Dead</option>
                                        <option value="Missing">Missing</option>
                                        <option value="Unknown">Unknown</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500">Location</label>
                                    <AutoSaveInput 
                                        value={selectedItem.location || ''} 
                                        onSave={(val) => updateItem(selectedItem.id, { location: val })}
                                        className="w-full bg-black/40 border border-gray-700 rounded px-3 py-1.5 outline-none text-xs text-gray-300"
                                        placeholder="Location..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Notes & History</label>
                                <AutoSaveTextarea 
                                    value={selectedItem.description}
                                    onSave={(val) => updateItem(selectedItem.id, { description: val })}
                                    className="w-full bg-black/20 border border-gray-800/50 rounded-lg p-4 text-sm text-gray-300 outline-none focus:border-gray-600 min-h-[250px] resize-y"
                                    placeholder="Appearance, first meeting, important info..."
                                />
                            </div>
                        </div>
                        
                        <div className="bg-[#121316] px-8 py-4 border-t border-[#3e4149] flex justify-end">
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const CreatureLogSection = ({ 
    title, 
    items, 
    onUpdate, 
    icon 
}: { 
    title: string, 
    items: EncounteredCreature[], 
    onUpdate: (items: EncounteredCreature[]) => void, 
    icon?: React.ReactNode 
}) => {
    const [selectedItem, setSelectedItem] = React.useState<EncounteredCreature | null>(null);

    const addItem = () => {
        const newItem: EncounteredCreature = { 
            id: Date.now().toString(), 
            name: '', 
            ac: 10,
            hp: 10,
            weaknesses: '',
            resistances: '',
            immunities: '',
            notes: ''
        };
        onUpdate([...items, newItem]);
        setSelectedItem(newItem);
    };
    
    const updateItem = (id: string, updates: Partial<EncounteredCreature>) => {
        onUpdate(items.map(i => i.id === id ? { ...i, ...updates } : i));
        if (selectedItem?.id === id) {
            setSelectedItem(prev => prev ? { ...prev, ...updates } : null);
        }
    };
    
    const removeItem = (id: string) => {
         onUpdate(items.filter(i => i.id !== id));
         if (selectedItem?.id === id) setSelectedItem(null);
    };

    return (
        <div className="bg-[#1b1c20]/95 border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-[#121316] px-6 py-4 flex justify-between items-center shrink-0 border-b border-[#3e4149]/50">
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
                </div>
                <button 
                    onClick={addItem}
                    className="text-[10px] font-bold uppercase text-gray-500 border border-[#3e4149]/50 bg-transparent hover:text-gray-300 hover:border-gray-600 hover:bg-gray-800 px-3 py-1 rounded transition-colors"
                >
                    + Add Creature
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 border-b border-gray-800">
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Creature Name</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 w-20">AC</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 w-20">HP</th>
                            <th className="px-6 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-600 text-xs italic">
                                    No creatures encountered.
                                </td>
                            </tr>
                        ) : (
                            items.map(item => (
                                <tr 
                                    key={item.id} 
                                    onClick={() => setSelectedItem(item)}
                                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-4 text-xs font-medium text-gray-200">{item.name || 'Unknown Creature'}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-blue-400">{item.ac || '---'}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-red-400">{item.hp || '---'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                            className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedItem && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1b1c20] border border-[#3e4149] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="bg-[#121316] px-8 py-6 border-b border-[#3e4149] flex justify-between items-center">
                            <AutoSaveInput 
                                value={selectedItem.name} 
                                onSave={(val) => updateItem(selectedItem.id, { name: val })}
                                className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-dnd-gold outline-none text-xl font-bold text-white w-full mr-4"
                                placeholder="Creature Name..."
                            />
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="text-gray-500 hover:text-white transition-colors text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500">Armor Class</label>
                                    <AutoSaveInput 
                                        type="number"
                                        value={selectedItem.ac?.toString() || '0'} 
                                        onSave={(val) => updateItem(selectedItem.id, { ac: parseInt(val) || 0 })}
                                        className="w-full bg-black/40 border border-gray-700 rounded px-3 py-1.5 outline-none text-xs text-blue-400 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500">Hit Points</label>
                                    <AutoSaveInput 
                                        type="number"
                                        value={selectedItem.hp?.toString() || '0'} 
                                        onSave={(val) => updateItem(selectedItem.id, { hp: parseInt(val) || 0 })}
                                        className="w-full bg-black/40 border border-gray-700 rounded px-3 py-1.5 outline-none text-xs text-red-400 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-gray-500">Weaknesses</label>
                                    <AutoSaveInput 
                                        value={selectedItem.weaknesses || ''} 
                                        onSave={(val) => updateItem(selectedItem.id, { weaknesses: val })}
                                        className="w-full bg-transparent border-b border-gray-800 hover:border-gray-600 focus:border-dnd-gold outline-none text-xs text-red-400"
                                        placeholder="Fire, silver, radiant..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-gray-500">Resistances</label>
                                    <AutoSaveInput 
                                        value={selectedItem.resistances || ''} 
                                        onSave={(val) => updateItem(selectedItem.id, { resistances: val })}
                                        className="w-full bg-transparent border-b border-gray-800 hover:border-gray-600 focus:border-dnd-gold outline-none text-xs text-blue-400"
                                        placeholder="Cold, poison, non-magical..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase text-gray-500">Immunities</label>
                                    <AutoSaveInput 
                                        value={selectedItem.immunities || ''} 
                                        onSave={(val) => updateItem(selectedItem.id, { immunities: val })}
                                        className="w-full bg-transparent border-b border-gray-800 hover:border-gray-600 focus:border-dnd-gold outline-none text-xs text-green-400"
                                        placeholder="Psychic, charm, exhaustion..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Abilities & Lore</label>
                                <AutoSaveTextarea 
                                    value={selectedItem.notes}
                                    onSave={(val) => updateItem(selectedItem.id, { notes: val })}
                                    className="w-full bg-black/20 border border-gray-800/50 rounded-lg p-4 text-sm text-gray-300 outline-none focus:border-gray-600 min-h-[200px] resize-y"
                                    placeholder="Attacks, special traits, where they live..."
                                />
                            </div>
                        </div>
                        
                        <div className="bg-[#121316] px-8 py-4 border-t border-[#3e4149] flex justify-end">
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const SessionNoteLogSection = ({ 
    title, 
    items, 
    onUpdate, 
    icon 
}: { 
    title: string, 
    items: SessionNote[], 
    onUpdate: (items: SessionNote[]) => void, 
    icon?: React.ReactNode 
}) => {
    const [selectedNote, setSelectedNote] = React.useState<SessionNote | null>(null);

    const addItem = () => {
        const newItem: SessionNote = { 
            id: Date.now().toString(), 
            sessionNumber: items.length + 1,
            title: `Session ${items.length + 1}`,
            date: new Date().toLocaleDateString(),
            itemsFound: '',
            locationsDiscovered: '',
            generalNotes: ''
        };
        onUpdate([...items, newItem]);
        setSelectedNote(newItem);
    };
    
    const updateItem = (id: string, updates: Partial<SessionNote>) => {
        onUpdate(items.map(i => i.id === id ? { ...i, ...updates } : i));
        if (selectedNote?.id === id) {
            setSelectedNote(prev => prev ? { ...prev, ...updates } : null);
        }
    };
    
    const removeItem = (id: string) => {
         onUpdate(items.filter(i => i.id !== id));
         if (selectedNote?.id === id) setSelectedNote(null);
    };

    return (
        <div className="bg-[#1b1c20]/95 border border-[#3e4149]/50 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-[#121316] px-6 py-4 flex justify-between items-center shrink-0 border-b border-[#3e4149]/50">
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
                </div>
                <button 
                    onClick={addItem}
                    className="text-[10px] font-bold uppercase text-gray-500 border border-[#3e4149]/50 bg-transparent hover:text-gray-300 hover:border-gray-600 hover:bg-gray-800 px-3 py-1 rounded transition-colors"
                >
                    + Add Session
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/40 border-b border-gray-800">
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 w-16">#</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Title</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 w-32">Date</th>
                            <th className="px-6 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-600 text-xs italic">
                                    No session notes recorded.
                                </td>
                            </tr>
                        ) : (
                            [...items].sort((a, b) => b.sessionNumber - a.sessionNumber).map(item => (
                                <tr 
                                    key={item.id} 
                                    onClick={() => setSelectedNote(item)}
                                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-4 text-xs font-bold text-dnd-gold">{item.sessionNumber}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-gray-200">{item.title || 'Untitled Session'}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{item.date || '---'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                            className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            &times;
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedNote && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1b1c20] border border-[#3e4149] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="bg-[#121316] px-8 py-6 border-b border-[#3e4149] flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">Session</span>
                                    <AutoSaveInput 
                                        type="number"
                                        value={selectedNote.sessionNumber.toString()} 
                                        onSave={(val) => updateItem(selectedNote.id, { sessionNumber: parseInt(val) || 0 })}
                                        className="w-12 bg-black/40 border border-gray-800 rounded px-2 py-1 text-xs font-bold text-dnd-gold outline-none focus:border-dnd-gold"
                                    />
                                </div>
                                <AutoSaveInput 
                                    value={selectedNote.title || ''} 
                                    onSave={(val) => updateItem(selectedNote.id, { title: val })}
                                    className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-dnd-gold outline-none text-xl font-bold text-white min-w-[300px]"
                                    placeholder="Session Title..."
                                />
                            </div>
                            <button 
                                onClick={() => setSelectedNote(null)}
                                className="text-gray-500 hover:text-white transition-colors text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-gray-500">Date</span>
                                <AutoSaveInput 
                                    value={selectedNote.date || ''} 
                                    onSave={(val) => updateItem(selectedNote.id, { date: val })}
                                    className="bg-transparent border-b border-gray-800 hover:border-gray-600 focus:border-dnd-gold outline-none text-xs text-gray-400 font-mono"
                                    placeholder="Date..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                        <span>💎</span> Items Found
                                    </label>
                                    <AutoSaveTextarea 
                                        value={selectedNote.itemsFound || ''}
                                        onSave={(val) => updateItem(selectedNote.id, { itemsFound: val })}
                                        className="w-full bg-black/20 border border-gray-800/50 rounded-lg p-4 text-xs text-gray-300 outline-none focus:border-gray-600 min-h-[120px] resize-none"
                                        placeholder="Loot, rewards, artifacts..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                        <span>🗺️</span> Locations Discovered
                                    </label>
                                    <AutoSaveTextarea 
                                        value={selectedNote.locationsDiscovered || ''}
                                        onSave={(val) => updateItem(selectedNote.id, { locationsDiscovered: val })}
                                        className="w-full bg-black/20 border border-gray-800/50 rounded-lg p-4 text-xs text-gray-300 outline-none focus:border-gray-600 min-h-[120px] resize-none"
                                        placeholder="Towns, dungeons, landmarks..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                    <span>📝</span> General Notes
                                </label>
                                <AutoSaveTextarea 
                                    value={selectedNote.generalNotes || ''}
                                    onSave={(val) => updateItem(selectedNote.id, { generalNotes: val })}
                                    className="w-full bg-black/20 border border-gray-800/50 rounded-lg p-4 text-xs text-gray-300 outline-none focus:border-gray-600 min-h-[200px] resize-y"
                                    placeholder="Summary of events, key dialogue, plans..."
                                />
                            </div>
                        </div>
                        
                        <div className="bg-[#121316] px-8 py-4 border-t border-[#3e4149] flex justify-end">
                            <button 
                                onClick={() => setSelectedNote(null)}
                                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
