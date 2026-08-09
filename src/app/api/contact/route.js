import { Resend } from "resend";

// Recipient defaults to Adams' own address; overridable via env so the
// deployed site's inbox can be changed without touching code.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "ikmal.usamah@gmail.com";
const FROM_EMAIL = "Portfolio Contact <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, message, company } = body || {};

  // Honeypot: a hidden field real visitors never fill in. If it has a
  // value, silently pretend success so the bot moves on.
  if (company) {
    return Response.json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email.trim())) {
    return Response.json({ error: "That email address doesn't look right." }, { status: 400 });
  }
  if (message.trim().length > 5000) {
    return Response.json({ error: "Message is too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set.");
    return Response.json(
      { error: "The contact form isn't configured yet. Please email directly instead." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email.trim(),
      subject: `Portfolio message from ${name.trim()}`,
      text: `From: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`,
      html: buildEmailHtml({ name: name.trim(), email: email.trim(), message: message.trim() }),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Couldn't send your message. Please try again." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ error: "Couldn't send your message. Please try again." }, { status: 500 });
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Mirrors the site's palette (paper / pine / amber) using inline styles and
// web-safe font fallbacks, since email clients don't load @fontsource files
// or reliably support <style> blocks.
function buildEmailHtml({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8" /></head>
  <body style="margin:0; background:#F6F3EC;">
  <div style="background:#F6F3EC; padding:32px 16px; font-family: Georgia, 'Times New Roman', serif;">
    <div style="max-width:520px; margin:0 auto; background:#FBF9F4; border:1px solid #C9BFA9; border-radius:16px; overflow:hidden;">
      <div style="background:#2F6E68; padding:20px 28px;">
        <p style="margin:0; font-family: 'Courier New', monospace; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#E4B379;">
          Portfolio - New Message
        </p>
      </div>
      <div style="padding:28px;">
        <p style="margin:0 0 4px; font-family: Georgia, serif; font-size:20px; color:#1E2A27;">
          ${safeName}
        </p>
        <p style="margin:0 0 20px; font-family: Arial, sans-serif; font-size:13px; color:#4B5B57;">
          <a href="mailto:${safeEmail}" style="color:#2F6E68; text-decoration:none;">${safeEmail}</a>
        </p>
        <div style="border-left:3px solid #C98A3E; padding:2px 0 2px 16px; margin-bottom:24px;">
          <p style="margin:0; font-family: Arial, sans-serif; font-size:15px; line-height:1.7; color:#1E2A27; white-space:pre-wrap;">
            ${safeMessage}
          </p>
        </div>
        <a href="mailto:${safeEmail}" style="display:inline-block; background:#2F6E68; color:#FBF9F4; font-family: Arial, sans-serif; font-size:13px; font-weight:bold; text-decoration:none; padding:10px 20px; border-radius:999px;">
          Reply to ${safeName.split(" ")[0]}
        </a>
      </div>
      <div style="padding:14px 28px; border-top:1px solid #C9BFA9;">
        <p style="margin:0; font-family: 'Courier New', monospace; font-size:11px; color:#4B5B57;">
          Sent from the contact form on usamah's portfolio
        </p>
      </div>
    </div>
  </div>
  </body>
  </html>
  `;
}
