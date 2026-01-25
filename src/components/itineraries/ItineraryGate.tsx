"use client";

interface Props {
    existing: boolean;
    onYes: () => void;
    onNo: () => void;
}

export default function ItineraryGate({ existing, onYes, onNo }: Props) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold">
                {existing ? "Edit itinerary?" : "Add an itinerary?"}
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400">
                {existing
                    ? "This listing already has an itinerary. Would you like to update it now?"
                    : "This listing does not have an itinerary. Would you like to create one?"}
            </p>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onYes}
                    className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
                >
                    {existing ? "Edit Itinerary" : "Create Itinerary"}
                </button>

                <button
                    type="button"
                    onClick={onNo}
                    className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}
