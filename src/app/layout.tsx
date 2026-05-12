import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Solnow — El sistema operativo para flotas de motos de agua",
  description:
    "Digitalizamos venta, papeleo, operación en tiempo real y postventa. Para operadores con flotas que ya no escalan con sistemas genéricos.",
  openGraph: {
    title: "Solnow — El sistema operativo para flotas de motos de agua",
    description:
      "Digitalizamos venta, papeleo, operación en tiempo real y postventa. Para operadores con flotas que ya no escalan con sistemas genéricos.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-palette="brand" data-density="regular">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
