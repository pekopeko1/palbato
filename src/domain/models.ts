export type ElementType = 
  | 'NORMAL' | 'FIRE' | 'WATER' | 'GRASS' | 'ELECTRIC' 
  | 'ICE' | 'FIGHTING' | 'POISON' | 'GROUND' | 'FLYING' 
  | 'PSYCHIC' | 'BUG' | 'ROCK' | 'GHOST' | 'DRAGON' 
  | 'STEEL' | 'DARK';

export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}

export interface Move {
  id: string;
  name: string;
  type: ElementType;
  category: 'PHYSICAL' | 'SPECIAL' | 'STATUS';
  power: number;
  accuracy: number;
  pp: number;
  description: string;
}

export interface MonsterDefinition {
  id: string;
  name: string;
  types: ElementType[];
  baseStats: Stats;
  learnset: { level: number; moveId: string }[];
  frontSprite: string;
  backSprite: string;
}

export interface MonsterInstance {
  definitionId: string;
  name: string;
  types: ElementType[];
  level: number;
  currentHp: number;
  stats: Stats;
  moves: (Move | null)[];
}

export interface BattleState {
  playerMonster: MonsterInstance;
  enemyMonster: MonsterInstance;
  turnCount: number;
  isFinished: boolean;
  winner: 'PLAYER' | 'ENEMY' | null;
  message: string;
}
