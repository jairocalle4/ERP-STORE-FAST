import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FastStore | Tu Tienda Online Profesional",
    template: "%s | FastStore"
  },
  description: "Descubre la mejor selección de productos con la mejor calidad y servicio. Envío rápido y pagos seguros.",
  keywords: ["ecommerce", "tienda online", "productos premium", "FastStore", "tecnología", "moda", "hogar"],
  authors: [{ name: "FastStore Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#7c3aed",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://faststore.dominioprueba.com",
    title: "FastStore | Tu Tienda Online Profesional",
    description: "La mejor experiencia de compra online. Calidad, rapidez y seguridad en cada pedido.",
    siteName: "FastStore",
    images: [
      {
        url: "/og-image.jpg", // Necesitamos crear esta imagen
        width: 1200,
        height: 630,
        alt: "FastStore Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FastStore | Tu Tienda Online Profesional",
    description: "La mejor experiencia de compra online.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen selection:bg-primary/30`}
      >
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white opacity-40"></div>
        <CartProvider>
          <CartDrawer />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
