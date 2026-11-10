import { NextResponse } from "next/server";
import { Resend } from "resend";

// In-memory rate limiting map: ip -> { count, resetAt }
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const ipRateMap = new Map<string, RateLimitRecord>();
const recentSubmissions = new Map<string, number>();

// Periodic cleanup of stale rate-limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of ipRateMap.entries()) {
    if (val.resetAt <= now) ipRateMap.delete(key);
  }
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > 60000) recentSubmissions.delete(key);
  }
}, 600000);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    // 1. Check server-side environment variables
    const apiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!apiKey || apiKey.trim().length === 0) {
      console.error("[Contact API] RESEND_API_KEY is not configured.");
      return NextResponse.json(
        {
          error:
            "Server email service is not configured (missing RESEND_API_KEY in .env).",
        },
        { status: 500 }
      );
    }

    if (!contactEmail || contactEmail.trim().length === 0) {
      console.error("[Contact API] CONTACT_EMAIL is not configured.");
      return NextResponse.json(
        {
          error:
            "Server recipient email is not configured (missing CONTACT_EMAIL in .env).",
        },
        { status: 500 }
      );
    }

    // 2. Parse request body
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload. JSON object expected." },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    // 3. Server-side validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide your name." },
        { status: 400 }
      );
    }
    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: "Name must be less than 100 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !email ||
      typeof email !== "string" ||
      !emailRegex.test(email.trim())
    ) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length < 10
    ) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long." },
        { status: 400 }
      );
    }
    if (message.trim().length > 5000) {
      return NextResponse.json(
        { error: "Message must be less than 5000 characters." },
        { status: 400 }
      );
    }

    // 4. Rate limiting & Duplicate prevention
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = (forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1") || "unknown";

    const submissionHash = `${ip}:${email.trim().toLowerCase()}:${message.trim().slice(0, 40)}`;
    const lastSent = recentSubmissions.get(submissionHash);
    const now = Date.now();

    if (lastSent && now - lastSent < 60000) {
      return NextResponse.json(
        {
          error:
            "Duplicate submission detected. Please wait a minute before sending the same message again.",
        },
        { status: 429 }
      );
    }

    const rateRecord = ipRateMap.get(ip);
    if (rateRecord) {
      if (rateRecord.resetAt > now) {
        if (rateRecord.count >= 5) {
          return NextResponse.json(
            {
              error:
                "Too many message submissions. Please wait 15 minutes before trying again.",
            },
            { status: 429 }
          );
        }
        rateRecord.count += 1;
      } else {
        ipRateMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
      }
    } else {
      ipRateMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    }

    // 5. Construct Clean Email Template
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessageHtml = escapeHtml(trimmedMessage).replace(/\n/g, "<br />");

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Portfolio Message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1321; color: #f6f8fd; padding: 32px 16px; margin: 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background-color: #111c2f; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <tr>
      <td style="padding: 28px 32px; border-bottom: 1px solid rgba(255,255,255,0.08); background-color: #152238;">
        <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #8fa4bf;">Portfolio Enquiry</span>
        <h2 style="margin: 6px 0 0; font-size: 20px; font-weight: 600; color: #ffffff;">New message from ${safeName}</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 32px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
          <tr>
            <td style="padding-bottom: 10px; width: 90px; font-family: monospace; font-size: 12px; color: #8fa4bf;">From:</td>
            <td style="padding-bottom: 10px; font-size: 14px; color: #f6f8fd; font-weight: 500;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding-bottom: 10px; width: 90px; font-family: monospace; font-size: 12px; color: #8fa4bf;">Email:</td>
            <td style="padding-bottom: 10px; font-size: 14px; color: #60a5fa;"><a href="mailto:${safeEmail}" style="color: #60a5fa; text-decoration: underline;">${safeEmail}</a></td>
          </tr>
        </table>
        
        <div style="background-color: rgba(0,0,0,0.28); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px;">
          <div style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #8fa4bf; margin-bottom: 12px;">Message Content</div>
          <div style="font-size: 14px; line-height: 1.65; color: #c5d3e6; word-break: break-word;">${safeMessageHtml}</div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 32px; background-color: #0d1726; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #64748b; font-family: monospace;">
        Delivered via Resend · You can reply directly to this email to contact ${safeName}.
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const emailText = `New Portfolio Enquiry\n\nName: ${trimmedName}\nEmail: ${trimmedEmail}\n\nMessage:\n${trimmedMessage}\n\n---\nReply directly to this email to reach ${trimmedName}.`;

    // 6. Send email via Resend
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [contactEmail.trim()],
      replyTo: trimmedEmail,
      subject: `New Portfolio Enquiry: ${trimmedName}`,
      text: emailText,
      html: emailHtml,
    });

    if (error) {
      console.error("[Contact API] Resend error:", error);
      return NextResponse.json(
        {
          error:
            error.message ||
            "Resend failed to deliver the message. Please verify your API key and recipient configuration.",
        },
        { status: 502 }
      );
    }

    // Mark submission as sent to prevent immediate spam
    recentSubmissions.set(submissionHash, Date.now());

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully.",
        id: data?.id,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "An unexpected server error occurred.";
    console.error("[Contact API] Unexpected error:", err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
