import { BattleState, MonsterInstance, MoveInstance } from '../domain/models';
import { calculateDamage } from '../domain/battle_logic';

export class BattleService {
  private state: BattleState;
  public onUpdate?: () => void;

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

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async executeTurn(playerMoveInstance: MoveInstance) {
    if (this.state.isFinished) return;

    const enemyMoveInstance = this.state.enemyMonster.moves[0]!;

    const playerFirst = this.state.playerMonster.stats.speed >= this.state.enemyMonster.stats.speed;

    if (playerFirst) {
      await this.processMove(this.state.playerMonster, this.state.enemyMonster, playerMoveInstance);
      await this.delay(1000);
      if (!this.state.isFinished) {
        await this.processMove(this.state.enemyMonster, this.state.playerMonster, enemyMoveInstance);
      }
    } else {
      await this.processMove(this.state.enemyMonster, this.state.playerMonster, enemyMoveInstance);
      await this.delay(1000);
      if (!this.state.isFinished) {
        await this.processMove(this.state.playerMonster, this.state.enemyMonster, playerMoveInstance);
      }
    }

    if (!this.state.isFinished) {
      this.state.turnCount++;
      this.state.message = "どうする？";
      if (this.onUpdate) this.onUpdate();
    }
  }

  private async processMove(attacker: MonsterInstance, defender: MonsterInstance, moveInstance: MoveInstance) {
    this.state.message = `${attacker.name} の ${moveInstance.move.name}！`;
    if (this.onUpdate) this.onUpdate();
    await this.delay(800);
    
    moveInstance.currentPp = Math.max(0, moveInstance.currentPp - 1);
    
    const result = calculateDamage(attacker, defender, moveInstance.move);
    defender.currentHp = Math.max(0, defender.currentHp - result.damage);

    let resultMsg = `${result.damage} の ダメージ！`;
    if (result.multiplier > 1) resultMsg = "こうかは ばつぐんだ！";
    if (result.multiplier < 1 && result.multiplier > 0) resultMsg = "こうかは いまひとつ みたいだ…";
    if (result.isCritical) resultMsg = "きゅうしょに あたった！";
    
    this.state.message = resultMsg;
    if (this.onUpdate) this.onUpdate();
    await this.delay(800);

    if (defender.currentHp <= 0) {
      this.state.isFinished = true;
      this.state.winner = attacker === this.state.playerMonster ? 'PLAYER' : 'ENEMY';
      this.state.message = `${defender.name} は たおれた！`;
      if (this.onUpdate) this.onUpdate();
    }
  }
}
