
import React, { useState } from 'react';
import { BeastDetail } from '@/types';
import { STANDARD_FAMILIARS } from '../../../data/familiars';
import CustomBeastModal from './CustomBeastModal';

interface FamiliarManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFamiliars: BeastDetail[];
    activeFamiliarId?: string;
    onUpdateFamiliars: (familiars: BeastDetail[]) => void;
    onSetActive: (familiar: BeastDetail | null) => void;
    onOpenForge: () => void;
}

const FamiliarManagerModal: React.FC<FamiliarManagerModalProps> = ({ 
    isOpen, onClose, currentFamiliars, activeFamiliarId, onUpdateFamiliars, onSetActive, onOpenForge 
}) => {
    const [selectedStandard, setSelectedStandard] = useState<string>('');
    const [showCustomModal, setShowCustomModal] = useState(false);

    if (!isOpen) return null;

    const handleAddStandard = () => {
        if (!selectedStandard) return;
        const beast = STANDARD_FAMILIARS.find(f => f.index === selectedStandard);
        if (beast) {
            // Clone to ensure unique ID if added multiple times
            const newFamiliar = {
                ...beast,
                index: `${beast.index}-${Date.now()}`
            };
            onUpdateFamiliars([...currentFamiliars, newFamiliar]);
            setSelectedStandard('');
        }
    };

    const handleAddCustom = (beast: BeastDetail) => {
        onUpdateFamiliars([...currentFamiliars, beast]);
        setShowCustomModal(false);
    };

    const handleRemove = (id: string) => {
        if (activeFamiliarId === id) onSetActive(null);
        onUpdateFamiliars(currentFamiliars.filter(f => f.index !== id));
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4 backdrop-blur-md">
            <CustomBeastModal 
                isOpen={showCustomModal} 
                onClose={() => setShowCustomModal(false)} 
                onSave={handleAddCustom} 
            />

            <div className="bg-[#1b1c20] border-2 border-pink-400/50 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-gray-700 bg-[#121316] rounded-t-xl shrink-0 flex justify-between items-center">
                    <h2 className="text-2xl font-serif text-pink-400">Manage Familiars</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl transition-colors">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-8">
                    {/* Active Section */}
                    <div className="bg-pink-900/10 border border-pink-500/30 rounded-lg p-4">
                        <h3 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-2">Active Familiar</h3>
                        {activeFamiliarId ? (
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-white">
                                    {currentFamiliars.find(f => f.index === activeFamiliarId)?.name || 'Unknown Entity'}
                                </span>
                                <button 
                                    onClick={() => onSetActive(null)}
                                    className="text-xs text-red-400 hover:text-red-300 border border-red-900 bg-red-900/20 px-3 py-1 rounded uppercase font-bold"
                                >
                                    Dismiss
                                </button>
                            </div>
                        ) : (
                            <span className="text-gray-500 italic text-sm">No familiar currently summoned.</span>
                        )}
                    </div>

                    {/* List Section */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-700 pb-1">Known Forms</h3>
                        <div className="space-y-2">
                            {currentFamiliars.map(fam => (
                                <div key={fam.index} className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700 hover:border-gray-500 transition-colors">
                                    <div>
                                        <div className="font-bold text-white">{fam.name}</div>
                                        <div className="text-[10px] text-gray-400">{fam.size} {fam.type} • AC {fam.ac} • HP {fam.hp}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        {activeFamiliarId !== fam.index && (
                                            <button 
                                                onClick={() => onSetActive(fam)}
                                                className="text-[10px] font-bold uppercase bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 rounded"
                                            >
                                                Summon
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleRemove(fam.index)}
                                            className="text-gray-500 hover:text-red-400 px-2"
                                            title="Forget Form"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {currentFamiliars.length === 0 && <div className="text-center text-gray-500 italic py-4">You have not bonded with any spirits.</div>}
                        </div>
                    </div>

                    {/* Add Section */}
                    <div className="bg-[#151619] p-4 rounded border border-gray-700">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bond New Spirit</h3>
                        <div className="flex gap-2 mb-3">
                            <select 
                                value={selectedStandard}
                                onChange={e => setSelectedStandard(e.target.value)}
                                className="flex-grow bg-[#0b0c0e] border border-gray-600 rounded p-2 text-white text-sm focus:border-pink-400 outline-none"
                            >
                                <option value="">Select Standard Form...</option>
                                {STANDARD_FAMILIARS.map(f => (
                                    <option key={f.index} value={f.index}>{f.name}</option>
                                ))}
                            </select>
                            <button 
                                onClick={handleAddStandard}
                                disabled={!selectedStandard}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase text-xs rounded"
                            >
                                Add
                            </button>
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] text-gray-600 uppercase font-bold">- OR -</span>
                        </div>
                        <button 
                            onClick={onOpenForge}
                            className="w-full mt-3 py-2 border border-gray-600 hover:border-pink-400 text-gray-400 hover:text-pink-400 font-bold uppercase text-xs rounded transition-colors"
                        >
                            Forge Custom Familiar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamiliarManagerModal;
