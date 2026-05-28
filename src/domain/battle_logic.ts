import { ElementType, MonsterInstance, Move, Stats } from './models';

const TypeEffectiveness: Record<ElementType, Partial<Record<ElementType, number>>> = {
  NORMAL: { ROCK: 0.5, GHOST: 0, STEEL: 0.5 },
  FIRE: { FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 2, BUG: 2, ROCK: 0.5, DRAGON: 0.5, STEEL: 2, FAIRY: 0.5 },
  WATER: { FIRE: 2, WATER: 0.5, GRASS: 0.5, GROUND: 2, ROCK: 2, DRAGON: 0.5 },
  GRASS: { FIRE: 0.5, WATER: 2, GRASS: 0.5, POISON: 0.5, GROUND: 2, FLYING: 0.5, BUG: 0.5, ROCK: 2, DRAGON: 0.5, STEEL: 0.5 },
  ELECTRIC: { WATER: 2, ELECTRIC: 0.5, GRASS: 0.5, GROUND: 0, FLYING: 2, DRAGON: 0.5 },
  ICE: { FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 0.5, GROUND: 2, FLYING: 2, DRAGON: 2, STEEL: 0.5 },
  FIGHTING: { NORMAL: 2, ICE: 2, POISON: 0.5, FLYING: 0.5, PSYCHIC: 0.5, BUG: 0.5, ROCK: 2, GHOST: 0, DARK: 2, STEEL: 2, FAIRY: 0.5 },
  POISON: { GRASS: 2, POISON: 0.5, GROUND: 0.5, ROCK: 0.5, GHOST: 0.5, STEEL: 0, FAIRY: 2 },
  GROUND: { FIRE: 2, ELECTRIC: 2, GRASS: 0.5, POISON: 2, BUG: 0.5, ROCK: 2, STEEL: 2 },
  FLYING: { ELECTRIC: 0.5, GRASS: 2, FIGHTING: 2, BUG: 2, ROCK: 0.5, STEEL: 0.5 },
  PSYCHIC: { FIGHTING: 2, POISON: 2, PSYCHIC: 0.5, DARK: 0, STEEL: 0.5 },
  BUG: { FIRE: 0.5, GRASS: 2, FIGHTING: 0.5, POISON: 0.5, FLYING: 0.5, PSYCHIC: 2, GHOST: 0.5, DARK: 2, STEEL: 0.5, FAIRY: 0.5 },
  ROCK: { FIRE: 2, ICE: 2, FIGHTING: 0.5, GROUND: 0.5, FLYING: 2, BUG: 2, STEEL: 0.5 },
  GHOST: { NORMAL: 0, PSYCHIC: 2, GHOST: 2, DARK: 0.5 },
  DRAGON: { DRAGON: 2, STEEL: 0.5, FAIRY: 0 },
  STEEL: { FIRE: 0.5, WATER: 0.5, ELECTRIC: 0.5, ICE: 2, ROCK: 2, STEEL: 0.5, FAIRY: 2 },
  DARK: { FIGHTING: 0.5, PSYCHIC: 2, GHOST: 2, DARK: 0.5, FAIRY: 0.5 },
  FAIRY: { FIRE: 0.5, FIGHTING: 2, POISON: 0.5, DRAGON: 2, STEEL: 0.5, DARK: 2 }
};

export function getEffectiveness(moveType: ElementType, targetTypes: ElementType[]): number {
  let multiplier = 1;
  for (const targetType of targetTypes) {
    const effect = TypeEffectiveness[moveType]?.[targetType];
    if (effect !== undefined) {
      multiplier *= effect;
    }
  }
  return multiplier;
}

export function calculateDamage(attacker: MonsterInstance, defender: MonsterInstance, move: Move): { damage: number; multiplier: number; isCritical: boolean } {
  if (move.category === 'STATUS') {
    return { damage: 0, multiplier: 1, isCritical: false };
  }

  const isSpecial = move.category === 'SPECIAL';
  const attackStat = isSpecial ? attacker.stats.spAttack : attacker.stats.attack;
  const defenseStat = isSpecial ? defender.stats.spDefense : defender.stats.defense;

  // Simplified Pokemon damage formula
  // Damage = (((2 * Level / 5 + 2) * Power * A/D) / 50 + 2) * Modifier
  const baseDamage = (((2 * attacker.level / 5 + 2) * move.power * (attackStat / defenseStat)) / 50) + 2;

  // Critical hit (simplified 1/16 chance)
  const isCritical = Math.random() < 0.0625;
  const critMultiplier = isCritical ? 1.5 : 1;

  // Random factor [0.85, 1.0]
  const randomFactor = 0.85 + Math.random() * 0.15;

  // STAB (Same Type Attack Bonus)
  const stab = attacker.types.includes(move.type) ? 1.5 : 1;

  // Type effectiveness
  const multiplier = getEffectiveness(move.type, defender.types);

  const totalDamage = Math.floor(baseDamage * critMultiplier * randomFactor * stab * multiplier);

  return { damage: Math.max(1, totalDamage), multiplier, isCritical };
}

// I should probably add types to MonsterInstance to make this easier
