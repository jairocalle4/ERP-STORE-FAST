"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function InstallPwaPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Cooldown timer de 7 días (en milisegundos)
        const dismissedAt = localStorage.getItem("pwa_prompt_dismissed_at");
        if (dismissedAt) {
            const timePassed = Date.now() - parseInt(dismissedAt, 10);
            const daysToWait = 1 * 24 * 60 * 60 * 1000; // 1 día
            if (timePassed < daysToWait) return; // Si no ha pasado 1 día, no mostramos el prompt
        }

        // Si ya lo instaló con éxito en el pasado, nunca más lo mostramos
        const hasInstalled = localStorage.getItem("pwa_installed");
        if (hasInstalled === "true") return;

        const handler = (e: Event) => {
            e.preventDefault(); // Prevent standard visual prompt for full custom control
            setDeferredPrompt(e);
            setTimeout(() => setShowPrompt(true), 1500); // Slide in smoothly after 1.5s
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowPrompt(false);
            localStorage.setItem("pwa_installed", "true");
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Guardar el tiempo actual para iniciar el temporizador de 7 días
        localStorage.setItem("pwa_prompt_dismissed_at", Date.now().toString());
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[100] md:max-w-md md:left-1/2 md:-translate-x-1/2 animate-slide-in-up">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex items-center justify-between text-white gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none"></div>

                <div className="flex items-center gap-4 z-10 w-full">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <img src="/icon-192x192.png" alt="App Icon" className="w-8 h-8 object-contain" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-sm leading-tight text-white mb-1">Instala FASTSTORE</h4>
                        <p className="text-[10px] text-slate-300 leading-tight">Acceso rápido y sin conexión</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 z-10 shrink-0">
                    <button
                        onClick={handleInstallClick}
                        className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
                    >
                        <Download size={14} /> Instalar
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-slate-400 hover:text-white shrink-0"
                        aria-label="Cerrar"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
