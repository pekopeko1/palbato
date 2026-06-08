import { BattleState, MonsterInstance, MoveInstance } from '../domain/models';
import { calculateDamage, getModifiedSpeed, canMove, applyStatus, processEndOfTurn } from '../domain/battle_logic';

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

    const playerSpeed = getModifiedSpeed(this.state.playerMonster);
    const enemySpeed = getModifiedSpeed(this.state.enemyMonster);
    const playerFirst = playerSpeed >= enemySpeed;

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

    // End of turn processing
    if (!this.state.isFinished) {
      await this.handleEndOfTurn(this.state.playerMonster);
      if (!this.state.isFinished) {
        await this.handleEndOfTurn(this.state.enemyMonster);
      }
    }

    if (!this.state.isFinished) {
      this.state.turnCount++;
      this.state.message = "どうする？";
      if (this.onUpdate) this.onUpdate();
    }
  }

  private async handleEndOfTurn(monster: MonsterInstance) {
    const result = processEndOfTurn(monster);
    if (result.message) {
      this.state.message = result.message;
      if (this.onUpdate) this.onUpdate();
      await this.delay(1000);
    }

    if (monster.currentHp <= 0) {
      this.state.isFinished = true;
      this.state.winner = monster === this.state.playerMonster ? 'ENEMY' : 'PLAYER';
      this.state.message = `${monster.name} は たおれた！`;
      if (this.onUpdate) this.onUpdate();
    }
  }

  private async processMove(attacker: MonsterInstance, defender: MonsterInstance, moveInstance: MoveInstance) {
    // Check if can move
    const canMoveResult = canMove(attacker);
    if (canMoveResult.message) {
      this.state.message = canMoveResult.message;
      if (this.onUpdate) this.onUpdate();
      await this.delay(800);
    }

    if (!canMoveResult.can) {
      return;
    }

    this.state.message = `${attacker.name} の ${moveInstance.move.name}！`;
    if (this.onUpdate) this.onUpdate();
    await this.delay(800);
    
    moveInstance.currentPp = Math.max(0, moveInstance.currentPp - 1);
    
    const result = calculateDamage(attacker, defender, moveInstance.move);
    defender.currentHp = Math.max(0, defender.currentHp - result.damage);

    let resultMsg = `${result.damage} の ダメージ！`;
    if (moveInstance.move.category !== 'STATUS') {
      if (result.multiplier > 1) resultMsg = "こうかは ばつぐんだ！";
      if (result.multiplier < 1 && result.multiplier > 0) resultMsg = "こうかは いまひとつ みたいだ…";
      if (result.isCritical) resultMsg = "きゅうしょに あたった！";
    } else {
      resultMsg = "";
    }
    
    if (resultMsg) {
      this.state.message = resultMsg;
      if (this.onUpdate) this.onUpdate();
      await this.delay(800);
    }

    if (defender.currentHp <= 0) {
      this.state.isFinished = true;
      this.state.winner = attacker === this.state.playerMonster ? 'PLAYER' : 'ENEMY';
      this.state.message = `${defender.name} は たおれた！`;
      if (this.onUpdate) this.onUpdate();
      return;
    }

    // Apply status effect
    const statusResult = applyStatus(attacker, defender, moveInstance.move);
    if (statusResult.message) {
      this.state.message = statusResult.message;
      if (this.onUpdate) this.onUpdate();
      await this.delay(800);
    }
  }
}
