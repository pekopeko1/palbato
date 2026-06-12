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
    const finalLevel = def.id === 'shidoss' ? 50 : (def.id === 'aruchu' ? 80 : level);
    
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
      const ui = document.getElementById('ui-overlay')!;
      ui.innerHTML = '';
      ui.style.flexDirection = 'column';
      ui.style.height = 'auto';
      ui.style.background = 'rgba(0,0,0,0.8)';
      ui.style.padding = '10px';
      ui.style.fontSize = '16px';
      ui.style.pointerEvents = 'auto';

      const info = document.createElement('div');
      info.innerHTML = `
        <div style="margin-bottom:5px;"><strong>${monster.name}</strong> Lv.${monster.level}</div>
        <div style="margin-bottom:5px;">HP: ${monster.currentHp} / ${monster.stats.hp}</div>
        <div style="margin-bottom:5px;">タイプ: ${monster.types.join(' / ')}</div>
        <div style="margin-top:10px; font-size:14px; line-height:1.4;">
          こうげき: ${monster.stats.attack} / ぼうぎょ: ${monster.stats.defense}<br>
          とくこう: ${monster.stats.spAttack} / とくぼう: ${monster.stats.spDefense}<br>
          すばやさ: ${monster.stats.speed}
        </div>
      `;
      ui.appendChild(info);

      const backBtn = document.createElement('div');
      backBtn.className = 'move-btn';
      backBtn.style.width = '100%';
      backBtn.style.height = '40px';
      backBtn.style.marginTop = '15px';
      backBtn.innerText = 'もどる';
      backBtn.onclick = () => {
        ui.style.flexDirection = 'row';
        ui.style.height = '30%';
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
