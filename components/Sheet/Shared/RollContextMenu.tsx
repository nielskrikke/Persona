
import React, { useEffect, useRef } from 'react';

interface RollContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onOptionSelect: (option: 'normal' | 'advantage' | 'disadvantage') => void;
}

const RollContextMenu: React.FC<RollContextMenuProps> = ({ x, y, onClose, onOptionSelect }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };
        // Also close on scroll
        const handleScroll = () => onClose();

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [onClose]);

    // Adjust position to not go off screen bottom/right
    const style: React.CSSProperties = {
        top: Math.min(y, window.innerHeight - 150),
        left: Math.min(x, window.innerWidth - 200),
    };

    return (
        <div ref={ref} className="fixed z-[9999] bg-[#1b1c20] border border-gray-600 rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.8)] py-2 w-48 text-sm animate-in fade-in duration-100" style={style}>
            <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-700/50 mb-1">Roll With:</div>
            
            <button 
                onClick={() => onOptionSelect('advantage')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-3 transition-colors text-white group"
            >
                <div className="w-6 h-6 flex items-center justify-center bg-green-900/40 text-green-500 border border-green-700 rounded-sm font-bold text-xs group-hover:bg-green-500 group-hover:text-black transition-colors">A</div>
                <span>Advantage</span>
            </button>
            
            <button 
                onClick={() => onOptionSelect('normal')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-3 transition-colors text-white group bg-gray-800/30"
            >
                <div className="w-6 h-6 flex items-center justify-center bg-gray-700 text-gray-300 border border-gray-500 rounded-sm font-bold text-xs group-hover:bg-gray-400 group-hover:text-black transition-colors">N</div>
                <span>Flat (One Die)</span>
                <span className="ml-auto text-dnd-gold text-xs">✓</span>
            </button>
            
            <button 
                onClick={() => onOptionSelect('disadvantage')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-3 transition-colors text-white group"
            >
                <div className="w-6 h-6 flex items-center justify-center bg-red-900/40 text-red-500 border border-red-700 rounded-sm font-bold text-xs group-hover:bg-red-500 group-hover:text-black transition-colors">D</div>
                <span>Disadvantage</span>
            </button>
        </div>
    );
};

export default RollContextMenu;
