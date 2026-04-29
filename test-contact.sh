#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# test-contact.sh — lokale curl-Tests gegen `wrangler pages dev`
#
# Voraussetzung (in einem zweiten Terminal starten):
#   cd "Ewelina Oase Final"
#   npx wrangler pages dev . --port 8788
#
# Env-Vars in .dev.vars setzen (siehe .dev.vars.example).
# Dann in diesem Terminal:
#   chmod +x test-contact.sh
#   ./test-contact.sh
#
# Erwartung:
#   Case 1 (valid)     → HTTP 200, {"ok":true, ...}
#   Case 2 (honeypot)  → HTTP 200, {"ok":true}   (silent success)
#   Case 3 (no consent)→ HTTP 400, {"ok":false, "error":"validation_failed", "fields":["consent"]}
#   Case 4 (bad email) → HTTP 400, {"ok":false, "error":"validation_failed", "fields":["email"]}
# ---------------------------------------------------------------------------

set -u

URL="${URL:-http://localhost:8788/api/contact}"
ORIGIN="${ORIGIN:-http://localhost:8788}"

# Farben (nur wenn tty)
if [ -t 1 ]; then
  G="\033[0;32m"; R="\033[0;31m"; Y="\033[0;33m"; N="\033[0m"
else
  G=""; R=""; Y=""; N=""
fi

pass=0
fail=0

assert_status() {
  local expect="$1"
  local got="$2"
  local name="$3"
  if [ "$got" = "$expect" ]; then
    echo -e "  ${G}PASS${N}  HTTP $got"
    pass=$((pass+1))
  else
    echo -e "  ${R}FAIL${N}  erwartet HTTP $expect, bekam $got"
    fail=$((fail+1))
  fi
}

run_case() {
  local name="$1"
  local payload="$2"
  local expect="$3"

  echo -e "${Y}» $name${N}"
  # -s silent, -o body-file, -w status
  local body_file
  body_file="$(mktemp)"
  local code
  code=$(curl -s -o "$body_file" -w "%{http_code}" \
    -X POST "$URL" \
    -H "Origin: $ORIGIN" \
    -H "Content-Type: application/json" \
    --data "$payload")
  echo "  Body: $(cat "$body_file")"
  assert_status "$expect" "$code" "$name"
  rm -f "$body_file"
  echo
}

# ---------------------------------------------------------------------------
# Case 1 — Valid Submit
# ---------------------------------------------------------------------------
read -r -d '' P1 <<'JSON' || true
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "phone": "015112345678",
  "service": "Maniküre",
  "preferred_date": "Nächste Woche Dienstag 14 Uhr wäre super",
  "consent": true,
  "website": ""
}
JSON
run_case "Case 1: Valid Submit" "$P1" "200"

# ---------------------------------------------------------------------------
# Case 2 — Honeypot gefüllt (Bot) → silent success, nichts passiert downstream
# ---------------------------------------------------------------------------
read -r -d '' P2 <<'JSON' || true
{
  "name": "Bot Tester",
  "email": "bot@example.com",
  "phone": "",
  "service": "Maniküre",
  "preferred_date": "Ich bin ein Bot und fülle das Honeypot-Feld aus",
  "consent": true,
  "website": "http://spam.example.com"
}
JSON
run_case "Case 2: Honeypot gefüllt" "$P2" "200"

# ---------------------------------------------------------------------------
# Case 3 — Consent fehlt
# ---------------------------------------------------------------------------
read -r -d '' P3 <<'JSON' || true
{
  "name": "Eva Beispiel",
  "email": "eva@example.com",
  "phone": "",
  "service": "Pediküre",
  "preferred_date": "Donnerstagnachmittag passt mir am besten",
  "consent": false,
  "website": ""
}
JSON
run_case "Case 3: Consent fehlt" "$P3" "400"

# ---------------------------------------------------------------------------
# Case 4 — Email-Regex fail
# ---------------------------------------------------------------------------
read -r -d '' P4 <<'JSON' || true
{
  "name": "Hans Kaputt",
  "email": "keine-email-adresse",
  "phone": "",
  "service": "Maniküre",
  "preferred_date": "Irgendwann nächste Woche wäre toll",
  "consent": true,
  "website": ""
}
JSON
run_case "Case 4: Email-Regex fail" "$P4" "400"

# ---------------------------------------------------------------------------
# Zusammenfassung
# ---------------------------------------------------------------------------
echo "-------------------------------------------"
echo -e "${G}PASS: $pass${N}   ${R}FAIL: $fail${N}"
echo "-------------------------------------------"
[ "$fail" -eq 0 ] || exit 1
