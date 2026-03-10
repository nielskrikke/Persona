
import React from 'react';
import { LogEntry } from '@/types';
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
    const addItem = () => {
        const newItem: LogEntry = { 
            id: Date.now().toString(), 
            name: '', 
            description: '', 
            status: 'active' 
        };
        onUpdate([...items, newItem]);
    };
    
    const updateItem = (id: string, updates: Partial<LogEntry>) => {
        onUpdate(items.map(i => i.id === id ? { ...i, ...updates } : i));
    };
    
    const removeItem = (id: string) => {
         onUpdate(items.filter(i => i.id !== id));
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
                    + Add Entry
                </button>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar p-4 space-y-3 max-h-[500px]">
                {items.length === 0 ? (
                    <div className="flex items-center justify-center text-gray-600 text-xs italic py-8">
                        No active quests.
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="bg-black/20 border border-gray-700/50 rounded-lg p-3 group hover:border-gray-600 transition-colors">
                            <div className="flex justify-between items-start mb-2 gap-2">
                                <AutoSaveInput 
                                    value={item.name} 
                                    onSave={(val) => updateItem(item.id, { name: val })}
                                    className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-dnd-gold outline-none text-sm font-bold text-white w-full transition-colors placeholder:text-gray-600"
                                    placeholder="Quest Name..."
                                />
                                <div className="flex items-center gap-2">
                                    <select 
                                        value={item.status || 'active'} 
                                        onChange={(e) => updateItem(item.id, { status: e.target.value })}
                                        className={`text-[9px] font-bold uppercase bg-transparent border border-gray-700 rounded px-1 py-0.5 outline-none cursor-pointer ${
                                            item.status === 'completed' ? 'text-green-500' :
                                            item.status === 'failed' ? 'text-red-500' :
                                            'text-blue-400'
                                        }`}
                                    >
                                        <option value="active">Active</option>
                                        <option value="completed">Complete</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className="text-gray-600 hover:text-red-400 transition-colors text-lg leading-none"
                                        title="Delete Entry"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                            <AutoSaveTextarea 
                                value={item.description}
                                onSave={(val) => updateItem(item.id, { description: val })}
                                className="w-full bg-transparent text-xs text-gray-400 resize-none outline-none min-h-[60px] placeholder:text-gray-700"
                                placeholder="Details, objectives, rewards..."
                            />
                        </div>
                    ))
                )}
            </div>
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
    };
    
    const updateItem = (id: string, updates: Partial<LogEntry>) => {
        onUpdate(items.map(i => i.id === id ? { ...i, ...updates } : i));
    };
    
    const removeItem = (id: string) => {
         onUpdate(items.filter(i => i.id !== id));
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
            
            <div className="overflow-y-auto custom-scrollbar p-4 space-y-3 max-h-[600px]">
                {items.length === 0 ? (
                    <div className="flex items-center justify-center text-gray-600 text-xs italic py-8">
                        No contacts recorded.
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="bg-black/20 border border-gray-700/50 rounded-lg p-3 group hover:border-gray-600 transition-colors">
                            <div className="flex flex-col gap-2 mb-2">
                                <div className="flex justify-between items-start gap-2">
                                     <AutoSaveInput 
                                        value={item.name} 
                                        onSave={(val) => updateItem(item.id, { name: val })}
                                        className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-dnd-gold outline-none text-sm font-bold text-white w-full transition-colors placeholder:text-gray-600"
                                        placeholder="Name..."
                                    />
                                    <div className="flex items-center gap-2 shrink-0">
                                         <select 
                                            value={item.relationship || 'Neutral'} 
                                            onChange={(e) => updateItem(item.id, { relationship: e.target.value })}
                                            className={`text-[9px] font-bold uppercase bg-transparent border border-gray-700 rounded px-1 py-0.5 outline-none cursor-pointer ${
                                                item.relationship === 'Ally' ? 'text-green-500' :
                                                item.relationship === 'Enemy' ? 'text-red-500' :
                                                'text-gray-400'
                                            }`}
                                        >
                                            <option value="Ally">Ally</option>
                                            <option value="Neutral">Neutral</option>
                                            <option value="Enemy">Enemy</option>
                                        </select>
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-600 hover:text-red-400 transition-colors text-lg leading-none"
                                            title="Delete Contact"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <AutoSaveInput 
                                            value={item.location || ''} 
                                            onSave={(val) => updateItem(item.id, { location: val })}
                                            className="w-full bg-transparent border-b border-gray-800 hover:border-gray-600 focus:border-dnd-gold outline-none text-xs text-gray-300 placeholder:text-gray-700"
                                            placeholder="Location..."
                                        />
                                    </div>
                                    <div className="w-24 shrink-0">
                                         <select 
                                            value={item.status || 'Unknown'} 
                                            onChange={(e) => updateItem(item.id, { status: e.target.value })}
                                            className="w-full text-[9px] font-bold uppercase bg-transparent border border-gray-700 rounded px-1 py-0.5 outline-none cursor-pointer text-gray-400"
                                        >
                                            <option value="Alive">Alive</option>
                                            <option value="Dead">Dead</option>
                                            <option value="Missing">Missing</option>
                                            <option value="Unknown">Unknown</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <AutoSaveTextarea 
                                value={item.description}
                                onSave={(val) => updateItem(item.id, { description: val })}
                                className="w-full bg-transparent text-xs text-gray-400 resize-none outline-none min-h-[60px] placeholder:text-gray-700 border-t border-gray-800/50 pt-2 mt-1"
                                placeholder="Notes, appearance, quests..."
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
