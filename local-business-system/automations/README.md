# n8n Automationen

## Übersicht

| Workflow | Trigger | Was passiert? |
|----------|---------|---------------|
| 01-anfrage-speichern | Webhook (POST) | Formular-Daten → Airtable speichern |
| 02-benachrichtigung | Webhook (POST) | Email + WhatsApp an Inhaber |
| 03-follow-up | Schedule (alle 6h) | Erinnerung wenn Anfrage >24h unbeantwortet |
| 04-bewertung | Schedule (täglich) | Google-Bewertung anfragen 7 Tage nach Termin |

## So funktioniert der Flow

```
Kunde füllt Formular aus
        ↓
  Webhook empfängt Daten
        ↓
  → Airtable: Anfrage gespeichert (Status: "Neu")
  → Email + WhatsApp: Inhaber wird benachrichtigt
        ↓
  Inhaber kontaktiert Kunden → Status: "Kontaktiert"
        ↓
  Termin gebucht → Status: "Termin gebucht"
        ↓
  Termin erledigt → Status: "Erledigt"
        ↓
  7 Tage später: WhatsApp → "Bitte Bewertung abgeben"
```

## Importieren
1. n8n öffnen (http://localhost:5678)
2. Menü → Import from File
3. JSON-Datei auswählen
4. Credentials anpassen (Airtable Token etc.)
5. Aktivieren

## Anpassen pro Kunde
- `AIRTABLE_BASE_ID` → Base-ID des Kunden
- `OWNER_WHATSAPP` → WhatsApp-Nummer des Inhabers
- `GOOGLE_REVIEW_URL` → Google-Bewertungslink des Kunden
- Leistungen in Formular-Optionen anpassen

## Für Website-Integration
Das Kontaktformular muss an den n8n-Webhook senden:

```javascript
// Im generate.js wird das Formular so angebunden:
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.source = 'Website-Formular';
  data.client = 'KUNDENNAME';

  await fetch('https://n8n.deine-agentur.de/webhook/anfrage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
});
```
