
import React from 'react';
import { PICK_A_CARD_TABLE } from '../../../data/constants';

interface CardOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isWorldUnlocked?: boolean;
}

const CardOptionsModal: React.FC<CardOptionsModalProps> = ({ isOpen, onClose, isWorldUnlocked = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1b1c20] border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#121316]">
                    <div>
                        <h2 className="text-3xl font-serif text-white">The Deck of Destiny</h2>
                        <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-1">Card Master Reference Table</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {PICK_A_CARD_TABLE.filter(card => card.name !== 'The World' || isWorldUnlocked).map((card) => (
                            <div key={card.roll} className="bg-black/40 border border-gray-800 rounded-xl p-4 hover:border-dnd-gold transition-colors group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-16 bg-gray-900 border border-gray-700 rounded-md flex flex-col items-center justify-center shrink-0 group-hover:border-dnd-gold transition-colors">
                                        <span className="text-[10px] font-black text-gray-500 leading-none mb-1">Roll</span>
                                        <span className="text-xl font-black text-white leading-none">{card.roll}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-serif text-dnd-gold mb-1">{card.name}</h3>
                                        <p className="text-xs text-gray-400 leading-relaxed font-serif italic">
                                            {card.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-800 bg-[#121316] flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all"
                    >
                        Close Reference
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardOptionsModal;
