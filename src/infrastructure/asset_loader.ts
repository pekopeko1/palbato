import { MonsterDefinition, Move } from '../domain/models';
import movesData from '../../public/data/moves.json';
import monstersData from '../../public/data/monsters.json';

export class AssetLoader {
  private monsters: Map<string, MonsterDefinition> = new Map();
  private moves: Map<string, Move> = new Map();
  private images: Map<string, HTMLImageElement> = new Map();

  async loadAll() {
    (movesData as Move[]).forEach(move => this.moves.set(move.id, move));
    (monstersData as MonsterDefinition[]).forEach(monster => this.monsters.set(monster.id, monster));
  }

  async loadImage(url: string): Promise<HTMLImageElement> {
    if (this.images.has(url)) return this.images.get(url)!;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(url, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  getMonster(id: string): MonsterDefinition | undefined {
    return this.monsters.get(id);
  }

  getMove(id: string): Move | undefined {
    return this.moves.get(id);
  }
}
