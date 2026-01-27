// components/forms/ContactForm.tsx
"use client";

import BotCheck, { BotCheckRef } from "@/components/BotCheck";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import messageService from "@/services/message.service";
import { Message } from "@/types";
import { useRef, useState } from "react";

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
    const botCheckRef = useRef<BotCheckRef>(null);
const [botCheckPassed, setBotCheckPassed] = useState(false);
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
        if (!botCheckPassed) {
            newErrors.botCheck = "Please answer the security question correctly.";
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
        if (!validate()) {
            botCheckRef.current?.clear();
            return;
        }
        if (!botCheckPassed) {
            setBotCheckPassed(true);
            setStatus("Bot check passed! Please submit again to confirm.");
            return;
        }
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
            botCheckRef.current?.clear();
        } catch (err) {
            console.error(err);
            setStatus("error");
            botCheckRef.current?.clear();
        } finally {
            setLoading(false);
            botCheckRef.current?.clear();
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${className}`}>
         
          <div className="mt-10 space-y-6">
             
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
                        <Input
                            type="text"
                            placeholder="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            label="Your Name *"
                        />
                      
                    </div>

                    <div className="w-full lg:w-1/2">
                        <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email address"
                         error={errors.email}
                         label="Your Email *"
                        />
                    </div>
                </div>

                <div className="mb-11.5">
                    <TextArea
                        name="message"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        label="Message *"
                      error={errors.message}/>
                </div>
                <BotCheck
                    ref={botCheckRef}
                    error={errors.botCheck}
                    onVerified={(passed) => setBotCheckPassed(passed)}
                />
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
        </div>
    );
}
