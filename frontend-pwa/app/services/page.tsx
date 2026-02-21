"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCompany } from "@/context/CompanyContext";
import {
    Code2, Cpu, ShoppingCart, BarChart3, MessageSquare,
    CheckCircle2, ArrowRight, Wrench, Globe, Database, Zap
} from "lucide-react";
import Link from "next/link";

const SERVICES = [
    {
        icon: Code2,
        color: "bg-violet-50 text-violet-600",
        accent: "bg-violet-600",
        title: "Desarrollo de Software a Medida",
        desc: "Diseño y desarrollo de aplicaciones web, sistemas ERP, CRM y portales personalizados adaptados exactamente a tu proceso de negocio.",
        features: ["Análisis de requerimientos", "Arquitectura escalable", "UI/UX moderno", "Entrega con soporte"],
    },
    {
        icon: Globe,
        color: "bg-blue-50 text-blue-600",
        accent: "bg-blue-600",
        title: "Sitios Web & Tiendas Online",
        desc: "Landing pages, portafolios profesionales y e-commerce completos con panel de administración, pagos y catálogo de productos.",
        features: ["Diseño responsivo", "Optimización SEO", "Panel administrativo", "Integración de pagos"],
    },
    {
        icon: Wrench,
        color: "bg-amber-50 text-amber-600",
        accent: "bg-amber-500",
        title: "Consultoría Tecnológica",
        desc: "Asesoramiento estratégico para digitalizar tu negocio: selección de tecnologías, arquitectura de sistemas, migraciones y revisión de código.",
        features: ["Auditoría de sistemas", "Selección de tech stack", "Migración de bases de datos", "Revisiones de código"],
    },
    {
        icon: Database,
        color: "bg-emerald-50 text-emerald-600",
        accent: "bg-emerald-600",
        title: "Bases de Datos & APIs",
        desc: "Diseño de bases de datos relacionales y no relacionales, desarrollo de APIs REST, integración de servicios externos y optimización de consultas.",
        features: ["SQL Server / MySQL / MongoDB", "APIs RESTful", "Integraciones SRI/terceros", "Optimización de rendimiento"],
    },
];

const SOFTWARE_PRODUCTS = [
    {
        icon: ShoppingCart,
        badge: "⭐ Producto Estrella",
        badgeColor: "bg-violet-100 text-violet-700",
        name: "FASTSTORE",
        tagline: "ERP + Tienda Online todo en uno",
        desc: "Sistema completo para gestionar tu negocio: inventario, ventas, clientes, reportes y una tienda PWA integrada. Disponible como software independiente o como servicio.",
        stack: ["Next.js", "ASP.NET Core", "SQL Server", "PWA"],
        cta: "Conocer más",
        price: "Precio según modalidad",
    },
    {
        icon: BarChart3,
        badge: "Próximamente",
        badgeColor: "bg-slate-100 text-slate-500",
        name: "Otros proyectos",
        tagline: "Portafolio de soluciones",
        desc: "Tengo más proyectos desarrollados con distintas tecnologías. Contáctame para conocer el catálogo completo y encontrar la solución que tu negocio necesita.",
        stack: ["React", "Python", ".NET", "Node.js"],
        cta: "Consultar disponibilidad",
        price: "A convenir",
    },
];

export default function ServicesPage() {
    const { company } = useCompany();
    const whatsappNumber = company.phone?.replace(/\D/g, "") || "";
    const whatsappLink = whatsappNumber
        ? `https://wa.me/593${whatsappNumber.replace(/^0/, "")}?text=${encodeURIComponent("Hola, estoy interesado en sus servicios de software.")}`
        : "https://wa.me/";

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-24">

                    {/* ── Hero ── */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[11px] font-black uppercase tracking-widest">
                            <Cpu size={12} />
                            <span>Ingeniería de Software Profesional</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-outfit font-black text-slate-900 tracking-tight leading-none">
                            SERVICIOS <span className="gradient-text">DIGITALES</span>
                        </h1>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                            Además de nuestra tienda, ofrecemos servicios completos de desarrollo de software y consultoría tecnológica.
                            Transformamos ideas en soluciones reales y escalables.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-2">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="premium-button px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20 group font-black uppercase tracking-widest text-sm"
                            >
                                <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                                <span>Consultar por WhatsApp</span>
                            </a>
                            <Link
                                href="#software"
                                className="bg-white text-foreground px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg border border-slate-100 hover:border-primary/30 transition-all active:scale-95 text-sm"
                            >
                                <span>Ver Software en Venta</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* ── Services Grid ── */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-outfit font-black text-slate-900">¿QUÉ PUEDO HACER POR TI?</h2>
                            <p className="text-slate-500 mt-2">Servicios disponibles como Ingeniero en Software independiente</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {SERVICES.map((service, i) => (
                                <div key={i} className="bg-white rounded-[2rem] p-8 shadow-md border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${service.color} group-hover:scale-110 transition-transform`}>
                                            <service.icon size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-outfit font-black text-slate-900 text-lg">{service.title}</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed mt-1">{service.desc}</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-2">
                                        {service.features.map((f, j) => (
                                            <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                                                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Software Products ── */}
                    <div id="software" className="space-y-6 scroll-mt-32">
                        <div className="text-center">
                            <h2 className="text-3xl font-outfit font-black text-slate-900">SOFTWARE EN VENTA</h2>
                            <p className="text-slate-500 mt-2">Proyectos ya desarrollados disponibles para compra o licenciamiento</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {SOFTWARE_PRODUCTS.map((product, i) => (
                                <div key={i} className={`rounded-[2rem] p-8 border transition-all duration-300 ${i === 0 ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-2xl' : 'bg-white border-slate-100 shadow-md hover:shadow-xl'}`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${i === 0 ? 'bg-primary/20 text-primary' : 'bg-slate-100 text-slate-600'}`}>
                                            <product.icon size={22} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${product.badgeColor}`}>
                                            {product.badge}
                                        </span>
                                    </div>
                                    <h3 className={`font-outfit font-black text-2xl mb-1 ${i === 0 ? 'text-white' : 'text-slate-900'}`}>{product.name}</h3>
                                    <p className={`text-sm font-bold mb-3 ${i === 0 ? 'text-primary' : 'text-slate-500'}`}>{product.tagline}</p>
                                    <p className={`text-sm leading-relaxed mb-5 ${i === 0 ? 'text-slate-300' : 'text-slate-500'}`}>{product.desc}</p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {product.stack.map((tech, j) => (
                                            <span key={j} className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${i === 0 ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-500'}`}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-bold ${i === 0 ? 'text-slate-400' : 'text-slate-400'}`}>{product.price}</span>
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${i === 0 ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30' : 'bg-slate-900 text-white hover:bg-slate-700'}`}
                                        >
                                            {product.cta}
                                            <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── CTA Final ── */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 rounded-3xl bg-primary/20 text-primary flex items-center justify-center mx-auto">
                                <Zap size={32} />
                            </div>
                            <h2 className="text-4xl font-outfit font-black text-white">¿TIENES UN PROYECTO EN MENTE?</h2>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                Cuéntame tu idea. Analizamos juntos los requerimientos y te propongo la mejor solución técnica para tu presupuesto.
                            </p>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 premium-button px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group text-sm"
                            >
                                <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
                                <span>Hablemos por WhatsApp</span>
                            </a>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
