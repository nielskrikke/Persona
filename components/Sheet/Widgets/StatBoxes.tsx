
import React from 'react';
import { createPortal } from 'react-dom';
import { AbilityName, ABILITY_LABELS } from '@/types';
import { formatModifier } from '@/utils/rules';

export const HeaderStatBox: React.FC<{ 
    label: string, 
    value: number, 
    modifier: number, 
    onRoll: (formula: string, label: string) => void,
    onContextMenu?: (e: React.MouseEvent, formula: string, label: string) => void
}> = ({ label, value, modifier, onRoll, onContextMenu }) => (
    <div 
        className="flex flex-col items-center p-2 bg-[#1b1c20] border border-gray-600 rounded w-16 md:w-20 hover:border-dnd-gold cursor-pointer transition-colors group" 
        onClick={() => onRoll(`1d20${formatModifier(modifier)}`, `${ABILITY_LABELS[label as AbilityName]} Check`)}
        onContextMenu={(e) => onContextMenu && onContextMenu(e, `1d20${formatModifier(modifier)}`, `${ABILITY_LABELS[label as AbilityName]} Check`)}
    >
        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 group-hover:text-dnd-gold">{label}</div>
        <div className="text-2xl font-bold text-white leading-none">{formatModifier(modifier)}</div>
        <div className="text-[10px] text-gray-400 font-bold bg-[#0b0c0e] px-2 rounded-full mt-1 border border-gray-700">{value}</div>
    </div>
);

export const SquareStatBox: React.FC<{ 
    label: string, 
    subLabel: string, 
    value: string, 
    tooltip?: React.ReactNode,
    tooltipPosition?: 'top' | 'bottom'
}> = ({ label, subLabel, value, tooltip, tooltipPosition = 'top' }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [coords, setCoords] = React.useState({ top: 0, left: 0 });
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Dynamically size text based on length
    const len = value.length;
    let fontSizeClass = 'text-xl';
    if (len > 5) fontSizeClass = 'text-sm';
    if (len > 10) fontSizeClass = 'text-[10px] leading-tight';
    if (len > 20) fontSizeClass = 'text-[8px] leading-tight';

    const updateCoords = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCoords({
                top: tooltipPosition === 'top' ? rect.top : rect.bottom,
                left: rect.left + rect.width / 2
            });
        }
    };

    React.useEffect(() => {
        if (isHovered) {
            updateCoords();
            window.addEventListener('scroll', updateCoords, true);
            window.addEventListener('resize', updateCoords);
        }
        return () => {
            window.removeEventListener('scroll', updateCoords, true);
            window.removeEventListener('resize', updateCoords);
        };
    }, [isHovered]);

    return (
        <div 
            ref={containerRef}
            className={`flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 border rounded bg-[#1b1c20] p-1 relative transition-all duration-200 outline-none select-none ${tooltip ? 'cursor-help border-gray-500 hover:border-dnd-gold hover:shadow-[0_0_15px_rgba(201,173,106,0.2)]' : 'border-gray-600'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`${fontSizeClass} font-bold text-white text-center break-words w-full pointer-events-none`}>{value}</div>
            <div className="text-[9px] font-bold text-gray-500 uppercase mt-1 text-center leading-tight shrink-0 pointer-events-none">{label}<br/>{subLabel}</div>
            
            {tooltip && isHovered && createPortal(
                <div 
                    style={{ 
                        position: 'fixed', 
                        top: coords.top, 
                        left: coords.left, 
                        transform: `translateX(-50%) ${tooltipPosition === 'top' ? 'translateY(-100%) translateY(-12px)' : 'translateY(12px)'}`,
                        zIndex: 9999 
                    }}
                    className="w-56 bg-[#121316] border border-[#3e4149] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-3 animate-in fade-in zoom-in-95 duration-200 pointer-events-none"
                >
                    <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                        <div className="text-[10px] font-bold text-dnd-gold uppercase tracking-widest">{label} Breakdown</div>
                    </div>
                    <div className="space-y-1">
                        {tooltip}
                    </div>
                    <div className={`absolute left-1/2 -translate-x-1/2 border-8 border-transparent ${tooltipPosition === 'top' ? 'top-full border-t-[#3e4149]' : 'bottom-full border-b-[#3e4149]'}`}/>
                </div>,
                document.body
            )}
        </div>
    );
};
