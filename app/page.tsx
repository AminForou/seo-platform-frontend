// app/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Home - SEO Platform",
  description: "Welcome to our SEO Platform. Optimize your website now!",
};

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to SEO Platform</h1>
      <p className="text-lg">
        Our platform offers tools to help you optimize your website for search engines.
      </p>
    </div>
  );
}
