"use strict";
(() => {
  // src/infrastructure/asset_loader.ts
  var AssetLoader = class {
    monsters = /* @__PURE__ */ new Map();
    moves = /* @__PURE__ */ new Map();
    images = /* @__PURE__ */ new Map();
    async loadAll() {
      await Promise.all([
        this.loadMoves("data/moves.json"),
        this.loadMonsters("data/monsters.json")
      ]);
    }
    async loadMoves(url) {
      const response = await fetch(url);
      const data = await response.json();
      data.forEach((move) => this.moves.set(move.id, move));
    }
    async loadMonsters(url) {
      const response = await fetch(url);
      const data = await response.json();
      data.forEach((monster) => this.monsters.set(monster.id, monster));
    }
    async loadImage(url) {
      if (this.images.has(url)) return this.images.get(url);
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
    getMonster(id) {
      return this.monsters.get(id);
    }
    getMove(id) {
      return this.moves.get(id);
    }
  };

  // src/infrastructure/canvas_renderer.ts
  var CanvasRenderer = class {
    ctx;
    width = 240;
    height = 160;
    constructor(canvas) {
      this.ctx = canvas.getContext("2d");
      canvas.width = this.width;
      canvas.height = this.height;
      this.ctx.imageSmoothingEnabled = false;
    }
    render(state) {
      this.drawBackground();
      this.drawMonsters(state.playerMonster, state.enemyMonster);
      this.drawUI(state);
    }
    drawBackground() {
      this.ctx.fillStyle = "#78C850";
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = "#E0E0E0";
      this.ctx.fillRect(0, 112, this.width, 48);
      this.ctx.strokeStyle = "#000";
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(2, 114, this.width - 4, 44);
    }
    drawMonsters(player, enemy) {
      this.ctx.fillStyle = "#555";
      this.ctx.fillRect(140, 20, 60, 60);
      this.drawHealthBar(enemy, 20, 20);
      this.ctx.fillStyle = "#888";
      this.ctx.fillRect(40, 50, 60, 60);
      this.drawHealthBar(player, 130, 80);
    }
    drawHealthBar(monster, x, y) {
      const barWidth = 80;
      const barHeight = 10;
      const hpRatio = monster.currentHp / monster.stats.hp;
      this.ctx.fillStyle = "#FFF";
      this.ctx.fillRect(x, y, barWidth, barHeight);
      this.ctx.strokeStyle = "#000";
      this.ctx.strokeRect(x, y, barWidth, barHeight);
      const color = hpRatio > 0.5 ? "#00FF00" : hpRatio > 0.2 ? "#FFFF00" : "#FF0000";
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x + 1, y + 1, (barWidth - 2) * hpRatio, barHeight - 2);
      this.ctx.fillStyle = "#000";
      this.ctx.font = "8px monospace";
      this.ctx.fillText(monster.name, x, y - 5);
      this.ctx.fillText(`Lv${monster.level}`, x + barWidth - 20, y - 5);
    }
    drawUI(state) {
      this.ctx.fillStyle = "#000";
      this.ctx.font = "10px monospace";
      this.ctx.fillText(state.message, 10, 130);
    }
  };

  // src/domain/battle_logic.ts
  var TypeEffectiveness = {
    NORMAL: { ROCK: 0.5, GHOST: 0, STEEL: 0.5 },
    FIRE: { FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 2, BUG: 2, ROCK: 0.5, DRAGON: 0.5, STEEL: 2 },
    WATER: { FIRE: 2, WATER: 0.5, GRASS: 0.5, GROUND: 2, ROCK: 2, DRAGON: 0.5 },
    GRASS: { FIRE: 0.5, WATER: 2, GRASS: 0.5, POISON: 0.5, GROUND: 2, FLYING: 0.5, BUG: 0.5, ROCK: 2, DRAGON: 0.5, STEEL: 0.5 },
    ELECTRIC: { WATER: 2, ELECTRIC: 0.5, GRASS: 0.5, GROUND: 0, FLYING: 2, DRAGON: 0.5 },
    ICE: { FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 0.5, GROUND: 2, FLYING: 2, DRAGON: 2, STEEL: 0.5 },
    FIGHTING: { NORMAL: 2, ICE: 2, POISON: 0.5, FLYING: 0.5, PSYCHIC: 0.5, BUG: 0.5, ROCK: 2, GHOST: 0, DARK: 2, STEEL: 2 },
    POISON: { GRASS: 2, POISON: 0.5, GROUND: 0.5, ROCK: 0.5, GHOST: 0.5, STEEL: 0 },
    GROUND: { FIRE: 2, ELECTRIC: 2, GRASS: 0.5, POISON: 2, BUG: 0.5, ROCK: 2, STEEL: 2 },
    FLYING: { ELECTRIC: 0.5, GRASS: 2, FIGHTING: 2, BUG: 2, ROCK: 0.5, STEEL: 0.5 },
    PSYCHIC: { FIGHTING: 2, POISON: 2, PSYCHIC: 0.5, DARK: 0, STEEL: 0.5 },
    BUG: { FIRE: 0.5, GRASS: 2, FIGHTING: 0.5, POISON: 0.5, FLYING: 0.5, PSYCHIC: 2, GHOST: 0.5, DARK: 2, STEEL: 0.5 },
    ROCK: { FIRE: 2, ICE: 2, FIGHTING: 0.5, GROUND: 0.5, FLYING: 2, BUG: 2, STEEL: 0.5 },
    GHOST: { NORMAL: 0, PSYCHIC: 2, GHOST: 2, DARK: 0.5 },
    DRAGON: { DRAGON: 2, STEEL: 0.5 },
    STEEL: { FIRE: 0.5, WATER: 0.5, ELECTRIC: 0.5, ICE: 2, ROCK: 2, STEEL: 0.5 },
    DARK: { FIGHTING: 0.5, PSYCHIC: 2, GHOST: 2, DARK: 0.5 }
  };
  function getEffectiveness(moveType, targetTypes) {
    let multiplier = 1;
    for (const targetType of targetTypes) {
      const effect = TypeEffectiveness[moveType]?.[targetType];
      if (effect !== void 0) {
        multiplier *= effect;
      }
    }
    return multiplier;
  }
  function calculateDamage(attacker, defender, move) {
    if (move.category === "STATUS") {
      return { damage: 0, multiplier: 1, isCritical: false };
    }
    const isSpecial = move.category === "SPECIAL";
    const attackStat = isSpecial ? attacker.stats.spAttack : attacker.stats.attack;
    const defenseStat = isSpecial ? defender.stats.spDefense : defender.stats.defense;
    const baseDamage = (2 * attacker.level / 5 + 2) * move.power * (attackStat / defenseStat) / 50 + 2;
    const isCritical = Math.random() < 0.0625;
    const critMultiplier = isCritical ? 1.5 : 1;
    const randomFactor = 0.85 + Math.random() * 0.15;
    const stab = attacker.types.includes(move.type) ? 1.5 : 1;
    const multiplier = getEffectiveness(move.type, defender.types);
    const totalDamage = Math.floor(baseDamage * critMultiplier * randomFactor * stab * multiplier);
    return { damage: Math.max(1, totalDamage), multiplier, isCritical };
  }

  // src/application/battle_service.ts
  var BattleService = class {
    state;
    constructor(player, enemy) {
      this.state = {
        playerMonster: player,
        enemyMonster: enemy,
        turnCount: 1,
        isFinished: false,
        winner: null,
        message: `A wild ${enemy.name} appeared!`
      };
    }
    getState() {
      return this.state;
    }
    async executeTurn(playerMoveInstance) {
      if (this.state.isFinished) return;
      const enemyMoveInstance = this.state.enemyMonster.moves[0];
      const playerFirst = this.state.playerMonster.stats.speed >= this.state.enemyMonster.stats.speed;
      if (playerFirst) {
        await this.processMove(this.state.playerMonster, this.state.enemyMonster, playerMoveInstance);
        if (!this.state.isFinished) {
          await this.processMove(this.state.enemyMonster, this.state.playerMonster, enemyMoveInstance);
        }
      } else {
        await this.processMove(this.state.enemyMonster, this.state.playerMonster, enemyMoveInstance);
        if (!this.state.isFinished) {
          await this.processMove(this.state.playerMonster, this.state.enemyMonster, playerMoveInstance);
        }
      }
      if (!this.state.isFinished) {
        this.state.turnCount++;
        this.state.message = "What will you do?";
      }
    }
    async processMove(attacker, defender, moveInstance) {
      this.state.message = `${attacker.name} used ${moveInstance.move.name}!`;
      moveInstance.currentPp = Math.max(0, moveInstance.currentPp - 1);
      const result = calculateDamage(attacker, defender, moveInstance.move);
      defender.currentHp = Math.max(0, defender.currentHp - result.damage);
      if (result.multiplier > 1) this.state.message += " It's super effective!";
      if (result.multiplier < 1 && result.multiplier > 0) this.state.message += " It's not very effective...";
      if (result.isCritical) this.state.message += " A critical hit!";
      if (defender.currentHp <= 0) {
        this.state.isFinished = true;
        this.state.winner = attacker === this.state.playerMonster ? "PLAYER" : "ENEMY";
        this.state.message = `${defender.name} fainted! ${attacker.name} wins!`;
      }
    }
  };

  // src/main.ts
  async function init() {
    const loader = new AssetLoader();
    await loader.loadAll();
    const canvas = document.getElementById("game-canvas");
    const renderer = new CanvasRenderer(canvas);
    const charDef = loader.getMonster("charmander");
    const bulbDef = loader.getMonster("bulbasaur");
    const createInstance = (def, level) => ({
      definitionId: def.id,
      name: def.name,
      types: def.types,
      level,
      currentHp: def.baseStats.hp + level * 2,
      stats: {
        hp: def.baseStats.hp + level * 2,
        attack: def.baseStats.attack + level,
        defense: def.baseStats.defense + level,
        spAttack: def.baseStats.spAttack + level,
        spDefense: def.baseStats.spDefense + level,
        speed: def.baseStats.speed + level
      },
      moves: def.learnset.map((l) => {
        const move = loader.getMove(l.moveId);
        return move ? { move, currentPp: move.pp } : null;
      }).filter((m) => m !== null),
      status: "NONE"
    });
    const playerMonster = createInstance(charDef, 5);
    const enemyMonster = createInstance(bulbDef, 5);
    const battleService = new BattleService(playerMonster, enemyMonster);
    const updateUI = () => {
      const state = battleService.getState();
      renderer.render(state);
      const ui = document.getElementById("ui-overlay");
      ui.innerHTML = "";
      if (state.isFinished) return;
      const options = ["FIGHT", "BAG", "MON", "RUN"];
      options.forEach((opt, i) => {
        const btn = document.createElement("div");
        btn.className = "move-btn";
        btn.innerText = opt;
        btn.onclick = () => {
          if (opt === "FIGHT") showMoves();
          else alert("Not implemented yet!");
        };
        ui.appendChild(btn);
      });
    };
    const showMoves = () => {
      const ui = document.getElementById("ui-overlay");
      ui.innerHTML = "";
      playerMonster.moves.forEach((moveInstance) => {
        const btn = document.createElement("div");
        btn.className = "move-btn";
        btn.style.flexDirection = "column";
        btn.innerHTML = `<span>${moveInstance.move.name}</span><span style="font-size:12px">PP: ${moveInstance.currentPp}/${moveInstance.move.pp}</span>`;
        btn.onclick = async () => {
          await battleService.executeTurn(moveInstance);
          updateUI();
        };
        ui.appendChild(btn);
      });
      const backBtn = document.createElement("div");
      backBtn.className = "move-btn";
      backBtn.innerText = "BACK";
      backBtn.onclick = updateUI;
      ui.appendChild(backBtn);
    };
    updateUI();
  }
  init().catch(console.error);
})();
//# sourceMappingURL=main.js.map
