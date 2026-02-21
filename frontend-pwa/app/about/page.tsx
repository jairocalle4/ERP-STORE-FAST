"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCompany } from "@/context/CompanyContext";
import { MapPin, ShieldCheck, Zap, Tag, Star, Package, Truck, Users } from "lucide-react";

export default function AboutPage() {
    const { company } = useCompany();
    const storeName = company.name || "FASTSTORE";

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-20">

                    {/* ───── Hero ───── */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[11px] font-black uppercase tracking-widest">
                            <Star size={12} fill="currentColor" />
                            <span>Calidad para todos los bolsillos</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-outfit font-black text-slate-900 tracking-tight leading-none">
                            SOBRE <span className="gradient-text">{storeName.toUpperCase()}</span>
                        </h1>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                            Vendemos productos originales de primera línea y también opciones económicas accesibles para todo público.
                            Calidad sin compromisos, precio para cada bolsillo.
                        </p>
                    </div>

                    {/* ───── Propuesta de valor principal ───── */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Premium Card */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                            <div className="relative z-10 space-y-5">
                                <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">Top Triple A</p>
                                    <h2 className="text-2xl font-outfit font-black mb-3">Productos Premium &amp; Originales</h2>
                                    <p className="text-slate-300 leading-relaxed text-sm">
                                        Marcas reconocidas, garantía real, calidad verificada. Para quien exige lo mejor
                                        sin importar el precio. Auriculares, cámaras, accesorios de alto rendimiento.
                                    </p>
                                </div>
                                <ul className="space-y-2">
                                    {["100% originales y garantizados", "Rendimiento comprobado", "Soporte técnico incluido"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Económico Card */}
                        <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100">
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
                            <div className="relative z-10 space-y-5">
                                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                    <Tag size={28} />
                                </div>
                                <div>
                                    <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">Accesibles &amp; Rápidos</p>
                                    <h2 className="text-2xl font-outfit font-black text-slate-900 mb-3">Productos Económicos y Funcionales</h2>
                                    <p className="text-slate-500 leading-relaxed text-sm">
                                        Productos que hacen bien su trabajo a un precio que no duele. Perfectos para el día a día,
                                        para regalar o para equipar sin gastar de más. ¡Vuelan del inventario!
                                    </p>
                                </div>
                                <ul className="space-y-2">
                                    {["Precios supercompetitivos", "Alta rotación y disponibilidad", "Relación calidad-precio imbatible"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ───── Misión ───── */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-shrink-0 w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
                            <Zap size={32} />
                        </div>
                        <div>
                            <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">Nuestra Misión</p>
                            <h2 className="text-2xl font-outfit font-black text-slate-900 mb-3">
                                Democratizar el acceso a la tecnología y los productos de calidad
                            </h2>
                            <p className="text-slate-500 leading-relaxed">
                                En <strong className="text-slate-700">{storeName}</strong> creemos que todos merecen acceder a buenas herramientas, desde el estudiante
                                que necesita un mouse funcional hasta el profesional que exige lo mejor de lo mejor.
                                Por eso mantenemos una selección amplia: lo más alto de gama junto con alternativas
                                accesibles, siempre con honestidad en lo que vendemos y transparencia en los precios.
                            </p>
                        </div>
                    </div>

                    {/* ───── Stats ───── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Package, num: "500+", label: "Productos" },
                            { icon: Users, num: "1K+", label: "Clientes felices" },
                            { icon: Star, num: "4.9★", label: "Calificación" },
                            { icon: Truck, num: "24h", label: "Envío rápido" },
                        ].map((s, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 group hover:border-primary/30 hover:shadow-md transition-all">
                                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                                    <s.icon size={20} />
                                </div>
                                <p className="text-2xl md:text-3xl font-outfit font-black gradient-text">{s.num}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ───── Mapa ───── */}
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-4xl font-outfit font-black text-slate-900">ENCUÉNTRANOS</h2>
                            <p className="text-slate-500">Estamos en el corazón de la ciudad. ¡Visítanos y conoce nuestro catálogo en persona!</p>
                        </div>

                        <div className="w-full h-[480px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3986.2308426416403!2d-79.34107499999999!3d-2.4298990000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMsKwMjUnNDcuNiJTIDc5wrAyMCcyNy45Ilc!5e0!3m2!1ses!2sec!4v1771530407936!5m2!1ses!2sec"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                            ></iframe>

                            {/* Button anchored bottom-left — NO obstruye el centro del mapa */}
                            <div className="absolute bottom-5 left-5 pointer-events-none">
                                <a
                                    href="https://maps.app.goo.gl/dbEidUuc9YYa3UaG6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md text-slate-900 px-5 py-3 rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all border border-white/60 text-sm"
                                >
                                    <MapPin size={18} className="text-rose-500" />
                                    <span>Abrir en Google Maps</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
