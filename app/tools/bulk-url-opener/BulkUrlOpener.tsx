'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExternalLinkAlt,
  faInfoCircle,
  faPause,
  faPlay,
  faDownload,
  faTrash,
  faChevronDown,
  faChevronUp,
  faRedo,
} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../../components/Tooltip';

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
  
    const handleScroll = () => {
      if (textareaRef.current && lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
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
  
    const clearUrls = () => {
      setUrls('');
      setOpenedUrls(new Set());
      setCurrentPosition(0);
      setDuplicates(new Set());
      setShowProgress(false);
      setProcessComplete(false);
    };
  
    // Delay text logic
    const delayText =
      minDelay === maxDelay
        ? `at a delay of ${minDelay} seconds`
        : `at a delay between ${minDelay} and ${maxDelay} seconds`;
  
    // Adjust maxDelay if minDelay is increased
    const handleMinDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMinDelay = Number(parseFloat(e.target.value).toFixed(2));
      setMinDelay(newMinDelay);
      if (newMinDelay > maxDelay) {
        setMaxDelay(newMinDelay);
      }
    };
  
    const handleMaxDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMaxDelay = Number(parseFloat(e.target.value).toFixed(2));
      setMaxDelay(newMaxDelay);
      if (newMaxDelay < minDelay) {
        setMinDelay(newMaxDelay);
      }
    };
  
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
          <div>
            <label htmlFor="urls" className="block text-sm font-medium text-gray-700 flex items-center mb-2">
              Enter URLs (one per line)
              <Tooltip content="Enter one URL per line. Duplicate URLs are highlighted in red.">
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
                className="absolute top-0 left-0 text-gray-400 bg-gray-100 rounded-l-md p-2 select-none"
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
              <div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{
                  paddingLeft: '3rem',
                  paddingTop: '8px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre',
                  overflowX: 'hidden',
                }}
              >
                {urls.split('\n').map((url, index) => (
                  <div
                    key={index}
                    style={{
                      color: duplicates.has(index)
                        ? 'red'
                        : openedUrls.has(index + 1)
                        ? '#999'
                        : 'transparent',
                    }}
                  >
                    {url}
                  </div>
                ))}
              </div>
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
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 flex items-center mb-2">
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
                className="mt-4 py-2 px-4 rounded-md bg-blue-color text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                style={{ height: '42px' }}
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2 text-white" />
                Export URLs
              </button>
            )}
          </div>
  
          {/* Advanced Settings Accordion */}
          <div className="mt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex justify-between items-center py-2 px-4 bg-gray-200 rounded-md focus:outline-none"
            >
              <span className="text-sm font-medium text-gray-700">Advanced Settings</span>
              <FontAwesomeIcon icon={showAdvanced ? faChevronUp : faChevronDown} />
            </button>
            {showAdvanced && (
              <div className="mt-4 space-y-6">
                {/* Parameters and Filters */}
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Parameters and Filters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="filters" className="block text-sm font-medium text-gray-700 flex items-center mb-2">
                        Filter URLs
                        <Tooltip content="Filter URLs containing a word or domain. Example: 'example.com' will only include URLs that have 'example.com' in them.">
                          <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-gray-400 hover:text-gray-600" />
                        </Tooltip>
                      </label>
                      <input
                        type="text"
                        id="filters"
                        name="filters"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="e.g., example.com"
                        value={filters}
                        onChange={(e) => setFilters(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="appendParams"
                        className="block text-sm font-medium text-gray-700 flex items-center mb-2"
                      >
                        Append Parameters
                        <Tooltip content="Append UTM parameters or tracking codes to URLs automatically. Example: 'utm_source=bulkopener'">
                          <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-gray-400 hover:text-gray-600" />
                        </Tooltip>
                      </label>
                      <input
                        type="text"
                        id="appendParams"
                        name="appendParams"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="e.g., utm_source=bulkopener"
                        value={appendParams}
                        onChange={(e) => setAppendParams(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
  
                {/* Range Settings */}
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Range Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startRange" className="block text-sm font-medium text-gray-700">
                        Start from URL #
                      </label>
                      <input
                        type="number"
                        id="startRange"
                        name="startRange"
                        min="1"
                        max={totalUrls}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={startRange}
                        onChange={(e) => {
                          let newValue = Number(e.target.value);
                          if (newValue > endRange) newValue = endRange;
                          if (newValue < 1) newValue = 1;
                          setStartRange(newValue);
                          setCurrentPosition(0); // Reset position when range changes
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="endRange" className="block text-sm font-medium text-gray-700">
                        End at URL #
                      </label>
                      <input
                        type="number"
                        id="endRange"
                        name="endRange"
                        min={startRange}
                        max={totalUrls}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={endRange}
                        onChange={(e) => {
                          let newValue = Number(e.target.value);
                          if (newValue < startRange) newValue = startRange;
                          if (newValue > totalUrls) newValue = totalUrls;
                          setEndRange(newValue);
                          setCurrentPosition(0); // Reset position when range changes
                        }}
                      />
                    </div>
                  </div>
                </div>
  
                {/* Delay Settings */}
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Delay Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="minDelay"
                        className="block text-sm font-medium text-gray-700 flex items-center mb-2"
                      >
                        Min Delay (seconds)
                        <Tooltip content="Minimum delay between opening URLs. Helps avoid pop-up blockers and mimic human behavior.">
                          <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-gray-400 hover:text-gray-600" />
                        </Tooltip>
                      </label>
                      <input
                        type="number"
                        id="minDelay"
                        name="minDelay"
                        min="0"
                        max="10"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={minDelay}
                        onChange={handleMinDelayChange}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="maxDelay"
                        className="block text-sm font-medium text-gray-700 flex items-center mb-2"
                      >
                        Max Delay (seconds)
                        <Tooltip content="Maximum delay between opening URLs. The actual delay will be randomized between Min and Max delay.">
                          <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-gray-400 hover:text-gray-600" />
                        </Tooltip>
                      </label>
                      <input
                        type="number"
                        id="maxDelay"
                        name="maxDelay"
                        min="0"
                        max="10"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={maxDelay}
                        onChange={handleMaxDelayChange}
                      />
                    </div>
                  </div>
                </div>
  
                {/* Batching Settings */}
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Batching Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="urlsPerBatch"
                        className="block text-sm font-medium text-gray-700 flex items-center mb-2"
                      >
                        URLs per Batch
                        <Tooltip content="Number of URLs to open in each batch. Helps manage large lists by opening a set number at a time and saving position for sequential opening. Set to 0 to open all URLs at once.">
                          <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-gray-400 hover:text-gray-600" />
                        </Tooltip>
                      </label>
                      <input
                        type="number"
                        id="urlsPerBatch"
                        name="urlsPerBatch"
                        min="0"
                        max={filteredUrlList.length}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={urlsPerBatch}
                        onChange={(e) => {
                          setUrlsPerBatch(Number(e.target.value));
                          setCurrentPosition(0); // Reset position when batch size changes
                        }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="concurrentLimit"
                        className="block text-sm font-medium text-gray-700 flex items-center mb-2"
                      >
                        Concurrent Openings
                        <Tooltip content="Maximum number of URLs to open at the same time. Helps prevent browser overload and manage system performance.">
                          <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-gray-400 hover:text-gray-600" />
                        </Tooltip>
                      </label>
                      <input
                        type="number"
                        id="concurrentLimit"
                        name="concurrentLimit"
                        min="1"
                        max="10"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={concurrentLimit}
                        onChange={(e) => setConcurrentLimit(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
  
          {/* Informational Text */}
          {filteredUrlList.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                You have <strong>{totalUrls}</strong> URLs in the list.
                {filters || startRange > 1 || endRange < totalUrls ? (
                  <>
                    {' '}
                    After applying{' '}
                    {filters ? (
                      <>
                        filters (<strong>{filters}</strong>){' '}
                        {startRange > 1 || endRange < totalUrls ? 'and ranges' : ''}
                      </>
                    ) : (
                      ''
                    )}
                    {filters && (startRange > 1 || endRange < totalUrls) ? 'and ' : ''}
                    {startRange > 1 || endRange < totalUrls ? (
                      <>
                        ranges (<strong>
                          {startRange} - {endRange}
                        </strong>)
                      </>
                    ) : (
                      ''
                    )}
                    , there are <strong>{filteredUrlList.length}</strong> URLs to process.
                  </>
                ) : (
                  <>
                    {' '}There are <strong>{filteredUrlList.length}</strong> URLs to process.
                  </>
                )}{' '}
                {urlsToOpen > 0 ? (
                  <>
                    When you click the button, <strong>{urlsToOpen}</strong>{' '}
                    URL{urlsToOpen > 1 ? 's' : ''} from position <strong>{startPosition}</strong> to{' '}
                    <strong>{endPosition}</strong> will open {delayText}.
                  </>
                ) : processComplete ? (
                  <>
                    All URLs have been processed. You can rerun the process or modify the settings to open URLs again.
                  </>
                ) : (
                  ''
                )}
              </p>
              {appendParams && (
                <p className="text-sm text-gray-600 mt-1">
                  Parameters to append: <strong>{appendParams}</strong>
                </p>
              )}
            </div>
          )}
  
          {/* Open URLs Button */}
          <div className="flex space-x-4 mt-4">
            {processComplete ? (
              <button
                onClick={() => {
                    // Reset state variables
                    setCurrentPosition(0);
                    setOpenedUrls(new Set());
                    setProcessComplete(false);
                    // Set the flag to true
                    setShouldStart(true);
                }}
                className="flex-1 py-2 rounded-md bg-purple-color text-white hover:bg-blue-color focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
              >
                <FontAwesomeIcon icon={faRedo} className="mr-2" />
                Redo Opening URLs
              </button>
            ) : (
              <button
                onClick={openUrls}
                disabled={urlsToOpen <= 0}
                className={`flex-1 py-2 rounded-md ${
                  urlsToOpen > 0
                    ? 'hover:bg-gradient-hover focus:ring-2 focus:ring-blue-400 gradientButton'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } focus:outline-none transition-all duration-300 ease-in-out`}
              >
                {isOpening
                  ? 'Opening URLs...'
                  : `Open URLs ${startPosition} to ${endPosition > 0 ? endPosition : startPosition}`}
              </button>
            )}
            {isOpening && !isPaused && (
              <button
                onClick={pauseOpening}
                className="flex-1 py-2 rounded-md bg-blue-color text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
              >
                <FontAwesomeIcon icon={faPause} className="mr-2 text-white" />
                Pause
              </button>
            )}
            {isPaused && (
              <button
                onClick={resumeOpening}
                className="flex-1 py-2 rounded-md bg-green-color text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 ease-in-out"
              >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                Resume
              </button>
            )}
          </div>
  
          {/* Popup Blocker Warning */}
          {popUpBlocked && !isOpening && (
            <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              <p className="font-bold">Pop-ups Blocked</p>
              <p>
                It seems that your browser is blocking some pop-ups. To ensure all URLs open correctly, please allow
                pop-ups for this site in your browser settings.
              </p>
              <ul className="mt-2 list-disc list-inside">
                <li>
                  <strong>Chrome</strong>: Click the pop-up blocked icon in the address bar and select{' '}
                  <em>&quot;Always allow pop-ups and redirects from this site&quot;</em>.
                </li>
                <li>
                  <strong>Firefox</strong>: Click the options button in the address bar and choose{' '}
                  <em>&quot;Allow pop-ups for this site&quot;</em>.
                </li>
                <li>
                  <strong>Edge</strong>: Click the blocked pop-ups icon and select{' '}
                  <em>&quot;Always allow pop-ups and redirects from this site&quot;</em>.
                </li>
                <li>
                  <strong>Safari</strong>: Go to <em>Preferences &gt; Websites &gt; Pop-up Windows</em> and allow pop-ups
                  for this site.
                </li>
              </ul>
            </div>
          )}
        </div>
  
        {/* Progress and Instructions */}
        {showProgress && (
          <>
            <p className="mt-4 text-sm text-gray-600">
              Total URLs: {filteredUrlList.length}. Current Position: {currentPosition}. Use Ctrl+Enter to start,
              pause, or resume opening URLs.
            </p>
  
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span
                      className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white"
                      style={{ background: 'linear-gradient(90deg, #2dbdad 0%, #30a3c5 50%, #804cbd 100%)' }}
                    >
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-gray-700">
                      {currentPosition}/{filteredUrlList.length}
                    </span>
                  </div>
                </div>
                <div
                  className="overflow-hidden h-2 mb-4 text-xs flex rounded"
                  style={{ backgroundColor: '#e0e0e0' }}
                >
                  <div
                    style={{
                      width: `${(currentPosition / filteredUrlList.length) * 100}%`,
                      background: 'linear-gradient(90deg, #2dbdad 0%, #30a3c5 50%, #804cbd 100%)',
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }