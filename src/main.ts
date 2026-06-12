import { AssetLoader } from './infrastructure/asset_loader';
import { CanvasRenderer } from './infrastructure/canvas_renderer';
import { BattleService } from './application/battle_service';
import { MonsterInstance, Move } from './domain/models';

async function init() {
  const loader = new AssetLoader();
  await loader.loadAll();

  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const renderer = new CanvasRenderer(canvas, loader);

  const createInstance = (def: any, level: number): MonsterInstance => {
    const finalLevel = def.id === 'shidoss' ? 30 : (def.id === 'aruchu' ? 80 : level);
    
    // Monster-like stat calculation
    const calcHP = (base: number, lvl: number) => Math.floor((base * 2 * lvl) / 100) + lvl + 10;
    const calcOther = (base: number, lvl: number) => Math.floor((base * 2 * lvl) / 100) + 5;

    const stats = {
      hp: calcHP(def.baseStats.hp, finalLevel),
      attack: calcOther(def.baseStats.attack, finalLevel),
      defense: calcOther(def.baseStats.defense, finalLevel),
      spAttack: calcOther(def.baseStats.spAttack, finalLevel),
      spDefense: calcOther(def.baseStats.spDefense, finalLevel),
      speed: calcOther(def.baseStats.speed, finalLevel),
    };

    return {
      definitionId: def.id,
      name: def.name,
      types: def.types,
      level: finalLevel,
      currentHp: stats.hp,
      stats: stats,
      statStages: {
        attack: 0,
        defense: 0,
        spAttack: 0,
        spDefense: 0,
        speed: 0
      },
      moves: def.learnset
        .filter((l: any) => l.level <= finalLevel)
        .slice(0, 4)
        .map((l: any) => {
          const move = loader.getMove(l.moveId);
          return move ? { move, currentPp: move.pp } : null;
        }).filter((m: any) => m !== null),
      status: 'NONE'
    };
  };

  const showSelection = () => {
    const ui = document.getElementById('ui-overlay')!;
    ui.innerHTML = 'じぶんの モンスターを えらんで！';
    
    ['bulbasaur', 'charmander', 'squirtle', 'shidoss', 'aruchu'].forEach(id => {
      const def = loader.getMonster(id)!;
      const btn = document.createElement('div');
      btn.className = 'move-btn';
      btn.innerText = def.name;
      btn.onclick = () => showEnemySelection(def);
      ui.appendChild(btn);
    });
  };

  const showEnemySelection = (playerDef: any) => {
    const ui = document.getElementById('ui-overlay')!;
    ui.innerHTML = 'あいての モンスターを えらんで！';
    
    ['bulbasaur', 'charmander', 'squirtle', 'shidoss', 'aruchu'].forEach(id => {
      const def = loader.getMonster(id)!;
      const btn = document.createElement('div');
      btn.className = 'move-btn';
      btn.innerText = def.name;
      btn.onclick = () => startBattle(playerDef, def);
      ui.appendChild(btn);
    });
  };

  const startBattle = (playerDef: any, enemyDef: any) => {
    const playerMonster = createInstance(playerDef, 5);
    const enemyMonster = createInstance(enemyDef, 5);
    
    const battleService = new BattleService(playerMonster, enemyMonster);

    // バトル進行中のUI更新をフックするためにコールバックを登録
    battleService.onUpdate = () => {
      renderer.render(battleService.getState());
    };

    const updateUI = () => {
      const state = battleService.getState();
      renderer.render(state);
      const ui = document.getElementById('ui-overlay')!;
      ui.innerHTML = '';
      if (state.isFinished) {
        const msg = document.createElement('div');
        msg.style.marginBottom = '10px';
        msg.innerText = state.message;
        ui.appendChild(msg);

        const restartBtn = document.createElement('div');
        restartBtn.className = 'move-btn';
        restartBtn.innerText = 'もういちど たたかう';
        restartBtn.onclick = () => showSelection();
        ui.appendChild(restartBtn);
        return;
      }
      
      const options = [
        { label: 'たたかう', action: 'FIGHT' },
        { label: 'バッグ', action: 'BAG' },
        { label: 'モンスター', action: 'MON' },
        { label: 'にげる', action: 'RUN' }
      ];
      options.forEach((opt) => {
        const btn = document.createElement('div');
        btn.className = 'move-btn';
        btn.innerText = opt.label;
        btn.onclick = async () => {
          if (opt.action === 'FIGHT') showMoves(battleService, updateUI, playerMonster);
          else if (opt.action === 'RUN') {
            ui.innerHTML = 'バトル中...';
            await battleService.attemptEscape();
            renderer.render(battleService.getState());
            await new Promise(r => setTimeout(r, 1000));
            updateUI();
          }
          else if (opt.action === 'MON') showMonsterInfo(playerMonster, updateUI);
          else alert('まだ実装されていません！');
        };
        ui.appendChild(btn);
      });
    };

    const showMonsterInfo = (monster: MonsterInstance, backAction: () => void) => {
      const def = loader.getMonster(monster.definitionId)!;
      const ui = document.getElementById('ui-overlay')!;
      ui.innerHTML = '';
      ui.style.flexDirection = 'column';
      ui.style.height = 'auto';
      ui.style.maxHeight = '80%';
      ui.style.top = '10%';
      ui.style.background = '#c0392b';
      ui.style.border = '4px solid #8e1c12';
      ui.style.padding = '10px';
      ui.style.pointerEvents = 'auto';
      ui.style.color = 'white';

      ui.innerHTML = `
        <div style="display:flex; margin-bottom:10px; background:#fff; color:#333; padding:5px; border-radius:5px;">
          <img src="${def.frontSprite}" style="width:80px; height:80px; image-rendering:pixelated; background:#eee; border-radius:5px;">
          <div style="margin-left:10px; flex:1;">
            <div style="font-size:18px; font-weight:bold;">${monster.name}</div>
            <div style="font-size:14px;">Lv.${monster.level}</div>
            <div style="font-size:12px; margin-top:5px; background:#34495e; color:#fff; display:inline-block; padding:2px 5px; border-radius:3px;">
              ${monster.types.join(' / ')}
            </div>
          </div>
        </div>
        <div style="background:#2ecc71; color:#000; padding:10px; border-radius:5px; font-size:13px; min-height:50px; margin-bottom:10px; border:2px solid #27ae60;">
          ${def.description}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; font-size:12px; background:rgba(0,0,0,0.3); padding:5px; border-radius:5px;">
          <div>HP: ${monster.currentHp} / ${monster.stats.hp}</div>
          <div>こうげき: ${monster.stats.attack}</div>
          <div>ぼうぎょ: ${monster.stats.defense}</div>
          <div>とくこう: ${monster.stats.spAttack}</div>
          <div>とくぼう: ${monster.stats.spDefense}</div>
          <div>すばやさ: ${monster.stats.speed}</div>
        </div>
      `;

      const backBtn = document.createElement('div');
      backBtn.className = 'move-btn';
      backBtn.style.width = '100%';
      backBtn.style.height = '35px';
      backBtn.style.marginTop = '10px';
      backBtn.style.background = '#3498db';
      backBtn.style.border = 'none';
      backBtn.innerText = 'とじる';
      backBtn.onclick = () => {
        ui.style.flexDirection = 'row';
        ui.style.height = '30%';
        ui.style.maxHeight = 'none';
        ui.style.top = 'auto';
        ui.style.bottom = '0';
        ui.style.background = 'rgba(0,0,0,0.5)';
        ui.style.border = 'none';
        ui.style.padding = '0';
        backAction();
      };
      ui.appendChild(backBtn);
    };

    const showMoves = (service: BattleService, updateUI: () => void, playerMonster: MonsterInstance) => {
      const ui = document.getElementById('ui-overlay')!;
      ui.innerHTML = '';
      playerMonster.moves.forEach((moveInstance) => {
        const btn = document.createElement('div');
        btn.className = 'move-btn';
        btn.style.flexDirection = 'column';
        btn.innerHTML = `<span>${moveInstance.move.name}</span><span style="font-size:12px">PP: ${moveInstance.currentPp}/${moveInstance.move.pp}</span>`;
        btn.onclick = async () => {
          ui.innerHTML = 'バトル中...';
          await service.executeTurn(moveInstance);
          renderer.render(service.getState());
          await new Promise(r => setTimeout(r, 1000));
          updateUI();
        };
        ui.appendChild(btn);
      });
      const backBtn = document.createElement('div');
      backBtn.className = 'move-btn';
      backBtn.innerText = 'もどる';
      backBtn.onclick = updateUI;
      ui.appendChild(backBtn);
    };

    updateUI();
  };

  showSelection();
}

init().catch(console.error);

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
});
