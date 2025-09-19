import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter as FontSans } from "next/font/google"
import { cn } from '@/lib/utils';
import { Literata as FontSerif } from 'next/font/google';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
  axes: ['opsz']
})

export const metadata: Metadata = {
  title: 'GratitudeFlow',
  description: 'A daily gratitude journal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
        fontSerif.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
