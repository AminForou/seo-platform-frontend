import URLAnalysisDashboard from './URLAnalysisDashboard';
import SiteStructureFaq from './components/SiteStructureFaq';
import { Metadata } from 'next';

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL;
    
export const metadata: Metadata = {
    title: 'Site Structure Analyzer - Analyze URL Patterns & Hierarchy | Prismiqo',
    description:
      "Analyze your website's structure and gain insights into your URL patterns and folder hierarchy with our comprehensive site structure analyzer.",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${domain}/tools/site-structure-analyzer`,
    },
};

export default function BulkUrlOpenerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <URLAnalysisDashboard />
       <SiteStructureFaq />
    </div>
  );
}