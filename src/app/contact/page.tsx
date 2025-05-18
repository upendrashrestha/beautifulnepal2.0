"use client"
import { useState } from 'react';


export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Submitting...');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to submit');

            setFormData({ name: '', email: '', message: '', website: '' });
            setStatus('Thank you! Your message has been sent.');
        } catch (err) {
            console.error(err);
            setStatus('Something went wrong. Try again.');
        }
    };

    return (
        <div className="w-full p-6">
            <h1 className="text-3xl font-bold mb-5 text-center">Contact Us</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="hidden"
                    autoComplete="off"
                    tabIndex={-1}
                />
                <input
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <textarea
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    name="message"
                    placeholder="Your Message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
                    Send
                </button>
            </form>
            {status && <p className="mt-4">{status}</p>}
        </div>
    );
}
