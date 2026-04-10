# Neuen Kunden anlegen

## Schritt 1: Ordner kopieren (2 Min)
```bash
cp -r clients/_template clients/firmenname
```

## Schritt 2: config.json ausfüllen (15-30 Min)
Öffne `clients/firmenname/config.json` und fülle aus:
- business: Name, Tagline, URL
- owner: Name, Titel, Zitat
- contact: Telefon, E-Mail, WhatsApp-Nummer
- address: Straße, Stadt, PLZ
- hours: Öffnungszeiten
- theme.colors: Farben anpassen (Tipp: 1 Akzentfarbe + passende Abstufungen)
- hero: Headline, Subtext, Stats
- services: Leistungen, Preise, Beschreibungen
- about: Über-mich-Text
- reviews: Google-Bewertungen kopieren

## Schritt 3: Bilder sammeln (vom Kunden)
Der Kunde liefert:
- hero.jpg (Hauptbild, min. 1200px breit)
- service-main.jpg (Hauptleistung)
- service-1.jpg, service-2.jpg, service-3.jpg (Galerie)

Bilder in `clients/firmenname/images/` legen.

## Schritt 4: Site generieren (1 Min)
```bash
node template/generate.js clients/firmenname/config.json clients/firmenname/dist
```

## Schritt 5: Testen
- `clients/firmenname/dist/index.html` im Browser öffnen
- Mobile testen (Chrome DevTools → Responsive)
- WhatsApp-Button testen
- Kontaktformular testen

## Schritt 6: Deployen
```bash
# Netlify
netlify deploy --dir=clients/firmenname/dist --prod

# Oder Cloudflare Pages
# Push dist/ Ordner zu GitHub → Cloudflare verbinden
```

## Schritt 7: Automationen einrichten (wenn gebucht)
1. Airtable: Neue Base für den Kunden erstellen
2. n8n: Workflows klonen und Variablen anpassen
3. Testen: Testanfrage senden → prüfen ob alles ankommt

## Zeitaufwand pro Kunde
| Schritt | Zeit |
|---------|------|
| Config ausfüllen | 15-30 Min |
| Bilder einpflegen | 10 Min |
| Generieren + Testen | 15 Min |
| Deployen | 5 Min |
| Automationen (optional) | 30-45 Min |
| **Gesamt (OnePager)** | **ca. 1-1,5 Std** |
| **Gesamt (mit Automationen)** | **ca. 2-2,5 Std** |
