export interface Balloon {
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
  popped: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface Sticker {
  id: string;
  emoji: string;
  unlocked: boolean;
}

export const STICKERS: Sticker[] = [
  { id: 'star', emoji: '⭐', unlocked: false },
  { id: 'heart', emoji: '❤️', unlocked: false },
  { id: 'rocket', emoji: '🚀', unlocked: false },
  { id: 'unicorn', emoji: '🦄', unlocked: false },
  { id: 'dino', emoji: '🦕', unlocked: false },
  { id: 'robot', emoji: '🤖', unlocked: false },
  { id: 'rainbow', emoji: '🌈', unlocked: false },
  { id: 'crown', emoji: '👑', unlocked: false },
  { id: 'pizza', emoji: '🍕', unlocked: false },
  { id: 'balloon', emoji: '🎈', unlocked: false },
  { id: 'gift', emoji: '🎁', unlocked: false },
  { id: 'trophy', emoji: '🏆', unlocked: false }
];

export const COLORS = ['#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D', '#C084FC', '#FF9F45'];
