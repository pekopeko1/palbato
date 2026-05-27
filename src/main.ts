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
    currentHp: def.baseStats.hp + level * 2,
    stats: {
      hp: def.baseStats.hp + level * 2,
      attack: def.baseStats.attack + level,
      defense: def.baseStats.defense + level,
      spAttack: def.baseStats.spAttack + level,
      spDefense: def.baseStats.spDefense + level,
      speed: def.baseStats.speed + level,
    },
    moves: def.learnset.map((l: any) => {
      const move = loader.getMove(l.moveId);
      return move ? { move, currentPp: move.pp } : null;
    }).filter((m: any) => m !== null),
    status: 'NONE'
  });

  const playerMonster = createInstance(charDef, 5);
  const enemyMonster = createInstance(bulbDef, 5);

  const battleService = new BattleService(playerMonster, enemyMonster);

  const updateUI = () => {
    console.log('updateUI called');
    const state = battleService.getState();
    console.log('Battle state:', state);
    renderer.render(state);

    const ui = document.getElementById('ui-overlay')!;
    ui.innerHTML = '';

    if (state.isFinished) return;

    // Main Menu
    const options = ['FIGHT', 'BAG', 'MON', 'RUN'];
    options.forEach((opt, i) => {
      const btn = document.createElement('div');
      btn.className = 'move-btn';
      btn.innerText = opt;
      btn.onclick = () => {
        if (opt === 'FIGHT') showMoves();
        else alert('Not implemented yet!');
      };
      ui.appendChild(btn);
    });
  };

  const showMoves = () => {
    const ui = document.getElementById('ui-overlay')!;
    ui.innerHTML = '';
    
    playerMonster.moves.forEach((moveInstance) => {
      const btn = document.createElement('div');
      btn.className = 'move-btn';
      btn.style.flexDirection = 'column';
      btn.innerHTML = `<span>${moveInstance.move.name}</span><span style="font-size:12px">PP: ${moveInstance.currentPp}/${moveInstance.move.pp}</span>`;
      btn.onclick = async () => {
        await battleService.executeTurn(moveInstance);
        updateUI();
      };
      ui.appendChild(btn);
    });
    
    const backBtn = document.createElement('div');
    backBtn.className = 'move-btn';
    backBtn.innerText = 'BACK';
    backBtn.onclick = updateUI;
    ui.appendChild(backBtn);
  };

  updateUI();
}

init().catch(console.error);
