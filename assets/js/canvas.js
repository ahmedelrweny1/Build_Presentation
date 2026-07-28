/* ==========================================================================
   Ambient Background & Confetti Particle Engine
   ========================================================================== */

class AmbientCanvasEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 45;
    this.resize();

    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 3 + 1,
        color: i % 2 === 0 ? 'rgba(0, 242, 254, ' : 'rgba(127, 0, 255, ',
        alpha: Math.random() * 0.4 + 0.1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Subtle Glowing Mesh Orbs
    const grad1 = this.ctx.createRadialGradient(
      this.width * 0.2, this.height * 0.3, 0,
      this.width * 0.2, this.height * 0.3, this.width * 0.4
    );
    grad1.addColorStop(0, 'rgba(127, 0, 255, 0.08)');
    grad1.addColorStop(1, 'transparent');
    this.ctx.fillStyle = grad1;
    this.ctx.fillRect(0, 0, this.width, this.height);

    const grad2 = this.ctx.createRadialGradient(
      this.width * 0.8, this.height * 0.7, 0,
      this.width * 0.8, this.height * 0.7, this.width * 0.4
    );
    grad2.addColorStop(0, 'rgba(0, 242, 254, 0.08)');
    grad2.addColorStop(1, 'transparent');
    this.ctx.fillStyle = grad2;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Floating Particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + p.alpha + ')';
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Confetti Particle Cannon for Slide 20 Finale
class ConfettiCannon {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.confettis = [];
    this.active = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  launch() {
    this.confettis = [];
    this.active = true;
    const colors = ['#00f2fe', '#7f00ff', '#ff007a', '#00f5a0', '#ffb800', '#ffffff'];

    for (let i = 0; i < 180; i++) {
      this.confettis.push({
        x: this.width / 2,
        y: this.height / 2 + 100,
        vx: (Math.random() - 0.5) * 24,
        vy: (Math.random() - 0.8) * 22,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        alpha: 1,
        gravity: 0.35
      });
    }

    this.render();
  }

  render() {
    if (!this.active) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    let aliveCount = 0;

    this.confettis.forEach(c => {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.rotation += c.vRot;
      c.alpha -= 0.006;

      if (c.alpha > 0) {
        aliveCount++;
        this.ctx.save();
        this.ctx.translate(c.x, c.y);
        this.ctx.rotate((c.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, c.alpha);
        this.ctx.fillStyle = c.color;
        this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
        this.ctx.restore();
      }
    });

    if (aliveCount > 0) {
      requestAnimationFrame(() => this.render());
    } else {
      this.active = false;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
}

// Global Instances
window.ambientCanvas = null;
window.confettiCannon = null;

document.addEventListener('DOMContentLoaded', () => {
  window.ambientCanvas = new AmbientCanvasEngine('bg-canvas');
  window.confettiCannon = new ConfettiCannon('confetti-canvas');
});
