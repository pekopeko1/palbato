import { describe, it, expect } from 'vitest';
import { getEffectiveness, calculateDamage, getModifiedSpeed, canMove, applyStatus, processEndOfTurn, getStatMultiplier, applyStatChanges, applyRest } from './battle_logic';
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
      statStages: { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
      moves: [],
      status: 'NONE'
    };

    const defender: MonsterInstance = {
      definitionId: 'bulbasaur',
      name: 'Bulbasaur',
      types: ['GRASS'],
      level: 5,
      currentHp: 20,
      stats: { hp: 20, attack: 10, defense: 10, spAttack: 10, spDefense: 10, speed: 10 },
      statStages: { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
      moves: [],
      status: 'NONE'
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

  describe('getModifiedSpeed', () => {
    it('should halve speed when paralyzed', () => {
      const monster: any = { stats: { speed: 100 }, statStages: { speed: 0 }, status: 'PARALYSIS' };
      expect(getModifiedSpeed(monster)).toBe(50);
    });

    it('should not change speed when not paralyzed', () => {
      const monster: any = { stats: { speed: 100 }, statStages: { speed: 0 }, status: 'NONE' };
      expect(getModifiedSpeed(monster)).toBe(100);
    });
  });

  describe('canMove', () => {
    it('should not move when sleeping and statusTurns > 0', () => {
      const monster: any = { name: 'M1', status: 'SLEEP', statusTurns: 1, statStages: {} };
      const result = canMove(monster);
      expect(result.can).toBe(false);
      expect(result.message).toContain('ねむっている');
    });

    it('should wake up when sleeping and statusTurns is 0', () => {
      const monster: any = { name: 'M1', status: 'SLEEP', statusTurns: 0, statStages: {} };
      const result = canMove(monster);
      expect(result.can).toBe(true);
      expect(monster.status).toBe('NONE');
      expect(result.message).toContain('めをさました');
    });
  });

  describe('applyStatus', () => {
    it('should apply poison status', () => {
      const attacker: any = { statStages: {} };
      const defender: any = { name: 'D1', status: 'NONE', types: ['NORMAL'], statStages: {} };
      const move: any = { statusEffect: 'POISON', statusChance: 1 };
      const result = applyStatus(attacker, defender, move);
      expect(result.success).toBe(true);
      expect(defender.status).toBe('POISON');
    });

    it('should not poison POISON types', () => {
      const attacker: any = { statStages: {} };
      const defender: any = { name: 'D1', status: 'NONE', types: ['POISON'], statStages: {} };
      const move: any = { statusEffect: 'POISON', statusChance: 1 };
      const result = applyStatus(attacker, defender, move);
      expect(result.success).toBe(false);
      expect(defender.status).toBe('NONE');
    });
  });

  describe('processEndOfTurn', () => {
    it('should deal poison damage', () => {
      const monster: any = { name: 'M1', status: 'POISON', stats: { hp: 80 }, currentHp: 80, statStages: {} };
      const result = processEndOfTurn(monster);
      expect(result.damage).toBe(10);
      expect(monster.currentHp).toBe(70);
    });

    it('should decrement sleep turns', () => {
      const monster: any = { name: 'M1', status: 'SLEEP', statusTurns: 2, statStages: {} };
      processEndOfTurn(monster);
      expect(monster.statusTurns).toBe(1);
    });
  });

  describe('getStatMultiplier', () => {
    it('should return correct multipliers', () => {
      expect(getStatMultiplier(0)).toBe(1);
      expect(getStatMultiplier(2)).toBe(2);
      expect(getStatMultiplier(-2)).toBe(0.5);
    });
  });

  describe('applyStatChanges', () => {
    it('should increase attack by 2 stages', () => {
      const attacker: any = { name: 'A1', statStages: { attack: 0 } };
      const move: any = { statChanges: { attack: 2 }, target: 'SELF' };
      const results = applyStatChanges(attacker, null as any, move);
      expect(attacker.statStages.attack).toBe(2);
      expect(results[0].message).toContain('こうげき が ぐーんと あがった');
    });

    it('should not increase beyond 6 stages', () => {
      const attacker: any = { name: 'A1', statStages: { attack: 6 } };
      const move: any = { statChanges: { attack: 2 }, target: 'SELF' };
      const results = applyStatChanges(attacker, null as any, move);
      expect(attacker.statStages.attack).toBe(6);
      expect(results[0].message).toContain('これいじょう あがらない');
    });
  });

  describe('applyRest', () => {
    it('should restore HP and set sleep status', () => {
      const monster: any = { name: 'M1', stats: { hp: 100 }, currentHp: 10, status: 'POISON' };
      applyRest(monster);
      expect(monster.currentHp).toBe(100);
      expect(monster.status).toBe('SLEEP');
      expect(monster.statusTurns).toBe(2);
    });
  });
});
