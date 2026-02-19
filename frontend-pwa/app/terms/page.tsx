import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-outfit font-black text-slate-900">Términos y Condiciones</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Por favor lea nuestros términos de servicio cuidadosamente antes de usar nuestro sitio.
                        </p>
                    </div>

                    <div className="glass-card p-8 md:p-12 rounded-[2.5rem] space-y-8">
                        <div className="prose prose-slate max-w-none">
                            <h3 className="text-2xl font-bold font-outfit">1. Aceptación de los Términos</h3>
                            <p>
                                Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos Términos y Condiciones de Uso, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables.
                            </p>

                            <h3 className="text-2xl font-bold font-outfit mt-8">2. Licencia de Uso</h3>
                            <p>
                                Se concede permiso para acceder temporalmente a los materiales de información en el sitio web de FastStore para visualización transitoria personal y no comercial.
                            </p>

                            <h3 className="text-2xl font-bold font-outfit mt-8">3. Exención de Responsabilidad</h3>
                            <p>
                                Los materiales en el sitio web de FastStore se proporcionan "tal cual". FastStore no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías, incluidas, entre otras, las garantías implícitas o las condiciones de comerciabilidad.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
