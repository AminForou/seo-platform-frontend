// app/about/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us - SEO Platform",
  description: "Learn more about our mission and team at SEO Platform.",
};

export default function About() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg mb-2">
  At SEO Platform, we are dedicated to helping you improve your website&apos;s search engine rankings.
</p>

      <p className="text-lg">
        Our team consists of experienced professionals passionate about SEO.
      </p>
    </div>
  );
}
