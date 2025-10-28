import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const geistBricolage_Grotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "LyxLang Studio",
  description: "LyxLang Studio es un entorno de desarrollo web avanzado construido con Next.js y TypeScript, diseñado para compilar y ejecutar código en múltiples lenguajes directamente desde el navegador.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistBricolage_Grotesque.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
