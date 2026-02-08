import { STICKERS, type Sticker } from './types';

const STICKERS_KEY = 'stickerPop_stickers';
const SCORE_KEY = 'stickerPop_highScore';
const MUTE_KEY = 'stickerPop_mute';

export class Storage {
  static getStickers(): Sticker[] {
    const saved = localStorage.getItem(STICKERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return STICKERS.map(s => ({ ...s }));
  }

  static saveStickers(stickers: Sticker[]): void {
    localStorage.setItem(STICKERS_KEY, JSON.stringify(stickers));
  }

  static unlockSticker(id: string): boolean {
    const stickers = this.getStickers();
    const sticker = stickers.find(s => s.id === id);
    if (sticker && !sticker.unlocked) {
      sticker.unlocked = true;
      this.saveStickers(stickers);
      return true;
    }
    return false;
  }

  static getUnlockedCount(): number {
    return this.getStickers().filter(s => s.unlocked).length;
  }

  static getHighScore(): number {
    return parseInt(localStorage.getItem(SCORE_KEY) || '0', 10);
  }

  static setHighScore(score: number): void {
    localStorage.setItem(SCORE_KEY, String(score));
  }

  static isMuted(): boolean {
    return localStorage.getItem(MUTE_KEY) === 'true';
  }

  static setMuted(muted: boolean): void {
    localStorage.setItem(MUTE_KEY, String(muted));
  }

  static reset(): void {
    localStorage.removeItem(STICKERS_KEY);
    localStorage.removeItem(SCORE_KEY);
  }
}
