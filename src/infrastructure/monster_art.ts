export const MonsterArt = {
  bulbasaur: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Body
    ctx.fillStyle = '#78C850';
    ctx.beginPath();
    ctx.arc(x + size * 0.5, y + size * 0.6, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Bulb
    ctx.fillStyle = '#A0C800';
    ctx.beginPath();
    ctx.arc(x + size * 0.6, y + size * 0.3, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#FFF';
    ctx.fillRect(x + size * 0.6, y + size * 0.5, size * 0.05, size * 0.05);
  },
  charmander: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Body (Longer lizard body)
    ctx.fillStyle = '#F08030';
    ctx.fillRect(x + size * 0.2, y + size * 0.5, size * 0.5, size * 0.3);
    // Head
    ctx.beginPath();
    ctx.arc(x + size * 0.5, y + size * 0.3, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Tail (Longer)
    ctx.fillStyle = '#F08030';
    ctx.beginPath();
    ctx.moveTo(x + size * 0.2, y + size * 0.6);
    ctx.quadraticCurveTo(x + size * 0.1, y + size * 0.8, x + size * 0.0, y + size * 0.7);
    ctx.fill();
    // Flame
    ctx.fillStyle = '#F05030';
    ctx.beginPath();
    ctx.arc(x + size * 0.0, y + size * 0.7, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
  },
  squirtle: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Body
    ctx.fillStyle = '#6890F0';
    ctx.beginPath();
    ctx.arc(x + size * 0.5, y + size * 0.6, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    // Shell
    ctx.fillStyle = '#4060A0';
    ctx.fillRect(x + size * 0.3, y + size * 0.4, size * 0.4, size * 0.3);
    // Eye
    ctx.fillStyle = '#000';
    ctx.fillRect(x + size * 0.6, y + size * 0.5, size * 0.05, size * 0.05);
  }
};
