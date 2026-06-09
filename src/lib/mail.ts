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

/** Mẫu HTML email có nút bấm + link dự phòng. */
function passwordEmailHtml(opts: {
  heading: string;
  intro: string;
  buttonLabel: string;
  link: string;
  note: string;
}): string {
  return `<!doctype html>
<html lang="ja"><body style="margin:0;background:#f5f7fa;padding:32px 16px;font-family:'Noto Sans JP',sans-serif;color:#1f2733;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border:1px solid #e8ecf2;border-radius:14px;overflow:hidden;">
        <tr><td style="background:#2563eb;color:#fff;padding:18px 28px;font-size:18px;font-weight:800;">ASCare LMS</td></tr>
        <tr><td style="padding:28px;">
          <h1 style="font-size:18px;font-weight:800;margin:0 0 12px;">${opts.heading}</h1>
          <p style="font-size:14px;line-height:1.8;color:#5b6573;margin:0 0 22px;">${opts.intro}</p>
          <a href="${opts.link}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:13px 26px;border-radius:10px;">${opts.buttonLabel}</a>
          <p style="font-size:12px;color:#9aa3af;margin:22px 0 6px;">${opts.note}</p>
          <p style="font-size:12px;color:#7a8494;word-break:break-all;margin:0;"><a href="${opts.link}" style="color:#2563eb;">${opts.link}</a></p>
        </td></tr>
        <tr><td style="border-top:1px solid #eef1f5;padding:14px 28px;font-size:11px;color:#9aa3af;">© 2026 ASCare ・ Produced by Asahi</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendPasswordSetupMail(to: string, link: string): Promise<void> {
  await sendMail({
    to,
    subject: "【ASCare LMS】パスワード設定のご案内",
    text: `ASCare LMS へようこそ。\n以下のリンクからパスワードを設定してください（3日間有効）：\n${link}\n`,
    html: passwordEmailHtml({
      heading: "パスワードを設定してください",
      intro:
        "ASCare LMS へようこそ。下のボタンからパスワードを設定してください。リンクの有効期限は3日間です。",
      buttonLabel: "パスワードを設定する",
      link,
      note: "ボタンが開けない場合は、以下のURLをブラウザに貼り付けてください：",
    }),
  });
}

export async function sendPasswordResetMail(to: string, link: string): Promise<void> {
  await sendMail({
    to,
    subject: "【ASCare LMS】パスワード再設定のご案内",
    text: `以下のリンクからパスワードを再設定してください（1時間有効）：\n${link}\n`,
    html: passwordEmailHtml({
      heading: "パスワードを再設定してください",
      intro: "下のボタンからパスワードを再設定してください。リンクの有効期限は1時間です。",
      buttonLabel: "パスワードを再設定する",
      link,
      note: "ボタンが開けない場合は、以下のURLをブラウザに貼り付けてください：",
    }),
  });
}
