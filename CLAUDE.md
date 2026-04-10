# CLAUDE.md – Persistentes Gedächtnis für Dennis ("Big D")
> Letzte Aktualisierung: 2026-04-10

## Wer ist Dennis?
- Solo-Gründer, aktuell krankgeschrieben (Krankengeld, mentale Belastung), reine Lernphase
- Kein Gewerbe aktiv, keine Kunden – Belege als vorweggenommene Betriebsausgaben
- WICHTIG: Nichts öffentlich machen solange krankgeschrieben – Kunden erst nach Gründungszuschuss
- Agentur-Landingpage darf gebaut werden, aber NICHT veröffentlichen bis Gewerbe angemeldet
- Anfänger/Vibe-Coder – arbeitet mit AI-Tools und lernt dabei
- Will eine skalierbare AI Web- & Automations-Agentur für lokale Dienstleister in DE aufbauen
- Kommunikationsstil: Deutsch, direkt, kein Bullshit
- Will ständig verbessert werden – ehrliches Feedback, Challenge ihn, zeig bessere Wege

## Demo-Projekt: Ewelinas Oase
- **URL:** www.ewelinas-oase.de (live seit 10.04.2026)
- **Was:** Fußpflege-Salon der Mutter in Hamm
- **Hosting:** Cloudflare Pages (Projekt: `ewelinasoase`)
- **Chatbot:** Cloudflare Workers (Projekt: `ewelinas-oase-chatbot`, Repo: `denniswrbl-eng/ewelinas-oase-chatbot`)
- **Domain:** Bei IONOS, DNS CNAME www → ewelinasoase.pages.dev
- **Status:** Alles live – DSGVO, Maps-Consent, Honeypot, SEO, Chatbot CORS-Fix

## Projekt-Struktur (`Ewelina Oase Final/local-business-system/`)
```
template/generate.js          – Config-driven Site Generator (JSON → HTML)
clients/demo-fusspflege/       – config.json für Ewelinas Oase
clients/demo-friseur/          – config.json für Friseur-Demo
clients/_template/             – Leere Vorlage für neue Kunden
automations/01-anfrage-speichern.json   – Formular → Airtable
automations/01-anfrage-komplett.json    – Erweiterte Version
automations/02-benachrichtigung.json    – Email + WhatsApp an Inhaber
automations/03-follow-up.json          – Erinnerung nach 24h
automations/04-bewertung.json          – Google-Bewertung nach 7 Tagen
docs/airtable-setup.md        – Airtable CRM Setup-Anleitung
docs/setup-guide.md           – Komplett-Guide (Docker, n8n, Hetzner)
docs/laptop-setup-guide.md    – Lokale Entwicklungsumgebung
docs/tool-stack.md             – Alle Tools + Kosten
docs/neuer-kunde.md            – Onboarding-Workflow
chatbot/                       – (noch leer, Chatbot ist im separaten Repo)
dist/                          – Generierter Output (deployed auf Cloudflare)
```

## Tool-Stack
| Tool | Zweck | Kosten |
|------|-------|--------|
| Claude Max | Strategie, Review, komplexe Logik | 90EUR/Mo |
| VS Code + Continue.dev | Code-Editor mit AI | Kostenlos |
| Ollama Qwen2.5-Coder 14B | Lokales Coding | Kostenlos |
| Ollama DeepSeek-R1 14B | Debugging | Kostenlos |
| RTX 3060 12GB | GPU für lokale AI | Hardware |
| Cloudflare Pages | Hosting pro Kunde | Kostenlos |
| Cloudflare Workers | Chatbot Backend | Kostenlos |
| Groq API (LLaMA 3.3 70B) | LLM für Chatbot | Kostenlos |
| Airtable Free | CRM (bis 1.000 Records) | Kostenlos |
| Docker + n8n (lokal) | Automationen | Kostenlos |
| GitHub | Versionskontrolle | Kostenlos |

