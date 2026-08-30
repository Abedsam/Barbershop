# Alster Friseur – Website

Statische Website für den Friseursalon **Alster Friseur** (Fehlandtstraße 43, 20354 Hamburg). Kein Build-Schritt nötig – reines HTML/CSS/JS.

## Lokal öffnen

Einfach `index.html` im Browser öffnen, oder für sauberes Routing der iframe-Karte einen lokalen Server starten:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Struktur

- `index.html` – Startseite (Hero, Leistungen/Preisliste, Terminbuchung, Öffnungszeiten, Rezensionen, Standort)
- `impressum.html`, `datenschutz.html` – rechtliche Pflichtseiten (Platzhalter, siehe TODOs)
- `css/style.css` – Styles inkl. Scroll-Animationen
- `js/script.js` – Öffnungsstatus-Logik, Preis-Tabs, WhatsApp-Buchung, Scroll-/Zoom-Animationen
- `images/hero.jpg` – **Platz für das Hero-Foto** (Salon-Innenaufnahme), muss noch ergänzt werden

## Terminbuchung

Das Buchungsformular öffnet WhatsApp (`wa.me/4917631154715`) mit einer vorausgefüllten Nachricht – es gibt aktuell kein Backend/Datenbank. Für eine echte Kalenderbuchung mit Verfügbarkeitsprüfung müsste ein Dienst wie Fresha, Calendly o. ä. angebunden werden.

## Offene TODOs vor dem Live-Gang

- [ ] Echtes Hero-Foto unter `images/hero.jpg` ablegen (Format: quer, mind. 1600px breit)
- [ ] Preisliste in `index.html` (Abschnitt „Leistungen") gegen die tatsächliche Preisliste im Salon prüfen – wurde von einem Foto abgetippt, Lesbarkeit durch Spiegelungen teils eingeschränkt
- [ ] `impressum.html`: echten Namen/Rechtsform des Inhabers, E-Mail-Adresse, ggf. USt-ID eintragen
- [ ] `datenschutz.html`: bei Bedarf juristisch prüfen lassen
- [ ] Domain & Hosting einrichten (z. B. Netlify, Vercel, GitHub Pages – da rein statisch, überall einfach deploybar)
