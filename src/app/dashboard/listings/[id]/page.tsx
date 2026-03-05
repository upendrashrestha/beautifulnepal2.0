"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

import ListingForm from "@/components/listings/ListingForm";
import ItineraryGate from "@/components/itineraries/ItineraryGate";
import ItineraryForm from "@/components/itineraries/ItineraryForm";

import listingService from "@/services/listing.service";
import itineraryService from "@/services/itinerary.service";

import { Listing, ListingUpdate } from "../../../../../types/listing.types";
import Stepper from "@/components/listings/Stepper";

enum ListingStep {
    Listing = 1,
    ItineraryChoice = 2,
    Itinerary = 3,
}

export default function EditListingPage() {
    const router = useRouter();
    const pathname = usePathname();
    const listingId = pathname.split("/").pop()!;

    const [step, setStep] = useState<ListingStep>(ListingStep.Listing);
    const [listing, setListing] = useState<Listing | null>(null);
    const [hasItinerary, setHasItinerary] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const res = await listingService.getListingById(listingId);
            setListing(res);
            setHasItinerary(!!res.itinerary);
            setLoading(false);
        }

        load();
    }, [listingId]);

    if (loading) return <div>Loading...</div>;
    if (!listing) return <div>Listing not found</div>;

    return (
        <main className="mx-auto px-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Edit Listing</h1>

                <button
                    type="button"
                    onClick={() => router.push("./")}
                    className="inline-flex items-center p-2 text-black hover:text-red-600 transition"
                >
                    <FaTimes className="mr-1" />
                </button>
            </div>

            <Stepper step={step} />

            {/* STEP 1 – LISTING */}
            {step === ListingStep.Listing && (
                <ListingForm
                    initialData={listing}
                    onSubmit={async (data: Partial<ListingUpdate>) => {
                        const updatedListing = await listingService.updateListing({
                            ...data,
                            id: listing.id, // ensure ID only
                        });

                        setStep(ListingStep.ItineraryChoice);
                        return updatedListing;
                    }}
                    onSuccess={() => {
                        setStep(ListingStep.ItineraryChoice);
                    }}
                />
            )}

            {/* STEP 2 – ITINERARY CHOICE */}
            {step === ListingStep.ItineraryChoice && (
                <ItineraryGate
                    existing={hasItinerary}
                    onYes={() => setStep(ListingStep.Itinerary)}
                    onNo={() => router.push("../listings")}
                />
            )}

            {/* STEP 3 – ITINERARY */}
            {step === ListingStep.Itinerary && (
                <ItineraryForm
                    listingId={listing.id}
                    initialData={listing.itinerary ?? undefined}
                    onSubmit={async (data) => {
                        if (hasItinerary) {
                            await itineraryService.updateItinerary(data);
                        } else {
                            await itineraryService.createItinerary(data);
                        }

                        router.push("../listings");
                    }}
                />
            )}
        </main>
    );
}
