# Laptop Setup Guide — HP 17-cn0217ng (Café-Edition)

> **Dein Laptop:** Intel Pentium Silver N5030, 8GB RAM, 512GB SSD, Windows 10/11
> **Regel:** Kein Docker, kein Ollama auf diesem Gerät. Schwere Sachen → Desktop (RTX 3060).

---

## Schritt 1: Git installieren

**Was:** Versionskontrolle — damit du Code zwischen Laptop, Desktop und GitHub synchronisierst.

**Download:** https://git-scm.com/download/win

**Installation:**
1. Installer starten
2. Alle Defaults lassen, AUSSER:
   - "Default editor" → wähle **VS Code** (statt Vim)
   - "Adjusting PATH" → wähle **"Git from the command line and also from 3rd-party software"**
3. Fertig → Neustart nicht nötig

**Testen:**
```
Windows-Taste → "PowerShell" → Enter
git --version
```
Erwartet: `git version 2.xx.x`

**Direkt konfigurieren:**
```
git config --global user.name "Dennis"
git config --global user.email "dennis.wrbl@gmail.com"
```

---

## Schritt 2: Node.js installieren

**Was:** JavaScript-Runtime — damit `generate.js` läuft und du Websites generieren kannst.

**Download:** https://nodejs.org → **LTS Version** (der grüne Button links)

**Installation:**
1. Installer starten
2. Alle Defaults lassen
3. Bei "Tools for Native Modules" → **NEIN** (brauchen wir nicht, spart Zeit)

**Testen:**
```
node --version
npm --version
```
Erwartet: `v20.x.x` und `10.x.x` (oder höher)

---

## Schritt 3: VS Code installieren

**Was:** Dein Code-Editor.

**Download:** https://code.visualstudio.com

**Installation:** Defaults lassen. Danach diese Extensions installieren:
1. Öffne VS Code
2. Strg+Shift+X (Extensions)
3. Suche und installiere:
   - **Continue** (für AI-Coding, wenn du Ollama vom Desktop remote nutzen willst)
   - **German Language Pack** (optional)
   - **Live Server** (damit du generierte Websites sofort im Browser siehst)

---

## Schritt 4: Repo klonen

**Was:** Dein Projekt von GitHub auf den Laptop holen.

```
cd C:\Users\Home\Desktop
git clone https://github.com/DEIN-USERNAME/DEIN-REPO-NAME.git
```

Falls du dein Repo noch nicht auf GitHub hast, kannst du es jetzt pushen:
```
cd "C:\Users\Home\Desktop\Ewelina Oase Final"
git remote add origin https://github.com/DEIN-USERNAME/DEIN-REPO-NAME.git
git push -u origin main
```

---

## Schritt 5: generate.js testen

```
cd "C:\Users\Home\Desktop\Ewelina Oase Final\local-business-system"
node template/generate.js clients/demo-fusspflege/config.json dist/ewelina
```

Dann `dist/ewelina/index.html` im Browser öffnen (oder mit Live Server in VS Code).

---

## Was du unterwegs im Café machen kannst

### ✅ Geht auf dem Laptop

- **Configs bearbeiten** — neue Kunden-Configs erstellen, bestehende anpassen
- **generate.js weiterentwickeln** — Template verbessern, neue Sections einbauen
- **Websites generieren & testen** — `node generate.js` + Browser
- **Chatbot-Widget bauen** — reines HTML/CSS/JS, braucht keine Server
- **Docs schreiben** — Setup-Guides, Kunden-Onboarding-Dokumente
- **Git arbeiten** — commits, pushes, neue Branches
- **n8n Workflow-JSONs bearbeiten** — die JSON-Dateien anpassen (testen erst am Desktop)
- **Airtable im Browser** — Base anlegen, Felder konfigurieren (braucht nur WLAN)
- **Claude Max im Browser** — Strategie, Code-Review, Planung

### ❌ Geht NICHT auf dem Laptop

- Docker / n8n starten — zu wenig RAM
- Ollama / lokale LLMs — keine GPU, zu wenig RAM
- E2E Tests mit Webhook — braucht laufendes n8n
- Hetzner Deployment — machst du am Desktop

---

## Empfohlene Café-Aufgaben (priorisiert)

### 1. Airtable Base anlegen (Browser)
Geh auf https://airtable.com und erstelle eine Base "Kundenanfragen" mit diesen Feldern:

| Feldname            | Typ              | Notiz                        |
|---------------------|------------------|------------------------------|
| Name                | Single line text | Pflicht                      |
| Email               | Email            |                              |
| Telefon             | Phone number     |                              |
| Leistung            | Single select    | Optionen aus config.json     |
| Wunschtermin        | Single line text |                              |
| Status              | Single select    | Neu / Kontaktiert / Erledigt |
| Quelle              | Single select    | Website-Formular / WhatsApp  |
| Kunde (Business)    | Single line text | z.B. "Ewelinas Oase"        |
| Bewertung angefragt?| Checkbox         |                              |
| Erstellt am         | Created time     | Automatisch                  |

### 2. Neue Kunden-Config erstellen
Kopiere `clients/_template/config.json` → neuer Ordner, fülle aus, generiere mit `node generate.js`.

### 3. WhatsApp-Prefill Links testen
Öffne im Browser:
```
https://wa.me/4917631562454?text=Hallo%2C%20ich%20m%C3%B6chte%20einen%20Termin%20buchen.%0AName%3A%20%0ALeistung%3A%20Fu%C3%9Fpflege%20(35%E2%82%AC)%0AWunschtermin%3A%20
```
Prüfe ob die Nachricht korrekt vorausgefüllt ist.

---

## Desktop-Aufgaben (wenn du zuhause bist)

1. Docker Desktop installieren
2. n8n starten: `docker run -it --rm -p 5678:5678 n8nio/n8n`
3. Workflow `01-anfrage-komplett.json` importieren
4. Airtable Token + Base-ID als Environment Variables setzen
5. E2E Test: Generierte Website → Formular → n8n → Airtable
