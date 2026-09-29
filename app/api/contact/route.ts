import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, topic, message, _honeypot } = body;

    // Silent drop for spambots filling hidden honeypot
    if (_honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please provide your name." },
        { status: 400 }
      );
    }

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Please enter a message (at least 3 characters)." },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST || "smtp.hostinger.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = process.env.SMTP_SECURE !== "false";
    const sender = process.env.SMTP_USER || "mailer@kauxync.in";
    const pass = process.env.SMTP_PASS;
    const receiver = process.env.CONTACT_RECEIVER || "owner@kauxync.in";

    if (!pass) {
      console.warn("SMTP_PASS is not configured in environment variables.");
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service is not yet configured with SMTP credentials. Please contact owner@kauxync.in directly.",
        },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: sender,
        pass,
      },
    });

    const safeTopic = (topic || "General Inquiry").slice(0, 80);
    const formattedDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const plainText = `New contact form submission from kauxync.in

Name: ${name}
Email: ${email}
Topic: ${safeTopic}
Submitted: ${formattedDate} (IST)

--------------------------------------------------
Message:
${message}
--------------------------------------------------

Tip: Hit 'Reply' in your email client to respond directly to ${email}.`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #111; margin: 0; padding: 24px; background: #f4f4f7; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #0f766e; padding: 32px; box-shadow: 4px 4px 0 #0f766e; }
    .badge { display: inline-block; background: #e6f4f2; color: #0f766e; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 8px; margin-bottom: 12px; }
    h2 { font-size: 20px; font-weight: 700; margin: 0 0 16px 0; color: #0b1211; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; }
    .field { margin-bottom: 12px; font-size: 14px; }
    .field strong { color: #56635f; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; width: 90px; }
    .message-box { background: #f7fbfa; border: 1px solid #0f766e; padding: 16px; margin: 20px 0; font-size: 15px; white-space: pre-wrap; font-family: ui-monospace, Menlo, Consolas, monospace; }
    .reply-tip { font-size: 13px; color: #0f766e; background: #e6f4f2; padding: 10px 14px; border-left: 3px solid #0f766e; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Website Query · kauxync.in</div>
    <h2>New Message from ${name}</h2>
    
    <div class="field"><strong>Sender:</strong> ${name}</div>
    <div class="field"><strong>Email:</strong> <a href="mailto:${email}" style="color: #0f766e;">${email}</a></div>
    <div class="field"><strong>Topic:</strong> ${safeTopic}</div>
    <div class="field"><strong>Time:</strong> ${formattedDate} IST</div>

    <div class="message-box">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>

    <div class="reply-tip">
      <strong>Quick Reply:</strong> Just click <em>Reply</em> in your email app to write directly to <strong>${email}</strong>.
    </div>
  </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"Kauxync Contact Form" <${sender}>`,
      to: receiver,
      replyTo: `"${name}" <${email}>`,
      subject: `[${safeTopic}] ${name} via kauxync.in`,
      text: plainText,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("Error sending contact email:", errorMsg);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message via mail server. Please try again or email directly.",
      },
      { status: 500 }
    );
  }
}
