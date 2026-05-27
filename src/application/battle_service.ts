import { BattleState, MonsterInstance, MoveInstance } from '../domain/models';
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
      message: `やせいの ${enemy.name} が とびだしてきた！`
    };
  }

  getState(): BattleState {
    return this.state;
  }

  async executeTurn(playerMoveInstance: MoveInstance) {
    if (this.state.isFinished) return;

    const enemyMoveInstance = this.state.enemyMonster.moves[0]!;

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
      this.state.message = "どうする？";
    }
  }

  private async processMove(attacker: MonsterInstance, defender: MonsterInstance, moveInstance: MoveInstance) {
    this.state.message = `${attacker.name} の ${moveInstance.move.name}！`;
    
    moveInstance.currentPp = Math.max(0, moveInstance.currentPp - 1);
    
    const result = calculateDamage(attacker, defender, moveInstance.move);
    defender.currentHp = Math.max(0, defender.currentHp - result.damage);

    if (result.multiplier > 1) this.state.message += " こうかは ばつぐんだ！";
    if (result.multiplier < 1 && result.multiplier > 0) this.state.message += " こうかは いまひとつ みたいだ…";
    if (result.isCritical) this.state.message += " きゅうしょに あたった！";

    if (defender.currentHp <= 0) {
      this.state.isFinished = true;
      this.state.winner = attacker === this.state.playerMonster ? 'PLAYER' : 'ENEMY';
      this.state.message = `${defender.name} は たおれた！ ${attacker.name} の かち！`;
    }
  }
}
