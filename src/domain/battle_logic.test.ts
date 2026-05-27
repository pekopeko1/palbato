import { describe, it, expect } from 'vitest';
import { getEffectiveness, calculateDamage } from './battle_logic';
import { MonsterInstance, Move } from './models';

describe('battle_logic', () => {
  it('should calculate type effectiveness correctly', () => {
    expect(getEffectiveness('FIRE', ['GRASS'])).toBe(2);
    expect(getEffectiveness('WATER', ['FIRE'])).toBe(2);
    expect(getEffectiveness('GRASS', ['WATER'])).toBe(2);
    expect(getEffectiveness('NORMAL', ['GHOST'])).toBe(0);
    expect(getEffectiveness('FIRE', ['WATER', 'ROCK'])).toBe(0.25);
  });

  it('should calculate damage with STAB and effectiveness', () => {
    const attacker: MonsterInstance = {
      definitionId: 'charmander',
      name: 'Charmander',
      types: ['FIRE'],
      level: 5,
      currentHp: 20,
      stats: { hp: 20, attack: 10, defense: 10, spAttack: 10, spDefense: 10, speed: 10 },
      moves: []
    };

    const defender: MonsterInstance = {
      definitionId: 'bulbasaur',
      name: 'Bulbasaur',
      types: ['GRASS'],
      level: 5,
      currentHp: 20,
      stats: { hp: 20, attack: 10, defense: 10, spAttack: 10, spDefense: 10, speed: 10 },
      moves: []
    };

    const move: Move = {
      id: 'ember',
      name: 'Ember',
      type: 'FIRE',
      category: 'SPECIAL',
      power: 40,
      accuracy: 100,
      pp: 25,
      description: ''
    };

    const result = calculateDamage(attacker, defender, move);
    // Base damage ~ (((2*5/5+2)*40*1)/50)+2 = (4*40/50)+2 = 3.2 + 2 = 5.2
    // STAB (1.5) * Eff (2) = 3
    // Total ~ 5.2 * 3 = 15.6
    // Random [0.85, 1.0] -> [13.26, 15.6]
    expect(result.damage).toBeGreaterThanOrEqual(13);
    expect(result.damage).toBeLessThanOrEqual(23); // Including possible crit (1.5x)
  });
});
