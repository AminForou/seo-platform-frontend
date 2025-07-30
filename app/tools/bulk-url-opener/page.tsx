import BulkUrlOpener from './BulkUrlOpener';
import BulkUrlFaq from './components/BulkUrlFaq';
import { Metadata } from 'next';

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL;
    
export const metadata: Metadata = {
    title: 'Bulk URL Opener - SEO Platform',
    description:
      "Have questions or suggestions? Reach out to the Prismiqo team. We're here to help you optimize your SEO workflow and improve your website's performance.",
      robots: {
          index: false, // Equivalent to "noindex"
        },
        alternates: {
          canonical: `${domain}/tools/bulk-url-opener`,
        },
  };
export default function BulkUrlOpenerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BulkUrlOpener />
      <BulkUrlFaq />
    </div>
  );
}