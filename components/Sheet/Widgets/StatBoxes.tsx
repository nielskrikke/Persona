
import React from 'react';
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

export const SquareStatBox: React.FC<{ label: string, subLabel: string, value: string }> = ({ label, subLabel, value }) => {
    // Dynamically size text based on length
    const len = value.length;
    let fontSizeClass = 'text-xl';
    if (len > 5) fontSizeClass = 'text-sm';
    if (len > 10) fontSizeClass = 'text-[10px] leading-tight';
    if (len > 20) fontSizeClass = 'text-[8px] leading-tight';

    return (
        <div className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 border border-gray-600 rounded bg-[#1b1c20] p-1 overflow-hidden">
            <div className={`${fontSizeClass} font-bold text-white text-center break-words w-full`}>{value}</div>
            <div className="text-[9px] font-bold text-gray-500 uppercase mt-1 text-center leading-tight shrink-0">{label}<br/>{subLabel}</div>
        </div>
    );
};
