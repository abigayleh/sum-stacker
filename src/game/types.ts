export type BlockLocation = { type: 'footer' } | { type: 'pile'; pileIndex: number };

export type LevelBlock = {
  value: number;
  isHint: boolean;
  startLocation: BlockLocation;
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export type LevelDef = {
  id: number;
  difficulty: Difficulty;
  pileCount: number;
  targetSum: number;
  showSum: boolean;
  blocks: LevelBlock[];
};
