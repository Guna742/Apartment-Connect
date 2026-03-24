/* ===================================================
   APARTMENT CONNECT — MAIN JAVASCRIPT
   =================================================== */

'use strict';

// ─── NAVBAR ───────────────────────────────────────
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.navbar-menu');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close nav on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// Set active nav link based on current page
function setActiveNavLink() {
  const path = window.location.pathname;
  const currentPage = path.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.remove('active');

    // Normalize href and currentPage for comparison
    const normalizedHref = href.replace('./', '');
    const normalizedCurrent = currentPage.replace('./', '');

    if (normalizedHref === normalizedCurrent) {
      link.classList.add('active');
    }
  });
}
setActiveNavLink();

// ─── SCROLL REVEAL ────────────────────────────────
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

function initReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });
}

// ─── COUNTER ANIMATION ─────────────────────────────
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-target]').forEach(el => {
    counterObserver.observe(el);
  });
}

// ─── PROGRESS BAR ANIMATION ────────────────────────
function initProgressBars() {
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.progress-fill');
        if (fill) {
          setTimeout(() => {
            fill.style.width = fill.dataset.width || '70%';
          }, 200);
        }
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.progress-bar').forEach(bar => {
    progressObserver.observe(bar);
  });
}

// ─── HERO CANVAS PARTICLES ─────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particles = [];
  const count = Math.min(60, Math.floor(canvas.width / 20));

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '108,92,231' : '0,194,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < count; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,92,231,${(1 - dist / 120) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  });
}

// ─── NETWORK CANVAS ────────────────────────────────
function initNetworkCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const nodes = [];
  const stars = [];
  const nodeCount = 12;
  const starCount = 80;

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      opacity: Math.random() * 0.5 + 0.1,
      twinkle: Math.random() * 0.05
    });
  }

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 4 + 3
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background stars
    stars.forEach(s => {
      s.opacity += s.twinkle;
      if (s.opacity > 0.6 || s.opacity < 0.1) s.twinkle *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
      ctx.fill();
    });

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const alpha = (1 - dist / 200) * 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 2.5);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(0.4, 'rgba(108, 92, 231, 0.4)');
      grad.addColorStop(1, 'rgba(0,194,255,0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// ─── CURSOR GLOW ───────────────────────────────────
function initCursorGlow() {
  if ('ontouchstart' in window) return;
  const cursor = document.createElement('div');
  cursor.className = 'cursor-glow';
  document.body.appendChild(cursor);

  let cx = 0, cy = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function animateCursor() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

// ─── TAB SYSTEM ────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab-nav').forEach(nav => {
    const buttons = nav.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    const cards = document.querySelectorAll('.community-card');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active button
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Handle category filtering
        if (cards.length > 0 && btn.dataset.category) {
          const category = btn.dataset.category;
          cards.forEach(card => {
            card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            if (category === 'all' || card.dataset.category === category) {
              card.style.display = 'block';
              void card.offsetWidth; // Force reflow
              card.classList.remove('hidden');
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(8px) scale(0.98)';
              setTimeout(() => {
                if (card.style.opacity === '0') {
                  card.classList.add('hidden');
                  card.style.display = 'none';
                }
              }, 150);
            }
          });
        }

        // Handle panel switching
        if (panels.length > 0 && btn.dataset.tab) {
          panels.forEach(p => {
            p.style.opacity = '0';
            p.style.transform = 'translateY(10px)';
            setTimeout(() => { p.classList.add('hidden'); }, 150);
          });

          const target = btn.dataset.tab;
          const panel = document.getElementById(target);
          if (panel) {
            setTimeout(() => {
              panel.classList.remove('hidden');
              void panel.offsetWidth;
              panel.style.opacity = '1';
              panel.style.transform = 'translateY(0)';
            }, 150);
          }
        }
      });
    });

    // Initialize transition properties
    panels.forEach(p => {
      p.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    });
  });
}

// ─── CONTACT FORM ──────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.opacity = '0';
      form.style.transform = 'scale(0.95)';
      form.style.transition = 'all 0.3s ease';

      setTimeout(() => {
        form.innerHTML = `
          <div class="success-msg">
            <div class="success-icon"><span class="material-symbols-outlined" style="font-size: 2.5rem; color: var(--mint-green)">check_circle</span></div>
            <h3>Message Sent!</h3>
            <p style="color:var(--white-60);margin-top:0.75rem">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
          </div>
        `;
        form.style.opacity = '1';
        form.style.transform = 'scale(1)';
      }, 300);
    }, 1800);
  });
}

// ─── PARALLAX ──────────────────────────────────────
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallaxEls.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.3;
          const offset = scrollY * speed;
          el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── PAGE REVEAL ──────────────────────────────────
function initPageReveal() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease-out';

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
}

// ─── 3D HERO TILT & MOTION ────────────────────────
function init3DTilt() {
  const container = document.querySelector('.hero-visual-container');
  const cluster = document.getElementById('hero-cards');
  if (!container || !cluster) return;

  const cards = cluster.querySelectorAll('.floating-card');

  container.addEventListener('mousemove', e => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    cluster.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Update individual card glows
    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const mx = ((e.clientX - cardRect.left) / cardRect.width) * 100;
      const my = ((e.clientY - cardRect.top) / cardRect.height) * 100;
      card.style.setProperty('--mouse-x', `${mx}%`);
      card.style.setProperty('--mouse-y', `${my}%`);
    });
  });

  container.addEventListener('mouseleave', () => {
    cluster.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

function initFloatingCards() {
  const cards = document.querySelectorAll('.floating-card');
  if (!cards.length) return;

  cards.forEach((card, index) => {
    const delay = index * 0.5;
    const duration = 3 + Math.random() * 2;
    card.style.animation = `hero-card-float ${duration}s ease-in-out ${delay}s infinite alternate`;
  });

  // Inject animation keyframes if not exists
  if (!document.getElementById('floating-keyframes')) {
    const style = document.createElement('style');
    style.id = 'floating-keyframes';
    style.innerHTML = `
      @keyframes hero-card-float {
        from { transform: translateZ(var(--z-base, 50px)) translateY(0); }
        to { transform: translateZ(var(--z-base, 50px)) translateY(-15px); }
      }
      .card-main { --z-base: 50px; }
      .card-accent-1 { --z-base: 100px; }
      .card-accent-2 { --z-base: 20px; }
      .card-accent-3 { --z-base: 150px; }
    `;
    document.head.appendChild(style);
  }
}

// ─── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPageReveal();
  initReveal();
  initCounters();
  initProgressBars();
  initHeroCanvas();
  initNetworkCanvas('network-canvas');
  initCursorGlow();
  initTabs();
  initContactForm();
  init3DTilt();
  initFloatingCards();
  initParallax();
});
