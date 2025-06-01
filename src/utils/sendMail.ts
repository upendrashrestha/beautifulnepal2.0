// lib/sendEmail.ts
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NOTIFY_EMAIL,
      pass: process.env.NOTIFY_EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Notifier" <${process.env.NOTIFY_EMAIL}>`,
    to,
    subject,
    text,
  });
}
