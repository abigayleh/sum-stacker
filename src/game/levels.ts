import { Difficulty, LevelDef } from './types';

type PileBlueprint = { value: number; isHint?: boolean }[];

/**
 * Builds a level from per-pile blueprints and throws at import time if any
 * pile's authored values don't sum to the same target — catches typos early.
 * The target is hidden on hard levels; footer (non-hint) blocks are interleaved
 * round-robin across piles so their order doesn't reveal which pile they belong to.
 */
function buildLevel(id: number, difficulty: Difficulty, piles: PileBlueprint[]): LevelDef {
  const targetSum = piles[0].reduce((sum, b) => sum + b.value, 0);
  const hintBlocks: LevelDef['blocks'] = [];
  const footerByPile: LevelDef['blocks'][] = piles.map(() => []);

  piles.forEach((pile, pileIndex) => {
    const pileSum = pile.reduce((sum, b) => sum + b.value, 0);
    if (pileSum !== targetSum) {
      throw new Error(`Level ${id} pile ${pileIndex} sums to ${pileSum}, expected ${targetSum}`);
    }
    pile.forEach((b) => {
      if (b.isHint) {
        hintBlocks.push({ value: b.value, isHint: true, startLocation: { type: 'pile', pileIndex } });
      } else {
        footerByPile[pileIndex].push({ value: b.value, isHint: false, startLocation: { type: 'footer' } });
      }
    });
  });

  const footerBlocks: LevelDef['blocks'] = [];
  const maxLen = Math.max(...footerByPile.map((p) => p.length));
  for (let i = 0; i < maxLen; i++) {
    footerByPile.forEach((pileBlocks) => {
      if (pileBlocks[i]) footerBlocks.push(pileBlocks[i]);
    });
  }

  const showSum = difficulty !== 'hard';
  return { id, difficulty, pileCount: piles.length, targetSum, showSum, blocks: [...hintBlocks, ...footerBlocks] };
}

