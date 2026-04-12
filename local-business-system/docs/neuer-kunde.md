# Neuen Kunden anlegen

## Schritt 1: Ordner kopieren (2 Min)
```powershell
Copy-Item -Recurse clients/_template clients/firmenname
```

## Schritt 2: config.json ausfüllen (15-30 Min)
Öffne `clients/firmenname/config.json` und fülle aus:
- business: Name, Tagline, URL, Domain
- owner: Name, Titel, Zitat
- contact: Telefon, E-Mail, WhatsApp-Nummer, formApiUrl (Cloudflare Worker URL)
- address: Straße, Stadt, PLZ, mapEmbed (Google Maps Embed-URL)
- hours: Öffnungszeiten (display + schema für SEO)
- theme.colors: Farben anpassen (1 Akzentfarbe + passende Abstufungen)
- hero: Headline, Subtext, Stats
- services: Leistungen, Preise, Beschreibungen, WhatsApp-Flow Prefill-Nachrichten
- about: Über-mich-Text, Perks
- reviews: Google-Bewertungen mit echtem Datum (YYYY-MM-DD, wird automatisch zu "vor X Mon." berechnet)
- legal: Inhabername, Firmenname, USt-ID (null = Kleinunternehmer §19 UStG)
- integrations.chatbot: AI-Chatbot Config (version 2, clientId, quickReplies)
- integrations.rulesChatbot: Regelbasierter Chatbot (optional, kein AI, keine Kosten)

## Schritt 3: Fonts bereitstellen
Lade die Fonts als .ttf Dateien herunter und lege sie in `clients/firmenname/fonts/`:
- Heading-Font: z.B. `cormorant-garamond-300.ttf`, `cormorant-garamond-300-italic.ttf`
- Body-Font: z.B. `jost-300.ttf`, `jost-400.ttf`, `jost-500.ttf`

WICHTIG: Keine Google Fonts extern laden (DSGVO)! Immer lokal einbinden.

## Schritt 4: Bilder sammeln (vom Kunden)
Der Kunde liefert:
- hero.jpg (Hauptbild, min. 1200px breit)
- service-main.jpg (Hauptleistung)
- service-1.jpg, service-2.jpg, service-3.jpg (Galerie)
- Optional: favicon.svg (wird sonst automatisch generiert)

Bilder in `clients/firmenname/images/` legen.

## Schritt 5: Site generieren (1 Min)
```powershell
node template/generate.js clients/firmenname/config.json clients/firmenname/dist
```

Generiert automatisch: index.html, robots.txt, sitemap.xml, CNAME

## Schritt 6: Testen
- `clients/firmenname/dist/index.html` im Browser öffnen
- Mobile testen (Ctrl+Shift+I → Responsive)
- WhatsApp-Buttons testen (Prefill-Text prüfen)
- Kontaktformular testen (prüfen ob Daten in Airtable ankommen)
- Chatbot testen (falls aktiviert)

## Schritt 7: Deployen
```powershell
npx wrangler pages deploy clients/firmenname/dist --project-name=projektname
```

WICHTIG: Cloudflare hat KEINE Git-Verbindung! `git push` allein deployed NICHT. Immer Wrangler nutzen.

## Schritt 8: Chatbot einrichten (wenn gebucht)
1. Neues Client-Objekt in `AI-Chatbot/functions/api/chat.js` → `CLIENTS` hinzufügen
2. System-Prompt für den Kunden schreiben
3. `allowedOrigins` mit der Kunden-Domain konfigurieren
4. Chatbot deployen: `npx wrangler pages deploy public --project-name=ewelinas-oase-chatbot`

Für regelbasierten Chatbot (kein AI): Nur `rulesChatbot` in config.json konfigurieren, kein Backend nötig.

## Schritt 9: Airtable CRM einrichten
1. Neue Tabelle in Airtable Base anlegen (oder bestehende nutzen)
2. Felder: Name, Email, Telefon, Leistungen, Wunschtermin, Status, Quelle, Kunde
3. WICHTIG: Alle Felder als "Single line text" anlegen (nicht Single Select!)
4. Table-ID und Base-ID in `form.js` → `CLIENTS`-Objekt eintragen
5. `AIRTABLE_TOKEN` als verschlüsselte Variable in Cloudflare Dashboard

## Zeitaufwand pro Kunde
| Schritt | Zeit |
|---------|------|
| Config ausfüllen | 15-30 Min |
| Fonts + Bilder einpflegen | 10-15 Min |
| Generieren + Testen | 15 Min |
| Deployen (Wrangler) | 5 Min |
| Chatbot einrichten (optional) | 15-30 Min |
| Airtable CRM (optional) | 15 Min |
| **Gesamt (OnePager)** | **ca. 1-1,5 Std** |
| **Gesamt (mit Chatbot + CRM)** | **ca. 2-2,5 Std** |
