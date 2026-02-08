export function drawBalloon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
): void {
  // Balloon body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, radius, radius * 1.15, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Shine
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(x - radius * 0.3, y - radius * 0.3, radius * 0.2, radius * 0.3, -0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Knot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 5, y + radius * 1.1);
  ctx.lineTo(x + 5, y + radius * 1.1);
  ctx.lineTo(x, y + radius * 1.1 + 8);
  ctx.closePath();
  ctx.fill();
  
  // String
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + radius * 1.1 + 8);
  ctx.quadraticCurveTo(x + 10, y + radius * 1.1 + 30, x, y + radius * 1.1 + 50);
  ctx.stroke();
}

export function drawParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void {
  ctx.fillStyle = '#FFD93D';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
    const outerX = x + Math.cos(angle) * size;
    const outerY = y + Math.sin(angle) * size;
    const innerAngle = (Math.PI * 2 * (i + 0.5) / 5) - Math.PI / 2;
    const innerX = x + Math.cos(innerAngle) * (size * 0.4);
    const innerY = y + Math.sin(innerAngle) * (size * 0.4);
    
    if (i === 0) ctx.moveTo(outerX, outerY);
    else ctx.lineTo(outerX, outerY);
    ctx.lineTo(innerX, innerY);
  }
  ctx.closePath();
  ctx.fill();
}

export function drawStickerUnlocked(
  ctx: CanvasRenderingContext2D,
  emoji: string,
  x: number,
  y: number
): void {
  ctx.font = '60px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x, y);
}