// Difficulty ebbs rather than only ramping: mostly easy/medium, with a hard spike
// roughly every 6th level (7, 13, 19, 25) each followed by an easy breather.
export const LEVELS: LevelDef[] = [
  buildLevel(1, 'easy', [
    [{ value: 2, isHint: true }, { value: 3 }],
    [{ value: 0, isHint: true }, { value: 5 }],
    [{ value: -1, isHint: true }, { value: 6 }],
  ]),
  buildLevel(2, 'easy', [
    [{ value: 3, isHint: true }, { value: 5 }],
    [{ value: -2, isHint: true }, { value: 10 }],
    [{ value: 6 }, { value: 2 }],
  ]),
  buildLevel(3, 'easy', [
    [{ value: 4, isHint: true }, { value: 6 }],
    [{ value: 12 }, { value: -2 }],
    [{ value: 7 }, { value: 3 }],
  ]),
  buildLevel(4, 'medium', [
    [{ value: 6 }, { value: 4 }, { value: 2 }],
    [{ value: 10 }, { value: -3 }, { value: 5 }],
    [{ value: 15 }, { value: -8 }, { value: 5 }],
  ]),
  buildLevel(5, 'medium', [
    [{ value: 4 }, { value: 3 }, { value: 2 }],
    [{ value: 10 }, { value: -6 }, { value: 5 }],
    [{ value: 12 }, { value: -8 }, { value: 5 }],
  ]),
  buildLevel(6, 'easy', [
    [{ value: 7 }, { value: 4 }],
    [{ value: 14 }, { value: -3 }],
    [{ value: 5 }, { value: 6 }],
  ]),
  buildLevel(7, 'hard', [
    [{ value: 20 }, { value: -15 }, { value: 10 }, { value: -5 }],
    [{ value: -10 }, { value: 25 }, { value: 8 }, { value: -13 }],
    [{ value: 40 }, { value: -30 }, { value: 15 }, { value: -15 }],
  ]),
  buildLevel(8, 'easy', [
    [{ value: 5 }, { value: 4 }],
    [{ value: 12 }, { value: -3 }],
    [{ value: 7 }, { value: 2 }],
  ]),
  buildLevel(9, 'medium', [
    [{ value: 4 }, { value: 5 }, { value: -2 }],
    [{ value: 10 }, { value: -8 }, { value: 5 }],
    [{ value: 12 }, { value: -10 }, { value: 5 }],
  ]),
  buildLevel(10, 'medium', [
    [{ value: 8 }, { value: 4 }, { value: 2 }],
    [{ value: 20 }, { value: -10 }, { value: 4 }],
    [{ value: 15 }, { value: -6 }, { value: 5 }],
  ]),
  buildLevel(11, 'medium', [
    [{ value: 6 }, { value: -3 }, { value: 2 }],
    [{ value: 10 }, { value: -8 }, { value: 3 }],
    [{ value: -4 }, { value: 5 }, { value: 4 }],
  ]),
  buildLevel(12, 'easy', [
    [{ value: 8 }, { value: 5 }],
    [{ value: 16 }, { value: -3 }],
    [{ value: 7 }, { value: 6 }],
  ]),
  buildLevel(13, 'hard', [
    [{ value: 15 }, { value: -10 }, { value: 8 }, { value: -5 }],
    [{ value: -12 }, { value: 20 }, { value: 6 }, { value: -6 }],
    [{ value: 30 }, { value: -25 }, { value: 10 }, { value: -7 }],
  ]),
  buildLevel(14, 'easy', [
    [{ value: 6 }, { value: 4 }],
    [{ value: 15 }, { value: -5 }],
    [{ value: 8 }, { value: 2 }],
  ]),
  buildLevel(15, 'medium', [
    [{ value: 7 }, { value: 3 }, { value: 2 }],
    [{ value: 18 }, { value: -10 }, { value: 4 }],
    [{ value: 20 }, { value: -13 }, { value: 5 }],
  ]),
  buildLevel(16, 'medium', [
    [{ value: 5 }, { value: 4 }, { value: -3 }],
    [{ value: 12 }, { value: -9 }, { value: 3 }],
    [{ value: -5 }, { value: 8 }, { value: 3 }],
  ]),
  buildLevel(17, 'medium', [
    [{ value: 9 }, { value: 4 }, { value: 2 }],
    [{ value: 22 }, { value: -12 }, { value: 5 }],
    [{ value: 18 }, { value: -8 }, { value: 5 }],
  ]),
  buildLevel(18, 'easy', [
    [{ value: 4 }, { value: 3 }],
    [{ value: 12 }, { value: -5 }],
    [{ value: 9 }, { value: -2 }],
  ]),
  buildLevel(19, 'hard', [
    [{ value: 25 }, { value: -18 }, { value: 10 }, { value: -5 }],
    [{ value: -15 }, { value: 30 }, { value: 8 }, { value: -11 }],
    [{ value: 40 }, { value: -30 }, { value: 15 }, { value: -13 }],
  ]),
  buildLevel(20, 'easy', [
    [{ value: 9 }, { value: 5 }],
    [{ value: 20 }, { value: -6 }],
    [{ value: 8 }, { value: 6 }],
  ]),
  buildLevel(21, 'medium', [
    [{ value: 5 }, { value: 6 }, { value: -2 }],
    [{ value: 15 }, { value: -10 }, { value: 4 }],
    [{ value: 18 }, { value: -14 }, { value: 5 }],
  ]),
  buildLevel(22, 'medium', [
    [{ value: 8 }, { value: -6 }, { value: 2 }],
    [{ value: 10 }, { value: -9 }, { value: 3 }],
    [{ value: -5 }, { value: 6 }, { value: 3 }],
  ]),
  buildLevel(23, 'medium', [
    [{ value: 9 }, { value: 5 }, { value: 2 }],
    [{ value: 24 }, { value: -13 }, { value: 5 }],
    [{ value: 20 }, { value: -9 }, { value: 5 }],
  ]),
  buildLevel(24, 'easy', [
    [{ value: 7 }, { value: 5 }],
    [{ value: 18 }, { value: -6 }],
    [{ value: 9 }, { value: 3 }],
  ]),
  buildLevel(25, 'hard', [
    [{ value: 30 }, { value: -25 }, { value: 15 }, { value: -5 }],
    [{ value: -20 }, { value: 40 }, { value: 10 }, { value: -15 }],
    [{ value: 50 }, { value: -40 }, { value: 20 }, { value: -15 }],
  ]),
  buildLevel(26, 'easy', [
    [{ value: 4 }, { value: 4 }],
    [{ value: 5 }, { value: 3 }],
    [{ value: 1 }, { value: 7 }],
  ]),
  buildLevel(27, 'medium', [
    [{ value: 8 }, { value: 6 }, { value: -6 }],
    [{ value: 8 }, { value: 2 }, { value: -2 }],
    [{ value: 11 }, { value: 3 }, { value: -6 }],
  ]),
  buildLevel(28, 'medium', [
    [{ value: 10 }, { value: -12 }, { value: 15 }],
    [{ value: -1 }, { value: 2 }, { value: 12 }],
    [{ value: 7 }, { value: -7 }, { value: 13 }],
  ]),
  buildLevel(29, 'medium', [
    [{ value: 9 }, { value: 2 }, { value: -4 }],
    [{ value: 8 }, { value: 3 }, { value: -4 }],
    [{ value: -3 }, { value: 2 }, { value: 8 }],
  ]),
  buildLevel(30, 'easy', [
    [{ value: 5 }, { value: 4 }],
    [{ value: 6 }, { value: 3 }],
    [{ value: 2 }, { value: 7 }],
  ]),
  buildLevel(31, 'hard', [
    [{ value: 23 }, { value: -7 }, { value: -11 }, { value: 8 }],
    [{ value: -1 }, { value: -25 }, { value: 4 }, { value: 35 }],
    [{ value: 27 }, { value: -17 }, { value: 17 }, { value: -14 }],
  ]),
  buildLevel(32, 'easy', [
    [{ value: 7 }, { value: 8 }],
    [{ value: 6 }, { value: 9 }],
    [{ value: 4 }, { value: 11 }],
  ]),
  buildLevel(33, 'medium', [
    [{ value: 12 }, { value: -8 }, { value: 1 }],
    [{ value: -8 }, { value: -5 }, { value: 18 }],
    [{ value: -5 }, { value: 1 }, { value: 9 }],
  ]),
  buildLevel(34, 'medium', [
    [{ value: 12 }, { value: -10 }, { value: 9 }],
    [{ value: -9 }, { value: 6 }, { value: 14 }],
    [{ value: 5 }, { value: -9 }, { value: 15 }],
  ]),
  buildLevel(35, 'medium', [
    [{ value: 13 }, { value: -3 }, { value: 7 }],
    [{ value: 10 }, { value: -10 }, { value: 17 }],
    [{ value: 1 }, { value: -1 }, { value: 17 }],
  ]),
  buildLevel(36, 'easy', [
    [{ value: 1 }, { value: 6 }],
    [{ value: 2 }, { value: 5 }],
    [{ value: 8 }, { value: -1 }],
  ]),
  buildLevel(37, 'hard', [
    [{ value: 28 }, { value: 16 }, { value: -1 }, { value: -28 }],
    [{ value: -15 }, { value: 23 }, { value: -3 }, { value: 10 }],
    [{ value: -9 }, { value: 28 }, { value: 5 }, { value: -9 }],
  ]),
  buildLevel(38, 'easy', [
    [{ value: 4 }, { value: 9 }],
    [{ value: 7 }, { value: 6 }],
    [{ value: 3 }, { value: 10 }],
  ]),
  buildLevel(39, 'medium', [
    [{ value: 12 }, { value: 8 }, { value: -5 }],
    [{ value: -5 }, { value: 4 }, { value: 16 }],
    [{ value: -8 }, { value: 4 }, { value: 19 }],
  ]),
  buildLevel(40, 'medium', [
    [{ value: -11 }, { value: 1 }, { value: 18 }],
    [{ value: 10 }, { value: -8 }, { value: 6 }],
    [{ value: -10 }, { value: 12 }, { value: 6 }],
  ]),
  buildLevel(41, 'medium', [
    [{ value: 12 }, { value: -6 }, { value: 8 }],
    [{ value: 9 }, { value: -13 }, { value: 18 }],
    [{ value: -5 }, { value: 7 }, { value: 12 }],
  ]),
  buildLevel(42, 'easy', [
    [{ value: 5 }, { value: 10 }],
    [{ value: 7 }, { value: 8 }],
    [{ value: 4 }, { value: 11 }],
  ]),
  buildLevel(43, 'hard', [
    [{ value: -21 }, { value: -15 }, { value: 14 }, { value: 31 }],
    [{ value: 1 }, { value: 25 }, { value: -6 }, { value: -11 }],
    [{ value: 29 }, { value: 25 }, { value: -22 }, { value: -23 }],
  ]),
  buildLevel(44, 'easy', [
    [{ value: 3 }, { value: 7 }],
    [{ value: 2 }, { value: 8 }],
    [{ value: 6 }, { value: 4 }],
  ]),
  buildLevel(45, 'medium', [
    [{ value: 4 }, { value: -7 }, { value: 16 }],
    [{ value: 7 }, { value: -5 }, { value: 11 }],
    [{ value: 9 }, { value: -12 }, { value: 16 }],
  ]),
  buildLevel(46, 'medium', [
    [{ value: -8 }, { value: 14 }, { value: 13 }],
    [{ value: 10 }, { value: 10 }, { value: -1 }],
    [{ value: 12 }, { value: 9 }, { value: -2 }],
  ]),
  buildLevel(47, 'medium', [
    [{ value: -7 }, { value: 12 }, { value: 7 }],
    [{ value: 14 }, { value: -6 }, { value: 4 }],
    [{ value: 6 }, { value: -11 }, { value: 17 }],
  ]),
  buildLevel(48, 'easy', [
    [{ value: 5 }, { value: 7 }],
    [{ value: 2 }, { value: 10 }],
    [{ value: 4 }, { value: 8 }],
  ]),
  buildLevel(49, 'hard', [
    [{ value: 30 }, { value: -21 }, { value: -16 }, { value: 18 }],
    [{ value: -15 }, { value: 16 }, { value: -20 }, { value: 30 }],
    [{ value: -34 }, { value: -16 }, { value: 14 }, { value: 47 }],
  ]),
  buildLevel(50, 'easy', [
    [{ value: 8 }, { value: 11 }],
    [{ value: 7 }, { value: 12 }],
    [{ value: 9 }, { value: 10 }],
  ]),
  buildLevel(51, 'medium', [
    [{ value: -5 }, { value: -5 }, { value: 19 }],
    [{ value: -9 }, { value: 12 }, { value: 6 }],
    [{ value: 15 }, { value: 16 }, { value: -22 }],
  ]),
  buildLevel(52, 'medium', [
    [{ value: 5 }, { value: 14 }, { value: -3 }],
    [{ value: 12 }, { value: -7 }, { value: 11 }],
    [{ value: -15 }, { value: 12 }, { value: 19 }],
  ]),
  buildLevel(53, 'medium', [
    [{ value: -3 }, { value: -6 }, { value: 17 }],
    [{ value: -8 }, { value: 3 }, { value: 13 }],
    [{ value: 5 }, { value: -10 }, { value: 13 }],
  ]),
  buildLevel(54, 'easy', [
    [{ value: -2 }, { value: 10 }],
    [{ value: -5 }, { value: 13 }],
    [{ value: -6 }, { value: 14 }],
  ]),
  buildLevel(55, 'hard', [
    [{ value: -6 }, { value: 29 }, { value: -24 }, { value: 14 }],
    [{ value: -24 }, { value: 18 }, { value: -13 }, { value: 32 }],
    [{ value: 20 }, { value: -4 }, { value: -32 }, { value: 29 }],
  ]),
  buildLevel(56, 'easy', [
    [{ value: 7 }, { value: 8 }],
    [{ value: 3 }, { value: 12 }],
    [{ value: 6 }, { value: 9 }],
  ]),
  buildLevel(57, 'medium', [
    [{ value: -1 }, { value: 15 }, { value: 7 }],
    [{ value: 14 }, { value: 9 }, { value: -2 }],
    [{ value: -5 }, { value: 8 }, { value: 18 }],
  ]),
  buildLevel(58, 'medium', [
    [{ value: 12 }, { value: 17 }, { value: -16 }],
    [{ value: 5 }, { value: -8 }, { value: 16 }],
    [{ value: 4 }, { value: -2 }, { value: 11 }],
  ]),
  buildLevel(59, 'medium', [
    [{ value: 15 }, { value: -15 }, { value: 20 }],
    [{ value: -9 }, { value: 11 }, { value: 18 }],
    [{ value: -7 }, { value: 17 }, { value: 10 }],
  ]),
  buildLevel(60, 'easy', [
    [{ value: 8 }, { value: 10 }],
    [{ value: 7 }, { value: 11 }],
    [{ value: 6 }, { value: 12 }],
  ]),
  buildLevel(61, 'hard', [
    [{ value: 24 }, { value: -5 }, { value: 24 }, { value: -28 }],
    [{ value: -26 }, { value: -28 }, { value: 21 }, { value: 48 }],
    [{ value: -2 }, { value: -31 }, { value: 38 }, { value: 10 }],
  ]),
  buildLevel(62, 'easy', [
    [{ value: 2 }, { value: 10 }],
    [{ value: 6 }, { value: 6 }],
    [{ value: 5 }, { value: 7 }],
  ]),
  buildLevel(63, 'medium', [
    [{ value: 4 }, { value: -4 }, { value: 18 }],
    [{ value: 13 }, { value: -17 }, { value: 22 }],
    [{ value: 17 }, { value: 6 }, { value: -5 }],
  ]),
  buildLevel(64, 'medium', [
    [{ value: 7 }, { value: -13 }, { value: 15 }],
    [{ value: 17 }, { value: -11 }, { value: 3 }],
    [{ value: 17 }, { value: -1 }, { value: -7 }],
  ]),
  buildLevel(65, 'medium', [
    [{ value: 6 }, { value: -11 }, { value: 22 }],
    [{ value: -15 }, { value: 17 }, { value: 15 }],
    [{ value: 18 }, { value: 6 }, { value: -7 }],
  ]),
  buildLevel(66, 'easy', [
    [{ value: 4 }, { value: 10 }],
    [{ value: 2 }, { value: 12 }],
    [{ value: -1 }, { value: 15 }],
  ]),
  buildLevel(67, 'hard', [
    [{ value: -10 }, { value: -14 }, { value: 36 }, { value: -3 }],
    [{ value: 30 }, { value: -29 }, { value: -25 }, { value: 33 }],
    [{ value: -36 }, { value: 18 }, { value: -2 }, { value: 29 }],
  ]),
  buildLevel(68, 'easy', [
    [{ value: 9 }, { value: 13 }],
    [{ value: 8 }, { value: 14 }],
    [{ value: 7 }, { value: 15 }],
  ]),
  buildLevel(69, 'medium', [
    [{ value: 9 }, { value: 13 }, { value: -8 }],
    [{ value: 2 }, { value: 16 }, { value: -4 }],
    [{ value: -12 }, { value: 15 }, { value: 11 }],
  ]),
  buildLevel(70, 'medium', [
    [{ value: -4 }, { value: 5 }, { value: 21 }],
    [{ value: 7 }, { value: -4 }, { value: 19 }],
    [{ value: 18 }, { value: -11 }, { value: 15 }],
  ]),
  buildLevel(71, 'medium', [
    [{ value: 11 }, { value: 14 }, { value: -12 }],
    [{ value: 12 }, { value: 13 }, { value: -12 }],
    [{ value: 14 }, { value: 17 }, { value: -18 }],
  ]),
  buildLevel(72, 'easy', [
    [{ value: 7 }, { value: 3 }],
    [{ value: 1 }, { value: 9 }],
    [{ value: -4 }, { value: 14 }],
  ]),
  buildLevel(73, 'hard', [
    [{ value: 31 }, { value: -40 }, { value: 30 }, { value: -10 }],
    [{ value: -34 }, { value: -12 }, { value: 5 }, { value: 52 }],
    [{ value: -17 }, { value: -3 }, { value: -11 }, { value: 42 }],
  ]),
  buildLevel(74, 'easy', [
    [{ value: 8 }, { value: 10 }],
    [{ value: 5 }, { value: 13 }],
    [{ value: 11 }, { value: 7 }],
  ]),
  buildLevel(75, 'medium', [
    [{ value: 15 }, { value: -9 }, { value: 4 }],
    [{ value: -14 }, { value: 8 }, { value: 16 }],
    [{ value: 18 }, { value: 10 }, { value: -18 }],
  ]),
  buildLevel(76, 'medium', [
    [{ value: 16 }, { value: -13 }, { value: 15 }],
    [{ value: 10 }, { value: -18 }, { value: 26 }],
    [{ value: -6 }, { value: 19 }, { value: 5 }],
  ]),
  buildLevel(77, 'medium', [
    [{ value: 17 }, { value: -17 }, { value: 8 }],
    [{ value: -17 }, { value: 1 }, { value: 24 }],
    [{ value: 5 }, { value: 20 }, { value: -17 }],
  ]),
  buildLevel(78, 'easy', [
    [{ value: 11 }, { value: 9 }],
    [{ value: 12 }, { value: 8 }],
    [{ value: 10 }, { value: 10 }],
  ]),
  buildLevel(79, 'hard', [
    [{ value: -34 }, { value: 43 }, { value: -26 }, { value: 30 }],
    [{ value: 33 }, { value: -26 }, { value: -3 }, { value: 9 }],
    [{ value: 38 }, { value: -1 }, { value: 30 }, { value: -54 }],
  ]),
  buildLevel(80, 'easy', [
    [{ value: 12 }, { value: 2 }],
    [{ value: 7 }, { value: 7 }],
    [{ value: 10 }, { value: 4 }],
  ]),
  buildLevel(81, 'medium', [
    [{ value: 16 }, { value: -14 }, { value: 22 }],
    [{ value: 20 }, { value: 9 }, { value: -5 }],
    [{ value: 12 }, { value: -2 }, { value: 14 }],
  ]),
  buildLevel(82, 'medium', [
    [{ value: -20 }, { value: 5 }, { value: 29 }],
    [{ value: 17 }, { value: -16 }, { value: 13 }],
    [{ value: -2 }, { value: -13 }, { value: 29 }],
  ]),
  buildLevel(83, 'medium', [
    [{ value: 11 }, { value: 21 }, { value: -9 }],
    [{ value: -12 }, { value: 7 }, { value: 28 }],
    [{ value: 14 }, { value: 15 }, { value: -6 }],
  ]),
  buildLevel(84, 'easy', [
    [{ value: 5 }, { value: 11 }],
    [{ value: 8 }, { value: 8 }],
    [{ value: 10 }, { value: 6 }],
  ]),
  buildLevel(85, 'hard', [
    [{ value: -38 }, { value: -16 }, { value: 16 }, { value: 53 }],
    [{ value: 37 }, { value: 31 }, { value: -46 }, { value: -7 }],
    [{ value: -19 }, { value: -14 }, { value: -8 }, { value: 56 }],
  ]),
  buildLevel(86, 'easy', [
    [{ value: 7 }, { value: 17 }],
    [{ value: 10 }, { value: 14 }],
    [{ value: 11 }, { value: 13 }],
  ]),
  buildLevel(87, 'medium', [
    [{ value: -1 }, { value: -2 }, { value: 23 }],
    [{ value: 5 }, { value: 19 }, { value: -4 }],
    [{ value: -5 }, { value: -5 }, { value: 30 }],
  ]),
  buildLevel(88, 'medium', [
    [{ value: 1 }, { value: -19 }, { value: 27 }],
    [{ value: 14 }, { value: -18 }, { value: 13 }],
    [{ value: 18 }, { value: 5 }, { value: -14 }],
  ]),
  buildLevel(89, 'medium', [
    [{ value: -14 }, { value: 20 }, { value: 13 }],
    [{ value: -1 }, { value: -1 }, { value: 21 }],
    [{ value: 19 }, { value: 3 }, { value: -3 }],
  ]),
  buildLevel(90, 'easy', [
    [{ value: 10 }, { value: 1 }],
    [{ value: -2 }, { value: 13 }],
    [{ value: -3 }, { value: 14 }],
  ]),
  buildLevel(91, 'hard', [
    [{ value: -19 }, { value: -32 }, { value: 3 }, { value: 57 }],
    [{ value: -8 }, { value: 9 }, { value: -32 }, { value: 40 }],
    [{ value: -26 }, { value: -37 }, { value: 43 }, { value: 29 }],
  ]),
  buildLevel(92, 'easy', [
    [{ value: 5 }, { value: 16 }],
    [{ value: 6 }, { value: 15 }],
    [{ value: 13 }, { value: 8 }],
  ]),
  buildLevel(93, 'medium', [
    [{ value: -11 }, { value: 4 }, { value: 22 }],
    [{ value: -4 }, { value: -11 }, { value: 30 }],
    [{ value: -10 }, { value: -4 }, { value: 29 }],
  ]),
  buildLevel(94, 'medium', [
    [{ value: 22 }, { value: -21 }, { value: 24 }],
    [{ value: 13 }, { value: 23 }, { value: -11 }],
    [{ value: 14 }, { value: -19 }, { value: 30 }],
  ]),
  buildLevel(95, 'medium', [
    [{ value: -9 }, { value: -5 }, { value: 28 }],
    [{ value: -14 }, { value: 21 }, { value: 7 }],
    [{ value: 16 }, { value: 19 }, { value: -21 }],
  ]),
  buildLevel(96, 'easy', [
    [{ value: 7 }, { value: 16 }],
    [{ value: 12 }, { value: 11 }],
    [{ value: 4 }, { value: 19 }],
  ]),
  buildLevel(97, 'hard', [
    [{ value: 30 }, { value: 39 }, { value: -7 }, { value: -51 }],
    [{ value: 37 }, { value: 45 }, { value: -13 }, { value: -58 }],
    [{ value: -10 }, { value: -23 }, { value: -14 }, { value: 58 }],
  ]),
  buildLevel(98, 'easy', [
    [{ value: -3 }, { value: 19 }],
    [{ value: 11 }, { value: 5 }],
    [{ value: 9 }, { value: 7 }],
  ]),
  buildLevel(99, 'medium', [
    [{ value: 24 }, { value: 6 }, { value: -20 }],
    [{ value: -18 }, { value: -5 }, { value: 33 }],
    [{ value: -12 }, { value: -9 }, { value: 31 }],
  ]),
  buildLevel(100, 'medium', [
    [{ value: -4 }, { value: 21 }, { value: 3 }],
    [{ value: 21 }, { value: -23 }, { value: 22 }],
    [{ value: -12 }, { value: 18 }, { value: 14 }],
  ]),
];
