import nodemailer from "nodemailer";
import dns from "dns";

let transporter = null;

const EMAIL_TIMEOUT_MS = Math.max(Number(process.env.SMTP_TIMEOUT_MS) || 25000, 10000);
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL || "emmanuelharo2020@gmail.com";
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_USER || NOTIFY_EMAIL;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "RELI Website";
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO?.trim() || null;

// Domains that fail Gmail DMARC when used as SendGrid Single Sender (no domain authentication).
const DMARC_BLOCKED_DOMAINS = ["lasttea.com"];

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);
}

function resetTransporter() {
  transporter = null;
}

function normalizeApiKey(value) {
  return value?.trim().replace(/^["']|["']$/g, "") || "";
}

function resolveEmailProvider() {
  const forced = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (forced === "sendgrid" || forced === "smtp") return forced;
  if (normalizeApiKey(process.env.SENDGRID_API_KEY)) return "sendgrid";
  return "smtp";
}

function validateSendGridKey(apiKey) {
  if (!apiKey) return "SENDGRID_API_KEY is not set";
  if (!apiKey.startsWith("SG.")) {
    return "SENDGRID_API_KEY must start with SG. — copy it from SendGrid → Settings → API Keys";
  }
  if (apiKey.length < 50) {
    return "SENDGRID_API_KEY looks truncated — copy the full key from SendGrid";
  }
  return null;
}

function inferSmtpHost(user, host) {
  const normalizedHost = host?.trim();
  if (normalizedHost?.includes("@")) {
    console.warn(
      `SMTP_HOST "${normalizedHost}" looks like an email address. Use smtp.sendgrid.net for SendGrid SMTP.`,
    );
  } else if (normalizedHost) {
    return normalizedHost;
  }
  if (!user) return null;

  const lowerUser = user.toLowerCase();
  if (lowerUser.endsWith("@gmail.com") || lowerUser.endsWith("@googlemail.com")) return "smtp.gmail.com";
  if (
    lowerUser.endsWith("@outlook.com") ||
    lowerUser.endsWith("@hotmail.com") ||
    lowerUser.endsWith("@live.com") ||
    lowerUser.endsWith("@msn.com")
  ) {
    return "smtp.office365.com";
  }
  return "smtp.sendgrid.net";
}

export function getEmailProviderInfo() {
  const provider = resolveEmailProvider();
  const info = { provider, from: EMAIL_FROM, notify: NOTIFY_EMAIL };

  if (provider === "sendgrid") {
    const key = normalizeApiKey(process.env.SENDGRID_API_KEY);
    const keyError = validateSendGridKey(key);
    info.configured = Boolean(key && !keyError);
    info.keyError = keyError || undefined;
    info.note = "HTTP email via SendGrid (works on Render free tier)";
  } else {
    const smtpHost = inferSmtpHost(process.env.SMTP_USER, process.env.SMTP_HOST);
    info.configured = Boolean(smtpHost && process.env.SMTP_USER && process.env.SMTP_PASS);
    info.smtpHost = smtpHost;
    info.smtpPort = Number(process.env.SMTP_PORT) || 587;
    info.note = "SMTP transport — blocked on Render free tier. Set SENDGRID_API_KEY for production.";
  }

  return info;
}

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const smtpHost = inferSmtpHost(SMTP_USER, SMTP_HOST);

  if (!smtpHost || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP is not configured. Set SENDGRID_API_KEY for production, or SMTP_* for local dev.");
    return null;
  }

  const port = Number(SMTP_PORT) || 587;
  const fromAddress = process.env.EMAIL_FROM?.trim() || SMTP_USER.trim();
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER.trim(), pass: SMTP_PASS.trim() },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: EMAIL_TIMEOUT_MS,
    requireTLS: port !== 465,
    tls: { minVersion: "TLSv1.2" },
    lookup: (hostname, _options, callback) => {
      dns.lookup(hostname, { family: 4 }, callback);
    },
  });

  console.log(`Created SMTP transporter: host=${smtpHost}, port=${port}, from=${fromAddress}`);
  return transporter;
}

