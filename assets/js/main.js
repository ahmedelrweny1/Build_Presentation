/* ==========================================================================
   Main Presentation Engine Controller
   ========================================================================== */

class PresentationController {
  constructor() {
    this.currentSlide = 0;
    this.slides = [];
    this.totalSlides = 0;
    this.soundEnabled = true;
    this.audioCtx = null;

    this.initElements();
    this.initNavigation();
    this.initTheme();
    this.initTOC();
    this.initSound();
    this.updateSlideState();
  }

  initElements() {
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.totalSlides = this.slides.length;

    this.counterEl = document.getElementById('slide-counter');
    this.titlePill = document.getElementById('slide-title-pill');
    this.progressBar = document.getElementById('progress-bar-fill');
    
    this.prevBtn = document.getElementById('prev-slide-btn');
    this.nextBtn = document.getElementById('next-slide-btn');

    this.themeBtn = document.getElementById('theme-toggle-btn');
    this.soundBtn = document.getElementById('sound-toggle-btn');
    this.tocBtn = document.getElementById('toc-toggle-btn');
    this.fullscreenBtn = document.getElementById('fullscreen-toggle-btn');
  }

  initNavigation() {
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

    // Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;

      if (['ArrowRight', 'ArrowDown', 'Space', 'PageDown'].includes(e.code)) {
        e.preventDefault();
        this.nextSlide();
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.code)) {
        e.preventDefault();
        this.prevSlide();
      } else if (e.code === 'Home') {
        e.preventDefault();
        this.goToSlide(0);
      } else if (e.code === 'End') {
        e.preventDefault();
        this.goToSlide(this.totalSlides - 1);
      }
    });

    // Mobile Swipe Navigation
    let startX = 0;
    let startY = 0;
    window.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].clientX - startX;
      const diffY = e.changedTouches[0].clientY - startY;

      if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) this.nextSlide();
        else this.prevSlide();
      }
    });
  }

  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;
    this.slides[this.currentSlide]?.classList.remove('active');
    this.currentSlide = index;
    this.slides[this.currentSlide]?.classList.add('active');
    
    this.updateSlideState();
    this.playSound(440, 0.08);

    // Slide 20 Finale Confetti Trigger
    if (this.currentSlide === this.totalSlides - 1 && window.confettiCannon) {
      window.confettiCannon.launch();
    }
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  updateSlideState() {
    const activeSlide = this.slides[this.currentSlide];
    const slideTag = activeSlide?.getAttribute('data-title') || `Slide ${this.currentSlide + 1}`;

    // Update Counter & Titles
    if (this.counterEl) {
      const currentFormatted = String(this.currentSlide + 1).padStart(2, '0');
      const totalFormatted = String(this.totalSlides).padStart(2, '0');
      this.counterEl.textContent = `${currentFormatted} / ${totalFormatted}`;
    }

    if (this.titlePill) {
      this.titlePill.textContent = slideTag;
    }

    // Update Progress Bar
    if (this.progressBar) {
      const percent = ((this.currentSlide + 1) / this.totalSlides) * 100;
      this.progressBar.style.width = `${percent}%`;
    }

    // Update Buttons disabled state
    if (this.prevBtn) this.prevBtn.disabled = this.currentSlide === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;

    // Update TOC Highlights
    document.querySelectorAll('.toc-card').forEach((card, idx) => {
      card.classList.toggle('active', idx === this.currentSlide);
    });
  }

  initTheme() {
    this.themeBtn?.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      this.themeBtn.innerHTML = isLight ? '🌙' : '☀️';
    });
  }

  initTOC() {
    const drawer = document.getElementById('drawer-overlay');
    const closeBtn = document.getElementById('drawer-close-btn');
    const grid = document.getElementById('drawer-grid');

    if (!grid || !drawer) return;

    // Render TOC Cards
    grid.innerHTML = '';
    this.slides.forEach((slide, idx) => {
      const title = slide.getAttribute('data-title') || `Slide ${idx + 1}`;
      const card = document.createElement('div');
      card.className = `toc-card ${idx === this.currentSlide ? 'active' : ''}`;
      card.innerHTML = `
        <div class="toc-num">SLIDE ${String(idx + 1).padStart(2, '0')}</div>
        <div class="toc-title">${title}</div>
      `;
      card.addEventListener('click', () => {
        this.goToSlide(idx);
        drawer.classList.remove('active');
      });
      grid.appendChild(card);
    });

    this.tocBtn?.addEventListener('click', () => drawer.classList.add('active'));
    closeBtn?.addEventListener('click', () => drawer.classList.remove('active'));
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) drawer.classList.remove('active');
    });
  }

  initSound() {
    this.soundBtn?.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      this.soundBtn.innerHTML = this.soundEnabled ? '🔔' : '🔕';
    });
  }

  playSound(freq = 440, duration = 0.08) {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted yet
    }
  }
}

// Global Launch
document.addEventListener('DOMContentLoaded', () => {
  window.presentation = new PresentationController();
});
