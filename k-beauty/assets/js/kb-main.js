/* K-Beauty by K-IMPACT — Main JS */

// ===== HEADER SCROLL =====
const header = document.getElementById('kb-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 60
      ? 'rgba(13,0,16,0.98)'
      : 'rgba(13,0,16,0.88)';
  }, { passive: true });
}

// ===== HAMBURGER =====
const hamburger = document.querySelector('.kb-hamburger');
const navMenu = document.querySelector('.kb-nav-menu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.querySelectorAll('span').forEach((s, i) => {
      if (isOpen) {
        if (i === 0) s.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (i === 1) s.style.opacity = '0';
        if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        s.style.transform = '';
        s.style.opacity = '';
      }
    });
  });
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });
}

// ===== DROPDOWN MENU =====
document.querySelectorAll('.kb-nav-item.has-dropdown').forEach(item => {
  const link = item.querySelector('.kb-nav-link');
  const dropdown = item.querySelector('.kb-dropdown');
  if (!link || !dropdown) return;

  // Desktop: hover
  item.addEventListener('mouseenter', () => {
    dropdown.style.opacity = '1';
    dropdown.style.visibility = 'visible';
    dropdown.style.transform = 'translateY(0)';
    dropdown.style.pointerEvents = 'auto';
  });
  item.addEventListener('mouseleave', () => {
    dropdown.style.opacity = '0';
    dropdown.style.visibility = 'hidden';
    dropdown.style.transform = 'translateY(-8px)';
    dropdown.style.pointerEvents = 'none';
  });

  // Mobile: click toggle
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      const isOpen = item.classList.toggle('dropdown-open');
      dropdown.style.display = isOpen ? 'flex' : 'none';
    }
  });
});

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.kb-nav-item.has-dropdown')) {
    document.querySelectorAll('.kb-nav-item.has-dropdown').forEach(item => {
      item.classList.remove('dropdown-open');
      const dropdown = item.querySelector('.kb-dropdown');
      if (dropdown) dropdown.style.display = '';
    });
  }
});

// ===== DEALS FILTER =====
const dealsTabs = document.querySelectorAll('.deals-tab');
const dealCards = document.querySelectorAll('.deal-card');

dealsTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    dealsTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const channel = tab.getAttribute('data-channel');
    dealCards.forEach(card => {
      if (channel === 'all' || card.getAttribute('data-channel') === channel) {
        card.classList.remove('hidden');
        card.style.display = '';
      } else {
        card.classList.add('hidden');
        card.style.display = 'none';
      }
    });
  });
});

// ===== SPARKLINE CANVAS =====
function drawSparkline(container, data) {
  const canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 30;
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = canvas.width;
  const h = canvas.height;
  const pad = 3;

  const points = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / range) * (h - pad * 2)
  }));

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, 'rgba(233,30,140,0.6)');
  grad.addColorStop(1, 'rgba(201,169,110,0.8)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dot at end
  const last = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#c9a96e';
  ctx.fill();
}

document.querySelectorAll('.sparkline[data-trend]').forEach(el => {
  const data = el.getAttribute('data-trend').split(',').map(Number);
  drawSparkline(el, data);
});

// ===== AOS =====
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
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

// ===== IMPACT BAR ANIMATION =====
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.setProperty('--score', entry.target.style.getPropertyValue('--score') || '0');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.impact-bar').forEach(bar => barObserver.observe(bar));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 120;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== TICKER DUPLICATE for seamless loop =====
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  const clone = tickerTrack.innerHTML;
  tickerTrack.innerHTML += clone;
}

// ===== BLIND SPOT ROW HOVER EFFECT =====
document.querySelectorAll('.blind-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.style.paddingLeft = '32px';
  });
  row.addEventListener('mouseleave', () => {
    row.style.paddingLeft = '';
  });
});
