# Setup Guide: Local Business System

## Voraussetzungen
- Node.js (v18+): https://nodejs.org
- Git: https://git-scm.com
- VS Code + Continue.dev Extension
- Ollama: https://ollama.ai
- Wrangler CLI: `npm install -g wrangler` (Cloudflare Deploy-Tool)

---

## 1. Ollama einrichten (lokale AI)

```powershell
# Ollama installieren (Windows: Download von ollama.ai)
# Dann Modelle laden:
ollama pull qwen2.5-coder:14b    # Hauptmodell zum Coden
ollama pull qwen2.5-coder:7b     # Autocomplete (schneller)
ollama pull deepseek-r1:14b      # Debugging / komplexe Logik
```

### Continue.dev konfigurieren
In VS Code → Continue Extension → config.json:
```json
{
  "models": [
    {
      "model": "qwen2.5-coder:14b",
      "title": "Qwen Coder 14B",
      "provider": "ollama"
    }
  ],
  "tabAutocompleteModel": {
    "model": "qwen2.5-coder:7b",
    "title": "Qwen Autocomplete",
    "provider": "ollama"
  }
}
```

---

## 2. Cloudflare einrichten

### Cloudflare Account
1. Account auf https://dash.cloudflare.com erstellen
2. `npx wrangler login` → bestätigt im Browser

### Projekte erstellen
Pro Kunde ein Cloudflare Pages Projekt:
1. Cloudflare Dashboard → Pages → "Create a project" → "Direct Upload"
2. Projekt-Namen eingeben (z.B. `ewelinasoase`)

### Umgebungsvariablen setzen (für Chatbot + Formular)
In Cloudflare Dashboard → Pages → dein Chatbot-Projekt → Settings → Environment variables:
- `GROQ_API_KEY` → API-Key von https://console.groq.com (für AI-Chatbot)
- `AIRTABLE_TOKEN` → Personal Access Token von Airtable (für Formular-Backend)

---

## 3. Airtable CRM einrichten

Siehe: [docs/airtable-setup.md](airtable-setup.md)

WICHTIG: Alle Felder die per API beschrieben werden (Leistungen, Status, Quelle, Kunde) als "Single line text" anlegen, NICHT als "Single Select"!

---

## 4. Erste Website generieren

```powershell
# Template für neuen Kunden kopieren
Copy-Item -Recurse clients/_template clients/mein-kunde

# config.json ausfüllen (alle Felder!)
# Fonts als .ttf in fonts/ legen (DSGVO: keine Google Fonts extern!)
# Bilder in images/ legen

# Website generieren
node template/generate.js clients/mein-kunde/config.json clients/mein-kunde/dist

# Generiert: index.html, robots.txt, sitemap.xml, CNAME, config.json
```

### Testen
- Öffne `clients/mein-kunde/dist/index.html` im Browser
- Mobile testen: Ctrl+Shift+I → Responsive Mode
- WhatsApp-Buttons testen (Prefill-Text prüfen)
- Kontaktformular testen

---

## 5. Deployment auf Cloudflare Pages

```powershell
# Website deployen
npx wrangler pages deploy clients/mein-kunde/dist --project-name=projektname

# Chatbot deployen (aus dem Chatbot-Repo)
cd C:\Users\denni\AI-Chatbot
npx wrangler pages deploy public --project-name=ewelinas-oase-chatbot
```

**Beim ersten Mal:** Cloudflare-Login im Browser bestätigen.

**Danach:** Custom Domain in Cloudflare Dashboard → Pages → Custom Domains hinzufügen. Domain-DNS muss als CNAME auf `projektname.pages.dev` zeigen.

**WICHTIG:** Cloudflare hat KEINE Git-Verbindung! `git push` allein deployed NICHT. Immer Wrangler nutzen.

---

## 6. End-to-End Test

### Test 1: Formular → Airtable
Im Browser (Ctrl+Shift+I → Console):
```javascript
fetch('https://dein-chatbot-projekt.pages.dev/api/form', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Person',
    email: 'test@example.com',
    phone: '01761234567',
    service: 'Fußpflege (35 €)',
    preferredDate: 'Montag Vormittag',
    clientId: 'ewelinas-oase'
  })
}).then(r => r.json()).then(console.log)
```
→ Sollte `{"success":true,"recordId":"recXXXXX"}` zurückgeben.
→ In Airtable prüfen: neuer Eintrag sollte da sein ✓

### Test 2: Chatbot
1. Website öffnen → Chatbot-Icon unten rechts klicken
2. Quick Reply testen → Antwort sollte kommen
3. Eigene Frage tippen → Antwort prüfen

---

## 7. Chatbot für neuen Kunden einrichten

### AI-Chatbot (mit Groq, kostenlos)
1. In `AI-Chatbot/functions/api/chat.js` → `CLIENTS`-Objekt neues Objekt hinzufügen
2. System-Prompt schreiben (Öffnungszeiten, Leistungen, Tonfall)
3. `allowedOrigins` mit der Kunden-Domain konfigurieren
4. In config.json: `integrations.chatbot.enabled: true`, `version: 2`, `clientId` setzen
5. Chatbot deployen

### Regelbasierter Chatbot (ohne AI, null Kosten)
1. In config.json: `integrations.rulesChatbot.enabled: true`
2. `rules` Array mit Keyword-Antwort-Paaren befüllen
3. Kein Backend nötig – läuft komplett im Browser
4. Website deployen – fertig

---

## Ordnerstruktur
```
local-business-system/
├── template/generate.js        ← Site Generator (config → HTML)
├── clients/
│   ├── _template/config.json   ← Leere Vorlage für neue Kunden
│   ├── demo-fusspflege/        ← Ewelinas Oase (live)
│   ├── demo-friseur/           ← Friseur-Demo
│   └── demo-handwerker/        ← Handwerker-Demo
├── automations/                ← n8n Workflows (optional, für spätere Nutzung)
└── docs/                       ← Diese Dokumentation
```
