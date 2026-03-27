import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { Chatbot } from "@/components/chatbot";
import { LanguageProvider } from "@/components/language-provider";
import { AuthProvider } from "@/components/auth-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "BOCRA — Botswana Communications Regulatory Authority",
  description:
    "Botswana's independent, converged communications regulator. Promoting competition, innovation, consumer protection, and universal access across telecommunications, broadcasting, postal, and internet sectors.",
  keywords: [
    "BOCRA",
    "Botswana",
    "telecommunications",
    "regulator",
    "licensing",
    "broadcasting",
    "spectrum",
    "cybersecurity",
    ".bw domain",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans`}>
        <AuthProvider>
          <LanguageProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[100] focus:bg-bocra-blue focus:text-white focus:p-3 focus:text-sm shadow-xl"
            >
              Skip to main content
            </a>
            <Header />
            <PageBreadcrumbs />
            <main id="main-content" className="min-h-screen">
              {children}
            </main>

            <Footer />
            <Chatbot />
            <CookieConsent />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
