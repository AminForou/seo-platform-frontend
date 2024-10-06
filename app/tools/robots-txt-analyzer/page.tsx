// app/tools/robots-txt-analyzer/page.tsx

import RobotsTxtAnalyzer from './RobotsTxtAnalyzer';
import { Metadata } from 'next';

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL;

export const metadata: Metadata = {
  title: 'Robots.txt Analyzer - SEO Platform',
  description:
    "Analyze your robots.txt files for syntax errors, test URLs against your robots.txt rules, and compare different versions. Improve your site's SEO with our Robots.txt Analyzer tool.",
  robots: {
    index: true,
  },
  alternates: {
    canonical: `${domain}/tools/robots-txt-analyzer`,
  },
};

export default function RobotsTxtAnalyzerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <RobotsTxtAnalyzer />
      {/* Include an FAQ component if you have one */}
    </div>
  );
}
