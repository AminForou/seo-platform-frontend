// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import Nav from './components/Nav';
import Footer from './components/Footer';

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL;

export const metadata: Metadata = {
  title: 'URL Status Checker - SEO Platform',
  description: 'Check the status code of any URL using our tool.',
  robots: {
    index: false,
  },
  alternates: {
    canonical: `${domain}/tool`,
  },
  icons: {
    icon: '/favicon.ico', // This adds the favicon
    apple: '/apple-touch-icon.png', // Optional: Add Apple touch icon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Nav />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
