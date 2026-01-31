"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye } from "react-icons/fa";

interface EventImageModalProps {
    imageUrl: string;
    alt?: string;
    className?: string;
}

export default function EventImageModal({
    imageUrl,
    alt,
    className,
}: EventImageModalProps) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className={`relative ${className || ""}`}> {/* MUST be relative */}
            {/* Hero Image */}
            <img
                src={imageUrl}
                alt={alt || "Event Image"}
                className="rounded-2xl shadow-xl w-full h-96 object-cover"
            />

            {/* View Button */}
            <button
                onClick={handleOpen}
                className="absolute bottom-4 right-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg cursor-pointer"
            >
                <span className="inline-block">
                    <FaEye />
                </span>
                <span className="px-1">View</span>

            </button>

            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    >
                        <motion.img
                            src={imageUrl}
                            alt={alt || "Event Image"}
                            className="max-h-full max-w-full object-contain shadow-xl rounded-lg"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()} // prevent closing on image click
                        />

                        <motion.button
                            onClick={handleClose}
                            className="absolute top-6 right-6 text-white text-3xl font-bold z-20"
                            aria-label="Close image"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            &times;
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
