
import React from 'react';

interface LevelStepProps {
    onSelect: (level: number) => void;
    onBack?: () => void;
}

const LevelStep: React.FC<LevelStepProps> = ({ onSelect, onBack }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-5xl font-serif text-dnd-gold mb-4 leading-tight">Forge Your Hero</h2>
            <p className="text-gray-400 mb-12 text-lg max-w-lg mx-auto font-serif italic">
                At what stage of legend does your journey truly begin? Select your starting level to proceed.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20].map(lvl => (
                    <button
                        key={lvl}
                        onClick={() => onSelect(lvl)}
                        className="bg-[#1b1c20] border border-gray-700 hover:border-dnd-gold hover:bg-[#25262b] py-5 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 group"
                    >
                        <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 group-hover:text-dnd-gold transition-colors">Level</div>
                        <div className="text-3xl font-black text-white group-hover:text-dnd-gold transition-colors">{lvl}</div>
                    </button>
                ))}
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-center bg-gradient-to-t from-[#0b0c0e] to-transparent">
                 {onBack && (
                    <button 
                        onClick={onBack}
                        className="px-10 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-black uppercase text-xs tracking-widest rounded-lg shadow-lg transition-all"
                    >
                        &larr; Back to Landing
                    </button>
                )}
            </div>
        </div>
    );
};

export default LevelStep;
