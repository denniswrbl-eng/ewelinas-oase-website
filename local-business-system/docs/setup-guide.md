# Setup Guide: Local Business System

## Voraussetzungen
- Node.js (v18+): https://nodejs.org
- Docker Desktop: https://docker.com/products/docker-desktop
- Git: https://git-scm.com
- VS Code + Continue.dev Extension
- Ollama: https://ollama.ai

---

## 1. Ollama einrichten (lokale AI)

```bash
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

## 2. Docker + n8n installieren

### Docker Desktop starten
1. Docker Desktop installieren + starten
2. Prüfen: `docker --version` → sollte Version zeigen

### n8n mit Docker starten
```bash
# Ordner für n8n-Daten erstellen
mkdir -p ~/n8n-data

# n8n starten (bleibt laufen)
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/n8n-data:/home/node/.n8n \
  -e GENERIC_TIMEZONE="Europe/Berlin" \
  -e TZ="Europe/Berlin" \
  --restart unless-stopped \
  n8nio/n8n
```

3. Browser öffnen: **http://localhost:5678**
4. Account erstellen (lokal, nur für dich)

### n8n-Umgebungsvariablen setzen
In Docker → n8n Container → Environment:
```
AIRTABLE_BASE_ID=appXXXXXXXXXXXX
OWNER_WHATSAPP=49176XXXXXXXX
GOOGLE_REVIEW_URL=https://g.page/r/XXXXXXXXX/review
CALLMEBOT_API_KEY=XXXXXXX
```

Oder beim Docker-Start mitgeben:
```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/n8n-data:/home/node/.n8n \
  -e GENERIC_TIMEZONE="Europe/Berlin" \
  -e TZ="Europe/Berlin" \
  -e AIRTABLE_BASE_ID="appXXXXXXXXXXXX" \
  -e OWNER_WHATSAPP="49176XXXXXXXX" \
  --restart unless-stopped \
  n8nio/n8n
```

---

## 3. Workflows importieren

1. n8n öffnen → Hamburger-Menü → **Import from File**
2. Nacheinander importieren:
   - `automations/01-anfrage-speichern.json`
   - `automations/02-benachrichtigung.json`
   - `automations/03-follow-up.json`
   - `automations/04-bewertung.json`

3. In jedem Workflow: **Credentials anpassen!**
   - Airtable: Personal Access Token eintragen
   - SMTP: E-Mail-Server eintragen (oder Gmail SMTP)

---

## 4. Airtable einrichten

Siehe: [docs/airtable-setup.md](airtable-setup.md)

---

## 5. Erste Website generieren

```bash
# Template für neuen Kunden kopieren
cp -r clients/_template clients/mein-kunde

# config.json ausfüllen (alle Felder!)
# Bilder in images/ legen

# Website generieren
node template/generate.js clients/mein-kunde/config.json clients/mein-kunde/dist

# Testen
# Öffne clients/mein-kunde/dist/index.html im Browser
```

## 5b. Deployment auf Cloudflare Pages

```powershell
# In den dist-Ordner wechseln
cd clients/mein-kunde/dist

# Auf Cloudflare Pages deployen (Projekt muss vorher existieren)
npx wrangler pages deploy . --project-name=projektname

# Beim ersten Mal: Cloudflare-Login im Browser bestätigen
# Danach: Custom Domain in Cloudflare Dashboard → Pages → Custom Domains hinzufügen
```

**Wichtig:** Domain-DNS muss als CNAME auf `projektname.pages.dev` zeigen.

---

## 6. End-to-End Test

So testest du die komplette Kette:

### Test 1: Formular → Airtable
1. n8n Workflow `01-anfrage-speichern` aktivieren
2. Webhook-URL kopieren (z.B. `http://localhost:5678/webhook/anfrage`)
3. Im Terminal testen:

**PowerShell (Windows):**
```powershell
Invoke-RestMethod -Uri "http://localhost:5678/webhook/anfrage" -Method POST -ContentType "application/json" -Body '{"name":"Test Person","email":"test@example.com","phone":"01761234567","message":"Das ist ein Testformular"}'
```

**Bash (Linux/Mac):**
```bash
curl -X POST http://localhost:5678/webhook/anfrage \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Person","email":"test@example.com","phone":"01761234567","message":"Das ist ein Testformular"}'
```
4. In Airtable prüfen → neuer Eintrag sollte da sein ✓

### Test 2: Benachrichtigung
1. Workflow `02-benachrichtigung` aktivieren
2. Gleicher Test wie oben, aber an `/webhook/notify`
3. E-Mail / WhatsApp vom Inhaber prüfen ✓

---

## 7. Für Produktion (wenn Kunden kommen)

### Hetzner VPS (3,79€/Monat)
```bash
# Auf dem Server:
apt update && apt install docker.io docker-compose -y

# docker-compose.yml erstellen:
```

```yaml
version: "3"
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    volumes:
      - ./n8n-data:/home/node/.n8n
    environment:
      - GENERIC_TIMEZONE=Europe/Berlin
      - N8N_HOST=n8n.deine-agentur.de
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.deine-agentur.de/
    restart: unless-stopped

  caddy:
    image: caddy:2
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    restart: unless-stopped

volumes:
  caddy_data:
```

### Caddyfile (automatisches HTTPS)
```
n8n.deine-agentur.de {
    reverse_proxy n8n:5678
}
```

→ Damit hast du n8n online mit automatischem SSL für ca. 3,79€/Monat.
