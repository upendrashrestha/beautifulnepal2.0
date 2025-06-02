// lib/sendEmail.ts
import { Resend } from "resend";

interface EmailOptions {
  subject: string;
  text: string;
}

export async function sendEmail({subject, text }: EmailOptions) {
  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

  await resend.emails.send({
    from: `"Notifier" <${process.env.NEXT_PUBLIC_RESEND_EMAIL}>`,
    to: `${process.env.NEXT_PUBLIC_NOTIFY_EMAIL}`,
    subject,
    text,
  });
}
