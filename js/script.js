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

/* Video scrub: video position follows scroll progress through its section */
const scrubSection = document.getElementById('salon-video');
const scrubVideo = document.getElementById('scrub-video');

if (scrubSection && scrubVideo && !prefersReducedMotion) {
  let duration = 0;
  scrubVideo.addEventListener('loadedmetadata', () => { duration = scrubVideo.duration; });
  scrubVideo.pause();

  function unlockVideo() {
    scrubVideo.play().then(() => scrubVideo.pause()).catch(() => {});
  }
  window.addEventListener('touchstart', unlockVideo, { passive: true, once: true });
  window.addEventListener('scroll', unlockVideo, { passive: true, once: true });

  let scrubTicking = false;
  function updateScrub() {
    const rect = scrubSection.getBoundingClientRect();
    const total = scrubSection.offsetHeight - window.innerHeight;
    const progress = Math.min(Math.max(-rect.top / total, 0), 1);
    if (duration) {
      scrubVideo.currentTime = progress * duration;
    }
    scrubTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrubTicking) {
      requestAnimationFrame(updateScrub);
      scrubTicking = true;
    }
  }, { passive: true });
  updateScrub();
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
function updateStatus() {
  const now = new Date();
  const day = now.getDay();
  const todayRange = HOURS[day];

  const todayHours = document.getElementById('today-hours');
  if (todayHours) {
    const todayLabel = todayRange
      ? `${String(todayRange[0]).padStart(2, '0')}:00 – ${String(todayRange[1]).padStart(2, '0')}:00`
      : 'Geschlossen';
    todayHours.textContent = todayLabel;
  }

  document.querySelectorAll('#hours-table tr').forEach(row => {
    row.classList.toggle('today', Number(row.dataset.day) === day);
  });
}
updateStatus();

