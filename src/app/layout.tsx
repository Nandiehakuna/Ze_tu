import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Zetu - Send Money Home with Your Voice",
  description: "AI-native Bitcoin remittance service for the African diaspora. Send money home using voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} bg-[#1a1a1a]`}
    >
      <body className="min-h-screen flex flex-col bg-[#1a1a1a] text-[#fafaf6] font-poppins antialiased">
        {children}
      </body>
    </html>
  );
}
