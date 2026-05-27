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
    this.ctx.imageSmoothingEnabled = false; // Pixel art style
  }

  render(state: BattleState) {
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
    const draw = (def: MonsterDefinition, x: number, y: number, isPlayer: boolean) => {
      const url = isPlayer ? def.backSprite : def.frontSprite;
      const img = this.loader.getImage(url);
      if (img) {
        this.ctx.drawImage(img, x, y, 60, 60);
      } else {
        const art = (MonsterArt as any)[def.id];
        if (art) art(this.ctx, x, y, 60);
        else {
          this.ctx.fillStyle = '#999';
          this.ctx.fillRect(x, y, 60, 60);
        }
      }
    };

    // Enemy (top right)
    draw(this.loader.getMonster(enemy.definitionId)!, 160, 20, false);
    this.drawInfoBox(enemy, 20, 20);

    // Player (bottom left)
    draw(this.loader.getMonster(player.definitionId)!, 20, 80, true);
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
