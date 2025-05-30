"use client";

import { motion, useAnimation } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface Props {
    children: ReactNode;
}

export default function AnimatedSection({ children }: Props) {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const variants = {
        hidden: {
            opacity: 0,
            y: 20, // slide from bottom
        },
        visible: {
            opacity: 1,
            y: 0,
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={controls}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="animate_left relative mx-auto w-full h-auto px-4 sm:px-6 md:px-8"
        >
            {children}
        </motion.div>
    );
}
