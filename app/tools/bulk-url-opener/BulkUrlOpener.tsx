// OpenUrlsButton.tsx
// Renders the main action button (Open URLs, Redo Opening URLs)
// Includes Pause and Resume buttons

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExternalLinkAlt,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import UrlInput from './components/UrlInput';
import AdvancedSettings from './components/AdvancedSettings';
import OpenUrlsButton from './components/OpenUrlsButton';
import ProgressBar from './components/ProgressBar';
import InformationalText from './components/InformationalText';
import PopupBlockerWarning from './components/PopupBlockerWarning';

export default function BulkUrlOpener() {
    // State variables
    const [urls, setUrls] = useState('');
    const [isOpening, setIsOpening] = useState(false);
    const [openType, setOpenType] = useState('tab');
    const [totalUrls, setTotalUrls] = useState(0);
    const [openedUrls, setOpenedUrls] = useState<Set<number>>(new Set());
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
  
    // New state variables
    const [currentPosition, setCurrentPosition] = useState(0); // For Sequential URL Opening
    const [urlsPerBatch, setUrlsPerBatch] = useState(0); // Number of URLs to open per batch
    const [concurrentLimit, setConcurrentLimit] = useState(1); // Limit Concurrent Openings
    const [isPaused, setIsPaused] = useState(false); // Pause and Resume Functionality
    const [minDelay, setMinDelay] = useState(0.5); // Customizable Delays and Randomization
    const [maxDelay, setMaxDelay] = useState(0.5);
    const [filters, setFilters] = useState(''); // Filtering and Sorting Options
    const [duplicates, setDuplicates] = useState<Set<number>>(new Set()); // Duplicate URL Detection
    const [appendParams, setAppendParams] = useState(''); // Integration with SEO Tools and Parameters
    const [startRange, setStartRange] = useState(1);
    const [endRange, setEndRange] = useState(1);
    const [showAdvanced, setShowAdvanced] = useState(false); // For accordion
    const [showProgress, setShowProgress] = useState(false); // Show progress only when opening
    const [popUpBlocked, setPopUpBlocked] = useState(false); // Popup blocker detection
    const [abortController, setAbortController] = useState<AbortController | null>(null); // For pausing
    const [processComplete, setProcessComplete] = useState(false); // To track if processing is complete
  
    // Add the new state variable
    const [shouldStart, setShouldStart] = useState(false); // Flag to indicate when to start opening URLs
  
    useEffect(() => {
      const urlLines = urls.split('\n');
      const trimmedUrls = urlLines.map((url) => url.trim());
      const validUrls = trimmedUrls.filter((url) => url !== '');
      setTotalUrls(validUrls.length);
      setEndRange(validUrls.length);
      updateLineNumbers();
      detectDuplicates(validUrls);
  
      // Simplify usage: If totalUrls > 30, default urlsPerBatch to 30, else open all at once
      if (validUrls.length > 30) {
        setUrlsPerBatch(30);
      } else {
        setUrlsPerBatch(validUrls.length);
      }
  
      // Reset processComplete when URLs change
      setProcessComplete(false);
    }, [urls]);
  
    // Calculate the filtered URL list
    const filteredUrlList = useMemo(() => {
      let urlList = urls
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url !== '');
  
      // Apply start and end range
      urlList = urlList.slice(startRange - 1, endRange);
  
      // Apply filters
      if (filters) {
        try {
          const filterRegex = new RegExp(filters, 'i');
          urlList = urlList.filter((url) => filterRegex.test(url));
        } catch (error) {
          console.error('Invalid filter pattern:', error);
          alert('Invalid filter pattern.');
        }
      }
  
      // Append parameters if any
      if (appendParams) {
        urlList = urlList.map((url) => {
          const separator = url.includes('?') ? '&' : '?';
          return url + separator + appendParams;
        });
      }
  
      // Reset processComplete when settings change
      setProcessComplete(false);
      return urlList;
    }, [urls, startRange, endRange, filters, appendParams]);
  
    useEffect(() => {
      setCurrentPosition(0);
    }, [filteredUrlList]);
    
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
  
    const openUrls = async () => {
      setIsOpening(true);
      setIsPaused(false);
      setShowProgress(true);
      setPopUpBlocked(false);
  
      // Create an AbortController to cancel the async operation
      const controller = new AbortController();
      setAbortController(controller);
  
      const totalToOpen =
        urlsPerBatch > 0
          ? Math.min(urlsPerBatch, filteredUrlList.length - currentPosition)
          : filteredUrlList.length - currentPosition;
  
      if (totalToOpen <= 0) {
        alert('No URLs to open.');
        setIsOpening(false);
        return;
      }
  
      try {
        for (let batchIndex = 0; batchIndex < totalToOpen; batchIndex += concurrentLimit) {
          if (controller.signal.aborted) {
            throw new Error('Operation paused');
          }
          const concurrentUrls = [];
          for (let i = 0; i < concurrentLimit; i++) {
            const index = currentPosition + batchIndex + i;
            if (index >= filteredUrlList.length) break;
            const url = filteredUrlList[index];
            concurrentUrls.push({ url, index });
          }
          // Open concurrent URLs
          concurrentUrls.forEach(({ url, index }) => {
            let newWindow: Window | null = null;
            if (openType === 'window') {
              newWindow = window.open(url, '_blank', 'noopener,noreferrer');
            } else {
              newWindow = window.open(url, '_blank');
            }
            if (newWindow) {
              setOpenedUrls((prev) => new Set(prev).add(index + 1));
            } else {
              setPopUpBlocked(true);
            }
          });
          // Wait for delay
          const randomDelay = minDelay + Math.random() * (maxDelay - minDelay);
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, randomDelay * 1000);
            controller.signal.addEventListener('abort', () => {
              clearTimeout(timeout);
              reject(new Error('Operation paused'));
            });
          });
          setCurrentPosition((prev) => prev + concurrentUrls.length);
        }
        setIsOpening(false);
        setProcessComplete(true); // Mark processing as complete
      } catch (error) {
        console.error('Error opening URLs:', error);
        // Operation was paused
        setIsOpening(false);
      }
    };
  
    const pauseOpening = () => {
      setIsPaused(true);
      setIsOpening(false);
      if (abortController) {
        abortController.abort();
      }
    };
  
    const resumeOpening = () => {
      openUrls();
    };
  
    const updateLineNumbers = () => {
      if (textareaRef.current && lineNumbersRef.current) {
        const lines = urls.split('\n');
        const lineNumbers = lines.map((_, index) => `${index + 1}`).join('\n');
        lineNumbersRef.current.innerText = lineNumbers;
      }
    };
  
    // Hotkeys: Ctrl+Enter to start, pause, or resume opening URLs
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'Enter') {
          e.preventDefault();
          if (!isOpening && !isPaused && !processComplete) {
            openUrls();
          } else if (isOpening && !isPaused) {
            pauseOpening();
          } else if (!isOpening && isPaused) {
            resumeOpening();
          } else if (processComplete) {
            // If processing is complete, redo the process
            setCurrentPosition(0);
            setOpenedUrls(new Set());
            openUrls();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpening, isPaused, processComplete, openUrls, pauseOpening, resumeOpening]);
    // Delay text logic
    const delayText =
      minDelay === maxDelay
        ? `at a delay of ${minDelay} seconds`
        : `at a delay between ${minDelay} and ${maxDelay} seconds`;
  
    // Calculate positions for informational text
    const totalRemaining = filteredUrlList.length - currentPosition;
    const urlsToOpen =
      urlsPerBatch > 0 ? Math.min(urlsPerBatch, totalRemaining) : totalRemaining;
    const startPosition = startRange + currentPosition;
    const endPosition = startPosition + urlsToOpen - 1;
  
    // Update the useEffect to watch for shouldStart changes
    useEffect(() => {
        if (shouldStart) {
            openUrls();
            setShouldStart(false); // Reset the flag
        }
    }, [shouldStart, openUrls]); // Trigger when shouldStart changes
  
    const redoOpening = () => {
      setCurrentPosition(0);
      setOpenedUrls(new Set());
      setProcessComplete(false);
      setShouldStart(true);
    };
  
    return (
      <div className="bg-gray-50 shadow rounded-lg p-6">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-center mb-2">
            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xl text-indigo-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Bulk URL Opener</h2>
          </div>
          <p className="text-center text-sm text-gray-500">Open multiple URLs with customizable settings</p>
        </div>
  
        <div className="space-y-4">
          <UrlInput
            urls={urls}
            setUrls={setUrls}
            openedUrls={openedUrls}
            setOpenedUrls={setOpenedUrls}
            duplicates={duplicates}
            setDuplicates={setDuplicates}
            setCurrentPosition={setCurrentPosition}
            setShowProgress={setShowProgress}
            setProcessComplete={setProcessComplete}
          />
  
          {/* Open in New Tabs and Export URLs */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label htmlFor="openType" className="block text-sm font-medium text-gray-700">
                Open in
              </label>
              <select
                id="openType"
                name="openType"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={openType}
                onChange={(e) => setOpenType(e.target.value)}
              >
                <option value="tab">New Tabs</option>
                <option value="window">New Windows</option>
              </select>
            </div>
            {urls.trim() !== '' && (
              <button
                onClick={() => {
                  const blob = new Blob([urls], { type: 'text/plain;charset=utf-8' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = 'urls.txt';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="py-2 px-4 rounded-md bg-blue-color text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2 text-white" />
                Export URLs
              </button>
            )}
          </div>
  
          <AdvancedSettings
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            filters={filters}
            setFilters={setFilters}
            appendParams={appendParams}
            setAppendParams={setAppendParams}
            startRange={startRange}
            setStartRange={setStartRange}
            endRange={endRange}
            setEndRange={setEndRange}
            totalUrls={totalUrls}
            minDelay={minDelay}
            setMinDelay={setMinDelay}
            maxDelay={maxDelay}
            setMaxDelay={setMaxDelay}
            urlsPerBatch={urlsPerBatch}
            setUrlsPerBatch={setUrlsPerBatch}
            concurrentLimit={concurrentLimit}
            setConcurrentLimit={setConcurrentLimit}
            filteredUrlList={filteredUrlList}
            urls={urls}
            setCurrentPosition={setCurrentPosition}
          />
  
          {/* Informational Text */}
          {filteredUrlList.length > 0 && (
            <InformationalText
              totalUrls={totalUrls}
              filteredUrlList={filteredUrlList}
              filters={filters}
              startRange={startRange}
              endRange={endRange}
              urlsToOpen={urlsToOpen}
              startPosition={startPosition}
              endPosition={endPosition}
              delayText={delayText}
              processComplete={processComplete}
              appendParams={appendParams}
            />
          )}
  
          <OpenUrlsButton
            processComplete={processComplete}
            isOpening={isOpening}
            isPaused={isPaused}
            urlsToOpen={urlsToOpen}
            startPosition={startPosition}
            endPosition={endPosition}
            openUrls={openUrls}
            pauseOpening={pauseOpening}
            resumeOpening={resumeOpening}
            redoOpening={redoOpening}
          />
  
          {/* Popup Blocker Warning */}
          {popUpBlocked && !isOpening && <PopupBlockerWarning />}
        </div>
  
        {/* Progress and Instructions */}
        {showProgress && (
          <ProgressBar
            currentPosition={currentPosition}
            totalUrls={filteredUrlList.length}
          />
        )}
      </div>
  );
}