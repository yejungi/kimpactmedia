/* K-IMPACT Media Group — Main JS v6.0 */

// ===== HEADER SCROLL =====
const header = document.getElementById('kg-header');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.kg-hamburger');
const navMenu = document.querySelector('.kg-nav-menu');
const mobileNav = document.querySelector('.kg-mobile-nav');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isOpen);
    if (mobileNav) mobileNav.classList.toggle('open', !isOpen);
    const spans = hamburger.querySelectorAll('span');
    if (!isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}
if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  });
}

// ===== HERO CANVAS — Global Network Visualization =====
(function initHeroCanvas() {
  const canvas = document.getElementById('kg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // World map city coordinates (normalized 0-1)
  const cities = [
    { x: 0.50, y: 0.30, label: 'Seoul', size: 4 },
    { x: 0.52, y: 0.28, label: 'Tokyo', size: 3 },
    { x: 0.48, y: 0.35, label: 'Shanghai', size: 3 },
    { x: 0.42, y: 0.38, label: 'Singapore', size: 2.5 },
    { x: 0.14, y: 0.28, label: 'New York', size: 3 },
    { x: 0.22, y: 0.22, label: 'London', size: 3 },
    { x: 0.24, y: 0.25, label: 'Paris', size: 2.5 },
    { x: 0.28, y: 0.30, label: 'Dubai', size: 2.5 },
    { x: 0.12, y: 0.40, label: 'São Paulo', size: 2 },
    { x: 0.35, y: 0.45, label: 'Sydney', size: 2 },
    { x: 0.18, y: 0.25, label: 'Toronto', size: 2 },
    { x: 0.30, y: 0.28, label: 'Berlin', size: 2 },
    { x: 0.38, y: 0.32, label: 'Mumbai', size: 2 },
    { x: 0.10, y: 0.28, label: 'Los Angeles', size: 2.5 },
  ];

  // Connections from Seoul (index 0) to all others
  const connections = cities.slice(1).map((_, i) => ({ from: 0, to: i + 1 }));
  // Additional cross-connections
  connections.push(
    { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 5, to: 7 },
    { from: 2, to: 3 }, { from: 1, to: 2 }, { from: 7, to: 12 }
  );

  // Animated data packets
  const packets = connections.map(conn => ({
    conn,
    t: Math.random(),
    speed: 0.002 + Math.random() * 0.003,
    active: Math.random() > 0.4
  }));

  // Floating particles
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0003,
    vy: (Math.random() - 0.5) * 0.0003,
    r: Math.random() * 1.5 + 0.5,
    a: Math.random() * 0.4 + 0.1
  }));

  let frame = 0;

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background grid (subtle)
    ctx.strokeStyle = 'rgba(0,102,255,0.04)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += 80) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (let gy = 0; gy < H; gy += 80) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    // Draw connection lines
    connections.forEach(conn => {
      const a = cities[conn.from], b = cities[conn.to];
      const ax = a.x * W, ay = a.y * H, bx = b.x * W, by = b.y * H;
      const grad = ctx.createLinearGradient(ax, ay, bx, by);
      grad.addColorStop(0, 'rgba(0,102,255,0.25)');
      grad.addColorStop(0.5, 'rgba(0,170,255,0.15)');
      grad.addColorStop(1, 'rgba(0,102,255,0.25)');
      ctx.beginPath();
      // Curved arc
      const mx = (ax + bx) / 2, my = (ay + by) / 2 - Math.abs(bx - ax) * 0.15;
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(mx, my, bx, by);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    // Draw data packets
    packets.forEach(pkt => {
      if (!pkt.active) return;
      pkt.t += pkt.speed;
      if (pkt.t > 1) { pkt.t = 0; pkt.active = Math.random() > 0.3; }
      const a = cities[pkt.conn.from], b = cities[pkt.conn.to];
      const ax = a.x * W, ay = a.y * H, bx = b.x * W, by = b.y * H;
      const mx = (ax + bx) / 2, my = (ay + by) / 2 - Math.abs(bx - ax) * 0.15;
      const t = pkt.t;
      const px = (1-t)*(1-t)*ax + 2*(1-t)*t*mx + t*t*bx;
      const py = (1-t)*(1-t)*ay + 2*(1-t)*t*my + t*t*by;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,200,255,0.9)';
      ctx.fill();
      // Glow
      const grd = ctx.createRadialGradient(px, py, 0, px, py, 8);
      grd.addColorStop(0, 'rgba(0,200,255,0.4)');
      grd.addColorStop(1, 'rgba(0,200,255,0)');
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });

    // Reactivate random packets
    if (frame % 60 === 0) {
      const idx = Math.floor(Math.random() * packets.length);
      packets[idx].active = true;
      packets[idx].t = 0;
    }

    // Draw city nodes
    cities.forEach((city, i) => {
      const cx = city.x * W, cy = city.y * H;
      const isSeoul = i === 0;
      const r = isSeoul ? city.size * 1.5 : city.size;

      // Pulse ring for Seoul
      if (isSeoul) {
        const pulse = (Math.sin(frame * 0.04) + 1) / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 6 + pulse * 8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,170,255,${0.15 + pulse * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0,170,255,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Node glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
      grd.addColorStop(0, isSeoul ? 'rgba(0,150,255,0.5)' : 'rgba(0,102,255,0.3)');
      grd.addColorStop(1, 'rgba(0,102,255,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Node dot
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = isSeoul ? '#00aaff' : 'rgba(100,180,255,0.8)';
      ctx.fill();
    });

    // Floating particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100,180,255,${p.a})`;
      ctx.fill();
    });

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== AOS (Animate On Scroll) =====
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-aos-delay') || 0;
      setTimeout(() => {
        entry.target.classList.add('aos-animate');
      }, parseInt(delay));
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => {
  aosObserver.observe(el);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== CONTACT FORM =====
const form = document.querySelector('.kg-contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '전송 완료 ✓';
    btn.style.background = 'linear-gradient(135deg, #00c851, #00a040)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.kg-nav-link[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${current}`;
    link.style.color = isActive ? 'var(--blue-glow)' : '';
  });
}, { passive: true });

// ===== SCROLL ANIMATION =====
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.kg-animate').forEach(el => animObserver.observe(el));

// ===== LOGIN MODAL =====
const loginModal = document.getElementById('kg-login-modal');
const loginBtns = document.querySelectorAll('[data-action="login"]');
const loginClose = document.getElementById('kg-login-close');

if (loginModal) {
  loginBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      loginModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  if (loginClose) {
    loginClose.addEventListener('click', () => {
      loginModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  loginModal.addEventListener('click', e => {
    if (e.target === loginModal) {
      loginModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}
