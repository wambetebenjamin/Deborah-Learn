import nodemailer from "nodemailer";

export type ContactMessage = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(payload: ContactMessage) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? "Deborah Learn <hello@deborahlearn.co.ke>";
  const to = process.env.SMTP_TO ?? "hello@deborahlearn.co.ke";

  if (!host || !user || !pass) {
    console.info("[contact] SMTP is not configured, message stored in logs only", payload);
    return { delivered: false, reason: "smtp-not-configured" as const };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject: `Website enquiry: ${payload.subject}`,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone ?? "not given"}\n\n${payload.message}`,
    html: `<p><strong>Name:</strong> ${payload.name}</p>
<p><strong>Email:</strong> ${payload.email}</p>
<p><strong>Phone:</strong> ${payload.phone ?? "not given"}</p>
<p>${payload.message.replace(/\n/g, "<br />")}</p>`,
  });

  return { delivered: true, reason: "sent" as const };
}
