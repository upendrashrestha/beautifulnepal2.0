'use client'

import { useEffect, useState } from 'react'

export default function TrekAppBanner() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
            return
        }

        const handler = (e: Event) => {
            e.preventDefault()
            setInstallPrompt(e as BeforeInstallPromptEvent)
        }

        const onInstalled = () => setIsInstalled(true)

        window.addEventListener('beforeinstallprompt', handler)
        window.addEventListener('appinstalled', onInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
            window.removeEventListener('appinstalled', onInstalled)
        }
    }, [])

    const handleInstall = async () => {
        if (!installPrompt) return
        installPrompt.prompt()
        const { outcome } = await installPrompt.userChoice
        if (outcome === 'accepted') {
            setInstallPrompt(null)
            setIsInstalled(true)
        }
    }

    return (
        <div className="w-full flex flex-row items-center gap-4 bg-stone-900 border border-stone-800 rounded-2xl px-5 py-4">
            {/* Icon */}
            <span className="text-3xl shrink-0">🏔️</span>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm leading-tight">
                    Trek Nepal — Offline App
                </p>
                <p className="text-stone-400 text-xs mt-0.5 truncate">
                    Everest & Annapurna · Works without signal
                </p>
            </div>

            {/* Action */}
            <div className="shrink-0">
                {isInstalled ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Installed
                    </span>
                ) : installPrompt ? (
                    <button
                        onClick={handleInstall}
                        className="bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                    >
                        📲 Install Free
                    </button>
) : (
                    <span className="text-[11px] leading-tight text-stone-400 text-right max-w-[10rem] inline-block">
                        iPhone: Share → Add to Home Screen
                    </span>
                )}
            </div>
        </div>
    )
}