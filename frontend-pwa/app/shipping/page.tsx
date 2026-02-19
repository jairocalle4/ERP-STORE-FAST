import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShippingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-outfit font-black text-slate-900">Envíos y Devoluciones</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Toda la información que necesitas sobre nuestra logística y garantías.
                        </p>
                    </div>

                    <div className="glass-card p-8 md:p-12 rounded-[2.5rem] space-y-8">
                        <div className="prose prose-slate max-w-none">
                            <h3 className="text-2xl font-bold font-outfit">Política de Envíos</h3>
                            <p>
                                Ofrecemos envíos a todo el territorio nacional. Los tiempos de entrega varían según la ubicación, generalmente entre 24 a 48 horas hábiles después de confirmado el pago.
                            </p>

                            <h3 className="text-2xl font-bold font-outfit mt-8">Costos de Envío</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Local:</strong> $2.50 o Gratis en compras superiores a $50.</li>
                                <li><strong>Nacional:</strong> $5.00 tarifa plana.</li>
                            </ul>

                            <h3 className="text-2xl font-bold font-outfit mt-8">Devoluciones</h3>
                            <p>
                                Si no está satisfecho con su compra, aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto. El artículo debe estar sin usar y en las mismas condiciones en que lo recibió.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