function formatSendGridError(status, body) {
  let parsed = {};
  try {
    parsed = JSON.parse(body);
  } catch {
    parsed = { message: body };
  }

  const detail =
    parsed?.errors?.[0]?.message ||
    parsed?.message ||
    body ||
    "request failed";

  if (status === 401) {
    return (
      "SendGrid rejected your API key (401). Create a new key at SendGrid → Settings → API Keys " +
      "(Mail Send full access), paste the full key starting with SG. into Render as SENDGRID_API_KEY, then redeploy."
    );
  }
  if (status === 403) {
    return (
      `SendGrid sender not verified (403): ${detail}. ` +
      "In SendGrid → Settings → Sender Authentication, verify a Single Sender for EMAIL_FROM (" +
      EMAIL_FROM +
      "), then wait until status is Verified."
    );
  }
  if (status === 400 && /from|sender|verified/i.test(detail)) {
    return (
      `SendGrid sender problem (400): ${detail}. ` +
      "EMAIL_FROM must exactly match a verified Single Sender or authenticated domain in SendGrid."
    );
  }
  return `SendGrid ${status}: ${detail}`;
}

async function sendViaSendGrid({ to, subject, text, html, replyTo, fromName = EMAIL_FROM_NAME }) {
  const apiKey = normalizeApiKey(process.env.SENDGRID_API_KEY);
  const keyError = validateSendGridKey(apiKey);
  if (keyError) return { sent: false, error: keyError };

  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: EMAIL_FROM, name: fromName },
    subject,
    content: [
      { type: "text/plain", value: text || " " },
      { type: "text/html", value: html || `<pre>${text || ""}</pre>` },
    ],
  };
  if (replyTo) payload.reply_to = { email: replyTo };

  const res = await withTimeout(
    fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
    EMAIL_TIMEOUT_MS,
    "SendGrid API",
  );

  // SendGrid returns 202 Accepted with an empty body on success
  if (res.status !== 202 && !res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(formatSendGridError(res.status, body));
  }
  return { sent: true };
}

async function sendViaSmtp({ to, subject, text, html, replyTo, fromName = EMAIL_FROM_NAME }) {
  const transport = getTransporter();
  if (!transport) return { sent: false, error: "SMTP is not configured" };

  const fromAddress = process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || EMAIL_FROM;
  await withTimeout(
    transport.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      replyTo,
      subject,
      text,
      html,
    }),
    EMAIL_TIMEOUT_MS,
    "SMTP send",
  );
  return { sent: true };
}

async function sendEmail(options) {
  const provider = resolveEmailProvider();
  const senders = { sendgrid: sendViaSendGrid, smtp: sendViaSmtp };

  try {
    return await senders[provider](options);
  } catch (err) {
    console.error(`Email send failed (${provider}):`, err);
    if (provider === "smtp") resetTransporter();

    const code = err?.code || "UNKNOWN";
    const message = err?.message || String(err);
    let hint = "";

    if (provider === "smtp" && /timed out/i.test(message)) {
      hint = " Render free tier blocks SMTP. Set SENDGRID_API_KEY in your Render environment.";
    } else if (provider === "smtp" && /ENOTFOUND/i.test(message)) {
      hint = " Set SMTP_HOST=smtp.sendgrid.net or use SENDGRID_API_KEY instead.";
    }

    return { sent: false, error: `${code}: ${message}${hint}` };
  }
}

export async function sendContactNotification({ name, email, subject, message }) {
  const adminResult = await sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: email,
    subject: `[RELI Contact] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Subject:</strong> ${subject}</p><p>${message.replace(/\n/g, "<br>")}</p>`,
    fromName: "RELI Website",
  });

  if (!adminResult.sent) return adminResult;

  const donorResult = await sendEmail({
    to: email,
    subject: "We received your message",
    text: `Hello ${name},\n\nThank you for contacting RELI. We have received your message and will respond as soon as possible.\n\nSubject: ${subject}\n\nWith gratitude,\nRELI Team`,
    html: `<p>Hello ${name},</p><p>Thank you for contacting RELI. We have received your message and will respond as soon as possible.</p><p><strong>Subject:</strong> ${subject}</p><p>With gratitude,<br/>RELI Team</p>`,
    fromName: "RELI Team",
  });

  if (!donorResult.sent) return { sent: true, partial: true, error: donorResult.error };
  return { sent: true };
}

