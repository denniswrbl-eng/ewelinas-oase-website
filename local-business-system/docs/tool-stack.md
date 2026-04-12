# Tool-Stack

## Aktuell (Lernphase) – 90€/Monat

| Tool | Zweck | Kosten |
|------|-------|--------|
| Claude Max | Strategie, Review, komplexe Logik | 90€/Mo |
| VS Code + Continue.dev | Code-Editor mit AI | Kostenlos |
| Ollama (Qwen2.5-Coder 14B) | Lokales Coding | Kostenlos |
| Ollama DeepSeek-R1 14B | Debugging | Kostenlos |
| RTX 3060 12GB | GPU für lokale AI | Hardware |
| Git / GitHub | Versionskontrolle | Kostenlos |
| Cloudflare Pages | Hosting (unbegrenzt) | Kostenlos |
| Cloudflare Pages Functions | Chatbot + Formular Backend | Kostenlos |
| Groq API (LLaMA 3.3 70B) | LLM für AI-Chatbot | Kostenlos |
| Airtable Free | CRM (bis 1.000 Records) | Kostenlos |

## Mit Kunden – ca. 98€/Monat + Domains

| Tool | Zweck | Kosten |
|------|-------|--------|
| Alles oben | – | 90€/Mo |
| Eigene Domain | deine-agentur.de | ~10€/Jahr |
| lexoffice | Buchhaltung + Rechnungen | 7,90€/Mo |
| Domain pro Kunde | kunden-seite.de | ~10€/Jahr |

**Hinweis:** Kein VPS nötig! Cloudflare Pages Functions ersetzt n8n für Formular-Verarbeitung und Chatbot. Alles serverless, alles kostenlos.

## Warum Cloudflare statt Netlify?
- Unbegrenzte Bandbreite (Netlify: 100GB/Mo)
- Schnelleres globales CDN
- Pages Functions = serverless Backend (Chatbot, Formulare)
- Kostenlose Analytics
- Kein Vendor-Lock-In

## Warum Groq statt OpenAI für Chatbot?
- Kostenlos (Rate-Limited, reicht für lokale Dienstleister)
- Extrem schnelle Inferenz (LPU statt GPU)
- LLaMA 3.3 70B = gute Qualität auf Deutsch
- Kein API-Key-Kosten bis zu einem gewissen Traffic
- OpenAI wäre 20-50€/Mo für gleichen Use Case
- Alternative: Regelbasierter Chatbot (null Kosten, kein AI nötig)

## Warum Airtable statt Google Sheets?
- Echte Datenbank (Feldtypen, Validierung)
- Views = verschiedene Ansichten derselben Daten
- API = direkte Integration mit Cloudflare Worker
- Google Sheets API = Fummelei

## Deploy-Workflow
- Website: `npx wrangler pages deploy . --project-name=projektname`
- Chatbot: `npx wrangler pages deploy public --project-name=chatbot-projektname`
- WICHTIG: Cloudflare hat keine Git-Verbindung! `git push` allein deployed NICHT.
