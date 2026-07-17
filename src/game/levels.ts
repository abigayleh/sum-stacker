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
];
