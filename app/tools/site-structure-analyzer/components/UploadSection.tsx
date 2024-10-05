import React from 'react';
import { FileUp, Info, BarChart2, FileText, Layers } from 'lucide-react';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import Tooltip from '@/app/components/Tooltip';

interface UploadSectionProps {
  isDragActive: boolean;
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
  loading: boolean;
  error: string | null;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  isDragActive,
  getRootProps,
  getInputProps,
  loading,
  error,
}) => {
  return (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <FileText className="text-indigo-600 mr-2" size={24} />
              <h4 className="font-semibold">CSV Upload</h4>
            </div>
            <p className="text-sm text-gray-600">
              Upload a CSV file with URLs in column A. Optionally, include indexability (TRUE/FALSE) in column B.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Layers className="text-indigo-600 mr-2" size={24} />
              <h4 className="font-semibold">Comprehensive Analysis</h4>
            </div>
            <p className="text-sm text-gray-600">
              Get insights on first-level URLs, second-level URLs, and query parameters to understand your site structure.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <BarChart2 className="text-indigo-600 mr-2" size={24} />
              <h4 className="font-semibold">Large-Scale Support</h4>
            </div>
            <p className="text-sm text-gray-600">
              Handles large datasets efficiently, tested with up to 5 million URLs for thorough site analysis.
            </p>
          </div>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 mb-4 text-center cursor-pointer rounded-lg transition-colors duration-200 ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
        }`}
      >
        <input {...getInputProps()} accept=".csv,text/csv" />
        <FileUp size={48} className="mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-lg text-indigo-600">Drop the CSV file here ...</p>
        ) : (
          <p className="text-lg text-gray-600">
            Drag 'n' drop a CSV file here, or click to select a file
          </p>
        )}
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <p className="flex items-center">
          <Info size={16} className="mr-1" />
          CSV format: Column A for URLs, Column B (optional) for indexability (TRUE/FALSE)
        </p>
      </div>

      {loading && (
        <div className="mb-4 text-center">
          <p className="text-indigo-600">Processing file...</p>
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}
    </>
  );
};

export default UploadSection;
