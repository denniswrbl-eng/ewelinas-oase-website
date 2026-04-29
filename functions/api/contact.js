/**
 * POST /api/contact — Kontaktformular-Handler (Cloudflare Pages Function)
 *
 * Fluss: Browser → diese Function → Airtable + Resend (parallel via Promise.allSettled).
 * Ziel: Lead nie verlieren. Wenn einer der beiden Downstreams failt, der andere läuft trotzdem.
 *
 * Env-Vars (in Cloudflare Pages Dashboard oder lokal via .dev.vars):
 *   RESEND_API_KEY      — re_...
 *   AIRTABLE_TOKEN      — pat...
 *   AIRTABLE_BASE_ID    — app9kLLaDhUOHINFU
 *   AIRTABLE_TABLE      — Anfragen
 *   OWNER_EMAIL         — Empfänger der Benachrichtigungs-Mail
 *   MAIL_FROM           — Absender (Session 1: onboarding@resend.dev)
 *   ALLOWED_ORIGINS     — Komma-Liste erlaubter Origins (inkl. localhost für Dev)
 *
 * Keine Dependencies. Standard-Web-APIs.
 */

// --------------------------------------------------------------------------
// Rate-Limit via in-memory Map mit TTL.
// Trade-off: Cloudflare Pages Functions laufen in isolierten Workers.
// Jede Edge-Location hat ihre eigene Map → Limit ist NICHT global konsistent,
// sondern nur pro Isolate. Das reicht gegen Mehrfach-Klicks & einfache Bots.
// Für echten Abuse-Schutz: KV-Namespace oder Durable Object (Session 2).
// Honeypot + Consent-Required sind die primäre Abwehr.
// --------------------------------------------------------------------------
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 min
const ipHits = new Map(); // ip -> [timestamp, ...]

function rateLimitHit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = (ipHits.get(ip) || []).filter((t) => t > windowStart);
  if (hits.length >= RATE_LIMIT_MAX) return true;
  hits.push(now);
  ipHits.set(ip, hits);
  // einfache Housekeeping-Heuristik: Map nicht unbegrenzt wachsen lassen
  if (ipHits.size > 5000) {
    for (const [k, v] of ipHits) {
      if (v[v.length - 1] < windowStart) ipHits.delete(k);
    }
  }
  return false;
}

// --------------------------------------------------------------------------
// Validierung
// --------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(body) {
  const errors = [];
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || body.preferred_date || "").trim();
  const consent = body.consent === true || body.consent === "true" || body.consent === "on";

  if (name.length < 2 || name.length > 80) errors.push("name");
  if (!EMAIL_RE.test(email)) errors.push("email");
  if (message.length < 10 || message.length > 2000) errors.push("message");
  if (!consent) errors.push("consent");

  return { errors, cleaned: { name, email, message } };
}

// --------------------------------------------------------------------------
// HTTP-Helpers
// --------------------------------------------------------------------------
function pickOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return allowed.includes(origin) ? origin : "";
}

function corsHeaders(allowOrigin) {
  return {
    "Access-Control-Allow-Origin": allowOrigin || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function jsonResponse(body, status, allowOrigin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(allowOrigin),
    },
  });
}

// fetch mit Timeout via AbortController
async function fetchWithTimeout(url, options, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(to);
  }
}

