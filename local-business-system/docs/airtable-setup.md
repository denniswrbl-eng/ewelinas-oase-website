# Airtable CRM Setup

## Base erstellen
Name: `Kundenanfragen` (eine Base pro Kunde ODER eine Base mit Views pro Kunde)

## Empfehlung: EINE Base für alle Kunden
Spart Platz im Free-Plan (max 1.000 Records pro Base).
Wenn du 10+ Kunden hast → separate Bases.

---

## Tabelle 1: Anfragen

| Feldname | Typ | Optionen / Beschreibung |
|----------|-----|------------------------|
| Datum | Date | Format: DD.MM.YYYY, Default: heute |
| Name | Single line text | Name des Anfragenden |
| Telefon | Phone number | |
| Email | Email | |
| Leistung | Single select | *Pro Kunde anpassen!* z.B. "Fußpflege Basis", "Maniküre", "Nagelpflege" |
| Wunschtermin | Single line text | Freitext (Kunden schreiben "nächste Woche" etc.) |
| Status | Single select | `Neu` (gelb), `Kontaktiert` (blau), `Termin gebucht` (grün), `Erledigt` (grau), `Abgesagt` (rot) |
| Quelle | Single select | `Website-Formular`, `WhatsApp`, `Chatbot`, `Telefon`, `Sonstige` |
| Kunde (Business) | Single select | z.B. "Ewelinas Oase", "Salon Bella" – filtert nach Kunde |
| Notiz | Long text | Freitext für interne Notizen |
| WhatsApp gesendet? | Checkbox | Haken wenn Bestätigung raus ist |
| Erstellt am | Created time | Automatisch |

## Views erstellen

1. **Alle Anfragen** – Grid View, sortiert nach Datum (neueste oben)
2. **Offene Anfragen** – Filter: Status = "Neu" ODER "Kontaktiert"
3. **Pro Kunde** – Filter: Kunde = "Ewelinas Oase" (eine View pro Kunde)
4. **Diese Woche** – Filter: Datum = this week

## Tabelle 2: Kunden-Übersicht (optional)

| Feldname | Typ | Beschreibung |
|----------|-----|-------------|
| Business Name | Single line text | z.B. "Ewelinas Oase" |
| Inhaber | Single line text | |
| Telefon | Phone number | |
| Email | Email | |
| Website | URL | |
| Paket | Single select | `OnePager`, `High-End`, `System` |
| Monatlich (€) | Currency | Recurring Revenue |
| Status | Single select | `Aktiv`, `Setup`, `Pausiert`, `Gekündigt` |
| Start-Datum | Date | |
| Notizen | Long text | |

---

## Setup-Schritte (5 Minuten)

1. **airtable.com** → "Add a base" → "Start from scratch"
2. Name: `Kundenanfragen`
3. Erste Tabelle umbenennen → `Anfragen`
4. Felder nach obiger Tabelle anlegen
5. Views erstellen (links oben → "+ Add view")
6. **API Key holen**: Account → Developer Hub → Personal Access Token erstellen
   - Scope: `data.records:read`, `data.records:write`
   - Diesen Token brauchst du für n8n!

## Wichtig für n8n-Integration
Du brauchst:
- **Personal Access Token** (nicht den alten API Key!)
- **Base ID**: Steht in der URL wenn du die Base öffnest (`appXXXXXXXXXXXXXX`)
- **Table Name**: `Anfragen`
