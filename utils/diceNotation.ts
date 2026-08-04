import { RollResult } from '../types';

export type KeepRule = 'highest-one' | 'lowest-one' | null;

export interface ParsedDiceGroup {
  count: number;
  sides: number;
  sign: 1 | -1;
  keep: KeepRule;
}

export interface ParsedRollFormula {
  groups: ParsedDiceGroup[];
  flatModifier: number;
  originalFormula: string;
}

/**
 * Parses a D&D dice formula string into structured groups and flat modifiers.
 * Supports:
 * - Simple rolls: "1d20", "d20", "2d6", "1d100"
 * - Modifiers: "1d20+5", "1d20-2"
 * - Advantage / Disadvantage: "2d20kh1+4", "2d20kl1-1"
 * - Mixed pools: "2d6+1d8+3", "1d20-1d4+2"
 */
export function parseRollFormula(formula: string): ParsedRollFormula | null {
  if (!formula || typeof formula !== 'string') return null;

  const clean = formula.replace(/\s+/g, '').toLowerCase();
  if (!clean) return null;

  const matches = Array.from(clean.matchAll(/([+-])?([a-z0-9]+)/g));
  if (matches.length === 0) return null;

  const groups: ParsedDiceGroup[] = [];
  let flatModifier = 0;
  let totalMatchedLength = 0;

  for (const match of matches) {
    totalMatchedLength += match[0].length;
    const signStr = match[1];
    const expr = match[2];

    const sign: 1 | -1 = signStr === '-' ? -1 : 1;

    // Check if expr is a dice expression: e.g. 2d20, d20, 2d20kh1, 2d20kl1
    const diceMatch = expr.match(/^(\d*)d(\d+)(kh1|kl1)?$/);
    if (diceMatch) {
      const count = diceMatch[1] ? parseInt(diceMatch[1], 10) : 1;
      const sides = parseInt(diceMatch[2], 10);
      const keepStr = diceMatch[3];

      if (isNaN(count) || count <= 0 || count > 100 || isNaN(sides) || sides <= 0 || sides > 1000) {
        return null;
      }

      let keep: KeepRule = null;
      if (keepStr === 'kh1') keep = 'highest-one';
      else if (keepStr === 'kl1') keep = 'lowest-one';

      groups.push({
        count,
        sides,
        sign,
        keep,
      });
    } else if (/^\d+$/.test(expr)) {
      const val = parseInt(expr, 10);
      if (isNaN(val)) return null;
      flatModifier += sign * val;
    } else {
      return null;
    }
  }

  if (totalMatchedLength !== clean.length) {
    return null;
  }

  if (groups.length === 0 && flatModifier === 0) {
    return null;
  }

  return {
    groups,
    flatModifier,
    originalFormula: formula,
  };
}

/**
 * Evaluates physical dice rolls against a parsed formula to produce a RollResult.
 */
export function evaluateParsedFormula(
  parsed: ParsedRollFormula,
  groupRolls: number[][],
  label: string,
  timestamp: number = Date.now()
): RollResult {
  let total = parsed.flatModifier;
  const allRolls: number[] = [];
  let isCrit = false;
  let isFail = false;

  parsed.groups.forEach((group, i) => {
    const rolls = groupRolls[i] || [];
    allRolls.push(...rolls);

    if (rolls.length === 0) return;

    let groupSubtotal = 0;
    let keptD20Value: number | null = null;

    if (group.keep === 'highest-one') {
      const highest = Math.max(...rolls);
      groupSubtotal = highest;
      if (group.sides === 20) {
        keptD20Value = highest;
      }
    } else if (group.keep === 'lowest-one') {
      const lowest = Math.min(...rolls);
      groupSubtotal = lowest;
      if (group.sides === 20) {
        keptD20Value = lowest;
      }
    } else {
      groupSubtotal = rolls.reduce((acc, val) => acc + val, 0);
      if (group.sides === 20) {
        keptD20Value = rolls[0];
      }
    }

    total += group.sign * groupSubtotal;

    if (keptD20Value !== null) {
      if (keptD20Value === 20) isCrit = true;
      if (keptD20Value === 1) isFail = true;
    }
  });

  let dieStr = '';
  if (parsed.groups.length > 0) {
    dieStr = `${parsed.groups[0].count}d${parsed.groups[0].sides}`;
  }

  return {
    formula: parsed.originalFormula,
    label,
    total,
    rolls: allRolls,
    timestamp,
    isCrit: isCrit || undefined,
    isFail: isFail || undefined,
    die: dieStr || undefined,
    modifier: parsed.flatModifier,
  };
}

/**
 * Generates random numbers for non-3D fallback rolls.
 */
export function evaluateFallbackRoll(
  parsed: ParsedRollFormula,
  label: string,
  timestamp: number = Date.now()
): RollResult {
  const groupRolls: number[][] = parsed.groups.map(group => {
    const rolls: number[] = [];
    for (let i = 0; i < group.count; i++) {
      rolls.push(Math.floor(Math.random() * group.sides) + 1);
    }
    return rolls;
  });

  return evaluateParsedFormula(parsed, groupRolls, label, timestamp);
}
