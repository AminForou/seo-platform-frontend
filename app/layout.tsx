// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import Nav from './components/Nav';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'SEO Platform',
  description: 'Optimize your website SEO with our tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Nav />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
