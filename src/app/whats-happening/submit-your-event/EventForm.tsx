"use client";
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
        eventEndDate: "",
        eventEndTime: "",
        description: "",
        organizerName: "",
        organizerEmail: "",
        website: "",
        createdAt: "",
        image: undefined,
    });
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    // const [imageFile, setImageFile] = useState<File | null>(null);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setValidationErrors((prev) => ({ ...prev, [e.target.name]: "" })); // clear error on change
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.title.trim()) errors.title = "Event title is required.";
        if (!formData.location.trim()) errors.location = "Location is required.";
        if (!formData.eventDate.trim()) errors.eventDate = "Event date is required.";
        if (!formData.description.trim()) errors.description = "Description is required.";
        if (!formData.organizerName.trim()) errors.organizerName = "Your name is required.";
        if (!formData.organizerEmail.trim()) {
            errors.organizerEmail = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.organizerEmail)) {
            errors.organizerEmail = "Please enter a valid email.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files[0]) {
    //         setImageFile(e.target.files[0]);
    //     } else {
    //         setImageFile(null);
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("");

        if (!validateForm()) return;

        setLoading(true);
        try {

            // const imageUrl = null;
            // const imageAlt = formData.image?.alt || formData.title; // Use title as default alt if not provided

            // if (imageFile) {
            //     const imageFormData = new FormData();
            //     imageFormData.append('file', imageFile);

            //     const uploadRes = await fetch('/api/upload-image', {
            //         method: 'POST',
            //         body: imageFormData,
            //     });

            //     if (!uploadRes.ok) {
            //         throw new Error('Failed to upload image.');
            //     }

            //     const imageData = await uploadRes.json();
            //     imageUrl = imageData.imageUrl; // This will be the Sanity asset ID or URL

            //     // Update formData with the Sanity image asset reference
            //     formData.image = {
            //         asset: {
            //             _ref: imageUrl,
            //         },
            //         alt: imageAlt
            //     };
            // }

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
                eventEndDate: "",
                eventEndTime: "",
                description: "",
                organizerName: "",
                organizerEmail: "",
                website: "",
                createdAt: ""
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
                                type="hidden"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            />
                            {/* <div>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div> */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Event Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full focus-visible:outline-hidden border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee"
                                />
                                {validationErrors.title && <p className="text-sm text-red-500">{validationErrors.title}</p>}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full focus-visible:outline-hidden border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee"
                                />
                                {validationErrors.location && <p className="text-sm text-red-500">{validationErrors.location}</p>}
                            </div>



                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-left font-bold text-gray-700 dark:text-gray-200 mb-1">Event Start Date</label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        className="w-full focus-visible:outline-hidden border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee"
                                    />
                                    {validationErrors.eventDate && <p className="text-sm text-red-500 mt-1">{validationErrors.eventDate}</p>}
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">Event Start Time</label>
                                    <input
                                        type="time"
                                        name="eventTime"
                                        value={formData.eventTime}
                                        onChange={handleChange}
                                        className="w-full focus-visible:outline-hidden border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-left font-bold text-gray-700 dark:text-gray-200 mb-1">Event End Date</label>
                                    <input
                                        type="date"
                                        name="eventEndDate"
                                        value={formData.eventEndDate}
                                        onChange={handleChange}
                                        className="w-full focus-visible:outline-hidden border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-gray-700 dark:text-gray-200 text-left mb-1">Event End Time</label>
                                    <input
                                        type="time"
                                        name="eventEndTime"
                                        value={formData.eventEndTime}
                                        onChange={handleChange}
                                        className="w-full focus-visible:outline-hidden border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee"
                                    />
                                </div>
                            </div>
                            <div>
                                <textarea
                                    name="description"
                                    placeholder="Event Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full focus-visible:outline-hidden border-b border-stroke bg-transparent focus:border-waterloo dark:border-strokedark dark:focus:border-manatee"
                                ></textarea>
                                {validationErrors.description && <p className="text-sm text-red-500">{validationErrors.description}</p>}
                            </div>

                            <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                                <div className="w-full lg:w-1/2">
                                    <input
                                        type="text"
                                        placeholder="Your Full Name"
                                        name="organizerName"
                                        value={formData.organizerName}
                                        onChange={handleChange}
                                        className="w-full focus-visible:outline-hidden border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee"
                                    />
                                    {validationErrors.organizerName && <p className="text-sm text-red-500">{validationErrors.organizerName}</p>}
                                </div>

                                <div className="w-full lg:w-1/2">
                                    <input
                                        name="organizerEmail"
                                        type="email"
                                        value={formData.organizerEmail}
                                        onChange={handleChange}
                                        placeholder="Email address"
                                        className="w-full focus-visible:outline-hidden border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee"
                                    />
                                    {validationErrors.organizerEmail && <p className="text-sm text-red-500">{validationErrors.organizerEmail}</p>}
                                </div>
                            </div>

                            <input
                                type="text"
                                name="website"
                                placeholder="Website"
                                value={formData.website || ""}
                                onChange={handleChange}
                                className="w-full focus-visible:outline-hidden border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo dark:border-strokedark dark:focus:border-manatee"
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
