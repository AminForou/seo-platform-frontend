import MiniCrawler from './MiniCrawler';
import MiniCrawlerFaq from './components/MiniCrawlerFaq';
import { Metadata } from 'next';

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL;
    
export const metadata: Metadata = {
    title: 'Mini Crawler - Bulk URL Status Checker | Prismiqo',
    description:
      "Check multiple URL statuses at once with our Mini Crawler tool. Quickly identify issues and save time with bulk URL analysis.",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${domain}/tools/mini-crawler`,
    },
};
export default function BulkUrlOpenerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
        <MiniCrawler />
      <MiniCrawlerFaq />
    </div>
  );
}