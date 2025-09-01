import ImageOptimizer from './ImageOptimizer';
import ImageOptimizerFaq from './components/ImageOptimizerFaq';
import { Metadata } from 'next';

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL;
    
export const metadata: Metadata = {
    title: 'Image Optimizer - Compress & Optimize Images | Prismiqo',
    description:
      "Optimize and compress your images with our free online tool. Crop, resize, and convert to multiple formats including WebP and AVIF. Reduce file sizes while maintaining quality.",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${domain}/free-tools/image-optimizer`,
    },
};

export default function ImageOptimizerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
        <ImageOptimizer />
      <ImageOptimizerFaq />
    </div>
  );
}