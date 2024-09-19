import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../components/Tooltip';

function URLInput({ urls, setUrls, setFile }: {
  urls: string;
  setUrls: (urls: string) => void;
  setFile: (file: File | null) => void;
}) {
  const handleUrlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUrls(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="urls" className="block text-sm font-medium text-gray-700 flex items-center mb-2">
          Enter URLs (one per line)
          <Tooltip content="Enter one URL per line. Example: https://example.com">
            <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-gray-400 hover:text-gray-600" />
          </Tooltip>
        </label>
        <textarea
          id="urls"
          name="urls"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
          placeholder="https://example.com
https://another-example.com"
          value={urls}
          onChange={handleUrlChange}
          style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
        ></textarea>
      </div>
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 flex items-center mb-2">
          Or upload a file with URLs
          <Tooltip content="Upload a .txt or .csv file with one URL per line. Maximum file size: 5MB">
            <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-gray-400 hover:text-gray-600" />
          </Tooltip>
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".txt,.csv"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-100 file:text-violet-700
            hover:file:bg-violet-200"
        />
        <p className="mt-1 text-xs text-gray-500">Accepted formats: .txt, .csv</p>
      </div>
    </div>
  );
}

export default URLInput;
