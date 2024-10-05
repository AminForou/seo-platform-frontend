import URLAnalysisDashboard from './URLAnalysisDashboard';
import SiteStructureFaq from './components/SiteStructureFaq';

export default function BulkUrlOpenerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <URLAnalysisDashboard />
       <SiteStructureFaq />
    </div>
  );
}