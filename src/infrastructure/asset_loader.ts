import { MonsterDefinition, Move } from '../domain/models';

export class AssetLoader {
  private monsters: Map<string, MonsterDefinition> = new Map();
  private moves: Map<string, Move> = new Map();
  private images: Map<string, HTMLImageElement> = new Map();

  async loadAll() {
    await Promise.all([
      this.loadMoves('data/moves.json'),
      this.loadMonsters('data/monsters.json')
    ]);
  }

  private async loadMoves(url: string) {
    const response = await fetch(url);
    const data: Move[] = await response.json();
    data.forEach(move => this.moves.set(move.id, move));
  }

  private async loadMonsters(url: string) {
    const response = await fetch(url);
    const data: MonsterDefinition[] = await response.json();
    data.forEach(monster => this.monsters.set(monster.id, monster));
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
