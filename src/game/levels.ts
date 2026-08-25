import { Difficulty, LevelDef } from './types';

type PileBlueprint = { value: number; isHint?: boolean }[];

/**
 * Builds a level from per-pile blueprints and throws at import time if any
 * pile's authored values don't sum to the same target - catches typos early.
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

// Tuned for flow over challenge: values never exceed +/-12 (single digits until
// level 66), and levels open with locked seed blocks already in the piles so
// there's less to drag. Hard is a rare milestone - every 10th level from 20,
// each followed by an easy breather.
export const LEVELS: LevelDef[] = [
  buildLevel(1, 'easy', [
    [{ value: 6, isHint: true }, { value: 4 }],
    [{ value: 7, isHint: true }, { value: 3 }],
    [{ value: 5, isHint: true }, { value: 5 }],
  ]),
  buildLevel(2, 'easy', [
    [{ value: 5, isHint: true }, { value: 4 }],
    [{ value: 6, isHint: true }, { value: 3 }],
    [{ value: 7, isHint: true }, { value: 2 }],
  ]),
  buildLevel(3, 'easy', [
    [{ value: 7, isHint: true }, { value: 3 }],
    [{ value: 4 }, { value: 6 }],
    [{ value: 5 }, { value: 5 }],
  ]),
  buildLevel(4, 'easy', [
    [{ value: 5, isHint: true }, { value: 4 }],
    [{ value: 6, isHint: true }, { value: 3 }],
    [{ value: 7, isHint: true }, { value: 2 }],
  ]),
  buildLevel(5, 'medium', [
    [{ value: 5, isHint: true }, { value: 4, isHint: true }, { value: 2 }],
    [{ value: 6, isHint: true }, { value: 3 }, { value: 2 }],
    [{ value: 4 }, { value: 4 }, { value: 3 }],
  ]),
  buildLevel(6, 'easy', [
    [{ value: 3 }, { value: 6 }],
    [{ value: 7, isHint: true }, { value: 2 }],
    [{ value: 5, isHint: true }, { value: 4 }],
  ]),
  buildLevel(7, 'medium', [
    [{ value: 5, isHint: true }, { value: 3 }, { value: 5 }],
    [{ value: 7, isHint: true }, { value: 2 }, { value: 4 }],
    [{ value: 6, isHint: true }, { value: 2 }, { value: 5 }],
  ]),
  buildLevel(8, 'easy', [
    [{ value: 2 }, { value: 4 }],
    [{ value: -1 }, { value: 7 }],
    [{ value: 1 }, { value: 5 }],
  ]),
  buildLevel(9, 'medium', [
    [{ value: 7 }, { value: -4 }, { value: 6 }],
    [{ value: 7, isHint: true }, { value: 5 }, { value: -3 }],
    [{ value: 4, isHint: true }, { value: 2 }, { value: 3 }],
  ]),
  buildLevel(10, 'easy', [
    [{ value: 5, isHint: true }, { value: 1 }],
    [{ value: 4, isHint: true }, { value: 2 }],
    [{ value: 7, isHint: true }, { value: -1 }],
  ]),
  buildLevel(11, 'medium', [
    [{ value: 7 }, { value: 6 }, { value: -4 }],
    [{ value: 1 }, { value: 3 }, { value: 5 }],
    [{ value: 7 }, { value: 7 }, { value: -5 }],
  ]),
  buildLevel(12, 'easy', [
    [{ value: 2, isHint: true }, { value: 1 }],
    [{ value: 7, isHint: true }, { value: -4 }],
    [{ value: -3 }, { value: 6 }],
  ]),
  buildLevel(13, 'medium', [
    [{ value: 7, isHint: true }, { value: -3 }, { value: 4 }],
    [{ value: 3, isHint: true }, { value: 3 }, { value: 2 }],
    [{ value: 5 }, { value: 5 }, { value: -2 }],
  ]),
  buildLevel(14, 'easy', [
    [{ value: 4, isHint: true }, { value: 4 }],
    [{ value: 7, isHint: true }, { value: 1 }],
    [{ value: 6, isHint: true }, { value: 2 }],
  ]),
  buildLevel(15, 'medium', [
    [{ value: 5, isHint: true }, { value: 2, isHint: true }, { value: -3 }],
    [{ value: 5, isHint: true }, { value: -5 }, { value: 4 }],
    [{ value: 1 }, { value: -2 }, { value: 5 }],
  ]),
  buildLevel(16, 'medium', [
    [{ value: 4, isHint: true }, { value: 4 }, { value: -4 }],
    [{ value: -5 }, { value: 4 }, { value: 5 }],
    [{ value: 6 }, { value: 4 }, { value: -6 }],
  ]),
  buildLevel(17, 'easy', [
    [{ value: 6, isHint: true }, { value: -3 }],
    [{ value: 5 }, { value: -2 }],
    [{ value: 4, isHint: true }, { value: -1 }],
  ]),
  buildLevel(18, 'medium', [
    [{ value: 4 }, { value: 7 }, { value: 2 }],
    [{ value: 3 }, { value: 4 }, { value: 6 }],
    [{ value: 7 }, { value: 3 }, { value: 3 }],
  ]),
  buildLevel(19, 'easy', [
    [{ value: 5, isHint: true }, { value: -1 }],
    [{ value: 3, isHint: true }, { value: 1 }],
    [{ value: -2 }, { value: 6 }],
  ]),
  buildLevel(20, 'hard', [
    [{ value: 5, isHint: true }, { value: -3 }, { value: 5 }, { value: 5 }],
    [{ value: 6, isHint: true }, { value: 4 }, { value: -3 }, { value: 5 }],
    [{ value: 5, isHint: true }, { value: 4 }, { value: 1 }, { value: 2 }],
  ]),
  buildLevel(21, 'easy', [
    [{ value: 5 }, { value: 3 }],
    [{ value: 4 }, { value: 4 }],
    [{ value: 1 }, { value: 7 }],
  ]),
  buildLevel(22, 'medium', [
    [{ value: 6, isHint: true }, { value: 6, isHint: true }, { value: -2 }],
    [{ value: 7 }, { value: -2 }, { value: 5 }],
    [{ value: 2 }, { value: 6 }, { value: 2 }],
  ]),
  buildLevel(23, 'easy', [
    [{ value: 7, isHint: true }, { value: -2 }],
    [{ value: 6 }, { value: -1 }],
    [{ value: 3 }, { value: 2 }],
  ]),
  buildLevel(24, 'medium', [
    [{ value: -4 }, { value: 6 }, { value: 4 }],
    [{ value: -6 }, { value: 7 }, { value: 5 }],
    [{ value: 4 }, { value: 1 }, { value: 1 }],
  ]),
  buildLevel(25, 'medium', [
    [{ value: 6, isHint: true }, { value: 2, isHint: true }, { value: 1 }],
    [{ value: 4, isHint: true }, { value: 3 }, { value: 2 }],
    [{ value: -1 }, { value: 7 }, { value: 3 }],
  ]),
  buildLevel(26, 'easy', [
    [{ value: 7 }, { value: 3 }],
    [{ value: 5, isHint: true }, { value: 5 }],
    [{ value: 6, isHint: true }, { value: 4 }],
  ]),
  buildLevel(27, 'medium', [
    [{ value: 7, isHint: true }, { value: -2 }, { value: 6 }],
    [{ value: 4, isHint: true }, { value: 3 }, { value: 4 }],
    [{ value: 6, isHint: true }, { value: 1 }, { value: 4 }],
  ]),
  buildLevel(28, 'easy', [
    [{ value: 3 }, { value: 5 }],
    [{ value: 1 }, { value: 7 }],
    [{ value: 2 }, { value: 6 }],
  ]),
  buildLevel(29, 'medium', [
    [{ value: 1 }, { value: 7 }, { value: 7 }],
    [{ value: 6, isHint: true }, { value: 4 }, { value: 5 }],
    [{ value: 7, isHint: true }, { value: 6 }, { value: 2 }],
  ]),
  buildLevel(30, 'hard', [
    [{ value: 4, isHint: true }, { value: -4 }, { value: 3 }, { value: 3 }],
    [{ value: 5, isHint: true }, { value: 2 }, { value: -5 }, { value: 4 }],
    [{ value: 7 }, { value: 2 }, { value: -4 }, { value: 1 }],
  ]),
  buildLevel(31, 'easy', [
    [{ value: 9 }, { value: 2 }],
    [{ value: 7 }, { value: 4 }],
    [{ value: 3 }, { value: 8 }],
  ]),
  buildLevel(32, 'medium', [
    [{ value: 5, isHint: true }, { value: 1, isHint: true }, { value: -2 }],
    [{ value: -8 }, { value: 3 }, { value: 9 }],
    [{ value: 2 }, { value: -2 }, { value: 4 }],
  ]),
  buildLevel(33, 'medium', [
    [{ value: 5, isHint: true }, { value: -5 }, { value: 4 }],
    [{ value: 7, isHint: true }, { value: -9 }, { value: 6 }],
    [{ value: -4 }, { value: 1 }, { value: 7 }],
  ]),
  buildLevel(34, 'easy', [
    [{ value: 8, isHint: true }, { value: -3 }],
    [{ value: 3, isHint: true }, { value: 2 }],
    [{ value: 9, isHint: true }, { value: -4 }],
  ]),
  buildLevel(35, 'medium', [
    [{ value: 4, isHint: true }, { value: 3, isHint: true }, { value: -3 }],
    [{ value: 5, isHint: true }, { value: 2 }, { value: -3 }],
    [{ value: 4 }, { value: 5 }, { value: -5 }],
  ]),
  buildLevel(36, 'medium', [
    [{ value: 4, isHint: true }, { value: 4 }, { value: 1 }],
    [{ value: 6 }, { value: 9 }, { value: -6 }],
    [{ value: 9 }, { value: -2 }, { value: 2 }],
  ]),
  buildLevel(37, 'easy', [
    [{ value: 7, isHint: true }, { value: -4 }],
    [{ value: -5 }, { value: 8 }],
    [{ value: 5, isHint: true }, { value: -2 }],
  ]),
  buildLevel(38, 'medium', [
    [{ value: -2 }, { value: 7 }, { value: 5 }],
    [{ value: 9 }, { value: -3 }, { value: 4 }],
    [{ value: 1 }, { value: 7 }, { value: 2 }],
  ]),
  buildLevel(39, 'medium', [
    [{ value: 1 }, { value: 1 }, { value: 6 }],
    [{ value: 8, isHint: true }, { value: -4 }, { value: 4 }],
    [{ value: 7, isHint: true }, { value: 4 }, { value: -3 }],
  ]),
  buildLevel(40, 'hard', [
    [{ value: 8, isHint: true }, { value: 7, isHint: true }, { value: -1 }, { value: -1 }],
    [{ value: -7 }, { value: 7 }, { value: 5 }, { value: 8 }],
    [{ value: 9, isHint: true }, { value: 4 }, { value: 5 }, { value: -5 }],
  ]),
  buildLevel(41, 'easy', [
    [{ value: -1 }, { value: 6 }],
    [{ value: 2 }, { value: 3 }],
    [{ value: 1 }, { value: 4 }],
  ]),
  buildLevel(42, 'medium', [
    [{ value: 9, isHint: true }, { value: 6, isHint: true }, { value: -8 }],
    [{ value: 6 }, { value: 4 }, { value: -3 }],
    [{ value: -4 }, { value: 4 }, { value: 7 }],
  ]),
  buildLevel(43, 'easy', [
    [{ value: 6, isHint: true }, { value: -3 }],
    [{ value: -6 }, { value: 9 }],
    [{ value: 8 }, { value: -5 }],
  ]),
  buildLevel(44, 'medium', [
    [{ value: 7 }, { value: 6 }, { value: 3 }],
    [{ value: 6 }, { value: 1 }, { value: 9 }],
    [{ value: 8 }, { value: 4 }, { value: 4 }],
  ]),
  buildLevel(45, 'medium', [
    [{ value: 7, isHint: true }, { value: 7, isHint: true }, { value: 3 }],
    [{ value: 9, isHint: true }, { value: 1 }, { value: 7 }],
    [{ value: 6 }, { value: 5 }, { value: 6 }],
  ]),
  buildLevel(46, 'easy', [
    [{ value: 1 }, { value: 3 }],
    [{ value: 6, isHint: true }, { value: -2 }],
    [{ value: 7, isHint: true }, { value: -3 }],
  ]),
  buildLevel(47, 'medium', [
    [{ value: 8, isHint: true }, { value: 4 }, { value: -8 }],
    [{ value: 8, isHint: true }, { value: -5 }, { value: 1 }],
    [{ value: 5, isHint: true }, { value: -2 }, { value: 1 }],
  ]),
  buildLevel(48, 'medium', [
    [{ value: 1 }, { value: 3 }, { value: 5 }],
    [{ value: 1 }, { value: 9 }, { value: -1 }],
    [{ value: -9 }, { value: 9 }, { value: 9 }],
  ]),
  buildLevel(49, 'easy', [
    [{ value: 4, isHint: true }, { value: 3 }],
    [{ value: 6, isHint: true }, { value: 1 }],
    [{ value: -2 }, { value: 9 }],
  ]),
  buildLevel(50, 'hard', [
    [{ value: 8, isHint: true }, { value: 1 }, { value: 3 }, { value: 1 }],
    [{ value: 4 }, { value: 8 }, { value: 6 }, { value: -5 }],
    [{ value: 9, isHint: true }, { value: -4 }, { value: 7 }, { value: 1 }],
  ]),
  buildLevel(51, 'easy', [
    [{ value: 2 }, { value: 8 }],
    [{ value: 3 }, { value: 7 }],
    [{ value: 4 }, { value: 6 }],
  ]),
  buildLevel(52, 'medium', [
    [{ value: 9, isHint: true }, { value: 5, isHint: true }, { value: 4 }],
    [{ value: 6 }, { value: 7 }, { value: 5 }],
    [{ value: 8 }, { value: 2 }, { value: 8 }],
  ]),
  buildLevel(53, 'medium', [
    [{ value: 9, isHint: true }, { value: 4 }, { value: -7 }],
    [{ value: 4, isHint: true }, { value: 4 }, { value: -2 }],
    [{ value: 2 }, { value: 6 }, { value: -2 }],
  ]),
  buildLevel(54, 'easy', [
    [{ value: 6, isHint: true }, { value: 3 }],
    [{ value: 7, isHint: true }, { value: 2 }],
    [{ value: 5, isHint: true }, { value: 4 }],
  ]),
  buildLevel(55, 'medium', [
    [{ value: 4, isHint: true }, { value: 2, isHint: true }, { value: -1 }],
    [{ value: 3, isHint: true }, { value: 1 }, { value: 1 }],
    [{ value: -2 }, { value: 5 }, { value: 2 }],
  ]),
  buildLevel(56, 'medium', [
    [{ value: 6, isHint: true }, { value: 5 }, { value: -4 }],
    [{ value: 9 }, { value: 5 }, { value: -7 }],
    [{ value: 3 }, { value: -3 }, { value: 7 }],
  ]),
  buildLevel(57, 'easy', [
    [{ value: 8, isHint: true }, { value: -2 }],
    [{ value: -3 }, { value: 9 }],
    [{ value: 5, isHint: true }, { value: 1 }],
  ]),
  buildLevel(58, 'medium', [
    [{ value: 3 }, { value: 3 }, { value: 6 }],
    [{ value: 5 }, { value: 5 }, { value: 2 }],
    [{ value: 2 }, { value: 7 }, { value: 3 }],
  ]),
  buildLevel(59, 'medium', [
    [{ value: 5 }, { value: 4 }, { value: 5 }],
    [{ value: 8, isHint: true }, { value: 5 }, { value: 1 }],
    [{ value: 9, isHint: true }, { value: -4 }, { value: 9 }],
  ]),
  buildLevel(60, 'hard', [
    [{ value: 7, isHint: true }, { value: 6, isHint: true }, { value: 2 }, { value: -6 }],
    [{ value: 9, isHint: true }, { value: 8 }, { value: -5 }, { value: -3 }],
    [{ value: 6, isHint: true }, { value: -6 }, { value: 6 }, { value: 3 }],
  ]),
  buildLevel(61, 'easy', [
    [{ value: 4 }, { value: 6 }],
    [{ value: 3 }, { value: 7 }],
    [{ value: 2 }, { value: 8 }],
  ]),
  buildLevel(62, 'medium', [
    [{ value: 9, isHint: true }, { value: 7, isHint: true }, { value: -1 }],
    [{ value: -1 }, { value: 8 }, { value: 8 }],
    [{ value: -2 }, { value: 9 }, { value: 8 }],
  ]),
  buildLevel(63, 'easy', [
    [{ value: 8, isHint: true }, { value: 3 }],
    [{ value: 9 }, { value: 2 }],
    [{ value: 4 }, { value: 7 }],
  ]),
  buildLevel(64, 'medium', [
    [{ value: 1 }, { value: 8 }, { value: 8 }],
    [{ value: 7 }, { value: 7 }, { value: 3 }],
    [{ value: 8 }, { value: 6 }, { value: 3 }],
  ]),
  buildLevel(65, 'medium', [
    [{ value: 9, isHint: true }, { value: 6, isHint: true }, { value: -8 }],
    [{ value: 9, isHint: true }, { value: -7 }, { value: 5 }],
    [{ value: 1 }, { value: 4 }, { value: 2 }],
  ]),
  buildLevel(66, 'easy', [
    [{ value: -4 }, { value: 7 }],
    [{ value: 11, isHint: true }, { value: -8 }],
    [{ value: 4, isHint: true }, { value: -1 }],
  ]),
  buildLevel(67, 'medium', [
    [{ value: 12, isHint: true }, { value: 11 }, { value: -10 }],
    [{ value: 8, isHint: true }, { value: 1 }, { value: 4 }],
    [{ value: 5, isHint: true }, { value: 3 }, { value: 5 }],
  ]),
  buildLevel(68, 'medium', [
    [{ value: 9 }, { value: -3 }, { value: 3 }],
    [{ value: 3 }, { value: -4 }, { value: 10 }],
    [{ value: -11 }, { value: 10 }, { value: 10 }],
  ]),
  buildLevel(69, 'easy', [
    [{ value: 11, isHint: true }, { value: -4 }],
    [{ value: 12, isHint: true }, { value: -5 }],
    [{ value: 2 }, { value: 5 }],
  ]),
  buildLevel(70, 'hard', [
    [{ value: 5 }, { value: -4 }, { value: -4 }, { value: 10 }],
    [{ value: 11, isHint: true }, { value: -9 }, { value: 2 }, { value: 3 }],
    [{ value: 11, isHint: true }, { value: -4 }, { value: 2 }, { value: -2 }],
  ]),
  buildLevel(71, 'easy', [
    [{ value: 3 }, { value: 11 }],
    [{ value: 7 }, { value: 7 }],
    [{ value: 6 }, { value: 8 }],
  ]),
  buildLevel(72, 'medium', [
    [{ value: 12, isHint: true }, { value: 6, isHint: true }, { value: 1 }],
    [{ value: 7 }, { value: 4 }, { value: 8 }],
    [{ value: 1 }, { value: 7 }, { value: 11 }],
  ]),
  buildLevel(73, 'medium', [
    [{ value: 12, isHint: true }, { value: 3 }, { value: 1 }],
    [{ value: 9, isHint: true }, { value: 9 }, { value: -2 }],
    [{ value: 1 }, { value: 11 }, { value: 4 }],
  ]),
  buildLevel(74, 'easy', [
    [{ value: 12, isHint: true }, { value: 1 }],
    [{ value: 8, isHint: true }, { value: 5 }],
    [{ value: 10, isHint: true }, { value: 3 }],
  ]),
  buildLevel(75, 'medium', [
    [{ value: 12, isHint: true }, { value: 7, isHint: true }, { value: 1 }],
    [{ value: 11, isHint: true }, { value: 10 }, { value: -1 }],
    [{ value: 5 }, { value: 12 }, { value: 3 }],
  ]),
  buildLevel(76, 'medium', [
    [{ value: 12, isHint: true }, { value: 10 }, { value: 3 }],
    [{ value: 12 }, { value: 6 }, { value: 7 }],
    [{ value: 11 }, { value: 4 }, { value: 10 }],
  ]),
  buildLevel(77, 'easy', [
    [{ value: 8, isHint: true }, { value: 2 }],
    [{ value: -2 }, { value: 12 }],
    [{ value: 7, isHint: true }, { value: 3 }],
  ]),
  buildLevel(78, 'medium', [
    [{ value: 1 }, { value: 11 }, { value: -5 }],
    [{ value: 4 }, { value: -7 }, { value: 10 }],
    [{ value: 8 }, { value: -8 }, { value: 7 }],
  ]),
  buildLevel(79, 'medium', [
    [{ value: 9 }, { value: 5 }, { value: -8 }],
    [{ value: 11, isHint: true }, { value: -10 }, { value: 5 }],
    [{ value: 5, isHint: true }, { value: -2 }, { value: 3 }],
  ]),
  buildLevel(80, 'hard', [
    [{ value: 12, isHint: true }, { value: 10 }, { value: 5 }, { value: 4 }],
    [{ value: 3 }, { value: 7 }, { value: 10 }, { value: 11 }],
    [{ value: 4 }, { value: 7 }, { value: 10 }, { value: 10 }],
  ]),
  buildLevel(81, 'easy', [
    [{ value: 8 }, { value: -4 }],
    [{ value: -8 }, { value: 12 }],
    [{ value: 5 }, { value: -1 }],
  ]),
  buildLevel(82, 'medium', [
    [{ value: 11, isHint: true }, { value: 5, isHint: true }, { value: 5 }],
    [{ value: 8 }, { value: 11 }, { value: 2 }],
    [{ value: 5 }, { value: 8 }, { value: 8 }],
  ]),
  buildLevel(83, 'easy', [
    [{ value: 9, isHint: true }, { value: 7 }],
    [{ value: 6 }, { value: 10 }],
    [{ value: 8 }, { value: 8 }],
  ]),
  buildLevel(84, 'medium', [
    [{ value: 5 }, { value: 12 }, { value: 6 }],
    [{ value: 9 }, { value: 12 }, { value: 2 }],
    [{ value: 10 }, { value: 12 }, { value: 1 }],
  ]),
  buildLevel(85, 'medium', [
    [{ value: 9, isHint: true }, { value: 5, isHint: true }, { value: -7 }],
    [{ value: 7, isHint: true }, { value: 1 }, { value: -1 }],
    [{ value: 9 }, { value: 10 }, { value: -12 }],
  ]),
  buildLevel(86, 'easy', [
    [{ value: 11 }, { value: -8 }],
    [{ value: 2, isHint: true }, { value: 1 }],
    [{ value: 8, isHint: true }, { value: -5 }],
  ]),
  buildLevel(87, 'medium', [
    [{ value: 9, isHint: true }, { value: -7 }, { value: 2 }],
    [{ value: 5, isHint: true }, { value: -5 }, { value: 4 }],
    [{ value: 8, isHint: true }, { value: 4 }, { value: -8 }],
  ]),
  buildLevel(88, 'medium', [
    [{ value: 3 }, { value: 10 }, { value: -8 }],
    [{ value: -11 }, { value: 9 }, { value: 7 }],
    [{ value: 3 }, { value: 5 }, { value: -3 }],
  ]),
  buildLevel(89, 'easy', [
    [{ value: 11, isHint: true }, { value: -1 }],
    [{ value: 5, isHint: true }, { value: 5 }],
    [{ value: 9 }, { value: 1 }],
  ]),
  buildLevel(90, 'hard', [
    [{ value: 12, isHint: true }, { value: 8, isHint: true }, { value: -11 }, { value: 8 }],
    [{ value: 11, isHint: true }, { value: 5 }, { value: 9 }, { value: -8 }],
    [{ value: -3 }, { value: 2 }, { value: 8 }, { value: 10 }],
  ]),
  buildLevel(91, 'easy', [
    [{ value: 8 }, { value: -1 }],
    [{ value: -5 }, { value: 12 }],
    [{ value: 9 }, { value: -2 }],
  ]),
  buildLevel(92, 'medium', [
    [{ value: 10, isHint: true }, { value: 1, isHint: true }, { value: -4 }],
    [{ value: -4 }, { value: 7 }, { value: 4 }],
    [{ value: 7 }, { value: 9 }, { value: -9 }],
  ]),
  buildLevel(93, 'medium', [
    [{ value: 7, isHint: true }, { value: -4 }, { value: 7 }],
    [{ value: 11, isHint: true }, { value: 8 }, { value: -9 }],
    [{ value: 8 }, { value: 9 }, { value: -7 }],
  ]),
  buildLevel(94, 'easy', [
    [{ value: 5, isHint: true }, { value: 4 }],
    [{ value: 11, isHint: true }, { value: -2 }],
    [{ value: 6, isHint: true }, { value: 3 }],
  ]),
  buildLevel(95, 'medium', [
    [{ value: 7, isHint: true }, { value: 6, isHint: true }, { value: 1 }],
    [{ value: 12, isHint: true }, { value: -3 }, { value: 5 }],
    [{ value: 11 }, { value: -4 }, { value: 7 }],
  ]),
  buildLevel(96, 'easy', [
    [{ value: 1 }, { value: 7 }],
    [{ value: 4, isHint: true }, { value: 4 }],
    [{ value: 11, isHint: true }, { value: -3 }],
  ]),
  buildLevel(97, 'medium', [
    [{ value: 9, isHint: true }, { value: 6 }, { value: -1 }],
    [{ value: 10, isHint: true }, { value: 1 }, { value: 3 }],
    [{ value: 12, isHint: true }, { value: 11 }, { value: -9 }],
  ]),
  buildLevel(98, 'easy', [
    [{ value: 6 }, { value: 4 }],
    [{ value: 5 }, { value: 5 }],
    [{ value: 8 }, { value: 2 }],
  ]),
  buildLevel(99, 'medium', [
    [{ value: 8 }, { value: 11 }, { value: -3 }],
    [{ value: 12, isHint: true }, { value: 10 }, { value: -6 }],
    [{ value: 11, isHint: true }, { value: -4 }, { value: 9 }],
  ]),
  buildLevel(100, 'medium', [
    [{ value: 9, isHint: true }, { value: -10 }, { value: 8 }],
    [{ value: 12, isHint: true }, { value: 2 }, { value: -7 }],
    [{ value: 10, isHint: true }, { value: 7 }, { value: -10 }],
  ]),
];
