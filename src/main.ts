import { AssetLoader } from './infrastructure/asset_loader';
import { CanvasRenderer } from './infrastructure/canvas_renderer';
import { BattleService } from './application/battle_service';
import { MonsterInstance, Move } from './domain/models';

async function init() {
  const loader = new AssetLoader();
  await loader.loadAll();

  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const renderer = new CanvasRenderer(canvas);

  // Initialize monsters
  const charDef = loader.getMonster('charmander')!;
  const bulbDef = loader.getMonster('bulbasaur')!;

  const createInstance = (def: any, level: number): MonsterInstance => ({
    definitionId: def.id,
    name: def.name,
    types: def.types,
    level: level,
    currentHp: def.baseStats.hp + level * 2, // Simplified stats
    stats: {
      hp: def.baseStats.hp + level * 2,
      attack: def.baseStats.attack + level,
      defense: def.baseStats.defense + level,
      spAttack: def.baseStats.spAttack + level,
      spDefense: def.baseStats.spDefense + level,
      speed: def.baseStats.speed + level,
    },
    moves: def.learnset.map((l: any) => loader.getMove(l.moveId) || null).slice(0, 4)
  });

  const playerMonster = createInstance(charDef, 5);
  const enemyMonster = createInstance(bulbDef, 5);

  const battleService = new BattleService(playerMonster, enemyMonster);

  const updateUI = () => {
    const state = battleService.getState();
    renderer.render(state);

    playerMonster.moves.forEach((move, i) => {
      const btn = document.getElementById(`move-${i}`) as HTMLDivElement;
      if (move) {
        btn.innerText = move.name;
        btn.style.display = 'flex';
        btn.onclick = async () => {
          if (state.isFinished) return;
          await battleService.executeTurn(move);
          updateUI();
        };
      } else {
        btn.style.display = 'none';
      }
    });
  };

  updateUI();
}

init().catch(console.error);
