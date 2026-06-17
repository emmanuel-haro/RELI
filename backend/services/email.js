import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

export async function sendContactNotification({ name, email, subject, message }) {
  const transport = getTransporter();
  const notifyEmail = process.env.NOTIFY_EMAIL || "hope4lifeagency@gmail.com";
  if (!transport) {
    console.log("SMTP not configured — message saved to database only");
    return { sent: false };
  }

  await transport.sendMail({
    from: `"RELI Website" <${process.env.SMTP_USER}>`,
    to: notifyEmail,
    replyTo: email,
    subject: `[RELI Contact] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Subject:</strong> ${subject}</p><p>${message.replace(/\n/g, "<br>")}</p>`,
  });

  return { sent: true };
}

export async function sendDonationConfirmation({ email, donorName, amount, method }) {
  const transport = getTransporter();
  if (!transport || !email) return { sent: false };

  await transport.sendMail({
    from: `"RELI Donations" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Thank you for your donation to RELI",
    text: `Dear ${donorName || "Friend"},\n\nThank you for your donation of KES ${amount} via ${method}. Your generosity transforms lives.\n\nWith gratitude,\nRELI — Hope for Life Agency`,
  });

  return { sent: true };
}
