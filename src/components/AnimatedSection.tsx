// components/AnimatedSection.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
    children: ReactNode
}

export default function AnimatedSection({ children }: Props) {
    return (
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
            className="animate_left relative mx-auto hidden md:block md:w-full h-auto"
        >
            {children}
        </motion.div>
    );
}
