import { ElementType, MonsterInstance, Move, Stats, StatStages, StatusEffect } from './models';

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
  DRAGON: { DRAGON: 2, FAIRY: 0 },
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

export function getStatMultiplier(stage: number): number {
  if (stage >= 0) {
    return (2 + stage) / 2;
  } else {
    return 2 / (2 - stage);
  }
}

export function calculateDamage(attacker: MonsterInstance, defender: MonsterInstance, move: Move): { damage: number; multiplier: number; isCritical: boolean } {
  if (move.category === 'STATUS') {
    return { damage: 0, multiplier: 1, isCritical: false };
  }

  const isSpecial = move.category === 'SPECIAL';
  let attackStat = isSpecial ? attacker.stats.spAttack : attacker.stats.attack;
  let defenseStat = isSpecial ? defender.stats.spDefense : defender.stats.defense;

  // Apply stat stages
  const attackStage = isSpecial ? attacker.statStages.spAttack : attacker.statStages.attack;
  attackStat = Math.floor(attackStat * getStatMultiplier(attackStage));

  const targetDefenseStage = isSpecial ? defender.statStages.spDefense : defender.statStages.defense;
  defenseStat = Math.floor(defenseStat * getStatMultiplier(targetDefenseStage));

  // Simplified Monster damage formula
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

export function getModifiedSpeed(monster: MonsterInstance): number {
  let speed = Math.floor(monster.stats.speed * getStatMultiplier(monster.statStages.speed));
  if (monster.status === 'PARALYSIS') {
    speed = Math.floor(speed * 0.5);
  }
  return speed;
}

export function canMove(monster: MonsterInstance): { can: boolean; message?: string } {
  if (monster.status === 'SLEEP') {
    if ((monster.statusTurns || 0) > 0) {
      return { can: false, message: `${monster.name} は ぐうぐう ねむっている` };
    } else {
      monster.status = 'NONE';
      return { can: true, message: `${monster.name} は めをさました！` };
    }
  }

  if (monster.status === 'PARALYSIS') {
    if (Math.random() < 0.25) {
      return { can: false, message: `${monster.name} は からだが しびれて うごけない！` };
    }
  }

  return { can: true };
}

export function applyStatus(attacker: MonsterInstance, defender: MonsterInstance, move: Move): { success: boolean; status: StatusEffect; message?: string } {
  if (!move.statusEffect || move.statusEffect === 'NONE') {
    return { success: false, status: 'NONE' };
  }

  if (defender.status !== 'NONE') {
    return { success: false, status: defender.status };
  }

  // Immunity checks
  if (move.statusEffect === 'POISON' && defender.types.includes('POISON')) {
    return { success: false, status: 'NONE', message: `${defender.name} には きかない！` };
  }
  if (move.statusEffect === 'POISON' && defender.types.includes('STEEL')) {
    return { success: false, status: 'NONE', message: `${defender.name} には きかない！` };
  }

  if (Math.random() < (move.statusChance || 1)) {
    defender.status = move.statusEffect;
    if (move.statusEffect === 'SLEEP') {
      defender.statusTurns = Math.floor(Math.random() * 3) + 1; // 1-3 turns
      return { success: true, status: 'SLEEP', message: `${defender.name} は ねむってしまった！` };
    }
    if (move.statusEffect === 'POISON') {
      return { success: true, status: 'POISON', message: `${defender.name} は どくを あびた！` };
    }
    if (move.statusEffect === 'PARALYSIS') {
      return { success: true, status: 'PARALYSIS', message: `${defender.name} は まひしてしまった！` };
    }
  }

  return { success: false, status: 'NONE' };
}

export function applyStatChanges(attacker: MonsterInstance, defender: MonsterInstance, move: Move): { message: string }[] {
  if (!move.statChanges) return [];

  const target = move.target === 'SELF' ? attacker : defender;
  const messages: { message: string }[] = [];

  for (const [stat, change] of Object.entries(move.statChanges) as [keyof StatStages, number][]) {
    const oldStage = target.statStages[stat];
    const newStage = Math.max(-6, Math.min(6, oldStage + change));

    if (newStage === oldStage) {
      const direction = change > 0 ? "これいじょう あがらない！" : "これいじょう さがらない！";
      messages.push({ message: `${target.name} の ${stat} は ${direction}` });
      continue;
    }

    target.statStages[stat] = newStage;
    const actualChange = newStage - oldStage;

    let changeMsg = "";
    if (actualChange >= 2) changeMsg = "ぐーんと あがった！";
    else if (actualChange === 1) changeMsg = "あがった！";
    else if (actualChange === -1) changeMsg = "さがった！";
    else if (actualChange <= -2) changeMsg = "がくっと さがった！";

    // Japanese stat names
    const statNames: Record<string, string> = {
      attack: "こうげき",
      defense: "ぼうぎょ",
      spAttack: "とくこう",
      spDefense: "とくぼう",
      speed: "すばやさ"
    };

    messages.push({ message: `${target.name} の ${statNames[stat]} が ${changeMsg}` });
  }

  return messages;
}

export function applyRest(monster: MonsterInstance): { message: string }[] {
  monster.currentHp = monster.stats.hp;
  monster.status = 'SLEEP';
  monster.statusTurns = 2; // Fixed 2 turns for Rest
  return [
    { message: `${monster.name} は ねむって ＨＰを かいふくした！` }
  ];
}

export function calculateEscapeSuccess(playerSpeed: number, enemySpeed: number, attempts: number): boolean {
  if (playerSpeed >= enemySpeed) return true;
  
  const f = Math.floor((playerSpeed * 128) / enemySpeed) + 30 * attempts;
  if (f > 255) return true;
  
  return Math.random() * 256 < f;
}

export function processEndOfTurn(monster: MonsterInstance): { damage: number; message?: string } {
  let damage = 0;
  let message: string | undefined;

  if (monster.status === 'POISON') {
    damage = Math.floor(monster.stats.hp / 8);
    monster.currentHp = Math.max(0, monster.currentHp - damage);
    message = `${monster.name} は どくの ダメージを うけている`;
  }

  if (monster.status === 'SLEEP') {
    if ((monster.statusTurns || 0) > 0) {
      monster.statusTurns! -= 1;
    }
  }

  return { damage, message };
}
