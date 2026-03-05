"use client";

import { Picture } from "../../../types/picture.types";

interface Props {
    picture: Picture;
    selected?: boolean;
    onSelect: (picture: Picture) => void;
}

export default function PictureTile({
    picture,
    selected = false,
    onSelect,
}: Props) {
    return (
        <button
            type="button"
            onClick={() => onSelect(picture)}
            className={`relative rounded overflow-hidden border transition
        ${selected ? "ring-2 ring-blue-500 border-blue-500" : "hover:shadow-md"}
      `}
        >
            {/* Image */}
            <img
                src={picture.url}
                alt={picture.name}
                className="h-32 w-full object-cover"
                loading="lazy"
            />

            {/* Selected overlay */}
            {selected && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">
                        ✓
                    </div>
                </div>
            )}
        </button>
    );
}
