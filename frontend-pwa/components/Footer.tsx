import { ShoppingBag, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
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
                            FAST<span className="gradient-text">STORE</span>
                        </span>
                    </Link>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Tu destino premium para productos de alta calidad. Innovación, estilo y servicio excepcional en cada clic.
                    </p>
                    <div className="flex gap-4">
                        {[Facebook, Instagram, Twitter].map((Icon, i) => (
                            <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                                <Icon size={18} />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-outfit font-bold text-foreground mb-6">Explorar</h4>
                    <ul className="space-y-4">
                        {["Nuevas Llegadas", "Colección Invierno", "Más Vendidos", "Promociones"].map((link) => (
                            <li key={link}>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-outfit font-bold text-foreground mb-6">Compañía</h4>
                    <ul className="space-y-4">
                        {["Sobre Nosotros", "Carreras", "Sostenibilidad", "Prensa"].map((link) => (
                            <li key={link}>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-outfit font-bold text-foreground mb-6">Contacto</h4>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 group">
                            <MapPin size={18} className="text-primary mt-0.5" />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Calle Principal 123, Ciudad Elegante</span>
                        </li>
                        <li className="flex items-center gap-3 group">
                            <Phone size={18} className="text-primary" />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">+1 (555) 0123-4567</span>
                        </li>
                        <li className="flex items-center gap-3 group">
                            <Mail size={18} className="text-primary" />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">contacto@faststore.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-50 flex flex-col md:row justify-between items-center gap-4">
                <p className="text-xs text-muted-foreground">
                    © 2026 FastStore Inc. Todos los derechos reservados.
                </p>
                <div className="flex gap-6">
                    {["Política de Privacidad", "Términos de Servicio", "Cookies"].map((legal) => (
                        <Link key={legal} href="#" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors">{legal}</Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}
