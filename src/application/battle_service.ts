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

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async executeTurn(playerMoveInstance: MoveInstance) {
    if (this.state.isFinished) return;

    const enemyMoveInstance = this.state.enemyMonster.moves[0]!;

    const playerFirst = this.state.playerMonster.stats.speed >= this.state.enemyMonster.stats.speed;

    if (playerFirst) {
      await this.processMove(this.state.playerMonster, this.state.enemyMonster, playerMoveInstance);
      await this.delay(1000); // Pause for visibility
      if (!this.state.isFinished) {
        await this.processMove(this.state.enemyMonster, this.state.playerMonster, enemyMoveInstance);
      }
    } else {
      await this.processMove(this.state.enemyMonster, this.state.playerMonster, enemyMoveInstance);
      await this.delay(1000); // Pause for visibility
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
  // 更新を即時反映させるための工夫
  // (UI描画メソッドを呼び出す必要があるが、現在の設計ではstate更新のみ)
  // 画面にメッセージを表示する時間を確保するためにawaitを使用する

  moveInstance.currentPp = Math.max(0, moveInstance.currentPp - 1);

  await this.delay(800); // 技使用メッセージを表示する時間

  const result = calculateDamage(attacker, defender, moveInstance.move);
  defender.currentHp = Math.max(0, defender.currentHp - result.damage);

  let resultMsg = "";
  if (result.multiplier > 1) resultMsg += " こうかは ばつぐんだ！";
  if (result.multiplier < 1 && result.multiplier > 0) resultMsg += " こうかは いまひとつ みたいだ…";
  if (result.isCritical) resultMsg += " きゅうしょに あたった！";

  this.state.message = resultMsg || `${result.damage} の ダメージ！`;

  if (defender.currentHp <= 0) {
    this.state.isFinished = true;
    this.state.winner = attacker === this.state.playerMonster ? 'PLAYER' : 'ENEMY';
    this.state.message = `${defender.name} は たおれた！ ${attacker.name} の かち！`;
  }
}

}
