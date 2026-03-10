import React from 'react';
import { CharacterState } from '@/types';
import { WIDGET_BG } from '../../../data/constants';
import { QuestLogSection, ContactLogSection } from '../Widgets/LogSections';
import { AutoSaveTextarea } from '../Shared/AutoSaveInputs';

interface LogTabProps {
    character: CharacterState;
    setCharacter: React.Dispatch<React.SetStateAction<CharacterState>>;
    onOpenVault: () => void;
    setShowLayoutManager: (val: boolean) => void;
    handleRest: (type: 'short' | 'long') => void;
}

const LogTab: React.FC<LogTabProps> = ({ character, setCharacter, onOpenVault, setShowLayoutManager, handleRest }) => {
    const [search, setSearch] = React.useState('');

    const filteredQuests = character.quests.filter(q => 
        q.name.toLowerCase().includes(search.toLowerCase()) || 
        q.description.toLowerCase().includes(search.toLowerCase())
    );

    const filteredPeople = character.contacts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        (p.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.location || '').toLowerCase().includes(search.toLowerCase())
    );

    const notesMatch = !search || (character.generalNotes || '').toLowerCase().includes(search.toLowerCase());

    return (
        <div className="max-w-4xl mx-auto space-y-3 pb-20">
            <div className="flex justify-end">
                <input 
                    type="text" 
                    placeholder="Search journal..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className="text-[9px] font-bold uppercase px-3 py-1.5 rounded border bg-black/40 text-white border-gray-700 focus:border-dnd-gold outline-none w-full md:w-64 placeholder:text-gray-600" 
                />
            </div>

            <div className="md:hidden space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onOpenVault} className="flex items-center justify-center gap-3 p-4 bg-[#1b1c20]/80 border border-[#3e4149] rounded-xl hover:border-dnd-gold transition-colors group"><span className="text-xl group-hover:scale-110 transition-transform">🗝️</span><span className="text-xs font-bold uppercase tracking-wider">Vault</span></button>
                    <button onClick={() => setShowLayoutManager(true)} className="flex items-center justify-center gap-3 p-4 bg-[#1b1c20]/80 border border-[#3e4149] rounded-xl hover:border-dnd-gold transition-colors group"><span className="text-xl group-hover:scale-110 transition-transform">🛠️</span><span className="text-xs font-bold uppercase tracking-wider">Layout</span></button>
                    <button onClick={() => handleRest('short')} className="flex items-center justify-center gap-3 p-4 bg-[#1b1c20]/80 border border-[#3e4149] rounded-xl hover:border-dnd-gold transition-colors group"><span className="text-xl group-hover:scale-110 transition-transform text-red-400">🪑</span><span className="text-xs font-bold uppercase tracking-wider">Short Rest</span></button>
                    <button onClick={() => handleRest('long')} className="flex items-center justify-center gap-3 p-4 bg-[#1b1c20]/80 border border-[#3e4149] rounded-xl hover:border-dnd-gold transition-colors group"><span className="text-xl group-hover:scale-110 transition-transform text-dnd-gold">🌙</span><span className="text-xs font-bold uppercase tracking-wider">Long Rest</span></button>
                </div>
            </div>

            {(filteredQuests.length > 0 || !search) && (
                <QuestLogSection title="Quests" items={filteredQuests} onUpdate={(q) => setCharacter(p => ({...p, quests: q}))} />
            )}
            
            {(filteredPeople.length > 0 || !search) && (
                <ContactLogSection title="People" items={filteredPeople} onUpdate={(c) => setCharacter(p => ({...p, contacts: c}))} />
            )}

            {notesMatch && (
                <div className={`${WIDGET_BG} rounded-xl border border-[#3e4149]/50 overflow-hidden`}>
                    <div className="bg-[#121316]/80 px-6 py-4 border-b border-[#3e4149]/50 flex items-center gap-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notes</h3>
                    </div>
                    <AutoSaveTextarea value={character.generalNotes || ''} onSave={(val) => setCharacter(p => ({...p, generalNotes: val}))} className="w-full bg-transparent p-6 text-sm text-gray-300 min-h-[300px] outline-none resize-y placeholder:text-gray-700 font-serif leading-relaxed" placeholder="Record your journey, thoughts, and discoveries here..." />
                </div>
            )}

            {search && filteredQuests.length === 0 && filteredPeople.length === 0 && !notesMatch && (
                <div className="text-center py-20 text-gray-500 italic text-sm">
                    No matches found for "{search}"
                </div>
            )}
        </div>
    );
};

export default LogTab;