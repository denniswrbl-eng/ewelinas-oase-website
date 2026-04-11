# CLAUDE.md – Persistentes Gedächtnis für Dennis ("Big D")
> Letzte Aktualisierung: 2026-04-11 (Session 4 – Full Audit + Critical Fixes)

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
- **Chatbot:** Cloudflare Pages Functions (Projekt: `ewelinas-oase-chatbot`, Repo: `denniswrbl-eng/ewelinas-oase-chatbot`)
- **Domain:** Bei IONOS, DNS CNAME www → ewelinasoase.pages.dev
- **Google Search Console:** Verifiziert (HTML-Datei-Methode), Sitemap eingereicht, Seite indexiert
- **Google Business Profile:** Existiert bereits (5.0★, 4 Bewertungen)
- **Status:** Live – DSGVO, Maps-Consent, Honeypot, SEO, Chatbot v2 multi-tenant, Fonts lokal (DSGVO-fix)
- **Formular:** Aktuell WhatsApp-Fallback (kein VPS/n8n), Formulardaten werden als WhatsApp-Prefill geöffnet
- **Altes Netlify-Deployment:** `glowing-kataifi-ed4931.netlify.app` – war noch als Script-Tag in index.html, ENTFERNT in Session 4. Netlify-Projekt kann gelöscht werden.

## Projekt-Struktur (`Ewelina Oase Final/local-business-system/`)
```
template/generate.js           – Config-driven Site Generator (JSON → HTML), v2 mit Chatbot-Config
clients/demo-fusspflege/        – config.json für Ewelinas Oase (v2 mit WhatsApp-Flow + Chatbot v2)
clients/demo-friseur/           – config.json für Friseur-Demo (v2)
clients/demo-handwerker/        – config.json für Elektro Schuster, Bochum (v2)
clients/_template/              – Leere Vorlage für neue Kunden
automations/01-anfrage-speichern.json   – Formular → Airtable
automations/01-anfrage-komplett.json    – Erweiterte Version
automations/02-benachrichtigung.json    – Email + WhatsApp an Inhaber
automations/03-follow-up.json          – Erinnerung nach 24h
automations/04-bewertung.json          – Google-Bewertung nach 7 Tagen
docs/airtable-setup.md         – Airtable CRM Setup-Anleitung
docs/setup-guide.md            – Komplett-Guide (Docker, n8n, Hetzner, Cloudflare Deploy)
docs/laptop-setup-guide.md     – Lokale Entwicklungsumgebung
docs/tool-stack.md              – Alle Tools + Kosten (inkl. Groq/Workers, ohne Formspree)
docs/neuer-kunde.md             – Onboarding-Workflow
chatbot/                        – (leer, Chatbot ist im separaten Repo)
dist/                           – Generierter Output (deployed auf Cloudflare)
dist/google12ae90ebd971bd23.html – Google Search Console Verification (NICHT LÖSCHEN)
```

## Chatbot-Repo (`AI-Chatbot/` bzw. `denniswrbl-eng/ewelinas-oase-chatbot`)
```
functions/api/chat.js           – Multi-Tenant Backend v2 (CLIENTS-Objekt pro Kunde)
public/chatbot-widget.js        – Widget v1 (alt, hardcoded für Ewelinas Oase)
public/chatbot-widget-v2.js     – Widget v2 (config-basiert, window.WRBL_CHAT_CONFIG)
chatbot-widget-v2.js            – Source des v2 Widgets
test-widget-v2.html             – Lokale Testseite für v2
wrangler.toml                   – Cloudflare Pages Config
```

### Chatbot v2 Architektur
- **Widget**: Liest `window.WRBL_CHAT_CONFIG` → Farben, Texte, Quick Replies, API-URL, Client-ID
- **Backend**: Empfängt `clientId` im Request, lädt den passenden System-Prompt aus `CLIENTS`-Objekt
- **Neuer Kunde hinzufügen**: (1) neues Objekt in `CLIENTS` in chat.js, (2) `chatbot`-Block in config.json
- **CORS**: Dynamisch pro Client (allowedOrigins im CLIENTS-Objekt)
- **Token-Sparen**: Max 20 Nachrichten History, temperature 0.7
- **System-Prompt**: Kein Nagellack (bietet Mutter nicht an), medizinische Fragen → Arzt verweisen
- **"Powered by WRBL Digital"** Footer im Widget
- **DSGVO**: Widget lädt KEINE Google Fonts mehr extern (seit Session 4), nutzt Font der Host-Seite

