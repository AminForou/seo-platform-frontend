// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { Nunito, Outfit } from 'next/font/google';

const nunito = Nunito({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-outfit',
});

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
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/prismiqo-logo.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',
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
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/prismiqo-logo.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function () {
                const faqItems = document.querySelectorAll('.faq-item');

                faqItems.forEach((item) => {
                  const questionButton = item.querySelector('.faq-question');
                  const answer = item.querySelector('.faq-answer');
                  const icon = item.querySelector('.faq-icon');

                  questionButton.addEventListener('click', () => {
                    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
                    
                    // Close all other items
                    faqItems.forEach((i) => {
                      i.querySelector('.faq-answer').style.maxHeight = null;
                      i.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                      i.querySelector('.faq-question span').classList.remove('faq-gradient-text');
                    });

                    // Toggle the current item
                    if (!isOpen) {
                      answer.style.maxHeight = answer.scrollHeight + 'px';
                      icon.style.transform = 'rotate(180deg)';
                      questionButton.querySelector('span').classList.add('faq-gradient-text');
                    }
                  });
                });
              });
            `,
          }}
        />
      </head>
      <body className={`flex flex-col min-h-screen bg-black ${nunito.className} ${outfit.variable}`}>
        <Nav />
        <main className="flex-grow">
          <div className="mx-auto">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
