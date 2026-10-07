import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Dum-E Robotics | Affordable humanoid robots for India",
  description:
    "Dum-E is building humanoid robots that India's 60M+ small businesses can buy for ₹1–5 lakh, or rent for what they pay one worker.",
  openGraph: {
    title: "Dum-E Robotics | The Maruti of robots",
    description: "Affordable humanoid robots for India's labour-intensive small businesses. See the design, the simulation and the arm we are building now.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
