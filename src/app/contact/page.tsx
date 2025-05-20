"use client";

import { useState } from "react";
import PageTitle from "@/components/PageTitle";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        website: "",
    });
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to submit");

            setFormData({ name: "", email: "", message: "", website: "" });
            setStatus("success");
        } catch (err) {
            console.error(err);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center">
                <PageTitle>Contact Us</PageTitle>
            </div>
            <div className="max-w-2xl mx-auto px-4 py-12">
                <p className="text-gray-600 text-sm">
                    We would love to hear from you! Please fill out the form below and we will get back to you as soon as possible.
                </p>
                <form className="mt-10 space-y-6" onSubmit={handleSubmit} noValidate>
                    {/* Honeypot field */}
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="hidden"
                        autoComplete="off"
                        tabIndex={-1}
                    />

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Your Name
                        </label>
                        <div className="mt-1">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Your Email
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Your Message
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading && (
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l3.536-3.536A9.966 9.966 0 002 12h2z"
                                    ></path>
                                </svg>
                            )}
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </div>
                </form>

                {status === "success" && (
                    <div className="mt-6 rounded-md bg-green-100 text-green-700 px-4 py-3 text-sm">
                        Thank you! Your message has been sent.
                    </div>
                )}
                {status === "error" && (
                    <div className="mt-6 rounded-md bg-red-100 text-red-700 px-4 py-3 text-sm">
                        Something went wrong. Please try again.
                    </div>
                )}
            </div>
        </div>
    );
}
