import { NextResponse } from "next/server";
import { serverClient as client } from "@/sanity/lib/serverclient";
import { sendEmail } from "@/utils/sendMail";

export async function POST(req: Request) {
  const data = await req.json();
  const { name, email, message, website } = data;
  // Check honeypot (bots often fill this field)
  if (website) {
    console.warn("Spam detected (honeypot triggered).");
    return NextResponse.json({ success: true }); // pretend it worked
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const doc = {
      _id: `drafts.contact-message-${crypto.randomUUID()}`,
      _type: "contact",
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    };

    await client.create(doc);
    // Email notification
    await sendEmail({
      subject: "New Message",
      text: `A new message by "${name}".`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
