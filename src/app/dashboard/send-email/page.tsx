"use client";

import emailService from "@/services/email.service";
import { useState } from "react";

const generateEmailTemplate = (bodyContent: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;">
    
    <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;text-align:center;color:white;">
      <h1 style="margin:0;">Beautiful Nepal</h1>
    </div>

    <div style="padding:30px;">
      ${bodyContent}
    </div>

    <div style="background:#f8f9fa;padding:20px;text-align:center;font-size:13px;color:#666;">
      <p>© ${new Date().getFullYear()} Beautiful Nepal</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>

  </div>
</body>
</html>
`;

export default function SendEmailPage() {
    const defaultBody = `
<h2>Hello 👋</h2>
<p>Write your email content here...</p>
<p>Best regards,<br/>Beautiful Nepal Team</p>
`;

    const [form, setForm] = useState({
        toEmail: "",
        subject: "",
        htmlContent: generateEmailTemplate(defaultBody),
    });



    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            await emailService.sendEmail({
                toEmail: form.toEmail,
                subject: form.subject,
                htmlContent: form.htmlContent,
            });

            setStatus("success");
            setMessage("Email sent successfully.");
            setForm({
                toEmail: "",
                subject: "",
                htmlContent: generateEmailTemplate(defaultBody),
            });
        } catch (error) {
            console.error(error);
            setStatus("error");
            setMessage("Something went wrong while sending email.");
        } finally {
            setLoading(false);
        }
    };

    return (
       <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                Send Email
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* To Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Email
                    </label>
                    <input
                        type="email"
                        name="toEmail"
                        value={form.toEmail}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="example@email.com"
                    />
                </div>

                {/* Subject */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                    </label>
                    <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Email subject"
                    />
                </div>

                {/* HTML Content */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        HTML Content
                    </label>
                    <textarea
                        name="htmlContent"
                        value={form.htmlContent}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="<h1>Hello World</h1>"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium disabled:opacity-50 transition"
                >
                    {loading ? "Sending..." : "Send Email"}
                </button>

                {/* Status Message */}
                {status !== "idle" && (
                    <p
                        className={`text-sm mt-2 ${status === "success" ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
