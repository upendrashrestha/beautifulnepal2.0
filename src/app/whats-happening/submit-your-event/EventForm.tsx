"use client"
import { useState } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { CommunityEvent } from "@/types";

export default function EventFormPage() {
    const [formData, setFormData] = useState<CommunityEvent>({
        _id: "",
        title: "",
        location: "",
        eventDate: "",
        eventTime: "",
        description: "",
        organizerName: "",
        organizerEmail: "",
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
            const res = await fetch("/api/whats-happening", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to submit");

            setFormData({
                _id: "",
                title: "",
                location: "",
                eventDate: "",
                eventTime: "",
                description: "",
                organizerName: "",
                organizerEmail: "",
                website: "",
            });
            setStatus("success");
        } catch (err) {
            console.error(err);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout title="Submit Your Event" className="text-center">
            <AnimatedSection>
                <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-center xl:gap-20">
                    <div className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-3/4 xl:p-15">
                        <div className="animate_top w-full mb-5">
                            <h2 className="mb-5 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                                Hosting an Event?
                            </h2>
                            <p className="pb-5">
                                Planning something exciting in Nepal? Submit your event here and let the world know what&apos;s happening! Whether it&apos;s a festival, workshop, or community gathering, your event deserves the spotlight. Share it with the world.
                            </p>
                        </div>

                        <form className="mt-10 space-y-6" onSubmit={handleSubmit} noValidate>
                            <input
                                type="country"
                                placeholder="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <input
                                type="text"
                                placeholder="Event Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                            />
                            <input
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                required
                                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                            />
                            <input
                                type="time"
                                name="eventTime"
                                placeholder="Time"
                                value={formData.eventTime}
                                onChange={handleChange}
                                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee"
                            />

                            <textarea
                                name="description"
                                placeholder="Event Description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full border-b border-stroke bg-transparent focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                            ></textarea>

                            <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                                <input
                                    type="text"
                                    placeholder="Your Full Name"
                                    name="organizerName"
                                    value={formData.organizerName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b focus-visible:outline-hidden  border-stroke bg-transparent pb-3.5 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee lg:w-1/2"
                                />



                                <input
                                    name="organizerEmail"
                                    type="email"
                                    required
                                    value={formData.organizerEmail}
                                    onChange={handleChange}
                                    placeholder="Email address"
                                    className="w-full focus-visible:outline-hidden border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee lg:w-1/2"
                                />
                            </div>
                            <input
                                type="text"
                                name="website"
                                placeholder="Website"
                                value={formData.website || ""}
                                onChange={handleChange}
                                className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                            >
                                {loading ? "Submitting..." : "Submit Event"}
                            </button>
                        </form>

                        {status === "success" && (
                            <div className="mt-6 rounded-md bg-green-100 text-green-700 px-4 py-3 text-sm">
                                Thank you! Your event has been submitted and is pending review.
                            </div>
                        )}
                        {status === "error" && (
                            <div className="mt-6 rounded-md bg-red-100 text-red-700 px-4 py-3 text-sm">
                                Something went wrong. Please try again.
                            </div>
                        )}
                    </div>


                </div>
            </AnimatedSection>
        </PageLayout>
    );
}
