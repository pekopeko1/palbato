import { BattleState, MonsterInstance, Move } from '../domain/models';
import { calculateDamage } from '../domain/battle_logic';

export class BattleService {
  private state: BattleState;

  constructor(player: MonsterInstance, enemy: MonsterInstance) {
    this.state = {
      playerMonster: player,
      enemyMonster: enemy,
      turnCount: 1,
      isFinished: false,
      winner: null,
      message: `A wild ${enemy.name} appeared!`
    };
  }

  getState(): BattleState {
    return this.state;
  }

  async executeTurn(playerMoveInstance: MoveInstance) {
    if (this.state.isFinished) return;

    const enemyMoveInstance = this.state.enemyMonster.moves[0]!; // Simple AI

    // Decide order
    const playerFirst = this.state.playerMonster.stats.speed >= this.state.enemyMonster.stats.speed;

    if (playerFirst) {
      await this.processMove(this.state.playerMonster, this.state.enemyMonster, playerMoveInstance);
      if (!this.state.isFinished) {
        await this.processMove(this.state.enemyMonster, this.state.playerMonster, enemyMoveInstance);
      }
    } else {
      await this.processMove(this.state.enemyMonster, this.state.playerMonster, enemyMoveInstance);
      if (!this.state.isFinished) {
        await this.processMove(this.state.playerMonster, this.state.enemyMonster, playerMoveInstance);
      }
    }

    if (!this.state.isFinished) {
      this.state.turnCount++;
      this.state.message = "What will you do?";
    }
  }

  private async processMove(attacker: MonsterInstance, defender: MonsterInstance, moveInstance: MoveInstance) {
    this.state.message = `${attacker.name} used ${moveInstance.move.name}!`;
    
    // Decrement PP
    moveInstance.currentPp = Math.max(0, moveInstance.currentPp - 1);
    
    const result = calculateDamage(attacker, defender, moveInstance.move);
    defender.currentHp = Math.max(0, defender.currentHp - result.damage);

    if (result.multiplier > 1) this.state.message += " It's super effective!";
    if (result.multiplier < 1 && result.multiplier > 0) this.state.message += " It's not very effective...";
    if (result.isCritical) this.state.message += " A critical hit!";

    if (defender.currentHp <= 0) {
      this.state.isFinished = true;
      this.state.winner = attacker === this.state.playerMonster ? 'PLAYER' : 'ENEMY';
      this.state.message = `${defender.name} fainted! ${attacker.name} wins!`;
    }
  }
}
