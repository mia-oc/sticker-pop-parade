import { Balloon, Particle, COLORS, STICKERS } from './types';
import { AudioManager } from './audio';
import { Storage } from './storage';
import { drawBalloon, drawParticle, drawStar, drawStickerUnlocked } from './assets';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scoreEl: HTMLElement;
  private stickerEl: HTMLElement;
  
  private balloons: Balloon[] = [];
  private particles: Particle[] = [];
  private score = 0;
  private stickersUnlocked: Set<string> = new Set();
  private audio: AudioManager;
  
  private lastSpawn = 0;
  private spawnInterval = 1500;
  private animationId: number | null = null;
  private unlockedSticker: { emoji: string; x: number; y: number; time: number } | null = null;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.scoreEl = document.getElementById('scoreVal')!;
    this.stickerEl = document.getElementById('stickerVal')!;
    this.audio = new AudioManager();
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.setupInput();
    this.loadProgress();
    this.updateUI();
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private loadProgress(): void {
    const stickers = Storage.getStickers();
    stickers.filter(s => s.unlocked).forEach(s => this.stickersUnlocked.add(s.id));
  }

  private setupInput(): void {
    const handleTap = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      
      let clientX: number, clientY: number;
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      this.checkBalloonHit(clientX, clientY);
    };

    this.canvas.addEventListener('mousedown', handleTap);
    this.canvas.addEventListener('touchstart', handleTap, { passive: false });
  }

  private checkBalloonHit(x: number, y: number): void {
    for (let i = this.balloons.length - 1; i >= 0; i--) {
      const b = this.balloons[i];
      if (b.popped) continue;
      
      const dx = x - b.x;
      const dy = y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < b.radius + 20) {
        this.popBalloon(i);
        return;
      }
    }
  }

  private popBalloon(index: number): void {
    const b = this.balloons[index];
    b.popped = true;
    
    // Create particles
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      this.particles.push({
        x: b.x,
        y: b.y,
        vx: Math.cos(angle) * 5,
        vy: Math.sin(angle) * 5,
        life: 30,
        color: b.color
      });
    }
    
    // Remove balloon
    this.balloons.splice(index, 1);
    
    // Score
    this.score += 10;
    this.audio.playPop();
    
    // Check for sticker unlock
    this.checkStickerUnlock();
    this.updateUI();
  }

  private checkStickerUnlock(): void {
    const stickerIndex = Math.floor(this.score / 50);
    const availableStickers = STICKERS.filter(s => !this.stickersUnlocked.has(s.id));
    
    if (stickerIndex > this.stickersUnlocked.size && availableStickers.length > 0) {
      const newSticker = availableStickers[0];
      Storage.unlockSticker(newSticker.id);
      this.stickersUnlocked.add(newSticker.id);
      this.audio.playSticker();
      
      // Show unlocked animation
      this.unlockedSticker = {
        emoji: newSticker.emoji,
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        time: Date.now()
      };
    }
  }

  private spawnBalloon(): void {
    const now = Date.now();
    if (now - this.lastSpawn < this.spawnInterval) return;
    
    const radius = 35 + Math.random() * 25;
    const balloon: Balloon = {
      x: radius + Math.random() * (this.canvas.width - radius * 2),
      y: this.canvas.height + radius,
      radius,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 1 + Math.random() * 2 + (this.score / 200),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      popped: false
    };
    
    this.balloons.push(balloon);
    this.lastSpawn = now;
    
    // Speed up spawning as score increases
    this.spawnInterval = Math.max(500, 1500 - this.score * 2);
  }

  private update(): void {
    // Update balloons
    this.balloons.forEach(b => {
      b.y -= b.speed;
      b.wobble += b.wobbleSpeed;
      b.x += Math.sin(b.wobble) * 0.5;
      
      // Remove if off screen
      if (b.y < -b.radius * 2) {
        b.popped = true;
      }
    });
    
    this.balloons = this.balloons.filter(b => !b.popped);
    
    // Update particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life--;
    });
    this.particles = this.particles.filter(p => p.life > 0);
    
    // Spawn new balloons
    this.spawnBalloon();
  }

  private draw(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw balloons
    this.balloons.forEach(b => {
      drawBalloon(this.ctx, b.x, b.y, b.radius, b.color);
    });
    
    // Draw particles
    this.particles.forEach(p => {
      drawParticle(this.ctx, p.x, p.y, p.life / 6, p.color);
    });
    
    // Draw unlocked sticker notification
    if (this.unlockedSticker) {
      const elapsed = Date.now() - this.unlockedSticker.time;
      if (elapsed < 2000) {
        const alpha = elapsed < 500 ? elapsed / 500 : 1 - (elapsed - 500) / 1500;
        const scale = 1 + Math.sin(elapsed / 100) * 0.1;
        
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.translate(this.unlockedSticker.x, this.unlockedSticker.y);
        this.ctx.scale(scale, scale);
        drawStickerUnlocked(this.ctx, this.unlockedSticker.emoji, 0, 0);
        
        // Draw "New Sticker!" text
        this.ctx.font = 'bold 30px Arial';
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('New Sticker!', 0, -60);
        this.ctx.restore();
      } else {
        this.unlockedSticker = null;
      }
    }
  }

  private updateUI(): void {
    this.scoreEl.textContent = String(this.score);
    this.stickerEl.textContent = String(this.stickersUnlocked.size);
  }

  start(): void {
    const loop = () => {
      this.update();
      this.draw();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  getScore(): number {
    return this.score;
  }

  getUnlockedCount(): number {
    return this.stickersUnlocked.size;
  }
}
