export class AdultLock {
  private isLocked = false;
  private exitBtn: HTMLButtonElement;
  private exitGate: HTMLElement;
  private lockHint: HTMLElement;
  private settingsBtn: HTMLElement;
  private holdStart = 0;
  private holdTimer: number | null = null;
  private twoFingerActive = false;

  constructor() {
    this.exitBtn = document.getElementById('exitBtn') as HTMLButtonElement;
    this.exitGate = document.getElementById('exitGate') as HTMLElement;
    this.lockHint = document.getElementById('lockHint') as HTMLElement;
    this.settingsBtn = document.getElementById('settingsBtn') as HTMLElement;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Exit button hold detection
    this.exitBtn.addEventListener('touchstart', this.handleHoldStart.bind(this), { passive: false });
    this.exitBtn.addEventListener('mousedown', this.handleHoldStart.bind(this));
    this.exitBtn.addEventListener('touchend', this.handleHoldEnd.bind(this));
    this.exitBtn.addEventListener('mouseup', this.handleHoldEnd.bind(this));
    this.exitBtn.addEventListener('mouseleave', this.handleHoldEnd.bind(this));

    // Two-finger detection
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));

    // Context menu prevention
    document.addEventListener('contextmenu', e => {
      if (this.isLocked) e.preventDefault();
    });
  }

  private handleTouchStart(e: TouchEvent): void {
    this.twoFingerActive = e.touches.length >= 2;
  }

  private handleTouchEnd(e: TouchEvent): void {
    this.twoFingerActive = e.touches.length >= 2;
  }

  private handleHoldStart(e: Event): void {
    e.preventDefault();
    this.holdStart = Date.now();
    this.exitBtn.classList.add('holding');
    
    this.holdTimer = window.setInterval(() => {
      const held = Date.now() - this.holdStart;
      if (held >= 3000 && this.twoFingerActive) {
        this.unlock();
      }
    }, 100);
  }

  private handleHoldEnd(): void {
    this.exitBtn.classList.remove('holding');
    if (this.holdTimer) {
      clearInterval(this.holdTimer);
      this.holdTimer = null;
    }
  }

  async lock(): Promise<void> {
    this.isLocked = true;
    
    // Request fullscreen
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      }
    } catch (e) {
      console.log('Fullscreen not available');
    }

    // Hide settings, show exit gate
    this.settingsBtn.classList.add('hidden');
    this.exitGate.classList.add('active');
    this.lockHint.classList.add('active');

    // Hide address bar on mobile
    window.scrollTo(0, 1);
  }

  unlock(): void {
    this.isLocked = false;
    
    // Exit fullscreen
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    } catch (e) {
      console.log('Exit fullscreen failed');
    }

    // Show settings, hide exit gate
    this.settingsBtn.classList.remove('hidden');
    this.exitGate.classList.remove('active');
    this.lockHint.classList.remove('active');
  }

  isActive(): boolean {
    return this.isLocked;
  }
}
