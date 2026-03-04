
import { RollResult } from '../types';

export const rollDice = (formula: string, label: string = 'Roll'): RollResult => {
    // Basic dice rolling logic: "1d20 + 5"
    const cleanFormula = formula.replace(/\s+/g, '');
    const parts = cleanFormula.split(/([+-])/);
    
    let total = 0;
    const rolls: number[] = [];
    let currentSign = 1;

    parts.forEach(part => {
        if (part === '+') {
            currentSign = 1;
        } else if (part === '-') {
            currentSign = -1;
        } else if (part.includes('d')) {
            const [countStr, sidesStr] = part.split('d');
            const count = parseInt(countStr) || 1;
            const sides = parseInt(sidesStr);
            
            for (let i = 0; i < count; i++) {
                const roll = Math.floor(Math.random() * sides) + 1;
                rolls.push(roll);
                total += roll * currentSign;
            }
        } else {
            const val = parseInt(part);
            if (!isNaN(val)) {
                total += val * currentSign;
            }
        }
    });

    return {
        formula,
        label,
        total,
        rolls,
        timestamp: Date.now()
    };
};
