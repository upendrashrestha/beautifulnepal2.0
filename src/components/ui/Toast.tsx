'use client';

import { useEffect } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export default function Toast({
    message,
    type = 'success',
    onClose,
    duration = 3000,
}: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const styles = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
    };

    return (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
            <div
                className={`rounded-lg px-4 py-3 text-sm text-white shadow-lg ${styles[type]}`}
            >
                {message}
            </div>
        </div>
    );
}
