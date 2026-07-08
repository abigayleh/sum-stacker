import { useCallback, useMemo, useReducer } from 'react';
import { BlockLocation, LevelDef } from './types';

export type GameBlock = { value: number; isHint: boolean; location: BlockLocation };

type State = {
  pileCount: number;
  blocks: Record<string, GameBlock>;
  initialBlocks: Record<string, GameBlock>;
  moveCount: number;
};

export type Action = { type: 'MOVE_BLOCK'; blockId: string; destination: BlockLocation } | { type: 'RESET_LEVEL' };

function locationsEqual(a: BlockLocation, b: BlockLocation): boolean {
  if (a.type !== b.type) return false;
  return a.type === 'pile' && b.type === 'pile' ? a.pileIndex === b.pileIndex : true;
}

export function createInitialState(level: LevelDef): State {
  const blocks: Record<string, GameBlock> = {};
  level.blocks.forEach((b, index) => {
    blocks[`${level.id}-${index}`] = { value: b.value, isHint: b.isHint, location: b.startLocation };
  });
  return { pileCount: level.pileCount, blocks, initialBlocks: blocks, moveCount: 0 };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'MOVE_BLOCK': {
      const block = state.blocks[action.blockId];
      if (!block || block.isHint || locationsEqual(block.location, action.destination)) return state;
      return {
        ...state,
        blocks: { ...state.blocks, [action.blockId]: { ...block, location: action.destination } },
        moveCount: state.moveCount + 1,
      };
    }
    case 'RESET_LEVEL':
      return { ...state, blocks: state.initialBlocks, moveCount: 0 };
    default:
      return state;
  }
}

export function useGameState(level: LevelDef) {
  const [state, dispatch] = useReducer(reducer, level, createInitialState);

  const moveBlock = useCallback((blockId: string, destination: BlockLocation) => {
    dispatch({ type: 'MOVE_BLOCK', blockId, destination });
  }, []);

  const resetLevel = useCallback(() => dispatch({ type: 'RESET_LEVEL' }), []);

  const pileSums = useMemo(() => {
    const sums = new Array(state.pileCount).fill(0);
    Object.values(state.blocks).forEach((b) => {
      if (b.location.type === 'pile') sums[b.location.pileIndex] += b.value;
    });
    return sums;
  }, [state.blocks, state.pileCount]);

  const footerBlockIds = useMemo(
    () =>
      Object.entries(state.blocks)
        .filter(([, b]) => b.location.type === 'footer')
        .map(([id]) => id),
    [state.blocks]
  );

  const isWin = useMemo(
    () => footerBlockIds.length === 0 && pileSums.every((sum) => sum === pileSums[0]),
    [footerBlockIds, pileSums]
  );

  const stars = useMemo(() => {
    const idealMoves = Object.values(state.initialBlocks).filter((b) => !b.isHint).length;
    if (state.moveCount === idealMoves) return 3;
    if (state.moveCount <= Math.ceil(idealMoves * 1.5)) return 2;
    return 1;
  }, [state.moveCount, state.initialBlocks]);

  return { state, moveBlock, resetLevel, pileSums, footerBlockIds, isWin, stars };
}
