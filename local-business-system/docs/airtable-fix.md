# Airtable: Select-Felder auf Text umstellen

## Problem
Die API kann keine Werte in Select-Felder schreiben, die nicht als Option existieren.
Dadurch werden Leistungen, Status, Quelle und Kunde beim Formular-Submit nicht gespeichert.

## Lösung (2 Minuten)

1. Geh zu https://airtable.com und öffne die Base "Local Business CRM"
2. Öffne die Tabelle "Anfragen"
3. Für JEDES dieser Felder:
   - **Leistungen**
   - **Status**
   - **Quelle**
   - **Kunde**

   Mach Folgendes:
   - Klick auf den Feldnamen (Spaltenüberschrift)
   - Wähle "Customize field type"
   - Ändere von "Single select" auf **"Single line text"**
   - Klick "Save"

4. Teste: Schicke eine Anfrage über das Formular auf ewelinas-oase.de
5. Prüfe in Airtable ob alle Felder befüllt sind

## Warum?
Single-Select-Felder blockieren API-Writes wenn der Wert nicht als Option vordefiniert ist.
Single-Line-Text akzeptiert alles — flexibler und API-freundlich.
