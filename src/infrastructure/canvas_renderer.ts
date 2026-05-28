import { BattleState, MonsterInstance, MonsterDefinition } from '../domain/models';
import { MonsterArt } from './monster_art';
import { AssetLoader } from './asset_loader';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private loader: AssetLoader;
  private width: number = 240;
  private height: number = 160;

  constructor(canvas: HTMLCanvasElement, loader: AssetLoader) {
    this.ctx = canvas.getContext('2d')!;
    this.loader = loader;
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx.imageSmoothingEnabled = false;
  }

  render(state: BattleState) {
    // Clear canvas for transparency handling
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawBackground();
    this.drawMonsters(state.playerMonster, state.enemyMonster);
    this.drawUI(state);
  }

  private drawBackground() {
    // Ground/Field
    this.ctx.fillStyle = '#78C850';
    this.ctx.fillRect(0, 0, this.width, 112);
    
    // Platforms under monsters
    this.ctx.fillStyle = '#68A040'; // Slightly darker green
    
    // Enemy platform
    this.ctx.beginPath();
    this.ctx.ellipse(180, 70, 40, 15, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Player platform
    this.ctx.beginPath();
    this.ctx.ellipse(60, 130, 60, 20, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // UI area (fixed bottom)
    this.ctx.fillStyle = '#E0E0E0';
    this.ctx.fillRect(0, 112, this.width, 48);
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(2, 114, this.width - 4, 44);
  }

  private drawMonsters(player: MonsterInstance, enemy: MonsterInstance) {
    const draw = (def: MonsterDefinition, x: number, y: number, isPlayer: boolean) => {
      const url = isPlayer ? def.backSprite : def.frontSprite;
      const img = this.loader.getImage(url);
      
      if (img) {
        // Draw actual image (respects transparency)
        this.ctx.drawImage(img, x, y, 60, 60);
      } else {
        // Fallback procedural art
        const art = (MonsterArt as any)[def.id];
        if (art) art(this.ctx, x, y, 60);
        else {
          this.ctx.fillStyle = '#999';
          this.ctx.fillRect(x, y, 60, 60);
        }
      }
    };

    // Enemy (top right, on platform)
    draw(this.loader.getMonster(enemy.definitionId)!, 150, 15, false);
    this.drawInfoBox(enemy, 15, 15);

    // Player (bottom left, on platform)
    draw(this.loader.getMonster(player.definitionId)!, 30, 65, true);
    this.drawInfoBox(player, 135, 75);
  }

  private drawInfoBox(monster: MonsterInstance, x: number, y: number) {
    // Info bubble background
    this.ctx.fillStyle = '#FFF';
    this.ctx.strokeStyle = '#000';
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, 90, 30, 5);
    this.ctx.fill();
    this.ctx.stroke();

    // HP Bar
    const barWidth = 80;
    const hpRatio = monster.currentHp / monster.stats.hp;
    const color = hpRatio > 0.5 ? '#00FF00' : hpRatio > 0.2 ? '#FFFF00' : '#FF0000';

    this.ctx.fillStyle = '#EEE';
    this.ctx.fillRect(x + 5, y + 15, barWidth, 6);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 5, y + 15, barWidth * hpRatio, 6);

    // Text
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
