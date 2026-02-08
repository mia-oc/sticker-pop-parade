import { Game } from './game';
import { Storage } from './storage';
import { AdultLock } from './lock';
import { STICKERS } from './types';
import { AudioManager } from './audio';

// Initialize game
const game = new Game();
game.start();

// Initialize audio and lock
const audio = new AudioManager();
const adultLock = new AdultLock();

// UI Elements
const settingsBtn = document.getElementById('settingsBtn')!;
const settingsModal = document.getElementById('settingsModal')!;
const muteBtn = document.getElementById('muteBtn')!;
const lockBtn = document.getElementById('lockBtn')!;
const galleryBtn = document.getElementById('galleryBtn')!;
const closeBtn = document.getElementById('closeBtn')!;
const stickerGallery = document.getElementById('stickerGallery')!;
const stickerGrid = document.getElementById('stickerGrid')!;
const backBtn = document.getElementById('backBtn')!;

// Update mute button state
function updateMuteButton(): void {
  muteBtn.textContent = audio.muted ? '🔇 Sound Off' : '🔊 Sound On';
  muteBtn.classList.toggle('muted', audio.muted);
}

updateMuteButton();

// Event Listeners
settingsBtn.addEventListener('click', () => {
  settingsModal.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  settingsModal.classList.remove('active');
});

muteBtn.addEventListener('click', () => {
  audio.setMuted(!audio.muted);
  updateMuteButton();
});

lockBtn.addEventListener('click', async () => {
  settingsModal.classList.remove('active');
  await adultLock.lock();
});

galleryBtn.addEventListener('click', () => {
  settingsModal.classList.remove('active');
  renderGallery();
  stickerGallery.classList.add('active');
});

backBtn.addEventListener('click', () => {
  stickerGallery.classList.remove('active');
});

// Render sticker gallery
function renderGallery(): void {
  const saved = Storage.getStickers();
  stickerGrid.innerHTML = '';
  
  STICKERS.forEach(sticker => {
    const slot = document.createElement('div');
    slot.className = 'sticker-slot';
    
    const savedSticker = saved.find(s => s.id === sticker.id);
    if (savedSticker?.unlocked) {
      slot.classList.add('unlocked');
      slot.textContent = sticker.emoji;
    } else {
      slot.textContent = '🔒';
    }
    
    stickerGrid.appendChild(slot);
  });
}

// Prevent zoom on double tap
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// Prevent pull-to-refresh
document.body.style.overscrollBehavior = 'none';
