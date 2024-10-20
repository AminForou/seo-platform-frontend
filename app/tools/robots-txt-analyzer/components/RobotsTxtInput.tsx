'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, Code, SearchCode, Loader } from 'lucide-react';
import Tooltip from '../../../components/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
interface RobotsTxtInputProps {
  onAnalyze: (inputData: { url?: string; content?: string }) => void;
  url: string;
  content: string;
  onUrlChange: (url: string) => void;
  onContentChange: (content: string) => void;
  isLoading: boolean;
}

interface ErrorMessage {
  type: 'url' | 'content' | 'general';
  message: string;
}

const ErrorDisplay: React.FC<{ error: ErrorMessage }> = ({ error }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
    <div className="flex items-center">
      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
      <p><strong>Error:</strong> {error.message}</p>
    </div>
  </div>
);

const RobotsTxtInput: React.FC<RobotsTxtInputProps> = ({
  onAnalyze,
  url,
  content,
  onUrlChange,
  onContentChange,
  isLoading
}) => {
  const [error, setError] = useState<ErrorMessage | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (!url && !content) {
      setError({ type: 'general', message: 'Please provide either a URL or robots.txt content.' });
      return;
    }

    if (url && !isValidUrl(url)) {
      setError({ type: 'url', message: 'Please enter a valid URL.' });
      return;
    }

    setError(null);
    const data = {
      url: url || undefined,
      content: content || undefined
    };
    onAnalyze(data);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const updateLineNumbers = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      const lines = content.split('\n');
      const lineNumbers = lines.map((_, index) => index + 1);
      lineNumbersRef.current.innerHTML = lineNumbers
        .map((lineNumber) => `<div>${lineNumber}</div>`)
        .join('');
    }
  }, [content]);

  useEffect(() => {
    updateLineNumbers();
  }, [updateLineNumbers]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Input robots.txt</h2>
      
      {error && <ErrorDisplay error={error} />}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Link className="mr-2" size={20} />
          Robots.txt URL:
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error?.type === 'url' ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://www.example.com/robots.txt"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 flex items-center mb-2">
          <Code className="mr-2" size={20} />
          Or paste robots.txt content:
          <Tooltip content="Enter the content of your robots.txt file here">
            <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-gray-400 hover:text-gray-600" />
          </Tooltip>
        </label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            onScroll={handleScroll}
            className={`block w-full rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-8 ${
              error?.type === 'content' ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="User-agent: *..."
            rows={10}
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
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full gradientButton px-6 py-3 rounded-lg font-semibold text-white flex items-center justify-center transition-all duration-300 ease-in-out ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            {/* Use a loading spinner from Lucide React */}
            <Loader className="animate-spin mr-2" size={20} />
            Analyzing...
          </>
        ) : (
          <>
            <SearchCode className="mr-2" size={20} />
            Analyze robots.txt
          </>
        )}
      </button>
    </div>
  );
};

export default RobotsTxtInput;
