export type ElementType = 
  | 'NORMAL' | 'FIRE' | 'WATER' | 'GRASS' | 'ELECTRIC' 
  | 'ICE' | 'FIGHTING' | 'POISON' | 'GROUND' | 'FLYING' 
  | 'PSYCHIC' | 'BUG' | 'ROCK' | 'GHOST' | 'DRAGON' 
  | 'STEEL' | 'DARK' | 'FAIRY';

export type StatusEffect = 'NONE' | 'POISON' | 'PARALYSIS' | 'SLEEP' | 'BURN' | 'FROZEN';

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
  statusEffect?: StatusEffect;
  statusChance?: number;
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

export interface MoveInstance {
  move: Move;
  currentPp: number;
}

export interface MonsterInstance {
  definitionId: string;
  name: string;
  types: ElementType[];
  level: number;
  currentHp: number;
  stats: Stats;
  moves: MoveInstance[];
  status: StatusEffect;
  statusTurns?: number;
}

export interface BattleState {
  playerMonster: MonsterInstance;
  enemyMonster: MonsterInstance;
  turnCount: number;
  isFinished: boolean;
  winner: 'PLAYER' | 'ENEMY' | null;
  message: string;
}
