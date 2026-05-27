import { BattleState, MonsterInstance } from '../domain/models';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number = 240;
  private height: number = 160;

  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx.imageSmoothingEnabled = false; // Pixel art style
  }

  render(state: BattleState) {
    this.drawBackground();
    this.drawMonsters(state.playerMonster, state.enemyMonster);
    this.drawUI(state);
  }

  private drawBackground() {
    // Simple gradient background for now
    this.ctx.fillStyle = '#78C850'; // Grass field green
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#E0E0E0'; // UI area
    this.ctx.fillRect(0, 112, this.width, 48);
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(2, 114, this.width - 4, 44);
  }

  private drawMonsters(player: MonsterInstance, enemy: MonsterInstance) {
    // Enemy (top right)
    this.ctx.fillStyle = '#555';
    this.ctx.fillRect(160, 20, 60, 60);
    this.drawHealthBar(enemy, 20, 20);

    // Player (bottom left)
    this.ctx.fillStyle = '#888';
    this.ctx.fillRect(20, 50, 60, 60);
    this.drawHealthBar(player, 140, 70);
  }

  private drawHealthBar(monster: MonsterInstance, x: number, y: number) {
    const barWidth = 80;
    const barHeight = 8;
    const hpRatio = monster.currentHp / monster.stats.hp;

    this.ctx.fillStyle = '#FFF';
    this.ctx.fillRect(x, y, barWidth, barHeight);
    this.ctx.strokeStyle = '#000';
    this.ctx.strokeRect(x, y, barWidth, barHeight);

    const color = hpRatio > 0.5 ? '#00FF00' : hpRatio > 0.2 ? '#FFFF00' : '#FF0000';
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 1, y + 1, (barWidth - 2) * hpRatio, barHeight - 2);

    this.ctx.fillStyle = '#000';
    this.ctx.font = '8px monospace';
    this.ctx.fillText(monster.name, x, y - 5);
    this.ctx.fillText(`Lv${monster.level}`, x + barWidth - 25, y - 5);
  }

  private drawUI(state: BattleState) {
    this.ctx.fillStyle = '#000';
    this.ctx.font = '10px monospace';
    this.ctx.fillText(state.message, 10, 130);
  }
}
