import React from 'react';
import { CharacterState } from '@/types';
import { WIDGET_BG } from '../CharacterSheet';
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
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="md:hidden space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onOpenVault} className="flex items-center justify-center gap-3 p-4 bg-[#1b1c20]/80 border border-[#3e4149] rounded-xl hover:border-dnd-gold transition-colors group"><span className="text-xl group-hover:scale-110 transition-transform">🗝️</span><span className="text-xs font-bold uppercase tracking-wider">Vault</span></button>
                    <button onClick={() => setShowLayoutManager(true)} className="flex items-center justify-center gap-3 p-4 bg-[#1b1c20]/80 border border-[#3e4149] rounded-xl hover:border-dnd-gold transition-colors group"><span className="text-xl group-hover:scale-110 transition-transform">🛠️</span><span className="text-xs font-bold uppercase tracking-wider">Layout</span></button>
                    <button onClick={() => handleRest('short')} className="flex items-center justify-center gap-3 p-4 bg-[#1b1c20]/80 border border-[#3e4149] rounded-xl hover:border-dnd-gold transition-colors group"><span className="text-xl group-hover:scale-110 transition-transform text-red-400">🪑</span><span className="text-xs font-bold uppercase tracking-wider">Short Rest</span></button>
                    <button onClick={() => handleRest('long')} className="flex items-center justify-center gap-3 p-4 bg-[#1b1c20]/80 border border-[#3e4149] rounded-xl hover:border-dnd-gold transition-colors group"><span className="text-xl group-hover:scale-110 transition-transform text-dnd-gold">🌙</span><span className="text-xs font-bold uppercase tracking-wider">Long Rest</span></button>
                </div>
            </div>
            <QuestLogSection title="Quest Log" items={character.quests} onUpdate={(q) => setCharacter(p => ({...p, quests: q}))} />
            <ContactLogSection title="Contacts" items={character.contacts} onUpdate={(c) => setCharacter(p => ({...p, contacts: c}))} />
            <div className={`${WIDGET_BG} rounded-xl border border-[#3e4149]/50 overflow-hidden`}>
                <div className="bg-[#121316]/80 px-6 py-4 border-b border-[#3e4149]/50 flex items-center gap-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Chronicle & Notes</h3>
                </div>
                <AutoSaveTextarea value={character.generalNotes || ''} onSave={(val) => setCharacter(p => ({...p, generalNotes: val}))} className="w-full bg-transparent p-6 text-sm text-gray-300 min-h-[300px] outline-none resize-y placeholder:text-gray-700 font-serif leading-relaxed" placeholder="Record your journey, thoughts, and discoveries here..." />
            </div>
        </div>
    );
};

export default LogTab;