// --------------------------------------------------------------------------
// Airtable + Resend Calls
// --------------------------------------------------------------------------
async function sendToAirtable(env, data, meta) {
  const baseId = env.AIRTABLE_BASE_ID;
  const table = encodeURIComponent(env.AIRTABLE_TABLE || "Anfragen");
  const url = `https://api.airtable.com/v0/${baseId}/${table}`;

  // Mapping exakt nach local-business-system/automations/01-anfrage-komplett.json
  // (authoritative Quelle, getesteter n8n-Workflow).
  const fields = {
    "Name": data.name,
    "Email": data.email,
    "Telefon": data.phone || "",
    "Leistungen": data.service || "",
    "Wunschtermin": data.message, // Textarea trägt Wunschtermin/Nachricht
    "Status": "Neu",
    "Quelle": "Website-Formular",
    "Kunde (Business)": "Ewelinas Oase",
    // "Erstellt am" nicht senden — ist Airtable-Auto-Feld (Created time)
  };

  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [{ fields }],
      typecast: true, // erlaubt Single-Select-Strings ohne Option-ID
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function sendToResend(env, data, meta) {
  const to = env.OWNER_EMAIL;
  const from = env.MAIL_FROM || "onboarding@resend.dev";

  const subject = `🌸 Neue Anfrage: ${data.name}`;
  const lines = [
    `Neue Terminanfrage über ewelinas-oase.de`,
    ``,
    `Name:         ${data.name}`,
    `E-Mail:       ${data.email}`,
    `Telefon:      ${data.phone || "—"}`,
    `Leistung:     ${data.service || "—"}`,
    ``,
    `Wunschtermin / Nachricht:`,
    data.message,
    ``,
    `—`,
    `Eingegangen:  ${meta.timestamp}`,
    `IP (Spam-Debug): ${meta.ip || "—"}`,
  ];
  const text = lines.join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#2b2b2b;max-width:560px">
      <h2 style="margin:0 0 12px 0">Neue Anfrage – Ewelinas Oase</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td>${esc(data.name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">E-Mail</td><td><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Telefon</td><td>${esc(data.phone || "—")}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Leistung</td><td>${esc(data.service || "—")}</td></tr>
      </table>
      <h3 style="margin:16px 0 4px 0">Nachricht / Wunschtermin</h3>
      <p style="white-space:pre-wrap;background:#faf6f3;padding:10px 12px;border-left:3px solid #d4607a;margin:0">${esc(data.message)}</p>
      <p style="color:#999;font-size:12px;margin-top:18px">
        Eingegangen: ${esc(meta.timestamp)}<br>
        IP (Spam-Debug): ${esc(meta.ip || "—")}
      </p>
    </div>
  `.trim();

  const res = await fetchWithTimeout("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text, html }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Resend ${res.status}: ${t.slice(0, 300)}`);
  }
  return res.json();
}

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// --------------------------------------------------------------------------
// Handler
// --------------------------------------------------------------------------
export async function onRequestOptions({ request, env }) {
  // CORS-Preflight
  const origin = pickOrigin(request, env);
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function onRequestPost({ request, env }) {
  const origin = pickOrigin(request, env);
  // Origin-Check hart: ohne erlaubten Origin → 403.
  // Schützt vor CSRF aus fremden Domains.
  if (!origin) return jsonResponse({ ok: false, error: "origin_not_allowed" }, 403, "");

  // IP für Rate-Limit + Spam-Debug
  const ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    "unknown";

  if (rateLimitHit(ip)) {
    return jsonResponse({ ok: false, error: "rate_limited" }, 429, origin);
  }

  // Body parsen
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400, origin);
  }

  // Honeypot — still erfolgreich tun, nichts weiterleiten
  if (body && typeof body.website === "string" && body.website.trim() !== "") {
    return jsonResponse({ ok: true }, 200, origin);
  }

  // Validieren
  const { errors, cleaned } = validate(body);
  if (errors.length > 0) {
    return jsonResponse({ ok: false, error: "validation_failed", fields: errors }, 400, origin);
  }

  // Zusätzliche (optionale) Felder
  const phone = (body.phone || "").toString().slice(0, 60);
  const service = (body.service || "").toString().slice(0, 120);

  const data = {
    name: cleaned.name,
    email: cleaned.email,
    message: cleaned.message,
    phone,
    service,
  };
  const meta = {
    ip,
    timestamp: new Date().toISOString(),
  };

  // Parallel → keiner blockiert den anderen
  const results = await Promise.allSettled([
    sendToAirtable(env, data, meta),
    sendToResend(env, data, meta),
  ]);

  const [airtableRes, resendRes] = results;
  const airtableOk = airtableRes.status === "fulfilled";
  const resendOk = resendRes.status === "fulfilled";

  if (!airtableOk) {
    console.error("[contact] Airtable failed:", airtableRes.reason?.message || airtableRes.reason);
  }
  if (!resendOk) {
    console.error("[contact] Resend failed:", resendRes.reason?.message || resendRes.reason);
  }

  // Lead nicht verlieren: solange mindestens einer geklappt hat → 200.
  if (airtableOk || resendOk) {
    return jsonResponse(
      { ok: true, stored: airtableOk, notified: resendOk },
      200,
      origin
    );
  }

  // Beide tot → generischer 5xx, keine Stacktraces an den Client.
  return jsonResponse({ ok: false, error: "downstream_unavailable" }, 502, origin);
}

// Alle anderen Methoden ablehnen
export async function onRequest({ request, env }) {
  if (request.method === "POST") return onRequestPost({ request, env });
  if (request.method === "OPTIONS") return onRequestOptions({ request, env });
  const origin = pickOrigin(request, env);
  return jsonResponse({ ok: false, error: "method_not_allowed" }, 405, origin);
}
