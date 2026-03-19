/**
 * Client-safe prizes module — no server imports.
 * Imported by both lib/site-settings.ts (server) and admin form (client).
 */

export const DEFAULT_PRIZES: Record<number, number> = {
  1: 350, 2: 200, 3: 120, 4: 90, 5: 70, 6: 50, 7: 40, 8: 30, 9: 25, 10: 25,
  11: 900, 12: 900, 13: 900, 14: 900, 15: 900,
  16: 800, 17: 800,
  18: 700, 19: 700, 20: 700, 21: 700, 22: 700,
  23: 500, 24: 500, 25: 500, 26: 500, 27: 500, 28: 500,
  29: 400, 30: 400, 31: 400, 32: 400, 33: 400, 34: 400, 35: 400, 36: 400, 37: 400, 38: 400,
  39: 300, 40: 300, 41: 300, 42: 300, 43: 300, 44: 300, 45: 300,
  46: 200, 47: 200, 48: 200, 49: 200, 50: 200, 51: 200,
  52: 150, 53: 150, 54: 150, 55: 150, 56: 150, 57: 150, 58: 150, 59: 150, 60: 150, 61: 150,
  62: 125, 63: 125, 64: 125, 65: 125, 66: 125, 67: 125, 68: 125, 69: 125, 70: 125, 71: 125,
  72: 100, 73: 100, 74: 100, 75: 100, 76: 100, 77: 100, 78: 100, 79: 100, 80: 100, 81: 100,
  82: 75, 83: 75, 84: 75, 85: 75, 86: 75, 87: 75, 88: 75, 89: 75, 90: 75, 91: 75,
  92: 50, 93: 50, 94: 50, 95: 50, 96: 50, 97: 50, 98: 50, 99: 50, 100: 50, 101: 50,
};

/** Tier group definition for the admin prize editor UI */
export interface PrizeTier {
  label: string;
  ranks: number[];
}

export const PRIZE_TIERS: PrizeTier[] = [
  { label: '1st', ranks: [1] },
  { label: '2nd', ranks: [2] },
  { label: '3rd', ranks: [3] },
  { label: '4th', ranks: [4] },
  { label: '5th', ranks: [5] },
  { label: '6th', ranks: [6] },
  { label: '7th', ranks: [7] },
  { label: '8th', ranks: [8] },
  { label: '9th', ranks: [9] },
  { label: '10th', ranks: [10] },
  { label: '11–15', ranks: [11, 12, 13, 14, 15] },
  { label: '16–17', ranks: [16, 17] },
  { label: '18–22', ranks: [18, 19, 20, 21, 22] },
  { label: '23–28', ranks: [23, 24, 25, 26, 27, 28] },
  { label: '29–38', ranks: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38] },
  { label: '39–45', ranks: [39, 40, 41, 42, 43, 44, 45] },
  { label: '46–51', ranks: [46, 47, 48, 49, 50, 51] },
  { label: '52–61', ranks: [52, 53, 54, 55, 56, 57, 58, 59, 60, 61] },
  { label: '62–71', ranks: [62, 63, 64, 65, 66, 67, 68, 69, 70, 71] },
  { label: '72–81', ranks: [72, 73, 74, 75, 76, 77, 78, 79, 80, 81] },
  { label: '82–91', ranks: [82, 83, 84, 85, 86, 87, 88, 89, 90, 91] },
  { label: '92–101', ranks: [92, 93, 94, 95, 96, 97, 98, 99, 100, 101] },
];

/** Parse prizes JSON from DB. Returns null when missing or invalid (no fallback). */
export function parsePrizes(raw: string | null | undefined): Record<number, number> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) return null;
    const result: Record<number, number> = {};
    for (const [k, v] of Object.entries(parsed)) {
      const rank = Number(k);
      const prize = Number(v);
      if (!isNaN(rank) && !isNaN(prize) && rank > 0) {
        result[rank] = prize;
      }
    }
    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}

/**
 * Given per-tier prize values (one value per tier group), expand into
 * a full Record<number, number> keyed by individual rank.
 * tierValues is indexed by PRIZE_TIERS position.
 */
export function serializeTierValues(tierValues: number[]): string {
  const result: Record<number, number> = {};
  for (let i = 0; i < PRIZE_TIERS.length; i++) {
    const tier = PRIZE_TIERS[i];
    const value = tierValues[i] ?? 0;
    for (const rank of tier.ranks) {
      result[rank] = value;
    }
  }
  return JSON.stringify(result);
}

/** Convert a full prizes map into per-tier values for the UI (one value per tier group). Accepts null (returns zeros). */
export function prizesToTierValues(prizes: Record<number, number> | null): number[] {
  if (!prizes) return PRIZE_TIERS.map(() => 0);
  return PRIZE_TIERS.map((tier) => prizes[tier.ranks[0]] ?? 0);
}
