// Gửi mail qua Nodemailer. Dev: Mailpit (SMTP_HOST=localhost:1025, UI :8025).
// Không cấu hình SMTP_HOST → fallback "console" (in ra terminal). Prod: đổi env sang SES/SendGrid.
import nodemailer from "nodemailer";

const FROM = process.env.MAIL_FROM ?? "ASCare LMS <no-reply@ascare.local>";

let cached: nodemailer.Transporter | null | undefined;

function getTransport(): nodemailer.Transporter | null {
  if (cached !== undefined) return cached;
  const host = process.env.SMTP_HOST;
  cached = host
    ? nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT ?? 1025),
        secure: false,
      })
    : null;
  return cached;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  const t = getTransport();
  if (!t) {
    console.log(`\n[MAIL:console] To: ${opts.to}\nSubject: ${opts.subject}\n${opts.text}\n`);
    return;
  }
  await t.sendMail({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}

export async function sendPasswordSetupMail(to: string, link: string): Promise<void> {
  await sendMail({
    to,
    subject: "【ASCare LMS】パスワード設定のご案内",
    text: `ASCare LMS へようこそ。\n以下のリンクからパスワードを設定してください（3日間有効）：\n${link}\n`,
  });
}

export async function sendPasswordResetMail(to: string, link: string): Promise<void> {
  await sendMail({
    to,
    subject: "【ASCare LMS】パスワード再設定のご案内",
    text: `以下のリンクからパスワードを再設定してください（1時間有効）：\n${link}\n`,
  });
}
