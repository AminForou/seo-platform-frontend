import BulkUrlOpener from './BulkUrlOpener';
import BulkUrlFaq from './components/BulkUrlFaq';

export default function BulkUrlOpenerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BulkUrlOpener />
      <BulkUrlFaq />
    </div>
  );
}