## Tool-Stack
| Tool | Zweck | Kosten |
|------|-------|--------|
| Claude Max | Strategie, Review, komplexe Logik | 90EUR/Mo |
| VS Code + Continue.dev | Code-Editor mit AI | Kostenlos |
| Ollama Qwen2.5-Coder 14B | Lokales Coding | Kostenlos |
| Ollama DeepSeek-R1 14B | Debugging | Kostenlos |
| RTX 3060 12GB | GPU für lokale AI | Hardware |
| Cloudflare Pages | Hosting pro Kunde | Kostenlos |
| Cloudflare Pages Functions | Chatbot Backend (multi-tenant) | Kostenlos |
| Groq API (LLaMA 3.3 70B) | LLM für Chatbot | Kostenlos |
| Airtable Free | CRM (bis 1.000 Records) | Kostenlos |
| Docker + n8n (lokal) | Automationen | Kostenlos |
| GitHub | Versionskontrolle | Kostenlos |

## Pricing-Modell
- OnePager: 499EUR + 49EUR/Mo
- High-End Website: 1.299EUR + 79EUR/Mo
- Automationen als Extras separat verkaufbar

## GitHub Repos
- `denniswrbl-eng/ewelinas-oase-website` – Hauptwebsite + Template-System
- `denniswrbl-eng/ewelinas-oase-chatbot` – Chatbot v2 (Multi-Tenant Backend + Widget)

## Template-System (config.json v2)
Die `_template/config.json` enthält jetzt ALLES was pro Kunde nötig ist:
- Business-Daten, Kontakt, Öffnungszeiten, Farben/Fonts
- Leistungen mit Beschreibung + Preisen
- **WhatsApp-Flow**: Pro Leistung eine eigene Prefill-Nachricht (in `services.whatsappFlow[]`)
- **Chatbot v2**: apiUrl, clientId, greeting, subtitle, quickReplies (in `integrations.chatbot`)
- **Email-Templates**: Benachrichtigung, Follow-Up (24h), Bewertungsanfrage (7 Tage)
- **Onboarding-Status**: neu → in-arbeit → review → live
- Jedes Feld hat `_help` Erklärungen
- generate.js rendert WhatsApp-Flow-Buttons + Chatbot-Config automatisch
- **3 Branchen-Templates beweisen Skalierbarkeit**: Fußpflege, Friseur, Handwerker

## Sales-Material (erstellt, NICHT veröffentlichen)
- `wrbl-digital-onepager.pdf` – Agentur One-Pager (Problem, Lösung, Case Study, Pricing)
- `wrbl-digital-pitchdeck.pptx` – 7-Slide Pitch Deck
- `wrbl-digital-landingpage.html` – Agentur-Landingpage (Entwurf)
- `seo-audit-ewelinas-oase.html` – SEO-Audit Report (On-Page A, Technical A, Content C, Backlinks D)

## Was in den Cowork-Sessions gebaut wurde (09.-10.04.2026)

### Session 1 (09.04.)
- generate.js massiv erweitert: Leistungen-Redesign, DSGVO-Datenschutz komplett neu (9 Abschnitte), Impressum mit Kleinunternehmerregelung, Google Maps Click-to-Load Consent, Honeypot Spam-Schutz, SEO (og:image, geo-tags, lazy loading, alt-texte), rel="noopener noreferrer" auf externen Links
- Chatbot CORS-Fix: Whitelist statt Wildcard (nur ewelinas-oase.de erlaubt)
- DSGVO-Nachweise.txt erstellt (AVV/DPA Dokumentation)
- Bilder optimiert (PNG → JPEG, 690KB → 574KB)

### Session 2 (10.04.)
- WhatsApp-Flow v2 deployed (Prefill-Buttons pro Leistung)
- Friseur-Demo Template (config.json v2)
- Handwerker-Demo Template (Elektro Schuster, Bochum – komplett andere Branche)
- Docs aktualisiert (Formspree raus, Groq/Workers rein, PowerShell-Befehle)
- PDF One-Pager + PPTX Pitch Deck erstellt
- SEO-Audit durchgeführt (HTML-Report)
- Google Search Console eingerichtet (HTML-Datei-Verifikation, Sitemap eingereicht)
- Google Business Profile entdeckt (existierte bereits, 5.0★)
- **Chatbot Komplett-Upgrade v2:**
  - Widget config-basiert (window.WRBL_CHAT_CONFIG)
  - Backend multi-tenant (CLIENTS-Objekt, clientId im Request)
  - System-Prompt verbessert (Nagellack raus, klarere Regeln)
  - "Powered by WRBL Digital" Footer
  - Alles deployed und live
