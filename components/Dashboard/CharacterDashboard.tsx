import React, { useEffect, useState, useRef } from 'react';
import { loadCharacters, deleteCharacter, saveCharacterToDb } from '../../services/supabase';
import { CharacterState } from '../../types';
import HomebrewManagerModal from './HomebrewManagerModal';

interface CharacterDashboardProps {
    onLoadCharacter: (char: CharacterState) => void;
    onNewCharacter: () => void;
    onCancel: () => void;
    onLogout: () => void;
    currentUser: any;
}

const CharacterDashboard: React.FC<CharacterDashboardProps> = ({ onLoadCharacter, onNewCharacter, onCancel, onLogout, currentUser }) => {
    const [characters, setCharacters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [showHomebrew, setShowHomebrew] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previousTheme = useRef<{primary: string, secondary: string} | null>(null);

    // Theme Isolation: Reset to defaults on mount, restore on unmount
    useEffect(() => {
        const root = document.documentElement;
        // Capture current values
        previousTheme.current = {
            primary: root.style.getPropertyValue('--color-accent'),
            secondary: root.style.getPropertyValue('--color-accent-secondary')
        };
        
        // Set Vault Default (Gold/Red)
        root.style.setProperty('--color-accent', '201 173 106');
        root.style.setProperty('--color-accent-secondary', '138 11 11');

        return () => {
            if (previousTheme.current) {
                if (previousTheme.current.primary) root.style.setProperty('--color-accent', previousTheme.current.primary);
                if (previousTheme.current.secondary) root.style.setProperty('--color-accent-secondary', previousTheme.current.secondary);
            }
        };
    }, []);

    const refreshList = async () => {
        if (currentUser) {
            try {
                const chars = await loadCharacters(currentUser.id);
                setCharacters(chars || []);
            } catch (e) {
                console.error("Failed to load characters", e);
            }
        }
    };

    useEffect(() => {
        refreshList().then(() => setLoading(false));
    }, [currentUser]);

    const handleRequestDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!id) {
            alert("Error: Character has no ID.");
            return;
        }
        setConfirmDeleteId(id);
    };

    const handleExecuteDelete = async () => {
        if (!confirmDeleteId) return;
        
        const idToDelete = confirmDeleteId;
        setConfirmDeleteId(null); // Close modal
        setDeletingIds(prev => new Set(prev).add(idToDelete)); // Show spinner

        try {
            await deleteCharacter(idToDelete);
            setCharacters(prev => prev.filter(c => c.id !== idToDelete));
        } catch (error: any) {
            console.error("DASHBOARD: Delete failed", error);
            alert(`Failed to delete character. ${error.message || ''}`);
            refreshList();
        } finally {
            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(idToDelete);
                return next;
            });
        }
    };

    const handleSelect = (entry: any) => {
        if (deletingIds.has(entry.id)) return;
        const fullChar = { ...entry.data, id: entry.id, user_id: entry.user_id };
        onLoadCharacter(fullChar);
    };

    const triggerImport = () => {
        fileInputRef.current?.click();
    };

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (ev) => {
            try {
                const json = JSON.parse(ev.target?.result as string);
                if (!json.name || !json.abilities) {
                    alert("Invalid character file format.");
                    return;
                }

                const { id, user_id, ...charDataRaw } = json;
                let contacts = charDataRaw.contacts || [];
                if (!charDataRaw.contacts) {
                     if (charDataRaw.allies) contacts = [...contacts, ...charDataRaw.allies.map((a:any) => ({...a, relationship:'Ally'}))];
                     if (charDataRaw.enemies) contacts = [...contacts, ...charDataRaw.enemies.map((e:any) => ({...e, relationship:'Enemy'}))];
                }

                const charData = {
                    ...charDataRaw,
                    contacts,
                    quests: charDataRaw.quests || [],
                    inventory: charDataRaw.inventory || [],
                    customActions: charDataRaw.customActions || []
                };
                
                delete charData.allies;
                delete charData.enemies;

                setLoading(true);
                try {
                    const saved = await saveCharacterToDb(charData, currentUser.id);
                    if (saved) {
                        setCharacters(prev => [saved, ...prev]);
                    }
                } finally {
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                alert("Failed to read file.");
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    if (loading) return <div className="fixed inset-0 flex items-center justify-center bg-[#0b0c0e] text-dnd-gold">Accessing the archives...</div>;

    return (
        <div className="fixed inset-0 bg-[#0b0c0e] z-50 flex flex-col p-4 md:p-10 overflow-hidden">
            <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleImportFile} />
            
            <HomebrewManagerModal 
                isOpen={showHomebrew} 
                onClose={() => setShowHomebrew(false)} 
                currentUser={currentUser} 
            />

            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#1b1c20] border-2 border-red-600 rounded-lg p-8 max-w-md w-full shadow-2xl text-center relative">
                        <div className="text-red-500 text-6xl mb-4 animate-bounce">⚠️</div>
                        <h2 className="text-2xl font-bold text-white mb-2 font-serif">Delete Character?</h2>
                        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                            Are you sure you want to permanently delete this character from the vault? This action cannot be undone.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => setConfirmDeleteId(null)} className="px-6 py-3 border border-gray-600 rounded text-gray-300 hover:text-white hover:border-gray-400 font-bold uppercase text-xs tracking-widest transition-colors">Cancel</button>
                            <button onClick={handleExecuteDelete} className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded font-bold uppercase text-xs tracking-widest shadow-lg transition-colors">Delete Forever</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-800 pb-4 gap-4">
                    <div>
                         <h1 className="text-4xl font-serif text-dnd-gold">Character Vault</h1>
                         <p className="text-gray-500 text-sm mt-1">Logged in as {currentUser?.username}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                        <button onClick={onNewCharacter} className="bg-dnd-gold hover:bg-yellow-600 text-black px-5 py-2.5 rounded font-black uppercase text-[10px] tracking-widest shadow-xl transition-all transform active:scale-95">+ New Character</button>
                        <button onClick={triggerImport} className="bg-gray-800 border border-gray-700 hover:border-dnd-gold text-gray-300 hover:text-white px-5 py-2.5 rounded font-black uppercase text-[10px] tracking-widest transition-all transform active:scale-95">Import JSON</button>
                        <button onClick={() => setShowHomebrew(true)} className="bg-blue-900/20 border border-blue-800 hover:border-blue-500 text-blue-400 px-5 py-2.5 rounded font-black uppercase text-[10px] tracking-widest transition-all transform active:scale-95">Homebrew</button>
                        <div className="w-px h-8 bg-gray-800 hidden sm:block"></div>
                        <button onClick={onCancel} className="text-gray-500 hover:text-white font-bold uppercase text-xs px-2 transition-colors">Close</button>
                        <button onClick={onLogout} className="text-red-500 hover:text-red-400 font-bold uppercase text-xs border border-red-900 bg-red-900/10 px-4 py-2 rounded transition-colors">Log Out</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pb-10">
                    {characters.map(char => {
                        const isDeleting = deletingIds.has(char.id);
                        const classString = char.data.classes && char.data.classes.length > 0 
                            ? char.data.classes.map((c: any) => `${c.definition.name} ${c.level}`).join(' / ')
                            : `Lvl ${char.data.level} Adventurer`;

                        return (
                            <div key={char.id} onClick={() => handleSelect(char)} className={`bg-[#1b1c20] border border-gray-700 rounded-xl p-6 cursor-pointer relative group flex flex-col min-h-[200px] transition-all ${isDeleting ? 'opacity-50 pointer-events-none' : 'hover:border-dnd-gold/50 hover:bg-[#202125]'}`}>
                                <div className="absolute top-4 right-4 z-50" onClick={(e) => { e.stopPropagation(); }}>
                                    <button type="button" onClick={(e) => handleRequestDelete(char.id, e)} className="text-gray-600 hover:text-red-500 p-2 rounded-full hover:bg-black/40 transition-colors" title="Delete Character" disabled={isDeleting}>
                                        {isDeleting ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>}
                                    </button>
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-full bg-cover bg-center border border-gray-600 ${char.data.avatarUrl ? '' : 'flex items-center justify-center bg-gray-800 text-gray-500 font-serif font-bold text-xl'}`} style={char.data.avatarUrl ? {backgroundImage: `url(${char.data.avatarUrl})`} : {}}>{!char.data.avatarUrl && (char.name ? char.name.charAt(0) : '?')}</div>
                                </div>
                                <h3 className="text-xl font-serif text-white mb-1 truncate pr-8">{char.name || 'Unnamed'}</h3>
                                <div className="text-xs text-dnd-gold font-bold uppercase mb-4 truncate" title={classString}>{classString}</div>
                                <div className="mt-auto text-[10px] text-gray-600 pt-4 border-t border-gray-800 flex justify-between"><span>{char.data.race?.name}</span><span>Updated: {new Date(char.updated_at).toLocaleDateString()}</span></div>
                            </div>
                        );
                    })}
                    {characters.length === 0 && (
                        <div className="col-span-full py-20 text-center flex flex-col items-center">
                            <span className="text-6xl mb-4 opacity-10">📜</span>
                            <h3 className="text-xl font-serif text-gray-500 mb-2">The Vault is Silent</h3>
                            <p className="text-gray-600 text-sm max-w-xs">No heroic records found in the archives. Forge a new legend or import a past one to begin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CharacterDashboard;