
import React, { useState } from 'react';
import { RuleEntry } from '../../../types';
import { WIDGET_BG } from '../CharacterSheet';

interface RulesTabProps {
    visibleRules: RuleEntry[];
    setSelectedDetail: (item: any) => void;
}

const RulesTab: React.FC<RulesTabProps> = ({ visibleRules, setSelectedDetail }) => {
    const [rulesFilter, setRulesFilter] = useState<'All' | 'Action' | 'Condition' | 'Rules' | 'Custom'>('All');
    const [rulesSearch, setRulesSearch] = useState('');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">{['All', 'Action', 'Condition', 'Rules'].map(cat => (<button key={cat} onClick={() => setRulesFilter(cat as any)} className={`py-2 rounded font-bold uppercase text-xs border transition-colors ${rulesFilter === cat ? 'bg-white text-black border-white' : 'bg-black/40 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-300'}`}>{cat}</button>))}</div>
            <div className="mb-4"><input type="text" placeholder="Search rules..." value={rulesSearch} onChange={(e) => setRulesSearch(e.target.value)} className="w-full bg-[#0b0c0e] border border-gray-600/50 rounded p-3 text-white focus:border-dnd-gold outline-none" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{visibleRules.filter(r => (rulesFilter === 'All' || r.category === rulesFilter) && r.name.toLowerCase().includes(rulesSearch.toLowerCase())).map((rule, i) => (<div key={i} onClick={() => setSelectedDetail(rule)} className={`${WIDGET_BG} p-4 rounded border border-gray-800 hover:border-gray-600 cursor-pointer transition-all hover:bg-[#25262b]`}><div className="flex justify-between mb-2"><h4 className="font-bold text-gray-200 text-sm">{rule.name}</h4><span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${rule.category === 'Action' ? 'bg-blue-900/30 text-blue-400' : rule.category === 'Condition' ? 'bg-dnd-red/30 text-dnd-red' : 'bg-gray-800 text-gray-500'}`}>{rule.category}</span></div><p className="text-xs text-gray-500 line-clamp-2">{rule.desc}</p></div>))}</div>
        </div>
    );
};

export default RulesTab;
