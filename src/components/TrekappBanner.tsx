'use client'

import { useEffect, useMemo, useState } from 'react'

function isIosDevice() {
    if (typeof navigator === 'undefined') return false
    return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isInStandaloneMode() {
    if (typeof window === 'undefined') return false
    const isStandaloneDisplayMode = window.matchMedia('(display-mode: standalone)').matches
    const iosStandalone = 'standalone' in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
    return isStandaloneDisplayMode || iosStandalone
}

export default function TrekAppBanner() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstalled, setIsInstalled] = useState(false)
    const [showIosSteps, setShowIosSteps] = useState(false)

    const isIos = useMemo(() => isIosDevice(), [])

    useEffect(() => {
        if (isInStandaloneMode()) {
            setIsInstalled(true)
            return
        }

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault()
            setInstallPrompt(event as BeforeInstallPromptEvent)
        }

        const onInstalled = () => {
            setIsInstalled(true)
            setInstallPrompt(null)
            setShowIosSteps(false)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', onInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', onInstalled)
        }
    }, [])

    const handleInstallApp = async () => {
        if (installPrompt) {
            installPrompt.prompt()
            const { outcome } = await installPrompt.userChoice
            if (outcome === 'accepted') {
                setIsInstalled(true)
            }
            setInstallPrompt(null)
            return
        }

        if (isIos) {
            setShowIosSteps(true)
        }
    }

    return (
        <>
            <div className="w-full flex items-center gap-4 bg-stone-900 border border-stone-800 rounded-2xl px-5 py-4">
                <span className="text-3xl shrink-0">🏔️</span>

                <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm leading-tight">Trek Nepal — Offline App</p>
                    <p className="text-stone-400 text-xs mt-0.5 truncate">Everest & Annapurna · Works without signal</p>
                </div>

                <div className="shrink-0">
                    {isInstalled ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Installed
                        </span>
                    ) : (
                        <button
                            onClick={handleInstallApp}
                            className="bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                        >
                            Install App
                        </button>
                    )}
                </div>
            </div>

            {showIosSteps && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-stone-900 border border-stone-700 rounded-2xl p-5">
                        <h3 className="text-white font-bold mb-2">Install on iPhone</h3>
                        <ol className="text-sm text-stone-300 space-y-2 list-decimal list-inside">
                            <li>Tap the <strong>Share</strong> button in Safari.</li>
                            <li>Scroll and tap <strong>Add to Home Screen</strong>.</li>
                            <li>Tap <strong>Add</strong> to finish.</li>
                        </ol>
                        <button
                            onClick={() => setShowIosSteps(false)}
                            className="mt-4 w-full rounded-xl bg-stone-700 hover:bg-stone-600 text-white text-sm font-semibold py-2.5"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}