function getDonationMethodLabel(method) {
  if (method === "M-Pesa PayBill" || method === "mpesa_paybill") return "M-Pesa PayBill";
  if (method === "M-Pesa Buy Goods" || method === "mpesa_buygoods") return "M-Pesa Buy Goods";
  if (method === "Bank Transfer" || method === "bank_transfer") return "Bank Transfer";
  return method || "Donation";
}

export async function sendDonationConfirmation({ email, donorName, amount, category, method, reference }) {
  const displayName = donorName || "Anonymous donor";
  const displayEmail = email || "No donor email provided";
  const displayCategory = category || "general";
  const displayReference = reference || "Not provided";
  const methodLabel = getDonationMethodLabel(method);

  const adminResult = await sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: email || EMAIL_FROM,
    subject: `[RELI Donation] ${displayName} - KES ${amount} via ${methodLabel}`,
    text:
      `A new donation has been recorded.\n\n` +
      `Donor Name: ${displayName}\n` +
      `Donor Email: ${displayEmail}\n` +
      `Donation Category: ${displayCategory}\n` +
      `Amount: KES ${amount}\n` +
      `Method: ${methodLabel}\n` +
      `Reference: ${displayReference}\n`,
    html:
      `<p>A new donation has been recorded.</p>` +
      `<p><strong>Donor Name:</strong> ${displayName}</p>` +
      `<p><strong>Donor Email:</strong> ${displayEmail}</p>` +
      `<p><strong>Donation Category:</strong> ${displayCategory}</p>` +
      `<p><strong>Amount:</strong> KES ${amount}</p>` +
      `<p><strong>Method:</strong> ${methodLabel}</p>` +
      `<p><strong>Reference:</strong> ${displayReference}</p>`,
    fromName: "RELI Website",
  });

  if (!adminResult.sent) return adminResult;

  if (email) {
    const donorResult = await sendEmail({
      to: email,
      subject: `Thank you for your donation via ${methodLabel}`,
      text:
        `Dear ${displayName},\n\n` +
        `Thank you for your donation of KES ${amount} for ${displayCategory} via ${methodLabel}.\n` +
        `Reference: ${displayReference}\n\n` +
        `With gratitude,\nRELI — Hope for Life Agency`,
      html:
        `<p>Dear ${displayName},</p>` +
        `<p>Thank you for your donation of <strong>KES ${amount}</strong> for <strong>${displayCategory}</strong> via ${methodLabel}.</p>` +
        `<p><strong>Reference:</strong> ${displayReference}</p>` +
        `<p>With gratitude,<br/>RELI — Hope for Life Agency</p>`,
      fromName: "RELI Website",
    });

    if (!donorResult.sent) return { sent: true, partial: true, error: donorResult.error };
  }

  return { sent: true };
}

export async function testSmtp() {
  const info = getEmailProviderInfo();
  if (!info.configured) {
    return { available: false, verified: false, provider: info.provider, error: "Email is not configured", info };
  }

  if (info.provider === "smtp") {
    const transport = getTransporter();
    if (!transport) {
      return { available: false, verified: false, provider: info.provider, error: "SMTP is not configured", info };
    }
    try {
      await withTimeout(transport.verify(), EMAIL_TIMEOUT_MS, "SMTP verify");
      return { available: true, verified: true, provider: info.provider, info };
    } catch (err) {
      const code = err?.code || "UNKNOWN";
      const message = err?.message || String(err);
      return { available: true, verified: false, provider: info.provider, error: `${code}: ${message}`, info };
    }
  }

  const probe = await sendEmail({
    to: NOTIFY_EMAIL,
    subject: "[RELI] Email configuration test",
    text: "This is a test email from your RELI backend. Email delivery is working.",
    html: "<p>This is a test email from your <strong>RELI</strong> backend. Email delivery is working.</p>",
    fromName: "RELI System",
  });

  return {
    available: true,
    verified: probe.sent,
    provider: info.provider,
    error: probe.sent ? undefined : probe.error,
    info,
  };
}