- Git: Beide Repos committed + gepusht

### Session 3 (10.04. Nacht)
- **Chatbot v2 Backend fertig deployed:**
  - Multi-Tenant `CLIENTS`-Objekt in chat.js (neuer Kunde = neues Objekt)
  - System-Prompt komplett überarbeitet: Nagellack entfernt, klare Regeln (kein Erfinden, med. Fragen → Arzt)
  - `clientId` im Request für Client-Routing
  - Token-Limit: max 20 Nachrichten History + temperature 0.7
  - CORS dynamisch pro Client (allowedOrigins im CLIENTS-Objekt)
- **Chatbot v2 Widget fertig deployed:**
  - `window.WRBL_CHAT_CONFIG` steuert alles (Farben, Texte, Quick Replies, API-URL, Client-ID)
  - CSS-Prefix von "eo-" zu "wrbl-" geändert
  - "Powered by WRBL Digital" Footer
  - Mobile Fullscreen <480px
  - `chatbot-widget-v2.js` in public/ + als Source
  - `test-widget-v2.html` für lokales Testen
- **generate.js: Chatbot v2 Integration**
  - Rendert automatisch `window.WRBL_CHAT_CONFIG` Block aus config.json
  - Farben werden aus `theme.colors` übernommen (terra → primary, brown → primaryHover)
  - Font aus `theme.fonts.body`
  - Backward-compatible: v1 Widgets funktionieren weiter (kein Config-Block wenn version != 2)
- **config.json (demo-fusspflege) erweitert:**
  - `integrations.chatbot` jetzt mit version:2, apiUrl, clientId, greeting, subtitle, quickReplies
- **Git-Probleme gelöst:**
  - GitHub Push Protection blockierte wegen `.claude/settings.local.json` (OAuth Token)
  - Fix: `git reset --soft HEAD~2`, .claude/ in .gitignore, sauber neu committed
  - `.wrangler/cache/` ebenfalls in .gitignore (Cloudflare-Credentials)
- **Cloudflare-Projekt "ewelinasoas" gelöscht** (versehentlich erstelltes Duplikat)
- Git: Beide Repos committed + gepusht (sauber, keine Secrets)

## Bekannte Probleme / Offene Punkte
1. **ewelinas-oase.de (ohne www) funktioniert nicht** – IONOS erlaubt keinen CNAME auf Root-Domain, Nameserver-Wechsel zu Cloudflare hat nicht geklappt
2. **n8n läuft nur lokal** – Formular nutzt jetzt WhatsApp-Fallback statt n8n-Webhook; Hetzner VPS nötig für echte Automationen (aber erst kurz vor Gewerbeanmeldung)
3. **Airtable Base noch nicht angelegt** – Nur Docs, kein echtes Setup
4. **Chatbot: Kein Rate Limiting** – `/api/chat` kann gespammt werden, keine Input-Validierung (Nachrichtenlänge), kein Prompt-Injection-Schutz
5. **Chatbot Widget: XSS-Risiko** – `cfg.greeting` und `cfg.business.short` werden als innerHTML gerendert, nicht escaped
6. **index.html und generate.js sind out of sync** – Live-Seite wurde manuell editiert, weicht vom Template-Output ab. Sollte neu generiert werden.
7. **Bewertungen sind statisch** – "vor 4 Mon." veraltet nie, hardcoded im HTML
8. **Regelbasierter Chatbot** – Alternative zum AI-Chatbot als günstigere Option noch nicht gebaut
9. **Netlify-Projekt noch aktiv** – `glowing-kataifi-ed4931.netlify.app` existiert noch, Script-Tag ist entfernt, Projekt kann im Dashboard gelöscht werden

### Erledigte Punkte (aus alter Liste)
- ~~Chatbot-Widget nicht standalone~~ → v2 ist jetzt config-basiert und universal
- ~~Formspree noch in Docs referenziert~~ → Docs aktualisiert
- ~~WhatsApp-Flow fehlt~~ → v2 mit Prefill-Buttons live
- ~~Multi-Tenant Chatbot~~ → Backend v2 mit CLIENTS-Objekt
- ~~Canonical-Tag falsch~~ → Gefixt auf www.ewelinas-oase.de, deployed + gepusht
- ~~Versehentlich erstelltes Cloudflare-Projekt "ewelinasoas"~~ → Gelöscht in Session 3
- ~~Netlify-Script in index.html~~ → Entfernt in Session 4
- ~~Chatbot v1 statt v2 auf Live-Seite~~ → v2 mit WRBL_CHAT_CONFIG in Session 4
- ~~Kontaktformular kaputt (localhost:5678)~~ → WhatsApp-Fallback in Session 4
- ~~Nagellack-Widerspruch (Website vs. Chatbot)~~ → Überall entfernt in Session 4
- ~~Google Fonts extern geladen (DSGVO-Risiko)~~ → Fonts lokal via @font-face in Session 4
- ~~Canonical/og:url auf ewelinas-oase.de statt www~~ → Alle URLs auf www gefixt in Session 4
- ~~Samstag Öffnungszeiten Schema-Widerspruch~~ → Schema korrigiert in Session 4
- ~~.gitignore UTF-16 Encoding~~ → Neugeschrieben als UTF-8, .netlify/ hinzugefügt in Session 4

