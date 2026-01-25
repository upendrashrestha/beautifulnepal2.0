"use client";

import { useEffect, useState } from "react";
import { Itinerary, ItineraryItem } from "@/types/itinerary.types";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";
import itineraryService from "@/services/itinerary.service";

interface Props {
    listingId: string;
    initialData?: Itinerary | null;
    onSubmit: (data: Partial<Itinerary>) => Promise<void>;
}

interface ItemForm {
    id?: string;
    title: string;
    description: string;
    day: string;
}

export default function ItineraryForm({ listingId, initialData, onSubmit }: Props) {
    const [loading, setLoading] = useState(true);
    const [itineraryId] = useState<string | null>(initialData?.id ?? null);
    const [duration, setDuration] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState("");
    const [items, setItems] = useState<ItineraryItem[]>([]);
    useEffect(() => {
        if (!itineraryId) {
            setLoading(false);
            return;
        }
        itineraryService.getItinerariesById(itineraryId).then((itinerary) => {
            if (itinerary) {
                setDuration(itinerary.duration ?? "");
                setDifficultyLevel(itinerary.difficultyLevel ?? "");
                setItems(itinerary.items || []);
            }
            setLoading(false);
        });
    }, [itineraryId]);

    const addItem = () =>
        setItems((p) => [...p, { title: "", description: "", day: (p.length + 1).toString() }]);

    const deleteItem = (i: number) => {
        setItems((prev) => prev.filter((_, idx) => idx !== i));
    };

    const updateItem = (i: number, field: keyof ItemForm, value: string) => {
        setItems((p) => {
            const copy = [...p];
            copy[i][field] = value;
            return copy;
        });
    };

    const handleSubmit = async () => {
        await onSubmit({
            id: itineraryId ?? undefined,
            listingId,
            duration,
            difficultyLevel,
            items: items.map((i) => ({
                ...i,
                day: i.day,
            })) as ItineraryItem[],
        });
    };

    if (loading) return <div>Loading itinerary...</div>;


    return (
        <div className="border p-4 rounded space-y-4">
            <div className="border p-4 rounded space-y-4">
                <Input label="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />

                <Dropdown
                    label="Difficulty"
                    name="difficultyLevel"
                    value={difficultyLevel}
                    options={["Easy", "Moderate", "Challenging"].map((v) => ({ label: v, value: v }))}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                />

                {items.map((item, i) => (
                    <div key={i} className="space-y-2 border p-2 rounded">
                        <Input label="Title" value={item.title} onChange={(e) => updateItem(i, "title", e.target.value)} />
                        <Input label="Day" type="number" value={item.day} onChange={(e) => updateItem(i, "day", e.target.value)} />
                        <TextArea
                            label="Description"
                            value={item.description}
                            onChange={(e) => updateItem(i, "description", e.target.value)}
                        />

                        <Button
                            label="Delete Item"
                            onClick={() => deleteItem(i)}
                            className="top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600 transition"
                        />
                    </div>
                ))}

                <Button label="+ Add Item" onClick={addItem} className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition" />
            </div>
            <Button label="Save Itinerary" onClick={handleSubmit} />
        </div>
    );
}
