'use client';

import React, { useState } from 'react';
import axios from 'axios';
import URLInput from './components/URLInput';
import DisplayOptionsSelector from './components/DisplayOptionsSelector';
import UserAgentSelector from './components/UserAgentSelector';
import ResultsTable from './components/ResultTable';
import ProgressBar from './components/ProgressBar';
import ErrorDisplay from '../../components/ErrorDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { SelectedFields, Result } from './types';


export default function Tool() {
  const [urls, setUrls] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState<SelectedFields>({
    status_code: true,         // Default selected
    redirect_chain: true,      // Default selected
    response_time: false,
    content_type: false,
    meta_title: true,          // Default selected
    meta_description: true,    // Default selected
    h1_tags: false,
  });
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [progress, setProgress] = useState(0);
  const [userAgent, setUserAgent] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResults([]);
    setError(null);
    setLoading(true);

    if (file) {
      setError('File upload is not supported in this version.');
      setLoading(false);
      return;
    }

    if (!urls) {
      setError('Please provide a list of URLs.');
      setLoading(false);
      return;
    }

    const urlArray = urls
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    try {
      const responses = await Promise.all(
        urlArray.map(async (url, index) => {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          if (!backendUrl) {
            throw new Error('Backend URL is not defined');
          }
          const response = await axios.post(
            `${backendUrl}/api/check-url/`,
            { url, user_agent: userAgent }
          );
          setProgress(((index + 1) / urlArray.length) * 100);
          return response.data;
        })
      );
      setResults(responses);
    } catch (err: unknown) {
      console.error('Error:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data.error || err.response.statusText}`);
        } else if (err.request) {
          setError('No response received from the server. Please check your internet connection and try again.');
        } else {
          setError(`An unexpected error occurred: ${err.message}`);
        }
      } else if (err instanceof Error) {
        setError(`An unexpected error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSelectedFields((prev) => ({ ...prev, [name]: checked }));
  };

  const toggleRowExpansion = (index: number) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopy = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const getStatusCodeColor = (statusCode: number): string => {
    if (statusCode >= 200 && statusCode < 300) {
      return 'bg-green-100 text-green-800';
    } else if (statusCode >= 300 && statusCode < 400) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (statusCode >= 400 && statusCode < 500) {
      return 'bg-red-100 text-red-800';
    } else if (statusCode >= 500 && statusCode < 600) {
      return 'bg-red-200 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getErrorTypeColor = (errorType: string): string => {
    if (errorType === 'DNS_ERROR') {
      return 'bg-red-100 text-red-800';
    } else if (errorType === 'CONNECTION_ERROR') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (errorType === 'TIMEOUT_ERROR') {
      return 'bg-orange-100 text-orange-800';
    } else if (errorType === 'SSL_ERROR') {
      return 'bg-purple-100 text-purple-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const simplifyContentType = (contentType: string): string => {
    if (!contentType) return 'Unknown';
    if (contentType.includes('html')) return 'HTML';
    if (contentType.includes('json')) return 'JSON';
    if (contentType.includes('xml')) return 'XML';
    if (contentType.includes('javascript')) return 'JavaScript';
    if (contentType.includes('css')) return 'CSS';
    if (contentType.includes('image')) return 'Image';
    if (contentType.includes('audio')) return 'Audio';
    if (contentType.includes('video')) return 'Video';
    if (contentType.includes('pdf')) return 'PDF';
    return 'Other';
  };

  const getMetaTitleTooltip = (length: number): string => {
    if (length <= 15) return `Too short. Add ${41 - length} more characters for optimal length (41-55 characters).`;
    if (length > 65) return `Too long. Remove ${length - 65} characters. Keep it between 41-55 characters for optimal length.`;
    if (length >= 16 && length <= 40) return `A bit short. Add ${41 - length} more characters for optimal length (41-55 characters).`;
    if (length >= 56 && length <= 64) return `A bit long. Remove ${length - 55} characters for optimal length (41-55 characters).`;
    return 'Good length!';
  };

  const getMetaTitleLengthColor = (length: number): string => {
    if (length <= 15 || length >= 65) return 'text-red-600';
    if ((length >= 16 && length <= 40) || (length >= 56 && length <= 64)) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getMetaDescriptionTooltip = (length: number): string => {
    if (length < 50) return `Too short. Add ${50 - length} more characters. Keep it between 130-155 characters for optimal length.`;
    if (length > 165) return `Too long. Remove ${length - 165} characters. Keep it between 130-155 characters for optimal length.`;
    if (length >= 50 && length < 130) return `A bit short. Add ${130 - length} more characters for optimal length (130-155 characters).`;
    if (length > 155 && length <= 165) return `A bit long. Remove ${length - 155} characters for optimal length (130-155 characters).`;
    return 'Good length!';
  };

  const getMetaDescriptionLengthColor = (length: number): string => {
    if (length <= 50 || length > 165) return 'text-red-600';
    if ((length > 50 && length < 130) || (length > 155 && length <= 165)) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gray-50 shadow rounded-lg p-6">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-center mb-2">
                <FontAwesomeIcon icon={faLink} className="text-xl text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Mini Crawler
                </h2>
              </div>
              <p className="text-center text-sm text-gray-500">
                Check the status of multiple URLs quickly and efficiently
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-col items-center"
              encType="multipart/form-data"
            >
              <URLInput
                urls={urls}
                setUrls={setUrls}
                setFile={setFile}
              />

              <DisplayOptionsSelector
                selectedFields={selectedFields}
                handleCheckboxChange={handleCheckboxChange}
              />
              <UserAgentSelector
                userAgent={userAgent}
                setUserAgent={setUserAgent}
              />
              <button
                type="submit"
                className="w-full py-2 rounded-md hover:bg-gradient-hover focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out gradientButton"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Check Status'}
              </button>
            </form>

            {loading && (
              <div className="mt-4">
                <ProgressBar progress={progress} />
              </div>
            )}

            {error && <ErrorDisplay error={error} />}

            {results.length > 0 && (
              <ResultsTable
                results={results}
                selectedFields={selectedFields}
                expandedRows={expandedRows}
                toggleRowExpansion={toggleRowExpansion}
                copiedStates={copiedStates}
                handleCopy={handleCopy}
                getStatusCodeColor={getStatusCodeColor}
                getErrorTypeColor={getErrorTypeColor}
                simplifyContentType={simplifyContentType}
                getMetaTitleTooltip={getMetaTitleTooltip}
                getMetaTitleLengthColor={getMetaTitleLengthColor}
                getMetaDescriptionTooltip={getMetaDescriptionTooltip}
                getMetaDescriptionLengthColor={getMetaDescriptionLengthColor}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}