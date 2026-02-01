"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ListingForm from "@/components/listings/ListingForm";
import ItineraryGate from "@/components/itineraries/ItineraryGate";
import ItineraryForm from "@/components/itineraries/ItineraryForm";

import listingService from "@/services/listing.service";
import itineraryService from "@/services/itinerary.service";

import Stepper from "@/components/listings/Stepper";

enum ListingStep {
    Listing = 1,
    ItineraryChoice = 2,
    Itinerary = 3,
    Done = 4,
}

export default function CreateListingPage() {
    const router = useRouter();

    const [step, setStep] = useState<ListingStep>(ListingStep.Listing);
    const [listingId, setListingId] = useState<string | null>(null);

    return (
       <main className="mx-auto px-5">
            <Stepper step={step} />

            {/* STEP 1 – LISTING */}
            {step === ListingStep.Listing && (
                <ListingForm
                    onSubmit={listingService.createListing}
                    onSuccess={(id: string) => {
                        setListingId(id);
                        setStep(ListingStep.ItineraryChoice);
                    }}
                />
            )}

            {/* STEP 2 – ITINERARY YES / NO */}
            {step === ListingStep.ItineraryChoice && listingId && (
                <ItineraryGate
                    existing={false}
                    onYes={() => setStep(ListingStep.Itinerary)}
                    onNo={() => router.push("./")}
                />
            )}

            {/* STEP 3 – ITINERARY */}
            {step === ListingStep.Itinerary && listingId && (
                <ItineraryForm
                    listingId={listingId}
                    onSubmit={async (data) => {
                        await itineraryService.createItinerary(data);
                        router.push("./");
                    }}
                />
            )}
        </main>
    );
}