## Pricing-Modell
- OnePager: 499EUR + 49EUR/Mo
- High-End Website: 1.299EUR + 79EUR/Mo
- Automationen als Extras separat verkaufbar

## GitHub Repos
- `denniswrbl-eng/ewelinas-oase-website` – Hauptwebsite
- `denniswrbl-eng/ewelinas-oase-chatbot` – Chatbot (Cloudflare Workers)

## Template-System (config.json v2)
Die `_template/config.json` enthält jetzt ALLES was pro Kunde nötig ist:
- Business-Daten, Kontakt, Öffnungszeiten, Farben/Fonts
- Leistungen mit Beschreibung + Preisen
- **WhatsApp-Flow**: Pro Leistung eine eigene Prefill-Nachricht (in `services.whatsappFlow[]`)
- **Email-Templates**: Benachrichtigung, Follow-Up (24h), Bewertungsanfrage (7 Tage)
- **Onboarding-Status**: neu → in-arbeit → review → live
- Jedes Feld hat `_help` Erklärungen
- generate.js rendert WhatsApp-Flow-Buttons automatisch unter den Leistungen
- Agentur-Landingpage liegt als `wrbl-digital-landingpage.html` (Entwurf, NICHT veröffentlichen)

## Was in der Cowork-Session gebaut wurde (09.-10.04.2026)
- generate.js massiv erweitert: Leistungen-Redesign, DSGVO-Datenschutz komplett neu (9 Abschnitte), Impressum mit Kleinunternehmerregelung, Google Maps Click-to-Load Consent, Honeypot Spam-Schutz, SEO (og:image, geo-tags, lazy loading, alt-texte), rel="noopener noreferrer" auf externen Links
- Chatbot CORS-Fix: Whitelist statt Wildcard (nur ewelinas-oase.de erlaubt)
- DSGVO-Nachweise.txt erstellt (AVV/DPA Dokumentation)
- Bilder optimiert (PNG → JPEG, 690KB → 574KB)
- Alles deployed und live

## Bekannte Probleme / Offene Punkte
1. **ewelinas-oase.de (ohne www) funktioniert nicht** – IONOS erlaubt keinen CNAME auf Root-Domain, Nameserver-Wechsel zu Cloudflare hat nicht geklappt
2. **n8n läuft nur lokal** – Kontaktformular funktioniert nur wenn Dennis' PC an ist → Hetzner VPS nötig (aber erst kurz vor Gewerbeanmeldung, nicht jetzt)
3. **Chatbot-Widget nicht standalone** – Aktuell als externes Script von pages.dev geladen
4. **Formspree noch in Docs referenziert** – generate.js sendet bereits an n8n Webhook, aber Docs sind veraltet
5. **Airtable Base noch nicht angelegt** – Nur Docs, kein echtes Setup
6. **End-to-End Test steht aus** – Website → Formular → n8n → Airtable → Benachrichtigung
7. **WhatsApp-Flow fehlt** – Strukturierte Prefill-Nachrichten pro Leistung
8. **Regelbasierter Chatbot** – Alternative zum AI-Chatbot als günstigere Option noch nicht gebaut

## Langfrist-Vision
- Mehrere Branchen-Templates (Fußpflege, Friseur, Handwerker, Kosmetik...)
- Kunden-Onboarding automatisiert (Fragebogen → Config → Website)
- Multi-Tenant Chatbot (1 Worker für alle Kunden)
- Eventuell SaaS-Richtung

## Regeln für Claude
- Deutsch sprechen, direkt und ehrlich sein
- Kein Sugarcoating – wenn was schlecht ist, sagen
- Immer erklären WARUM etwas besser ist
- Dennis ist Anfänger – Befehle Schritt für Schritt geben
- Bei PowerShell-Befehlen: einzeln, nicht als Block
- Dennis tippt oft mit Tippfehlern – das ist normal, einfach verstehen
- Nicht zu viel auf einmal – ein Schritt nach dem anderen