/* Google reviews marquee */
const REVIEWS = [
  { name: "Masiha Raoufi", sub: "11 Rezensionen · 13 Fotos", time: "vor 4 Monaten", text: "Absolutely obsessed with my new cut and color! Gamze at Alster Frisuer totally understood what I wanted and made it even better." },
  { name: "ARWM", sub: "Local Guide · 50 Rezensionen · 12 Fotos", time: "vor 5 Monaten", text: "Freundliche Friseure und eine faire Preisgestaltung für die Lage. Teilweise muss man mit 10-20 Minuten Wartezeit trotz Termin rechnen. Komme allerdings immer wieder gerne zum Haareschneiden." },
  { name: "Tanja", sub: "Local Guide · 334 Rezensionen · 1.143 Fotos", time: "vor 3 Jahren", text: "Sehr freundliches Personal, war sehr zufrieden. Die Friseurin, die mir meine Haare geschnitten hat, war ruhig, konzentriert und voll sympathisch. Danke ;-) Preis war überraschend günstig: 38€ für Waschen/Schneiden/Föhnen (Angebot)." },
  { name: "noura zafaranchy", sub: "4 Rezensionen", time: "vor 3 Monaten", text: "Der beste Friseur, wo ich je war. Ich habe pechschwarze Haare und es ist super schwer, gute Strähnen zu machen – aber hier war's echt mega 😍" },
  { name: "Thomas", sub: "2 Rezensionen", time: "vor 2 Jahren", text: "Super Friseur, gehe seit 1 Jahr regelmäßig dahin und bin jedes Mal mehr als zufrieden. Man merkt richtig, dass es die Leidenschaft vom Chef ist. Er nimmt sich Zeit, um alles perfekt zu schneiden. Wenn ich könnte, würde ich mehr als nur 5 Sterne geben." },
  { name: "Thomas Venus", sub: "6 Rezensionen", time: "vor einem Jahr", text: "Morgens angerufen und mittags direkt einen Termin bekommen. Der Laden war voll und ich bin trotzdem direkt drangekommen. Guter Haarschnitt und nettes Team." },
  { name: "Sebastian B", sub: "Local Guide · 34 Rezensionen · 22 Fotos", time: "vor 2 Jahren", text: "Ich war seit langem auf der Suche nach einem guten Frisör. Ich denke, dass ich ihn endlich gefunden habe. Schnell, freundlich, kompetent, unkompliziert und der Preis von 20€ für einen Herrenhaarschnitt ist absolut unschlagbar. Man bekommt sogar einen Tee angeboten." },
  { name: "Benedict Bühler", sub: "Local Guide · 9 Rezensionen · 19 Fotos", time: "vor 3 Jahren", text: "Ich bin letzte Woche spontan vorbeigelaufen, ich kam direkt ohne Wartezeit dran. Das Endergebnis ist klasse geworden, ich werde auf jeden Fall wieder hingehen. Leistung ist top und der Preis geht voll klar." },
  { name: "primrose09", sub: "Local Guide · 19 Rezensionen · 10 Fotos", time: "vor 3 Jahren", text: "Habe spontan einen Termin bekommen, eine ungefähre Vorstellung geäußert und der Haarschnitt ist super geworden. Wahnsinns Preis-Leistungsverhältnis und sehr netter Service. Gerne wieder." },
  { name: "Mashhood Sattari", sub: "3 Rezensionen", time: "vor 2 Jahren", text: "I had an amazing experience with Gamze. They truly are a master of their craft and brought their own creative vision to the table. I've never felt more confident and beautiful after a haircut. Five stars aren't enough!" },
  { name: "Leander Rosado", sub: "Local Guide · 119 Rezensionen", time: "vor 4 Jahren", text: "Das erste Mal dort gewesen, nachdem ich spontan am selben Tag noch einen Termin bekommen habe. Sehr netter Friseur, sehr gutes Ergebnis, top Preis/Leistung. Komme definitiv wieder." },
  { name: "Nese Akyol", sub: "2 Rezensionen", time: "vor 3 Jahren", text: "Auf Instagram entdeckt, aus Lübeck hergefahren – der Weg hat sich gelohnt. Super Beratung, hat 100 Prozent rausgeholt, was leider ein anderer Friseur ruiniert hatte. Kann ich nur empfehlen." },
  { name: "S. waldmann", sub: "Local Guide · 80 Rezensionen · 17 Fotos", time: "vor 7 Monaten", text: "Sehr freundliches Personal und nette Atmosphäre." },
  { name: "KStudy", sub: "6 Rezensionen · 4 Fotos", time: "vor 3 Jahren", text: "Bin beim Vorbeigehen auf den liebevoll eingerichteten Friseur in den Hamburger Kolonnaden aufmerksam geworden. Sehr freundliches Personal und sehr saubere Ausführung des Haarschnitts. Ich komme sehr gern wieder!" },
  { name: "Do Mi", sub: "1 Rezension", time: "vor 3 Jahren", text: "Ich war heute für einen Herrenhaarschnitt dort. Das Ergebnis ist perfekt geworden und das Ambiente ist super. Werde auf jeden Fall wieder kommen!" },
  { name: "Taner akbas", sub: "Local Guide · 22 Rezensionen · 18 Fotos", time: "vor 2 Jahren", text: "Ich bin sehr zufrieden mit der Arbeit des Friseurs und der Preis ist auch super fair. Er hat sich viel Zeit für mich genommen und sehr viel Mühe gegeben." },
  { name: "Yigal Bloch", sub: "Local Guide · 44 Rezensionen · 5 Fotos", time: "vor 3 Jahren", text: "I went here 4 times already and always got a quick appointment around lunch time. My hair looks neat again. Can recommend!" },
  { name: "Tim S.", sub: "4 Rezensionen", time: "vor 4 Jahren", text: "Super Friseur. Sehr zuvorkommend und freundlich. Bin mit dem Resultat sehr zufrieden. Preis-Leistung absolut unschlagbar in der Region Gänsemarkt. Komme sehr sicher wieder!" },
  { name: "Petra", sub: "5 Rezensionen", time: "vor 2 Jahren", text: "Super nett und tolle Leute ❤️ ich bin aus Bayern im Urlaub in Hamburg und bin gleich drangekommen 🥰 vielen lieben Dank fürs Haare glätten, ich komme immer wieder gerne wenn ich hier bin." },
  { name: "Lea Garling", sub: "1 Rezension", time: "vor 3 Jahren", text: "Ein rundum guter Service. Man erreicht den Salon gut mit öffentlichen Verkehrsmitteln, wird mit leckerem Kaffee versorgt und die Qualität der Arbeit ist tip top. Ich habe mich durchgehend wohlgefühlt." },
  { name: "Jonathan Bahlsen", sub: "Local Guide · 30 Rezensionen · 6 Fotos", time: "vor 4 Jahren", text: "Die Friseure sind sehr zuvorkommend und sind stets bemüht, die Kundenwünsche umzusetzen. Außerdem ist der Laden mit den öffentlichen Verkehrsmitteln sehr gut zu erreichen." },
  { name: "Tobi", sub: "Local Guide · 38 Rezensionen · 19 Fotos", time: "vor 3 Jahren", text: "Mein neuer Stamm-Friseur! Super Haarschnitt und super Preis-Leistung!! Kann ich nur jedem empfehlen 😊" },
  { name: "M H", sub: "Local Guide · 954 Rezensionen · 783 Fotos", time: "vor 10 Monaten", text: "Sehr nettes und hilfsbereites Personal. Top Preis-Leistung." },
  { name: "Joris Jim", sub: "11 Rezensionen · 2 Fotos", time: "vor 3 Jahren", text: "Wie immer super geschnitten!! Bin jetzt zum 5.-6. Mal dagewesen und ich kann diesen Friseur nur weiterempfehlen." },
  { name: "Mohammed Test", sub: "2 Rezensionen", time: "vor 3 Jahren", text: "Super Friseur, sehr zuvorkommend, einem wird immer ein Café oder Tee angeboten, man kann sehr schöne Gespräche führen und man fühlt sich einfach sehr wohl." },
  { name: "Piet Overdiek", sub: "2 Rezensionen", time: "vor 3 Jahren", text: "Sehr nettes Personal und sehr guter Haarschnitt! Lohnt sich, hierhin zu kommen!" },
  { name: "Bjarne Hansen", sub: "7 Rezensionen", time: "vor einem Jahr", text: "Ich war bis jetzt zwei Mal da und werde wiederkommen. Man wird verstanden und auf Nachfrage bekommt man auch super Empfehlungen und Vorschläge." },
  { name: "Max's Reiseführer", sub: "Local Guide · 39 Rezensionen · 25 Fotos", time: "vor 3 Jahren", text: "Ich bin sehr zufrieden mit dem Service. Super Preis-Leistungsverhältnis. Kann ich echt nur empfehlen!" },
  { name: "Sascha Wesely", sub: "4 Rezensionen", time: "vor 4 Jahren", text: "Sehr zuvorkommend, super Preis-Leistungsverhältnis, hervorragendes Ergebnis. Gerne jederzeit wieder." },
  { name: "Rene Hagen", sub: "Local Guide · 32 Rezensionen · 15 Fotos", time: "vor 4 Jahren", text: "Absolut Spitzenklasse! Kompetent, freundlich, sauber, bezahlbar und zufriedenstellend. Komme gern wieder." },
  { name: "Tobi L.", sub: "Local Guide · 45 Rezensionen · 73 Fotos", time: "vor 3 Jahren", text: "Sofort drangekommen & gut geschnitten. Kartenzahlung ist kein Problem." },
  { name: "bambam bambam", sub: "3 Rezensionen", time: "vor 3 Jahren", text: "Nettes Personal, guter Haarschnitt. 10/10, alle vorbeikommen, ab geht's." },
  { name: "Katinka Magnussen", sub: "4 Rezensionen", time: "vor 9 Monaten", text: "Alle Daumen hoch! Vielen Dank ;-)" },
];

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const reviewsTrack = document.getElementById('reviews-track');
if (reviewsTrack) {
  const starsHtml = '<i class="fa-solid fa-star"></i>'.repeat(5);
  const cardsHtml = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-card-head">
        <div class="review-avatar" aria-hidden="true">${initials(r.name)}</div>
        <div class="review-meta">
          <span class="review-name">${escapeHtml(r.name)}</span>
          <span class="review-sub">${escapeHtml(r.sub)}</span>
        </div>
      </div>
      <div class="review-stars" aria-hidden="true">${starsHtml}</div>
      <p class="review-text">${escapeHtml(r.text)}</p>
      <span class="review-time">${escapeHtml(r.time)}</span>
    </div>
  `).join('');
  reviewsTrack.innerHTML = cardsHtml + cardsHtml;
}

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