### Session 4 (11.04. – Full Audit + Critical Fixes)
- **Full Project Audit durchgeführt:** Code, Security, DSGVO, SEO, Business, Architektur – komplett
- **Gesamtbewertung: 6/10** – optisch gut, technisch an mehreren Stellen kaputt/inkonsistent
- **7 kritische Fixes umgesetzt:**
  1. Netlify-Skript entfernt (`glowing-kataifi-ed4931.netlify.app/widget.js` – altes Deployment, Sicherheitsrisiko)
  2. Chatbot v1 → v2 auf Live-Seite (mit `WRBL_CHAT_CONFIG` Block)
  3. Kontaktformular: `localhost:5678` → WhatsApp-Deeplink-Fallback (Formulardaten als WhatsApp-Prefill)
  4. Nagellack-Widerspruch bereinigt: Website, config.json, dist/, Chatbot public/index.html – überall entfernt
  5. Canonical URL + og:url + og:image + Schema.org + sitemap.xml + robots.txt → alle auf `www.ewelinas-oase.de`
  6. Google Fonts: extern (fonts.googleapis.com) → lokal via @font-face (DSGVO-Fix, .ttf-Dateien waren schon da)
  7. Chatbot Widget v2: Google Fonts Loading entfernt, nutzt Font der Host-Seite
- **Bonus-Fixes:**
  - Samstag Schema-Öffnungszeiten korrigiert (14:00 → 20:00 mit Vereinbarungs-Hinweis)
  - `.gitignore` von UTF-16 auf UTF-8 neugeschrieben, `.netlify/` hinzugefügt
  - Chatbot public/index.html: "Nagellack +7€" → "Inkl. Fußbad, Peeling, Massage"
- **Noch nicht gefixt (benötigt weitere Arbeit):**
  - Chatbot Rate Limiting + Input-Validation + Prompt-Injection-Schutz
  - Widget XSS (innerHTML statt textContent für Config-Werte)
  - index.html ↔ generate.js Sync (Live-Seite manuell editiert, weicht vom Generator ab)
  - CSS-Variablen kryptisch (--c, --t etc.) → sprechende Namen
  - Keine Favicon-Datei

## Langfrist-Vision
- Mehrere Branchen-Templates (Fußpflege ✅, Friseur ✅, Handwerker ✅, Kosmetik, Gastro...)
- Kunden-Onboarding automatisiert (Fragebogen → Config → Website)
- Multi-Tenant Chatbot ✅ (1 Worker für alle Kunden)
- Eventuell SaaS-Richtung
- Agentur-Landingpage veröffentlichen (nach Gewerbeanmeldung)

## Wichtige Pfade (Windows)
- Website-Repo: `C:\Users\denni\Ewelina Oase Final\`
- Chatbot-Repo: `C:\Users\denni\AI-Chatbot\`
- `.gitignore` Website-Repo enthält: `.claude/`, `.wrangler/`, `.netlify/`, `dist-friseur/`, `dist-handwerker/`
- `.gitignore` Chatbot-Repo enthält: `.claude/`, `.wrangler/`

## Regeln für Claude
- Deutsch sprechen, direkt und ehrlich sein
- Kein Sugarcoating – wenn was schlecht ist, sagen
- Immer erklären WARUM etwas besser ist
- Dennis ist Anfänger – Befehle Schritt für Schritt geben
- Bei PowerShell-Befehlen: einzeln, nicht als Block
- Dennis tippt oft mit Tippfehlern – das ist normal, einfach verstehen
- Nicht zu viel auf einmal – ein Schritt nach dem anderen
- Bei Git: Aufpassen dass keine Secrets (.claude/, .wrangler/) committed werden
- GitHub hat Push Protection aktiv – Tokens/Secrets werden automatisch blockiert
