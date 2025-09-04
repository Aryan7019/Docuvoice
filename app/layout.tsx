import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Provider from './Provider';
import { ClerkProvider } from '@clerk/nextjs'

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans", 
});

export const metadata: Metadata = {
  title: "Docuvoice - Medical Voice Assistant",
  description: "AI-powered medical voice assistant for appointment booking and symptom triage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider >
      <html lang="en">
        <body className={`${montserrat.variable} antialiased`}>
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}