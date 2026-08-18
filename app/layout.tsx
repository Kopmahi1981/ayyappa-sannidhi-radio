import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#080503",
};

export const metadata: Metadata = {
  title: "Ayyappa Sannidhi Radio | అయ్యప్ప స్వామి భక్తి గీతాలు",
  description: "An immersive digital shrine and sacred internet radio dedicated to Lord Ayyappa, playing timeless devotional songs across Telugu, Tamil, and Malayalam.",
  keywords: ["Ayyappa Radio", "Sabarimala Devotional Songs", "Harivarasanam", "Yesudas Ayyappa Songs", "Padi Pooja", "Swamiye Saranam Ayyappa"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&family=Noto+Sans+Malayalam:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="h-full h-[100dvh] overflow-hidden bg-[#080503] font-sans antialiased text-[#FDF6E2]">
        <AudioPlayerProvider>
          {children}
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
