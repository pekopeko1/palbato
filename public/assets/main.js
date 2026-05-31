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
    },
    {
      id: "dragon_rush",
      name: "\u30C9\u30E9\u30B4\u30F3\u30C0\u30A4\u30D6",
      type: "DRAGON",
      category: "PHYSICAL",
      power: 100,
      accuracy: 75,
      pp: 10,
      description: "\u3082\u306E\u3059\u3054\u3044\u3000\u3044\u3042\u3064\u304B\u3093\u3092\u3000\u306F\u306A\u3061\u306A\u304C\u3089\u3000\u3042\u3044\u3066\u306B\u3000\u3068\u3063\u3057\u3093\u3059\u308B\u3002\u3042\u3044\u3066\u3092\u3000\u3072\u308B\u307E\u305B\u308B\u3053\u3068\u3082\u3000\u3042\u308B\u3002"
    },
    {
      id: "heal_block",
      name: "\u304B\u3044\u3075\u304F\u3075\u3046\u3058",
      type: "PSYCHIC",
      category: "STATUS",
      power: 0,
      accuracy: 100,
      pp: 15,
      description: "\uFF15\u30BF\u30FC\u30F3\u306E\u3000\u3042\u3044\u3060\u3000\u3042\u3044\u3066\u306E\u3000\u3058\u3076\u3093\u3092\u3000\u304B\u3044\u3075\u304F\u3055\u305B\u308B\u3000\u308F\u3056\u3092\u3000\u3075\u3046\u3058\u308B\u3002"
    },
    {
      id: "dragon_pulse",
      name: "\u308A\u3085\u3046\u306E\u306F\u3069\u3046",
      type: "DRAGON",
      category: "SPECIAL",
      power: 85,
      accuracy: 100,
      pp: 10,
      description: "\u304F\u3061\u304B\u3089\u3000\u3057\u3087\u3046\u3052\u304D\u306F\u3092\u3000\u306F\u304D\u3060\u3057\u3066\u3000\u3042\u3044\u3066\u3092\u3000\u3053\u3046\u3052\u304D\u3059\u308B\u3002"
    },
    {
      id: "moonblast",
      name: "\u30E0\u30FC\u30F3\u30D5\u30A9\u30FC\u30B9",
      type: "FAIRY",
      category: "SPECIAL",
      power: 95,
      accuracy: 100,
      pp: 15,
      description: "\u3064\u304D\u306E\u3000\u3061\u304B\u3089\u3092\u3000\u304B\u308A\u3066\u3000\u3042\u3044\u3066\u3092\u3000\u3053\u3046\u3052\u304D\u3059\u308B\u3002\u3042\u3044\u3066\u306E\u3000\u3068\u304F\u3053\u3046\u3092\u3000\u3055\u3052\u308B\u3053\u3068\u304C\u3000\u3042\u308B\u3002"
    },
    {
      id: "nihil_light",
      name: "\u7121\u306B\u5E30\u3059\u5149",
      type: "FAIRY",
      category: "SPECIAL",
      power: 150,
      accuracy: 100,
      pp: 5,
      description: "\u3059\u3079\u3066\u3092\u3000\u3080\u306B\u3000\u304D\u3059\u3000\u307E\u3070\u3086\u3044\u3000\u3072\u304B\u308A\u3067\u3000\u3042\u3044\u3066\u3092\u3000\u3053\u3046\u3052\u304D\u3059\u308B\u3002"
    },
    {
      id: "rest",
      name: "\u306D\u3080\u308B",
      type: "PSYCHIC",
      category: "STATUS",
      power: 0,
      accuracy: 100,
      pp: 10,
      description: "\uFF12\u30BF\u30FC\u30F3\u306E\u3000\u3042\u3044\u3060\u3000\u306D\u3080\u3063\u3066\u3000\u3058\u3076\u3093\u306E\u3000\uFF28\uFF30\u3068\u3000\u3058\u3087\u3046\u305F\u3044\u3058\u3087\u3046\u3092\u3000\u3059\u3079\u3066\u3000\u304B\u3044\u3075\u304F\u3059\u308B\u3002"
    },
    {
      id: "amnesia",
      name: "\u3069\u308F\u3059\u308C",
      type: "PSYCHIC",
      category: "STATUS",
      power: 0,
      accuracy: 100,
      pp: 20,
      description: "\u3044\u3063\u3057\u3085\u3093\u3000\u306A\u306B\u304B\u3092\u3000\u308F\u3059\u308C\u308B\u3053\u3068\u3067\u3000\u3058\u3076\u3093\u306E\u3000\u3068\u304F\u307C\u3046\u3092\u3000\u3050\u30FC\u3093\u3068\u3000\u3042\u3052\u308B\u3002"
    },
    {
      id: "swords_dance",
      name: "\u3064\u308B\u304E\u306E\u307E\u3044",
      type: "NORMAL",
      category: "STATUS",
      power: 0,
      accuracy: 100,
      pp: 20,
      description: "\u305F\u305F\u304B\u3044\u306E\u3000\u304D\u3082\u3061\u3092\u3000\u305F\u304B\u3081\u308B\u3000\u304A\u3069\u308A\u3092\u3000\u304A\u3069\u3063\u3066\u3000\u3058\u3076\u3093\u306E\u3000\u3053\u3046\u3052\u304D\u3092\u3000\u3050\u30FC\u3093\u3068\u3000\u3042\u3052\u308B\u3002"
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
    },
    {
      id: "shidoss",
      name: "\u30B7\u30C9\u30C3\u30B9",
      types: ["FAIRY"],
      baseStats: {
        hp: 60,
        attack: 60,
        defense: 60,
        spAttack: 60,
        spDefense: 60,
        speed: 60
      },
      learnset: [
        { level: 1, moveId: "dragon_rush" },
        { level: 1, moveId: "heal_block" },
        { level: 1, moveId: "dragon_pulse" },
        { level: 1, moveId: "moonblast" }
      ],
      frontSprite: "images/shidoss_front.png",
      backSprite: "images/shidoss_back.png"
    },
    {
      id: "aruchu",
      name: "\u30A2\u30EB\u30C1\u30E5\u30A6",
      types: ["NORMAL"],
      baseStats: {
        hp: 19,
        attack: 10,
        defense: 103,
        spAttack: 47,
        spDefense: 122,
        speed: 3
      },
      learnset: [
        { level: 1, moveId: "nihil_light" },
        { level: 1, moveId: "rest" },
        { level: 1, moveId: "amnesia" },
        { level: 1, moveId: "swords_dance" }
      ],
      frontSprite: "images/aruchu_front.png",
      backSprite: "images/aruchu_back.png"
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
      const sprites = Array.from(this.monsters.values()).flatMap((m) => [m.frontSprite, m.backSprite]);
      await Promise.all(sprites.map((s) => this.loadImage(s).catch(() => null)));
    }
    async loadImage(url) {
      if (this.images.has(url)) return this.images.get(url);
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.images.set(url, img);
          resolve(img);
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    }
    getImage(url) {
      return this.images.get(url);
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
      ctx.fillStyle = "#000";
      ctx.fillRect(x + size * 0.45, y + size * 0.5, size * 0.05, size * 0.05);
    },
    charmander: (ctx, x, y, size) => {
      ctx.fillStyle = "#F08030";
      ctx.fillRect(x + size * 0.2, y + size * 0.5, size * 0.5, size * 0.3);
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.3, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.fillRect(x + size * 0.45, y + size * 0.25, size * 0.05, size * 0.05);
      ctx.fillStyle = "#F08030";
      ctx.beginPath();
      ctx.moveTo(x + size * 0.2, y + size * 0.6);
      ctx.quadraticCurveTo(x + size * 0.1, y + size * 0.8, x + size * 0, y + size * 0.7);
      ctx.fill();
      ctx.fillStyle = "#F05030";
      ctx.beginPath();
      ctx.arc(x + size * 0, y + size * 0.7, size * 0.05, 0, Math.PI * 2);
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
      ctx.fillRect(x + size * 0.45, y + size * 0.55, size * 0.05, size * 0.05);
    },
    aruchu: (ctx, x, y, size) => {
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(x + size * 0.5, y + size * 0.6, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + size * 0.3, y + size * 0.3);
      ctx.lineTo(x + size * 0.2, y + size * 0.1);
      ctx.lineTo(x + size * 0.4, y + size * 0.3);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + size * 0.7, y + size * 0.3);
      ctx.lineTo(x + size * 0.8, y + size * 0.1);
      ctx.lineTo(x + size * 0.6, y + size * 0.3);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.fillRect(x + size * 0.45, y + size * 0.5, size * 0.05, size * 0.05);
    }
  };

  // src/infrastructure/canvas_renderer.ts
  var CanvasRenderer = class {
    ctx;
    loader;
    width = 240;
    height = 160;
    constructor(canvas, loader) {
      this.ctx = canvas.getContext("2d");
      this.loader = loader;
      canvas.width = this.width;
      canvas.height = this.height;
      this.ctx.imageSmoothingEnabled = false;
    }
    render(state) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawBackground();
      this.drawMonsters(state.playerMonster, state.enemyMonster);
      this.drawUI(state);
    }
    drawBackground() {
      this.ctx.fillStyle = "#78C850";
      this.ctx.fillRect(0, 0, this.width, 112);
      this.ctx.fillStyle = "#68A040";
      this.ctx.beginPath();
      this.ctx.ellipse(180, 70, 40, 15, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(60, 130, 60, 20, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = "#E0E0E0";
      this.ctx.fillRect(0, 112, this.width, 48);
      this.ctx.strokeStyle = "#000";
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(2, 114, this.width - 4, 44);
    }
    drawMonsters(player, enemy) {
      const draw = (def, x, y, isPlayer) => {
        const url = isPlayer ? def.backSprite : def.frontSprite;
        const img = this.loader.getImage(url);
        if (img) {
          this.ctx.imageSmoothingEnabled = true;
          this.ctx.drawImage(img, x, y, 60, 60);
          this.ctx.imageSmoothingEnabled = false;
        } else {
          const art = MonsterArt[def.id];
          if (art) art(this.ctx, x, y, 60);
          else {
            this.ctx.fillStyle = "#999";
            this.ctx.fillRect(x, y, 60, 60);
          }
        }
      };
      draw(this.loader.getMonster(enemy.definitionId), 150, 15, false);
      this.drawInfoBox(enemy, 15, 15);
      draw(this.loader.getMonster(player.definitionId), 30, 65, true);
      this.drawInfoBox(player, 135, 75);
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
    FIRE: { FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 2, BUG: 2, ROCK: 0.5, DRAGON: 0.5, STEEL: 2, FAIRY: 0.5 },
    WATER: { FIRE: 2, WATER: 0.5, GRASS: 0.5, GROUND: 2, ROCK: 2, DRAGON: 0.5 },
    GRASS: { FIRE: 0.5, WATER: 2, GRASS: 0.5, POISON: 0.5, GROUND: 2, FLYING: 0.5, BUG: 0.5, ROCK: 2, DRAGON: 0.5, STEEL: 0.5 },
    ELECTRIC: { WATER: 2, ELECTRIC: 0.5, GRASS: 0.5, GROUND: 0, FLYING: 2, DRAGON: 0.5 },
    ICE: { FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 0.5, GROUND: 2, FLYING: 2, DRAGON: 2, STEEL: 0.5 },
    FIGHTING: { NORMAL: 2, ICE: 2, POISON: 0.5, FLYING: 0.5, PSYCHIC: 0.5, BUG: 0.5, ROCK: 2, GHOST: 0, DARK: 2, STEEL: 2, FAIRY: 0.5 },
    POISON: { GRASS: 2, POISON: 0.5, GROUND: 0.5, ROCK: 0.5, GHOST: 0.5, STEEL: 0, FAIRY: 2 },
    GROUND: { FIRE: 2, ELECTRIC: 2, GRASS: 0.5, POISON: 2, BUG: 0.5, ROCK: 2, STEEL: 2 },
    FLYING: { ELECTRIC: 0.5, GRASS: 2, FIGHTING: 2, BUG: 2, ROCK: 0.5, STEEL: 0.5 },
    PSYCHIC: { FIGHTING: 2, POISON: 2, PSYCHIC: 0.5, DARK: 0, STEEL: 0.5 },
    BUG: { FIRE: 0.5, GRASS: 2, FIGHTING: 0.5, POISON: 0.5, FLYING: 0.5, PSYCHIC: 2, GHOST: 0.5, DARK: 2, STEEL: 0.5, FAIRY: 0.5 },
    ROCK: { FIRE: 2, ICE: 2, FIGHTING: 0.5, GROUND: 0.5, FLYING: 2, BUG: 2, STEEL: 0.5 },
    GHOST: { NORMAL: 0, PSYCHIC: 2, GHOST: 2, DARK: 0.5 },
    DRAGON: { DRAGON: 2, STEEL: 0.5, FAIRY: 0 },
    STEEL: { FIRE: 0.5, WATER: 0.5, ELECTRIC: 0.5, ICE: 2, ROCK: 2, STEEL: 0.5, FAIRY: 2 },
    DARK: { FIGHTING: 0.5, PSYCHIC: 2, GHOST: 2, DARK: 0.5, FAIRY: 0.5 },
    FAIRY: { FIRE: 0.5, FIGHTING: 2, POISON: 0.5, DRAGON: 2, STEEL: 0.5, DARK: 2 }
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
    onUpdate;
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
        if (this.onUpdate) this.onUpdate();
      }
    }
    async processMove(attacker, defender, moveInstance) {
      this.state.message = `${attacker.name} \u306E ${moveInstance.move.name}\uFF01`;
      if (this.onUpdate) this.onUpdate();
      await this.delay(800);
      moveInstance.currentPp = Math.max(0, moveInstance.currentPp - 1);
      const result = calculateDamage(attacker, defender, moveInstance.move);
      defender.currentHp = Math.max(0, defender.currentHp - result.damage);
      let resultMsg = `${result.damage} \u306E \u30C0\u30E1\u30FC\u30B8\uFF01`;
      if (result.multiplier > 1) resultMsg = "\u3053\u3046\u304B\u306F \u3070\u3064\u3050\u3093\u3060\uFF01";
      if (result.multiplier < 1 && result.multiplier > 0) resultMsg = "\u3053\u3046\u304B\u306F \u3044\u307E\u3072\u3068\u3064 \u307F\u305F\u3044\u3060\u2026";
      if (result.isCritical) resultMsg = "\u304D\u3085\u3046\u3057\u3087\u306B \u3042\u305F\u3063\u305F\uFF01";
      this.state.message = resultMsg;
      if (this.onUpdate) this.onUpdate();
      await this.delay(800);
      if (defender.currentHp <= 0) {
        this.state.isFinished = true;
        this.state.winner = attacker === this.state.playerMonster ? "PLAYER" : "ENEMY";
        this.state.message = `${defender.name} \u306F \u305F\u304A\u308C\u305F\uFF01`;
        if (this.onUpdate) this.onUpdate();
      }
    }
  };

  // src/main.ts
  async function init() {
    const loader = new AssetLoader();
    await loader.loadAll();
    const canvas = document.getElementById("game-canvas");
    const renderer = new CanvasRenderer(canvas, loader);
    const createInstance = (def, level) => {
      const finalLevel = def.id === "aruchu" ? 80 : level;
      const calcHP = (base, lvl) => Math.floor(base * 2 * lvl / 100) + lvl + 10;
      const calcOther = (base, lvl) => Math.floor(base * 2 * lvl / 100) + 5;
      const stats = {
        hp: calcHP(def.baseStats.hp, finalLevel),
        attack: calcOther(def.baseStats.attack, finalLevel),
        defense: calcOther(def.baseStats.defense, finalLevel),
        spAttack: calcOther(def.baseStats.spAttack, finalLevel),
        spDefense: calcOther(def.baseStats.spDefense, finalLevel),
        speed: calcOther(def.baseStats.speed, finalLevel)
      };
      return {
        definitionId: def.id,
        name: def.name,
        types: def.types,
        level: finalLevel,
        currentHp: stats.hp,
        stats,
        moves: def.learnset.map((l) => {
          const move = loader.getMove(l.moveId);
          return move ? { move, currentPp: move.pp } : null;
        }).filter((m) => m !== null),
        status: "NONE"
      };
    };
    const showSelection = () => {
      const ui = document.getElementById("ui-overlay");
      ui.innerHTML = "\u3058\u3076\u3093\u306E \u30DD\u30B1\u30E2\u30F3\u3092 \u3048\u3089\u3093\u3067\uFF01";
      ["bulbasaur", "charmander", "squirtle", "shidoss", "aruchu"].forEach((id) => {
        const def = loader.getMonster(id);
        const btn = document.createElement("div");
        btn.className = "move-btn";
        btn.innerText = def.name;
        btn.onclick = () => showEnemySelection(def);
        ui.appendChild(btn);
      });
    };
    const showEnemySelection = (playerDef) => {
      const ui = document.getElementById("ui-overlay");
      ui.innerHTML = "\u3042\u3044\u3066\u306E \u30DD\u30B1\u30E2\u30F3\u3092 \u3048\u3089\u3093\u3067\uFF01";
      ["bulbasaur", "charmander", "squirtle", "shidoss", "aruchu"].forEach((id) => {
        const def = loader.getMonster(id);
        const btn = document.createElement("div");
        btn.className = "move-btn";
        btn.innerText = def.name;
        btn.onclick = () => startBattle(playerDef, def);
        ui.appendChild(btn);
      });
    };
    const startBattle = (playerDef, enemyDef) => {
      const playerMonster = createInstance(playerDef, 5);
      const enemyMonster = createInstance(enemyDef, 5);
      const battleService = new BattleService(playerMonster, enemyMonster);
      battleService.onUpdate = () => {
        renderer.render(battleService.getState());
      };
      const updateUI = () => {
        const state = battleService.getState();
        renderer.render(state);
        const ui = document.getElementById("ui-overlay");
        ui.innerHTML = "";
        if (state.isFinished) {
          ui.innerText = state.message;
          return;
        }
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
            if (opt.action === "FIGHT") showMoves(battleService, updateUI, playerMonster);
            else alert("\u307E\u3060\u5B9F\u88C5\u3055\u308C\u3066\u3044\u307E\u305B\u3093\uFF01");
          };
          ui.appendChild(btn);
        });
      };
      const showMoves = (service, updateUI2, playerMonster2) => {
        const ui = document.getElementById("ui-overlay");
        ui.innerHTML = "";
        playerMonster2.moves.forEach((moveInstance) => {
          const btn = document.createElement("div");
          btn.className = "move-btn";
          btn.style.flexDirection = "column";
          btn.innerHTML = `<span>${moveInstance.move.name}</span><span style="font-size:12px">PP: ${moveInstance.currentPp}/${moveInstance.move.pp}</span>`;
          btn.onclick = async () => {
            ui.innerHTML = "\u30D0\u30C8\u30EB\u4E2D...";
            await service.executeTurn(moveInstance);
            renderer.render(service.getState());
            await new Promise((r) => setTimeout(r, 1e3));
            updateUI2();
          };
          ui.appendChild(btn);
        });
        const backBtn = document.createElement("div");
        backBtn.className = "move-btn";
        backBtn.innerText = "\u3082\u3069\u308B";
        backBtn.onclick = updateUI2;
        ui.appendChild(backBtn);
      };
      updateUI();
    };
    showSelection();
  }
  init().catch(console.error);
})();
