
import React from 'react';
import { CharacterState, ABILITY_NAMES, ABILITY_LABELS } from '../../../types';
import { formatModifier, calculateModifier } from '../../../utils/rules';

interface StatsTabProps {
    character: CharacterState;
    roll: (formula: string, label: string) => void;
    layout: {left: string[], right: string[], mobile?: string[]};
    renderWidget: (type: string) => React.ReactNode;
    setShowLayoutManager: (val: boolean) => void;
}

const StatsTab: React.FC<StatsTabProps> = ({ character, roll, layout, renderWidget, setShowLayoutManager }) => {
    // Filter mobile layout widgets to only those that meet requirements
    const isArtillerist = character.classes.some(c => c.definition.index === 'artificer' && c.subclass?.index === 'artillerist' && c.level >= 3);
    
    const activeWidgets = (layout.mobile && layout.mobile.length > 0 
        ? layout.mobile 
        : [...layout.left, ...layout.right]
    ).filter(id => {
        if (id === 'eldritchCannon' && !isArtillerist) return false;
        return true;
    });

    return (
        <div className="md:hidden space-y-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-6 gap-2 mb-6">
                 {ABILITY_NAMES.map(stat => {
                     const val = character.abilities[stat]; // Use raw for mobile check simplified
                     return (
                         <div key={stat} className="flex flex-col items-center bg-[#1b1c20] p-1 rounded border border-gray-700" onClick={() => roll(`1d20${formatModifier(calculateModifier(val))}`, `${ABILITY_LABELS[stat]} Check`)}>
                             <span className="text-[10px] text-gray-500 font-bold uppercase">{stat}</span>
                             <span className="text-lg font-bold text-white">{formatModifier(calculateModifier(val))}</span>
                             <span className="text-[9px] text-gray-600 bg-black/40 px-1 rounded">{val}</span>
                         </div>
                     );
                 })}
            </div>
            
            <div className="space-y-4">
                {activeWidgets.map(w => renderWidget(w))}
            </div>

            {activeWidgets.length === 0 && (
                 <div className="text-center text-gray-500 py-10">
                     <p className="mb-4">No widgets added or requirements not met.</p>
                     <button onClick={() => setShowLayoutManager(true)} className="bg-dnd-gold text-black px-4 py-2 rounded font-bold uppercase text-xs">Configure Layout</button>
                 </div>
            )}
        </div>
    );
};

export default StatsTab;
