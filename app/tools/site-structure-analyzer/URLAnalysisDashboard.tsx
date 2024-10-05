'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { BarChart2 } from 'lucide-react';
import UploadSection from './components/UploadSection';
import Summary from './components/Summary';
import FolderDetails from './components/FolderDetails';
import SecondLevelFolderAnalysis from './components/SecondLevelFolderAnalysis';
import ParameterReport from './components/ParameterReport';

interface FolderData {
  count: number;
  nonIndexableCount?: number;
  sampleUrl: string;
  subfolders?: { [key: string]: FolderData };
}

interface URLData {
  folderStructure: { [key: string]: FolderData };
  secondLevelFolders: {
    [key: string]: {
      count: number;
      nonIndexableCount?: number;
      subfolders: { [key: string]: number };
      sampleUrl: string;
    };
  };
  globalParams: {
    [key: string]: {
      count: number;
      folders: { [key: string]: { count: number; sampleUrl: string } };
    };
  };
  indexabilityDataProvided: boolean;
}

const URLAnalysisDashboard: React.FC = () => {
  const [urlData, setUrlData] = useState<URLData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setLoading(true);
    setError(null);

    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append('file', file);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/process-csv/`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.error || 'Error processing file');
          });
        }
        return response.json();
      })
      .then((data: URLData) => {
        setUrlData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const hasIndexabilityData = urlData?.indexabilityDataProvided ?? false;

  return (
    <div className="bg-gray-50 shadow rounded-lg p-6">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-center mb-2">
          <BarChart2 className="text-2xl text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">URL Analysis Dashboard</h1>
        </div>
        <p className="text-center text-sm text-gray-500">
          Analyze and visualize your site&apos;s URL structure
        </p>
      </div>

      <div className="space-y-4">
        {!urlData && (
          <UploadSection
            isDragActive={isDragActive}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            loading={loading}
            error={error}
          />
        )}

        {urlData && (
          <div className="space-y-6">
            <Summary data={urlData.folderStructure} hasIndexabilityData={hasIndexabilityData} />

            <FolderDetails
              folderStructure={urlData.folderStructure}
              hasIndexabilityData={hasIndexabilityData}
            />

            <SecondLevelFolderAnalysis
              secondLevelFolders={urlData.secondLevelFolders}
              hasIndexabilityData={hasIndexabilityData}
            />

            <ParameterReport globalParams={urlData.globalParams} />
          </div>
        )}
      </div>
    </div>
  );
};

export default URLAnalysisDashboard;
