import URLAnalysisDashboard from './URLAnalysisDashboard';
import SiteStructureFaq from './components/SiteStructureFaq';
import { Metadata } from 'next';

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL;
    
export const metadata: Metadata = {
    title: 'Site Structure Analyzer - SEO Platform',
    description:
      "Have questions or suggestions? Reach out to the SEO Tools Hub team. We're here to help you optimize your SEO workflow and improve your website's performance.",
      robots: {
          index: false, // Equivalent to "noindex"
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