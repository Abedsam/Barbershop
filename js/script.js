document.getElementById('year').textContent = new Date().getFullYear();

/* Hero image zoom-out on scroll */
const heroSection = document.querySelector('.hero');
const heroBg = document.getElementById('hero-bg');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroSection && heroBg && !prefersReducedMotion) {
  const MAX_SCALE = 1.18;
  const MIN_SCALE = 1.0;
  let ticking = false;

  function updateHeroZoom() {
    const heroHeight = heroSection.offsetHeight;
    const progress = Math.min(Math.max(-heroSection.getBoundingClientRect().top / heroHeight, 0), 1);
    const scale = MAX_SCALE - progress * (MAX_SCALE - MIN_SCALE);
    heroBg.style.transform = `scale(${scale})`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeroZoom);
      ticking = true;
    }
  }, { passive: true });

  updateHeroZoom();
}

/* Scroll reveal for sections */
if (!prefersReducedMotion) {
  const revealTargets = document.querySelectorAll(
    '.about-item, .section-eyebrow, .section > .container > h2, .section-lead, ' +
    '.price-tabs, .price-panel, .booking-form, .booking-card, .hours-table, ' +
    '.stars-big, .map-embed, .map-info'
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 90}ms`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));
}

/* Mobile nav toggle */
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
navToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => header.classList.remove('nav-open'));
});

/* Price tabs */
const priceTabs = document.querySelectorAll('.price-tab');
const pricePanels = document.querySelectorAll('.price-panel');
priceTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    priceTabs.forEach(t => t.classList.remove('active'));
    pricePanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

/* Opening hours: 0 = Sunday ... 6 = Saturday */
const HOURS = {
  0: null,
  1: [9, 19],
  2: [9, 19],
  3: [9, 19],
  4: [9, 19],
  5: [9, 19],
  6: [10, 18],
};
const DAY_LABEL = {
  0: 'Sonntag', 1: 'Montag', 2: 'Dienstag', 3: 'Mittwoch',
  4: 'Donnerstag', 5: 'Freitag', 6: 'Samstag'
};

function updateStatus() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const todayRange = HOURS[day];

  const statusBadge = document.getElementById('status-badge');
  const statusText = document.getElementById('status-text');
  const todayHours = document.getElementById('today-hours');

  let isOpen = false;
  let todayLabel = 'Geschlossen';

  if (todayRange) {
    todayLabel = `${String(todayRange[0]).padStart(2, '0')}:00 – ${String(todayRange[1]).padStart(2, '0')}:00`;
    isOpen = hour >= todayRange[0] && hour < todayRange[1];
  }
  todayHours.textContent = todayLabel;

  if (isOpen) {
    statusBadge.classList.add('open');
    statusBadge.classList.remove('closed');
    statusText.textContent = `Geöffnet · Schließt um ${String(todayRange[1]).padStart(2, '0')}:00 Uhr`;
  } else {
    statusBadge.classList.add('closed');
    statusBadge.classList.remove('open');

    let nextDay = day;
    let hops = 0;
    let opensToday = false;
    if (todayRange && hour < todayRange[0]) {
      opensToday = true;
    } else {
      do {
        nextDay = (nextDay + 1) % 7;
        hops++;
      } while (!HOURS[nextDay] && hops < 7);
    }

    if (opensToday) {
      statusText.textContent = `Geschlossen · Öffnet heute um ${String(todayRange[0]).padStart(2, '0')}:00 Uhr`;
    } else {
      const range = HOURS[nextDay];
      statusText.textContent = `Geschlossen · Öffnet ${DAY_LABEL[nextDay]} um ${String(range[0]).padStart(2, '0')}:00 Uhr`;
    }
  }

  document.querySelectorAll('#hours-table tr').forEach(row => {
    row.classList.toggle('today', Number(row.dataset.day) === day);
  });
}
updateStatus();

/* Booking form -> WhatsApp */
const bookingForm = document.getElementById('booking-form');
const SALON_WHATSAPP = '4917631154715';

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('b-name').value.trim();
  const phone = document.getElementById('b-phone').value.trim();
  const service = document.getElementById('b-service').value;
  const date = document.getElementById('b-date').value;
  const time = document.getElementById('b-time').value;
  const message = document.getElementById('b-message').value.trim();

  const dateFormatted = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';

  const lines = [
    'Terminanfrage – Alster Friseur',
    `Name: ${name}`,
    `Telefon: ${phone}`,
    `Leistung: ${service}`,
    `Wunschtermin: ${dateFormatted} um ${time} Uhr`,
  ];
  if (message) lines.push(`Nachricht: ${message}`);

  const text = encodeURIComponent(lines.join('\n'));
  window.open(`https://wa.me/${SALON_WHATSAPP}?text=${text}`, '_blank', 'noopener');
});
