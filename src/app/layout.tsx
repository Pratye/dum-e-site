import type { Metadata } from "next";
import { Manrope, Orbitron } from "next/font/google";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dum-E Robotics | Affordable Humanoid Robotics",
  description:
    "Dum-E Robotics is building affordable humanoid robots for India's 60M+ SMEs, sold outright or as Robotics-as-a-Service.",
  openGraph: {
    title: "Dum-E Robotics | The Maruti of Robots",
    description: "Affordable humanoid robots for India's 60M+ labour-intensive SMEs. See the design, the simulation and the arm we are building now.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
