import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
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
      className={`${poppins.variable} light`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-[#fafaf6] dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#fafaf6] font-sans antialiased transition-colors">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
