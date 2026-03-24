
import React, { useState } from 'react';
import { RuleEntry } from '../../../types';
import { WIDGET_BG } from '../../../data/constants';

interface RulesTabProps {
    visibleRules: RuleEntry[];
    setSelectedDetail: (item: any) => void;
}

const RulesTab: React.FC<RulesTabProps> = ({ visibleRules, setSelectedDetail }) => {
    const [rulesFilter, setRulesFilter] = useState<'All' | 'Action' | 'Condition' | 'Rules' | 'Custom'>('All');
    const [rulesSearch, setRulesSearch] = useState('');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
                <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                    <div className="flex gap-2 items-center overflow-x-auto pb-1 no-scrollbar">
                        {['All', 'Action', 'Condition', 'Rules', 'Mastery'].map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => setRulesFilter(cat as any)} 
                                className={`text-[10px] font-bold uppercase px-3 py-1 rounded border transition-colors ${rulesFilter === cat ? 'bg-white text-black border-white' : 'bg-black/40 text-gray-400 border-gray-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search rules..." 
                        value={rulesSearch} 
                        onChange={(e) => setRulesSearch(e.target.value)} 
                        className="text-[9px] font-bold uppercase px-3 py-1.5 rounded border bg-black/40 text-white border-gray-700 focus:border-dnd-gold outline-none w-full md:w-64 placeholder:text-gray-600" 
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleRules.filter(r => (rulesFilter === 'All' || r.category === rulesFilter) && r.name.toLowerCase().includes(rulesSearch.toLowerCase())).map((rule, i) => (
                    <div 
                        key={i} 
                        onClick={() => setSelectedDetail(rule)} 
                        className={`${WIDGET_BG} p-4 rounded-xl border border-gray-800 hover:border-gray-600 cursor-pointer transition-all hover:bg-[#25262b]`}
                    >
                        <div className="flex justify-between mb-2">
                            <h4 className="font-bold text-gray-200 text-sm">{rule.name}</h4>
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${rule.category === 'Action' ? 'bg-blue-900/30 text-blue-400' : rule.category === 'Condition' ? 'bg-dnd-red/30 text-dnd-red' : rule.category === 'Mastery' ? 'bg-dnd-gold/30 text-dnd-gold' : 'bg-gray-800 text-gray-500'}`}>
                                {rule.category}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{rule.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RulesTab;
