import nodemailer from "nodemailer";

let transporter = null;
const EMAIL_TIMEOUT_MS = Number(process.env.SMTP_TIMEOUT_MS) || 60000;

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

function inferSmtpHost(user, host) {
  const normalizedHost = host?.trim();
  if (normalizedHost && !normalizedHost.includes("@")) {
    return normalizedHost;
  }
  if (!user) return null;

  const lowerUser = user.toLowerCase();
  if (lowerUser.endsWith("@gmail.com")) return "smtp.gmail.com";
  if (lowerUser.endsWith("@outlook.com") || lowerUser.endsWith("@hotmail.com") || lowerUser.endsWith("@live.com") || lowerUser.endsWith("@msn.com")) {
    return "smtp.office365.com";
  }
  return null;
}

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const smtpHost = inferSmtpHost(SMTP_USER, SMTP_HOST);

  if (!smtpHost || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP is not configured correctly. Verify SMTP_HOST, SMTP_USER, and SMTP_PASS.");
    return null;
  }

  const transportOptions = {
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: EMAIL_TIMEOUT_MS,
    greetingTimeout: EMAIL_TIMEOUT_MS,
    socketTimeout: EMAIL_TIMEOUT_MS,
    tls: { rejectUnauthorized: false },
  };

  if (smtpHost === "smtp.gmail.com") {
    transportOptions.service = "gmail";
  } else {
    transportOptions.host = smtpHost;
    transportOptions.port = Number(SMTP_PORT) || 587;
    transportOptions.secure = Number(SMTP_PORT) === 465;
  }

  transporter = nodemailer.createTransport(transportOptions);
  console.log(`Created SMTP transporter using host=${smtpHost}, port=${SMTP_PORT || 587}`);
  return transporter;
}

async function sendOneMail(transport, options, label) {
  try {
    await withTimeout(transport.sendMail(options), EMAIL_TIMEOUT_MS, label);
    return { sent: true };
  } catch (err) {
    console.error(`${label} failed:`, err.message);
    resetTransporter();
    return { sent: false, error: err.message };
  }
}

function getDonationMethodLabel(method) {
  if (method === "M-Pesa PayBill" || method === "mpesa_paybill") return "M-Pesa PayBill";
  if (method === "M-Pesa Buy Goods" || method === "mpesa_buygoods") return "M-Pesa Buy Goods";
  if (method === "Bank Transfer" || method === "bank_transfer") return "Bank Transfer";
  return method || "Donation";
}

export async function sendContactNotification({ name, email, subject, message }) {
  const transport = getTransporter();
  const notifyEmail = process.env.NOTIFY_EMAIL || "hope4lifeagency@gmail.com";
  if (!transport) {
    console.log("SMTP not configured — message saved to database only");
    return { sent: false, error: "SMTP is not configured" };
  }

  const adminResult = await sendOneMail(
    transport,
    {
      from: `"RELI Website" <${process.env.SMTP_USER}>`,
      to: notifyEmail,
      replyTo: email,
      subject: `[RELI Contact] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Subject:</strong> ${subject}</p><p>${message.replace(/\n/g, "<br>")}</p>`,
    },
    "Contact admin email",
  );

  if (!adminResult.sent) {
    return { sent: false, error: adminResult.error };
  }

  const donorResult = await sendOneMail(
    transport,
    {
      from: `"RELI Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "We received your message",
      text: `Hello ${name},\n\nThank you for contacting RELI. We have received your message and will respond as soon as possible.\n\nSubject: ${subject}\n\nWith gratitude,\nRELI Team`,
      html: `<p>Hello ${name},</p><p>Thank you for contacting RELI. We have received your message and will respond as soon as possible.</p><p><strong>Subject:</strong> ${subject}</p><p>With gratitude,<br/>RELI Team</p>`,
    },
    "Contact confirmation email",
  );

  if (!donorResult.sent) {
    return { sent: true, partial: true, error: donorResult.error };
  }

  return { sent: true };
}

export async function sendDonationConfirmation({ email, donorName, amount, category, method, reference }) {
  const transport = getTransporter();
  const notifyEmail = process.env.NOTIFY_EMAIL || "hope4lifeagency@gmail.com";
  if (!transport) return { sent: false, error: "SMTP is not configured" };

  const displayName = donorName || "Anonymous donor";
  const displayEmail = email || "No donor email provided";
  const displayCategory = category || "general";
  const displayReference = reference || "Not provided";
  const methodLabel = getDonationMethodLabel(method);

  const adminResult = await sendOneMail(
    transport,
    {
      from: `"RELI Website" <${process.env.SMTP_USER}>`,
      to: notifyEmail,
      replyTo: email || process.env.SMTP_USER,
      subject: `[RELI Donation] ${displayName} - KES ${amount} via ${methodLabel}`,
      text:
        `A new donation has been recorded.\n\n` +
        `Donor Name: ${displayName}\n` +
        `Donor Email: ${displayEmail}\n` +
        `Donation Category: ${displayCategory}\n` +
        `Amount: KES ${amount}\n` +
        `Thank you for donation of KES ${amount} for ${displayCategory} via ${methodLabel}.\n` +
        `Method: ${methodLabel}\n` +
        `Reference: ${displayReference}\n`,
      html:
        `<p>A new donation has been recorded.</p>` +
        `<p><strong>Donor Name:</strong> ${displayName}</p>` +
        `<p><strong>Donor Email:</strong> ${displayEmail}</p>` +
        `<p><strong>Donation Category:</strong> ${displayCategory}</p>` +
        `<p><strong>Amount:</strong> KES ${amount}</p>` +
        `<p><strong>Thank you for donation of:</strong> KES ${amount} for ${displayCategory} via ${methodLabel}</p>` +
        `<p><strong>Method:</strong> ${methodLabel}</p>` +
        `<p><strong>Reference:</strong> ${displayReference}</p>`,
    },
    "Donation admin email",
  );

  if (!adminResult.sent) {
    return { sent: false, error: adminResult.error };
  }

  if (email) {
    const donorResult = await sendOneMail(
      transport,
      {
        from: `"RELI Website" <${process.env.SMTP_USER}>`,
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
      },
      "Donation donor email",
    );

    if (!donorResult.sent) {
      return { sent: true, partial: true, error: donorResult.error };
    }
  }

  return { sent: true };
}
