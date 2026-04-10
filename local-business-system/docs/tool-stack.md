# Tool-Stack

## Aktuell (Lernphase) – 90€/Monat

| Tool | Zweck | Kosten |
|------|-------|--------|
| Claude Max | Strategie, Review, komplexe Logik | 90€/Mo |
| VS Code + Continue.dev | Code-Editor mit AI | Kostenlos |
| Ollama (Qwen2.5-Coder 14B) | Lokales Coding | Kostenlos |
| Git / GitHub | Versionskontrolle | Kostenlos |
| Cloudflare Pages | Hosting (unbegrenzt) | Kostenlos |
| Airtable Free | CRM (bis 1.000 Records) | Kostenlos |
| Docker + n8n (lokal) | Automationen | Kostenlos |
| Cloudflare Workers | Chatbot Backend | Kostenlos |
| Groq API (LLaMA 3.3 70B) | LLM für Chatbot | Kostenlos |

## Mit Kunden – ca. 103€/Monat + Domains

| Tool | Zweck | Kosten |
|------|-------|--------|
| Alles oben | – | 90€/Mo |
| Hetzner VPS (CX22) | n8n online 24/7 | 3,79€/Mo |
| Eigene Domain | deine-agentur.de | ~10€/Jahr |
| lexoffice | Buchhaltung + Rechnungen | 7,90€/Mo |
| Domain pro Kunde | kunden-seite.de | ~10€/Jahr |

## Warum Cloudflare statt Netlify?
- Unbegrenzte Bandbreite (Netlify: 100GB/Mo)
- Schnelleres globales CDN
- Kostenlose Analytics
- Cloudflare Workers (für spätere API-Logik)
- Kein Vendor-Lock-In

## Warum n8n statt Zapier/Make?
- Self-hosted = keine monatlichen Kosten
- Unbegrenzte Workflows
- Volle Kontrolle über Daten (DSGVO!)
- Faire Preise falls doch Cloud (24€/Mo)
- Zapier wäre 20-50€/Mo für gleiche Funktionalität

## Warum Groq statt OpenAI für Chatbot?
- Kostenlos (Rate-Limited, reicht für lokale Dienstleister)
- Extrem schnelle Inferenz (LPU statt GPU)
- LLaMA 3.3 70B = gute Qualität auf Deutsch
- Kein API-Key-Kosten bis zu einem gewissen Traffic
- OpenAI wäre 20-50€/Mo für gleichen Use Case

## Warum Airtable statt Google Sheets?
- Echte Datenbank (Feldtypen, Validierung)
- Views = verschiedene Ansichten derselben Daten
- Formulare direkt einbaubar
- API = einfache n8n-Integration
- Google Sheets API = Fummelei
