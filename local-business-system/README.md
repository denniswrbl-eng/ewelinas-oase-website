# Local Business System

Ein skalierbares System für lokale Dienstleister:
Website + WhatsApp Flow + Chatbot + CRM + Automationen

## Ordnerstruktur

```
local-business-system/
│
├── template/              ← Das Herzstück: wiederverwendbare Website-Engine
│   ├── generate.js        ← Config rein → fertige Site raus
│   ├── base.html          ← HTML-Template mit Platzhaltern
│   ├── styles/            ← CSS (shared across all clients)
│   └── components/        ← Wiederverwendbare HTML-Blöcke
│       ├── nav.html
│       ├── hero.html
│       ├── services.html
│       ├── about.html
│       ├── reviews.html
│       ├── contact.html
│       ├── footer.html
│       └── whatsapp-button.html
│
├── chatbot/               ← Universaler Chatbot (regelbasiert)
│   ├── chatbot-widget.js  ← Das Widget (einbettbar per <script>)
│   ├── chatbot-config.js  ← Config pro Kunde (Fragen, Leistungen)
│   ├── styles.css         ← Chatbot-Styling
│   └── README.md          ← Doku: wie man den Chatbot anpasst
│
├── automations/           ← n8n Workflows (exportiert als JSON)
│   ├── 01-anfrage-speichern.json
│   ├── 02-benachrichtigung.json
│   ├── 03-follow-up.json
│   ├── 04-bewertung.json
│   └── README.md          ← Doku: wie man Workflows importiert
│
├── clients/               ← Ein Ordner pro Kunde
│   ├── _template/         ← Leere Vorlage zum Kopieren
│   │   ├── config.json    ← Alle Kundendaten (leer)
│   │   └── images/        ← Platzhalter für Bilder
│   │       └── .gitkeep
│   └── demo-fusspflege/   ← Dein Demo-Projekt (Mutter)
│       ├── config.json
│       ├── images/
│       └── dist/          ← Generierte Website
│
├── docs/                  ← Dokumentation
│   ├── setup-guide.md     ← Wie man das System aufsetzt
│   ├── neuer-kunde.md     ← Schritt-für-Schritt: neuen Kunden anlegen
│   └── tool-stack.md      ← Welche Tools, warum, wie
│
└── README.md              ← Diese Datei
```

## Quick Start

```bash
# 1. Neuen Kunden anlegen
cp -r clients/_template clients/neuer-kunde
# 2. config.json ausfüllen
# 3. Bilder in images/ legen
# 4. Site generieren
node template/generate.js clients/neuer-kunde/config.json clients/neuer-kunde/dist
```

## Tool-Stack

| Tool | Zweck | Kosten |
|------|-------|--------|
| Claude | Architektur, Review, komplexe Logik | 90€/Monat |
| Ollama + Continue.dev | Lokales Coding in VS Code | Kostenlos |
| Netlify / Cloudflare Pages | Hosting | Kostenlos |
| Airtable | CRM (Kundenanfragen) | Kostenlos (bis 1.000 Einträge) |
| n8n (Self-Hosted) | Automationen | Kostenlos (lokal) / 3,79€ (Hetzner) |
| Formspree | Kontaktformulare | Kostenlos (bis 50/Monat) |
