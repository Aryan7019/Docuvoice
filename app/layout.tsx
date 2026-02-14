import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Provider from './Provider';
import { ClerkProvider } from '@clerk/nextjs'
import { NavigationLoader } from './_components/NavigationLoader';
import { ErrorSuppressor } from './_components/ErrorSuppressor';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans", 
});

export const metadata: Metadata = {
  title: "DocuVoice - AI-Powered Healthcare",
  description: "Experience next-generation healthcare with AI-powered medical consultations. Get instant symptom analysis, personalized treatment plans, and connect with specialized virtual doctors anytime.",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${montserrat.variable} antialiased`}>
          <ErrorSuppressor />
          <NavigationLoader />
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}