"use client";
import React, { useState } from 'react';
import { FaFacebookF, FaLinkedin, FaCopy, FaTwitter } from 'react-icons/fa';

interface SocialShareProps {
    className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ className = '' }) => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const shareToSocialMedia = (platform: string) => {
        const url = window.location.href;
        const text = "Check out this amazing page!";
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    showToast("URL copied to clipboard!");
                }).catch(() => {
                    showToast("Failed to copy URL.");
                });
                return;
            default:
                return;
        }

        window.open(shareUrl, '_blank');
        showToast(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
    };

    return (
        <div className={`flex gap-2 items-center ${className}`}>
            <button
                onClick={() => shareToSocialMedia('facebook')}
                className="p-2 cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                title="Share on Facebook"
            >
                <FaFacebookF className="w-3 h-3" />
            </button>
            <button
                onClick={() => shareToSocialMedia('twitter')}
                className="p-2 cursor-pointer rounded-full bg-sky-500 hover:bg-sky-600 text-white"
                title="Share on Twitter"
            >
                <FaTwitter className="w-3 h-3" />

            </button>
            <button
                onClick={() => shareToSocialMedia('linkedin')}
                className="p-2 cursor-pointer rounded-full bg-blue-700 hover:bg-blue-800 text-white"
                title="Share on LinkedIn"
            >
                <FaLinkedin className="w-3 h-3" />
            </button>
            <button
                onClick={() => shareToSocialMedia('copy')}
                className="p-2 cursor-pointer rounded-full bg-teal-500 hover:bg-teal-600 text-white"
                title="Copy URL">
                <FaCopy className="w-3 h-3" />

            </button>

            {toastMessage && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default SocialShare;
