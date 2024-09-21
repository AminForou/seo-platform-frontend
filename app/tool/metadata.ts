import type { Metadata } from 'next';

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL || 'https://yourdomain.com';

export const metadata: Metadata = {
  title: 'URL Status Checker - SEO Platform',
  description: 'Check the status code of any URL using our tool.',
  robots: {
    index: false,
  },
  alternates: {
    canonical: `${domain}/tool`,
  },
};