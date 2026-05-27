export const MonsterArt = {
  bulbasaur: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.fillStyle = '#78C850';
    ctx.fillRect(x + size * 0.2, y + size * 0.4, size * 0.6, size * 0.5); // Body
    ctx.fillStyle = '#A0C800';
    ctx.fillRect(x + size * 0.3, y + size * 0.1, size * 0.4, size * 0.3); // Bulb
  },
  charmander: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.fillStyle = '#F08030';
    ctx.fillRect(x + size * 0.2, y + size * 0.4, size * 0.6, size * 0.5); // Body
    ctx.fillStyle = '#F05030';
    ctx.fillRect(x + size * 0.7, y + size * 0.8, size * 0.1, size * 0.1); // Tail flame
  },
  squirtle: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.fillStyle = '#6890F0';
    ctx.fillRect(x + size * 0.2, y + size * 0.4, size * 0.6, size * 0.5); // Body
    ctx.fillStyle = '#4060A0';
    ctx.fillRect(x + size * 0.2, y + size * 0.5, size * 0.6, size * 0.3); // Shell
  }
};
