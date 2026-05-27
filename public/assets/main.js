"use strict";
(() => {
  // public/data/moves.json
  var moves_default = [
    {
      id: "tackle",
      name: "\u305F\u3044\u3042\u305F\u308A",
      type: "NORMAL",
      category: "PHYSICAL",
      power: 40,
      accuracy: 100,
      pp: 35,
      description: "\u304B\u3089\u3060\u3092\u3000\u3076\u3064\u3051\u3066\u3000\u3042\u3044\u3066\u3092\u3000\u3053\u3046\u3052\u304D\u3059\u308B\u3002"
    },
    {
      id: "ember",
      name: "\u3072\u306E\u3053",
      type: "FIRE",
      category: "SPECIAL",
      power: 40,
      accuracy: 100,
      pp: 25,
      description: "\u3061\u3044\u3055\u306A\u3000\u3072\u306E\u3053\u3067\u3000\u3042\u3044\u3066\u3092\u3000\u3053\u3046\u3052\u304D\u3059\u308B\u3002\u3000\u3084\u3051\u3069\u306B\u3000\u3055\u305B\u308B\u3053\u3068\u304C\u3000\u3042\u308B\u3002"
    },
    {
      id: "bubble",
      name: "\u3042\u308F",
      type: "WATER",
      category: "SPECIAL",
      power: 40,
      accuracy: 100,
      pp: 30,
      description: "\u304A\u304A\u304F\u306E\u3000\u3042\u308F\u3092\u3000\u3075\u304D\u3060\u3057\u3066\u3000\u3053\u3046\u3052\u304D\u3059\u308B\u3002\u3000\u3059\u3070\u3084\u3055\u3092\u3000\u3055\u3052\u308B\u3053\u3068\u304C\u3000\u3042\u308B\u3002"
    },
    {
      id: "vine_whip",
      name: "\u3064\u308B\u306E\u30E0\u30C1",
      type: "GRASS",
      category: "PHYSICAL",
      power: 45,
      accuracy: 100,
      pp: 25,
      description: "\u307B\u305D\u3044\u3000\u3064\u308B\u3092\u3000\u30E0\u30C1\u306E\u3088\u3046\u306B\u3000\u3057\u306A\u3089\u305B\u3066\u3000\u3042\u3044\u3066\u3092\u3000\u3053\u3046\u3052\u304D\u3059\u308B\u3002"
    }
  ];

  // public/data/monsters.json
  var monsters_default = [
    {
      id: "bulbasaur",
      name: "\u30D5\u30B7\u30AE\u30C0\u30CD",
      types: ["GRASS", "POISON"],
      baseStats: {
        hp: 45,
        attack: 49,
        defense: 49,
        spAttack: 65,
        spDefense: 65,
        speed: 45
      },
      learnset: [
        { level: 1, moveId: "tackle" },
        { level: 1, moveId: "vine_whip" }
      ],
      frontSprite: "images/bulbasaur_front.png",
      backSprite: "images/bulbasaur_back.png"
    },
    {
      id: "charmander",
      name: "\u30D2\u30C8\u30AB\u30B2",
      types: ["FIRE"],
      baseStats: {
        hp: 39,
        attack: 52,
        defense: 43,
        spAttack: 60,
        spDefense: 50,
        speed: 65
      },
      learnset: [
        { level: 1, moveId: "tackle" },
        { level: 1, moveId: "ember" }
      ],
      frontSprite: "images/charmander_front.png",
      backSprite: "images/charmander_back.png"
    },
    {
      id: "squirtle",
      name: "\u30BC\u30CB\u30AC\u30E1",
      types: ["WATER"],
      baseStats: {
        hp: 44,
        attack: 48,
        defense: 65,
        spAttack: 50,
        spDefense: 64,
        speed: 43
      },
      learnset: [
        { level: 1, moveId: "tackle" },
        { level: 1, moveId: "bubble" }
      ],
      frontSprite: "images/squirtle_front.png",
      backSprite: "images/squirtle_back.png"
    }
  ];

  // src/infrastructure/asset_loader.ts
  var AssetLoader = class {
    monsters = /* @__PURE__ */ new Map();
    moves = /* @__PURE__ */ new Map();
    images = /* @__PURE__ */ new Map();
    async loadAll() {
      moves_default.forEach((move) => this.moves.set(move.id, move));
      monsters_default.forEach((monster) => this.monsters.set(monster.id, monster));
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

  // src/infrastructure/monster_art.ts
  var MonsterArt = {
    bulbasaur: (ctx, x, y, size) => {
      ctx.fillStyle = "#78C850";
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.6, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#A0C800";
      ctx.beginPath();
      ctx.arc(x + size * 0.6, y + size * 0.3, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFF";
      ctx.fillRect(x + size * 0.6, y + size * 0.5, size * 0.05, size * 0.05);
    },
    charmander: (ctx, x, y, size) => {
      ctx.fillStyle = "#F08030";
      ctx.fillRect(x + size * 0.3, y + size * 0.4, size * 0.4, size * 0.4);
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.3, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#F05030";
      ctx.beginPath();
      ctx.arc(x + size * 0.8, y + size * 0.7, size * 0.1, 0, Math.PI * 2);
      ctx.fill();
    },
    squirtle: (ctx, x, y, size) => {
      ctx.fillStyle = "#6890F0";
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.6, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4060A0";
      ctx.fillRect(x + size * 0.3, y + size * 0.4, size * 0.4, size * 0.3);
      ctx.fillStyle = "#000";
      ctx.fillRect(x + size * 0.6, y + size * 0.5, size * 0.05, size * 0.05);
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
      console.log("Rendering state:", state);
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
      const draw = (id, x, y) => {
        const art = MonsterArt[id];
        if (art) art(this.ctx, x, y, 60);
        else {
          this.ctx.fillStyle = "#999";
          this.ctx.fillRect(x, y, 60, 60);
        }
      };
      draw(enemy.definitionId, 160, 20);
      this.drawInfoBox(enemy, 20, 20);
      draw(player.definitionId, 20, 80);
      this.drawInfoBox(player, 140, 90);
    }
    drawInfoBox(monster, x, y) {
      this.ctx.fillStyle = "#FFF";
      this.ctx.strokeStyle = "#000";
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, 90, 30, 5);
      this.ctx.fill();
      this.ctx.stroke();
      const barWidth = 80;
      const hpRatio = monster.currentHp / monster.stats.hp;
      const color = hpRatio > 0.5 ? "#00FF00" : hpRatio > 0.2 ? "#FFFF00" : "#FF0000";
      this.ctx.fillStyle = "#EEE";
      this.ctx.fillRect(x + 5, y + 15, barWidth, 6);
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x + 5, y + 15, barWidth * hpRatio, 6);
      this.ctx.fillStyle = "#000";
      this.ctx.font = "8px monospace";
      this.ctx.fillText(monster.name, x + 5, y + 10);
      this.ctx.fillText(`Lv${monster.level}`, x + 60, y + 10);
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
        message: `\u3084\u305B\u3044\u306E ${enemy.name} \u304C \u3068\u3073\u3060\u3057\u3066\u304D\u305F\uFF01`
      };
    }
    getState() {
      return this.state;
    }
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async executeTurn(playerMoveInstance) {
      if (this.state.isFinished) return;
      const enemyMoveInstance = this.state.enemyMonster.moves[0];
      const playerFirst = this.state.playerMonster.stats.speed >= this.state.enemyMonster.stats.speed;
      if (playerFirst) {
        await this.processMove(this.state.playerMonster, this.state.enemyMonster, playerMoveInstance);
        await this.delay(1e3);
        if (!this.state.isFinished) {
          await this.processMove(this.state.enemyMonster, this.state.playerMonster, enemyMoveInstance);
        }
      } else {
        await this.processMove(this.state.enemyMonster, this.state.playerMonster, enemyMoveInstance);
        await this.delay(1e3);
        if (!this.state.isFinished) {
          await this.processMove(this.state.playerMonster, this.state.enemyMonster, playerMoveInstance);
        }
      }
      if (!this.state.isFinished) {
        this.state.turnCount++;
        this.state.message = "\u3069\u3046\u3059\u308B\uFF1F";
      }
    }
    async processMove(attacker, defender, moveInstance) {
      this.state.message = `${attacker.name} \u306E ${moveInstance.move.name}\uFF01`;
      moveInstance.currentPp = Math.max(0, moveInstance.currentPp - 1);
      await this.delay(800);
      const result = calculateDamage(attacker, defender, moveInstance.move);
      defender.currentHp = Math.max(0, defender.currentHp - result.damage);
      let resultMsg = "";
      if (result.multiplier > 1) resultMsg += " \u3053\u3046\u304B\u306F \u3070\u3064\u3050\u3093\u3060\uFF01";
      if (result.multiplier < 1 && result.multiplier > 0) resultMsg += " \u3053\u3046\u304B\u306F \u3044\u307E\u3072\u3068\u3064 \u307F\u305F\u3044\u3060\u2026";
      if (result.isCritical) resultMsg += " \u304D\u3085\u3046\u3057\u3087\u306B \u3042\u305F\u3063\u305F\uFF01";
      this.state.message = resultMsg || `${result.damage} \u306E \u30C0\u30E1\u30FC\u30B8\uFF01`;
      if (defender.currentHp <= 0) {
        this.state.isFinished = true;
        this.state.winner = attacker === this.state.playerMonster ? "PLAYER" : "ENEMY";
        this.state.message = `${defender.name} \u306F \u305F\u304A\u308C\u305F\uFF01 ${attacker.name} \u306E \u304B\u3061\uFF01`;
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
      console.log("updateUI called");
      const state = battleService.getState();
      console.log("Battle state:", state);
      renderer.render(state);
      const ui = document.getElementById("ui-overlay");
      ui.innerHTML = "";
      if (state.isFinished) return;
      const options = [
        { label: "\u305F\u305F\u304B\u3046", action: "FIGHT" },
        { label: "\u30D0\u30C3\u30B0", action: "BAG" },
        { label: "\u30DD\u30B1\u30E2\u30F3", action: "MON" },
        { label: "\u306B\u3052\u308B", action: "RUN" }
      ];
      options.forEach((opt) => {
        const btn = document.createElement("div");
        btn.className = "move-btn";
        btn.innerText = opt.label;
        btn.onclick = () => {
          if (opt.action === "FIGHT") showMoves();
          else alert("\u307E\u3060\u5B9F\u88C5\u3055\u308C\u3066\u3044\u307E\u305B\u3093\uFF01");
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
          const ui2 = document.getElementById("ui-overlay");
          ui2.innerHTML = "\u30D0\u30C8\u30EB\u4E2D...";
          await battleService.executeTurn(moveInstance);
          renderer.render(battleService.getState());
          await new Promise((r) => setTimeout(r, 1e3));
          updateUI();
        };
        ui.appendChild(btn);
      });
      const backBtn = document.createElement("div");
      backBtn.className = "move-btn";
      backBtn.innerText = "\u3082\u3069\u308B";
      backBtn.onclick = updateUI;
      ui.appendChild(backBtn);
    };
    updateUI();
  }
  init().catch(console.error);
})();
