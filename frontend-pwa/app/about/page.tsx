import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { MapPin } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-outfit font-black text-slate-900">Sobre Nosotros</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Conoce la historia detrás de nuestra pasión por la tecnología y el servicio excepcional.
                        </p>
                    </div>

                    <div className="glass-card p-8 md:p-12 rounded-[2.5rem] space-y-8">
                        <div className="prose prose-slate max-w-none">
                            <h3 className="text-2xl font-bold font-outfit">Nuestra Misión</h3>
                            <p>
                                En FastStore, nos dedicamos a ofrecer los mejores productos tecnológicos con un servicio al cliente inigualable.
                                Nuestra misión es democratizar el acceso a la última tecnología, brindando asesoría experta y precios competitivos.
                            </p>

                            <h3 className="text-2xl font-bold font-outfit mt-8">Nuestros valores</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Calidad:</strong> Solo vendemos productos originales y garantizados.</li>
                                <li><strong>Integridad:</strong> Transparencia total en precios y características.</li>
                                <li><strong>Innovación:</strong> Siempre a la vanguardia de lo último en el mercado.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="space-y-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-outfit font-black text-slate-900">Visítanos</h2>
                            <p className="text-muted-foreground">Estamos ubicados en el corazón de la ciudad.</p>
                        </div>

                        <div className="w-full h-96 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3986.2308426416403!2d-79.34107499999999!3d-2.4298990000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMsKwMjUnNDcuNiJTIDc5wrAyMCcyNy45Ilc!5e0!3m2!1ses!2sec!4v1771530407936!5m2!1ses!2sec"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                            ></iframe>

                            {/* Overlay Button */}
                            <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
                                <a
                                    href="https://maps.app.goo.gl/dbEidUuc9YYa3UaG6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pointer-events-auto bg-white/90 backdrop-blur-md text-slate-900 px-8 py-4 rounded-2xl font-black shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group/btn border border-white"
                                >
                                    <MapPin className="text-rose-500 group-hover/btn:animate-bounce" />
                                    <span>Abrir Ubicación Exacta</span>
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
