// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import Nav from './components/Nav';
import Footer from './components/Footer';
import './fontawesome'; // Import the FontAwesome configuration

export const metadata: Metadata = {
  title: "SEO Platform",
  description: "Optimize your website SEO with our tools.",
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
