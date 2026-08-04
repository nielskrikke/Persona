import { RollResult } from '../types';
import { parseRollFormula, evaluateFallbackRoll } from './diceNotation';

export const rollDice = (formula: string, label: string = 'Roll'): RollResult => {
  const parsed = parseRollFormula(formula);
  if (parsed) {
    return evaluateFallbackRoll(parsed, label);
  }

  // Basic fallback parsing for unhandled expressions
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
      const sides = parseInt(sidesStr) || 20;
      
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
