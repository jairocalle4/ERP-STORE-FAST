"use client";

import { ShoppingBag, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch("http://localhost:5140/api/v1/CompanySettings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        }
        fetchSettings();
    }, []);

    return (
        <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Branding */}
                <div className="space-y-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg premium-button flex items-center justify-center">
                            <ShoppingBag size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-outfit font-black tracking-tighter text-foreground">
                            {settings?.name?.toUpperCase() || "FAST"}<span className="gradient-text">{settings?.name ? "" : "STORE"}</span>
                        </span>
                    </Link>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Tu destino premium para productos de alta calidad. Innovación, estilo y servicio excepcional en cada clic.
                    </p>
                    {/* Social Media Hidden for now */}
                    {/* <div className="flex gap-4">
                        {[Facebook, Instagram, Twitter].map((Icon, i) => (
                            <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                                <Icon size={18} />
                            </Link>
                        ))}
                    </div> */}
                </div>

                {/* Information Links */}
                <div>
                    <h4 className="font-outfit font-bold text-foreground mb-6">Información</h4>
                    <ul className="space-y-4">
                        <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre Nosotros</Link></li>
                        <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Términos y Condiciones</Link></li>
                        <li><Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">Envíos y Devoluciones</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div id="footer-contact">
                    <h4 className="font-outfit font-bold text-foreground mb-6">Contacto</h4>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 group">
                            <MapPin size={18} className="text-primary mt-0.5" />
                            <a
                                href="https://maps.app.goo.gl/dbEidUuc9YYa3UaG6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2 hover:underline"
                            >
                                {settings?.address || "Ver nuestra ubicación en Maps"}
                            </a>
                        </li>
                        <li className="flex items-center gap-3 group">
                            <Phone size={18} className="text-primary" />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                {settings?.phone || "Teléfono en proceso..."}
                            </span>
                        </li>
                        <li className="flex items-center gap-3 group">
                            <Mail size={18} className="text-primary" />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                {settings?.email || "Correo en proceso..."}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-muted-foreground">
                    © 2026 {settings?.name || "FastStore Inc"}. Todos los derechos reservados.
                </p>
                {/* Legal links moved to column */}
            </div>
        </footer>
    );
}
