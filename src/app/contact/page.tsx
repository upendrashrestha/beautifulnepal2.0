"use client";

import { useState } from "react";
import PageLayout from "@/components/layouts/PageLayout";

import { motion } from "framer-motion";
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
        <PageLayout title="Contact Us" className="text-center">
            <motion.div
                variants={{
                    hidden: {
                        opacity: 0,
                        x: -20,
                    },

                    visible: {
                        opacity: 1,
                        x: 0,
                    },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="animate_left relative mx-auto hidden h-auto md:block md:w-full"
            >
                <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
                    <div className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-3/4 xl:p-15">

                        <p className="text-gray-600 text-sm pb-5">
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


                            <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                                />

                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email address"
                                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                                />
                            </div>


                            <div className="mb-11.5 flex">
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full border-b border-stroke bg-transparent focus:border-waterloo focus:placeholder:text-black focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                                ></textarea>
                            </div>



                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                    <svg
                                        className="fill-white"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                                            fill=""
                                        />
                                    </svg>

                                </button>
                            </div>
                        </form>

                        {
                            status === "success" && (
                                <div className="mt-6 rounded-md bg-green-100 text-green-700 px-4 py-3 text-sm">
                                    Thank you! Your message has been sent.
                                </div>
                            )
                        }
                        {
                            status === "error" && (
                                <div className="mt-6 rounded-md bg-red-100 text-red-700 px-4 py-3 text-sm">
                                    Something went wrong. Please try again.
                                </div>
                            )
                        }
                    </div >

                    <div className="animate_top w-full md:w-2/5 md:p-7.5 lg:w-[26%] xl:pt-15"
                    >
                        <h2 className="mb-12.5 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                            Our Locations
                        </h2>

                        <div className="5 mb-7">
                            <h3 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">
                                Offices
                            </h3>
                            <p className="p-2">Nepal: Kathmandu</p>
                            <p>USA: Arlington, TX </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </PageLayout >
    );
}
