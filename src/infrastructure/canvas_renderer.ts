import { BattleState, MonsterInstance } from '../domain/models';
import { MonsterArt } from './monster_art';

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
    console.log('Rendering state:', state);
    this.drawBackground();
    this.drawMonsters(state.playerMonster, state.enemyMonster);
    this.drawUI(state);
  }

  private drawBackground() {
    this.ctx.fillStyle = '#78C850'; // Grass field green
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#E0E0E0'; // UI area
    this.ctx.fillRect(0, 112, this.width, 48);
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(2, 114, this.width - 4, 44);
  }

  private drawMonsters(player: MonsterInstance, enemy: MonsterInstance) {
    const draw = (id: string, x: number, y: number) => {
      const art = (MonsterArt as any)[id];
      if (art) art(this.ctx, x, y, 60);
      else {
        this.ctx.fillStyle = '#999';
        this.ctx.fillRect(x, y, 60, 60);
      }
    };

    // Enemy (top right)
    draw(enemy.definitionId, 160, 20);
    this.drawInfoBox(enemy, 20, 20);

    // Player (bottom left)
    draw(player.definitionId, 20, 80);
    this.drawInfoBox(player, 140, 90);
  }

  private drawInfoBox(monster: MonsterInstance, x: number, y: number) {
    this.ctx.fillStyle = '#FFF';
    this.ctx.strokeStyle = '#000';
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, 90, 30, 5);
    this.ctx.fill();
    this.ctx.stroke();

    const barWidth = 80;
    const hpRatio = monster.currentHp / monster.stats.hp;
    const color = hpRatio > 0.5 ? '#00FF00' : hpRatio > 0.2 ? '#FFFF00' : '#FF0000';

    this.ctx.fillStyle = '#EEE';
    this.ctx.fillRect(x + 5, y + 15, barWidth, 6);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 5, y + 15, barWidth * hpRatio, 6);

    this.ctx.fillStyle = '#000';
    this.ctx.font = '8px monospace';
    this.ctx.fillText(monster.name, x + 5, y + 10);
    this.ctx.fillText(`Lv${monster.level}`, x + 60, y + 10);
  }

  private drawUI(state: BattleState) {
    this.ctx.fillStyle = '#000';
    this.ctx.font = '10px monospace';
    this.ctx.fillText(state.message, 10, 130);
  }
}
