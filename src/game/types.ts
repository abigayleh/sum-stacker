export type BlockLocation = { type: 'footer' } | { type: 'pile'; pileIndex: number };

export type LevelBlock = {
  value: number;
  isHint: boolean;
  startLocation: BlockLocation;
};

export type LevelDef = {
  id: number;
  pileCount: number;
  targetSum: number;
  showSum: boolean;
  blocks: LevelBlock[];
};
