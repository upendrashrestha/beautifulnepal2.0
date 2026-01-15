// components/forms/ContactForm.tsx
"use client";

import messageService from "@/services/message.service";
import { Message } from "@/types";
import { useState } from "react";

type ContactFormProps = {
    className?: string;
};

export default function ContactForm({ className }: ContactFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        website: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required.";
        } else if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required.";
        } else if (formData.message.length < 10) {
            newErrors.message = "Message must be at least 10 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setStatus("");


        try {
            const msg: Message = {
                createdBy: `${formData.name} (${formData.email})`,
                content: formData.message,
                category: 'contact',
            };
            await messageService.createMessage(msg);

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
        <div className={`animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-3/4 xl:p-15 ${className}`}>
            <p className="text-gray-600 text-sm pb-5">
                We would love to hear from you! Please fill out the form below and we will get back to you as soon as possible.
            </p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit} noValidate>
                <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="hidden"
                    autoComplete="off"
                    tabIndex={-1}
                />

                <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                    <div className="w-full lg:w-1/2">
                        <input
                            type="text"
                            placeholder="Full name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="w-full lg:w-1/2">
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email address"
                            className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>
                </div>

                <div className="mb-11.5">
                    <textarea
                        name="message"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border-b border-stroke bg-transparent focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                    ></textarea>
                    {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                    >
                        {loading ? "Sending..." : "Send Message"}
                        <svg className="fill-white" width="14" height="14" viewBox="0 0 14 14">
                            <path d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z" />
                        </svg>
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
    );
}
