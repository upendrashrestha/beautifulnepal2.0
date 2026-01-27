'use client'
import { useEffect, useRef, useState } from "react";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import { EventFormData } from "@/types/event.types";
import { NEPAL_CITIES } from "@/utils/constant";
import eventService from "@/services/event.service";
import BotCheck, { BotCheckRef } from "@/components/BotCheck";
import PicturePicker from "../pictures/PicturePicker";
import pictureService from "@/services/picture.service";


export default function EventSubmissionForm() {
  const [form, setForm] = useState<EventFormData>({
    title: "",
    street: "",
    city: "",
    content: "",
    type: "",
    pictureUrl: "",
    description: "",
    eventOn: "",
    eventOff: "",
    eventOnTime: "",
    eventOffTime: "",
    organizedBy: "",
    organizerEmail: ""
  });

  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState(NEPAL_CITIES);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [botCheckPassed, setBotCheckPassed] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureUrl, setPictureUrl] = useState<string | undefined>();
  const botCheckRef = useRef<BotCheckRef>(null);


  // Handle city search
  useEffect(() => {
    const filtered = NEPAL_CITIES.filter(city =>
      city.toLowerCase().includes(citySearch.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [citySearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const update = <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleCitySelect = (city: string) => {
    setForm({ ...form, city });
    setCitySearch(city);
    setShowCityDropdown(false);
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.title || !form.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!form.street || !form.street.trim()) {
      newErrors.streetAddress = "Street address is required.";
    }

    if (!form.city || !form.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!form.eventOn || !form.eventOn.trim()) {
      newErrors.eventOn = "Start Date is required.";
    }

    if (!form.content || !form.content.trim()) {
      newErrors.content = "Event Content is required.";
    }

    if (!botCheckPassed) {
      newErrors.botCheck = "Please answer the security question correctly.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

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
    try {
      let uploadedImageUrl = pictureUrl;

      if (pictureFile) {
        const res = await pictureService.uploadPicture({
          name: pictureFile.name,
          file: pictureFile,
        });

        uploadedImageUrl = res.url;
      }
      // Prepare event data for API (excluding streetAddress and city)
      const eventData = {
        title: form.title,
        city: form.city,
        street: form.street,
        content: form.content,
        type: form.type,
        pictureUrl: uploadedImageUrl,
        description: form.description,
        eventOn: form.eventOn,
        eventOff: form.eventOff,
        eventOnTime: form.eventOnTime,
        eventOffTime: form.eventOffTime,
        organizedBy: form.organizedBy,
        organizerEmail: form.organizerEmail
      };

      await eventService.createEvent(eventData);
      resetForm();
    } catch (err) {
      console.error(err);
      setStatus("error");

      botCheckRef.current?.clear();
    } finally {
      setLoading(false);

      botCheckRef.current?.clear();
    }




  };

  const resetForm = () => {
    // Reset form
    setForm({
      title: "",
      street: "",
      city: "",
      content: "",
      type: "",
      pictureUrl: "",
      description: "",
      eventOn: "",
      eventOff: "",
      eventOnTime: "",
      eventOffTime: "",
      organizedBy: "",
      organizerEmail: ""
    });
    setCitySearch("");
    botCheckRef.current?.clear();
    setStatus("success");

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
        {/* Status Messages */}
        {status === "success" && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700 dark:text-green-300 font-medium">
                Thank you! Your event has been submitted successfully and is pending review.
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 dark:text-red-300 font-medium">
                Something went wrong. Please try again.
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="mt-10 space-y-6">
            {/* Title */}
            <Input
              label="Title *"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              error={errors.title}
              className="input-base"
            />

            <PicturePicker
              label="Event Image"
              value={pictureUrl}
              showGallery={false}
              onChange={({ file, url }) => {
                setPictureFile(file ?? null);
                setPictureUrl(url);
              }}
            />

            {/* Location Section */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Street Address *"
                value={form.street}
                onChange={(e) => update("street", e.target.value)}
                error={errors.streetAddress}
                placeholder="Enter street address"
                className="input-base"
              />

              {/* City Dropdown */}
              <div ref={cityDropdownRef}>

                <div className="relative">

                  <Input
                    label="City"
                    value={citySearch}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      setShowCityDropdown(true);
                      setForm({ ...form, city: "" });
                    }}
                    onFocus={() => setShowCityDropdown(true)}
                    placeholder="Search for a city"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  {showCityDropdown && filteredCities.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredCities.map((city) => (
                        <div
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-white transition-colors"
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Event Date *"
                type="date"
                value={form.eventOn}
                onChange={(e) => update("eventOn", e.target.value)}
                error={errors.eventOn}
                className="input-base"
              />

              <Input
                label="End Date"
                type="date"
                value={form.eventOff}
                onChange={(e) => update("eventOff", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Time Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Start Time"
                type="time"
                value={form.eventOnTime}
                onChange={(e) => update("eventOnTime", e.target.value)}
                className="input-base"
              />

              <Input
                label="End Time"
                type="time"
                value={form.eventOffTime}
                onChange={(e) => update("eventOffTime", e.target.value)}
                className="input-base"
              />
            </div>

            {/* Description */}
            <TextArea
              label="Short Description"
              placeholder="Brief description of the event"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />

            {/* Content */}
            <TextArea
              label="Event Content *"
              placeholder="Full event details"
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              error={errors.content}
              rows={6}
            />

            {/* Keywords */}
            <Input
              label="Event Type"
              placeholder="e.g., Festival, Workshop, Concert, Conference"
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className="input-base"
            />

            {/* Organized By */}
            <Input
              label="Organized By"
              value={form.organizedBy}
              onChange={(e) => update("organizedBy", e.target.value)}
              placeholder="Your name or organization"
              className="input-base"
            />

            <Input
              label="Organizer Email"
              value={form.organizerEmail}
              onChange={(e) => update("organizerEmail", e.target.value)}
              placeholder="Your Email"
              className="input-base"
              type="email"
            />

            {/* Bot Check Section */}
            <BotCheck
              ref={botCheckRef}
              error={errors.botCheck}
              onVerified={(passed) => setBotCheckPassed(passed)}
            />

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center rounded-full bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Saving…" : "Submit Event"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>All submissions are reviewed before publication. You will be notified once your event is approved.</p>
        </div>
      </>
  );
}