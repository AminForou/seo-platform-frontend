'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../../../components/Tooltip';

interface AdvancedSettingsProps {
  showAdvanced: boolean;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
  filters: string;
  setFilters: React.Dispatch<React.SetStateAction<string>>;
  appendParams: string;
  setAppendParams: React.Dispatch<React.SetStateAction<string>>;
  startRange: number;
  setStartRange: React.Dispatch<React.SetStateAction<number>>;
  endRange: number;
  setEndRange: React.Dispatch<React.SetStateAction<number>>;
  totalUrls: number;
  minDelay: number;
  setMinDelay: React.Dispatch<React.SetStateAction<number>>;
  maxDelay: number;
  setMaxDelay: React.Dispatch<React.SetStateAction<number>>;
  urlsPerBatch: number;
  setUrlsPerBatch: React.Dispatch<React.SetStateAction<number>>;
  concurrentLimit: number;
  setConcurrentLimit: React.Dispatch<React.SetStateAction<number>>;
  filteredUrlList: string[];
  urls: string;
  setCurrentPosition: React.Dispatch<React.SetStateAction<number>>;
}

export default function AdvancedSettings({
  showAdvanced,
  setShowAdvanced,
  filters,
  setFilters,
  appendParams,
  setAppendParams,
  startRange,
  setStartRange,
  endRange,
  setEndRange,
  totalUrls,
  minDelay,
  setMinDelay,
  maxDelay,
  setMaxDelay,
  urlsPerBatch,
  setUrlsPerBatch,
  concurrentLimit,
  setConcurrentLimit,
  filteredUrlList,
  setCurrentPosition,
}: AdvancedSettingsProps) {
  const [startRangeInput, setStartRangeInput] = useState(startRange.toString());
  const [endRangeInput, setEndRangeInput] = useState(endRange.toString());

  useEffect(() => {
    setStartRangeInput(startRange.toString());
    setEndRangeInput(endRange.toString());
  }, [startRange, endRange]);

  const handleStartRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartRangeInput(e.target.value);
  };

  const handleEndRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndRangeInput(e.target.value);
  };

  const handleStartRangeBlur = () => {
    let newValue = parseInt(startRangeInput, 10);
    if (isNaN(newValue) || newValue < 1) {
      newValue = 1;
    } else if (newValue > endRange) {
      newValue = endRange;
    }
    setStartRange(newValue);
    setStartRangeInput(newValue.toString());
    setCurrentPosition(0); // Reset position when range changes
  };

  const handleEndRangeBlur = () => {
    let newValue = parseInt(endRangeInput, 10);
    if (isNaN(newValue) || newValue > totalUrls) {
      newValue = totalUrls;
    } else if (newValue < startRange) {
      newValue = startRange;
    }
    setEndRange(newValue);
    setEndRangeInput(newValue.toString());
    setCurrentPosition(0); // Reset position when range changes
  };

  const handleMinDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMinDelay(value);
    if (value > maxDelay) setMaxDelay(value);
  };

  const handleMaxDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMaxDelay(value);
    if (value < minDelay) setMinDelay(value);
  };

  return (
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={startRangeInput}
                  onChange={handleStartRangeChange}
                  onBlur={handleStartRangeBlur}
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={endRangeInput}
                  onChange={handleEndRangeChange}
                  onBlur={handleEndRangeBlur}
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
                  onChange={handleMinDelayChange} // Use the handleMinDelayChange function here
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
  );
}