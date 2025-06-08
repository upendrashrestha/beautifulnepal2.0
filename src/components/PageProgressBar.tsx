// components/PageProgressBar.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress'; // Make sure nprogress is installed
import 'nprogress/nprogress.css'; // Import the CSS

NProgress.configure({ showSpinner: false, speed: 500 }); // Optional: configure NProgress

export default function PageProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        NProgress.done(); // Ensure it's done when component mounts (initial load)
    }, []);

    useEffect(() => {
        // Start progress when navigation starts
        NProgress.start();

        // Finish progress when pathname or searchParams change (navigation completes)
        // A small delay ensures it shows up even for very fast navigations
        const timer = setTimeout(() => {
            NProgress.done();
        }, 100); // Adjust delay as needed

        return () => {
            clearTimeout(timer);
            NProgress.done(); // Ensure it's done on unmount or before next effect runs
        };
    }, [pathname, searchParams]); // Re-run effect on route changes

    return null; // This component doesn't render anything visible directly
}