import { serverClient as client } from "@/sanity/lib/serverclient";
import { sendEmail } from "@/utils/sendMail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  const {
    title,
    description,
    location,
    eventDate,
    eventTime,
    organizerName,
    organizerEmail,
    country,
  } = data;
  // Check honeypot (bots often fill this field)
  if (country) {
    console.warn("Spam detected (honeypot triggered).");
    return NextResponse.json({ success: true }); // pretend it worked
  }

  const missingFields: string[] = [];

  if (!organizerName) missingFields.push("organizerName");
  if (!organizerEmail) missingFields.push("organizerEmail");
  if (!title) missingFields.push("title");
  if (!description) missingFields.push("description");
  if (!eventDate) missingFields.push("eventDate");

  if (missingFields.length > 0) {
    console.log("Missing fields:", missingFields);
    return NextResponse.json(
      { error: "Missing required fields", missingFields },
      { status: 400 }
    );
  }
  try {
    await client.create({
      _id: `drafts.event-submit-${crypto.randomUUID()}`,
      _type: "event",
      title,
      description,
      location,
      eventDate,
      eventTime,
      organizerName,
      organizerEmail,
      published: false,
      createdAt: new Date().toISOString(),
    });

    // Email notification
    await sendEmail({
      subject: "New Event Submitted",
      text: `A new event titled "${title}" was submitted for review.`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error while submitting event: ", err);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
