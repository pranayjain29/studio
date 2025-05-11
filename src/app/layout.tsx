import type {Metadata} from 'next';
import Link from 'next/link';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Keyword Research Tools',
  description: 'Tools for Amazon and Flipkart keyword/product research.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Research Tools
            </Link>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/">Amazon Research</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/flipkart-scrapper">Flipkart Scrapper</Link>
              </Button>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
