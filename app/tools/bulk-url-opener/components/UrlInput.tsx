'use client';

import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../../../components/Tooltip';

interface UrlInputProps {
  urls: string;
  setUrls: React.Dispatch<React.SetStateAction<string>>;
  openedUrls: Set<number>;
  setOpenedUrls: React.Dispatch<React.SetStateAction<Set<number>>>;
  duplicates: Set<number>;
  setDuplicates: React.Dispatch<React.SetStateAction<Set<number>>>;
  setCurrentPosition: React.Dispatch<React.SetStateAction<number>>;
  setShowProgress: React.Dispatch<React.SetStateAction<boolean>>;
  setProcessComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UrlInput({
  urls,
  setUrls,
  openedUrls,
  setOpenedUrls,
  duplicates,
  setDuplicates,
  setCurrentPosition,
  setShowProgress,
  setProcessComplete,
}: UrlInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUrls(e.target.value);
    setOpenedUrls(new Set()); // Reset opened URLs when the content changes
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setUrls(content);
        setOpenedUrls(new Set()); // Reset opened URLs when a new file is loaded
      };
      reader.readAsText(selectedFile);
    }
  };

  const updateLineNumbers = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      const lines = urls.split('\n');
      const lineNumbers = lines.map((_, index) => index + 1);
      lineNumbersRef.current.innerHTML = lineNumbers
        .map((lineNumber, index) => {
          const isDuplicate = duplicates.has(index);
          const isOpened = openedUrls.has(index + 1);
          let className = '';
          if (isDuplicate) {
            className = 'bg-red-100';
          } else if (isOpened) {
            className = 'bg-gray-200';
          } else {
            className = '';
          }
          return `<div class="${className}">${lineNumber}</div>`;
        })
        .join('');
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const clearUrls = () => {
    setUrls('');
    setOpenedUrls(new Set());
    setCurrentPosition(0);
    setDuplicates(new Set());
    setShowProgress(false);
    setProcessComplete(false);
  };

  useEffect(() => {
    updateLineNumbers();
    const urlLines = urls.split('\n');
    const trimmedUrls = urlLines.map((url) => url.trim());
    const validUrls = trimmedUrls.filter((url) => url !== '');
    detectDuplicates(validUrls);
  }, [urls]);

  const detectDuplicates = (urlList: string[]) => {
    const urlCounts: { [url: string]: number[] } = {};
    urlList.forEach((url, index) => {
      if (!urlCounts[url]) {
        urlCounts[url] = [index];
      } else {
        urlCounts[url].push(index);
      }
    });
    const duplicatesIndices = new Set<number>();
    Object.values(urlCounts).forEach((indices) => {
      if (indices.length > 1) {
        indices.forEach((i) => duplicatesIndices.add(i));
      }
    });
    setDuplicates(duplicatesIndices);
  };

  // Update line numbers when duplicates or openedUrls change
  useEffect(() => {
    updateLineNumbers();
  }, [duplicates, openedUrls]);

  return (
    <div>
      <div>
        <label htmlFor="urls" className="block text-sm font-medium text-gray-700 flex items-center mb-2">
          Enter URLs (one per line)
          <Tooltip content="Enter one URL per line. Duplicate and processed URLs are indicated in the line numbers area.">
            <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-gray-400 hover:text-gray-600" />
          </Tooltip>
        </label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="urls"
            name="urls"
            rows={10}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-8"
            placeholder="e.g., https://example.com"
            value={urls}
            onChange={handleUrlChange}
            onScroll={handleScroll}
            style={{
              whiteSpace: 'pre',
              overflowWrap: 'normal',
              overflowX: 'auto',
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              resize: 'vertical',
              paddingLeft: '3rem',
              paddingTop: '8px',
            }}
          ></textarea>
          <div
            ref={lineNumbersRef}
            className="absolute top-0 left-0 bg-gray-100 rounded-l-md p-2 select-none"
            style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              width: '2.5rem',
              height: '100%',
              overflow: 'hidden',
              textAlign: 'right',
              userSelect: 'none',
              paddingTop: '8px',
            }}
          ></div>
        </div>
        {urls.trim() !== '' && (
          <button
            onClick={clearUrls}
            className="mt-2 py-1 px-3 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none transition-all duration-300 ease-in-out"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2 text-gray-500" />
            Clear URLs
          </button>
        )}
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 flex items-center mb-2 mt-4">
          Upload a file with URLs
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
        <p className="mt-1 text-xs text-gray-500 mb-4 mt-2">Accepted formats: .txt, .csv</p>
      </div>
    </div>
  );
}