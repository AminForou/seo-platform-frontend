// app/tools/robots-txt-analyzer/components/TestUrlInput.tsx

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Link, X, Plus, FileText, Info, Filter } from 'lucide-react';
import Tooltip from '../../../components/Tooltip';

interface TestUrlInputProps {
  urls: string;
  robotsContents: string[];
  onUrlsChange: (urls: string) => void;
  onRobotsContentsChange: (robotsContents: string[]) => void;
  availableUserAgents?: string[]; // Add this line if you need this prop
}

interface TestResult {
  url: string;
  robots_results: {
    robots_index: number;
    results: {
      [userAgent: string]: boolean;
    };
  }[];
}

const TestUrlInput: React.FC<TestUrlInputProps> = ({
  urls,
  robotsContents,
  onUrlsChange,
  onRobotsContentsChange
}) => {
  const [googlebot, setGooglebot] = useState(true);
  const [bingbot, setBingbot] = useState(true);
  const [customUserAgents, setCustomUserAgents] = useState<string[]>([]);
  const [newUserAgent, setNewUserAgent] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [filter, setFilter] = useState('all');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [robotsUserAgents, setRobotsUserAgents] = useState<{ [key: string]: boolean }>({});

  const handleTest = async () => {
    const data = {
      robots_contents: robotsContents.filter(content => content.trim() !== ''),
      test_urls: urls.split('\n').map((url) => url.trim()).filter(Boolean),
      user_agents: allUserAgents,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/robots-multi-test-url/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error ${response.status}: ${errorText}`);
        return;
      }

      if (contentType && contentType.includes('application/json')) {
        const resultData = await response.json();
        const finalResults: TestResult[] = resultData.results;
        setResults(finalResults);
      } else {
        const text = await response.text();
        console.error(`Unexpected response format: ${text}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredResults = results.filter((result) => {
    if (filter === 'allowed') {
      return result.robots_results.some(robotsResult =>
        Object.values(robotsResult.results).some(allowed => allowed)
      );
    }
    if (filter === 'disallowed') {
      return result.robots_results.some(robotsResult =>
        Object.values(robotsResult.results).some(allowed => !allowed)
      );
    }
    return true;
  });

  const handleRobotsContentChange = (index: number, value: string) => {
    const newContents = [...robotsContents];
    newContents[index] = value;
    onRobotsContentsChange(newContents);
  };

  const updateRobotsLineNumbers = useCallback((index: number) => {
    const textarea = document.getElementById(`robots-textarea-${index}`);
    const lineNumbers = document.getElementById(`robots-line-numbers-${index}`);
    if (textarea && lineNumbers) {
      const lines = robotsContents[index].split('\n');
      const numbers = lines.map((_, i) => i + 1);
      lineNumbers.innerHTML = numbers
        .map((num) => `<div>${num}</div>`)
        .join('');
    }
  }, [robotsContents]);

  useEffect(() => {
    robotsContents.forEach((_, index) => updateRobotsLineNumbers(index));
  }, [robotsContents, updateRobotsLineNumbers]);

  const addRobotsContent = () => {
    onRobotsContentsChange([...robotsContents, '']);
  };

  const removeRobotsContent = (index: number) => {
    const newContents = [...robotsContents];
    newContents.splice(index, 1);
    onRobotsContentsChange(newContents);
  };

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const updateLineNumbers = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      const lines = urls.split('\n');
      const lineNumbers = lines.map((_, index) => index + 1);
      lineNumbersRef.current.innerHTML = lineNumbers
        .map((lineNumber) => `<div>${lineNumber}</div>`)
        .join('');
    }
  }, [urls]);

  useEffect(() => {
    updateLineNumbers();
  }, [updateLineNumbers]);

  const handleAddUserAgent = () => {
    if (newUserAgent) {
      const agents = newUserAgent.split(',').map(agent => agent.trim()).filter(Boolean);
      const newAgents = agents.filter(agent => !customUserAgents.includes(agent));
      setCustomUserAgents(prev => [...prev, ...newAgents]);
      setNewUserAgent('');
    }
  };

  const handleRemoveUserAgent = (agent: string) => {
    setCustomUserAgents(prev => prev.filter(a => a !== agent));
  };

  const allUserAgents = [
    ...(googlebot ? ['Googlebot'] : []),
    ...(bingbot ? ['Bingbot'] : []),
    ...customUserAgents,
    ...Object.entries(robotsUserAgents)
      .filter(([_agent, isActive]) => isActive)
      .map(([agent]) => agent)
  ];

  useEffect(() => {
    const extractUserAgents = () => {
      const userAgentRegex = /User-agent:\s*(.+)/gi;
      const extractedAgents: { [key: string]: boolean } = {};
      
      robotsContents.forEach(content => {
        let match;
        while ((match = userAgentRegex.exec(content)) !== null) {
          const agent = match[1].trim();
          if (!(agent in extractedAgents)) {
            extractedAgents[agent] = true;
          }
        }
      });

      setRobotsUserAgents(extractedAgents);
    };

    extractUserAgents();
  }, [robotsContents]);

  const toggleRobotsUserAgent = (agent: string) => {
    setRobotsUserAgents(prev => ({
      ...prev,
      [agent]: !prev[agent]
    }));
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          URL Tester
        </h2>
        <p className="text-gray-600 mb-4">
          Test URLs against robots.txt files to check crawling permissions.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            <Info className="mr-2" size={20} />
            How to use:
          </h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Enter or paste your robots.txt content</li>
            <li>Input the URLs you want to test</li>
            <li>Select the user agents to check against</li>
            <li>Click &quot;Test URLs&quot; to see the results</li>
          </ol>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FileText className="mr-2" size={20} />
          robots.txt Content
        </label>
        {robotsContents.map((content, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm text-gray-500">
                {index > 0 ? `robots.txt #${index + 1}` : 'robots.txt'}
              </div>
              {index > 0 && (
                <button
                  onClick={() => removeRobotsContent(index)}
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
                >
                  <X className="mr-1" size={16} /> Remove
                </button>
              )}
            </div>
            <div className="relative">
              <textarea
                id={`robots-textarea-${index}`}
                value={content}
                onChange={(e) => handleRobotsContentChange(index, e.target.value)}
                onScroll={(e) => {
                  const lineNumbers = document.getElementById(`robots-line-numbers-${index}`);
                  if (lineNumbers) lineNumbers.scrollTop = e.currentTarget.scrollTop;
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-8"
                placeholder={`Enter robots.txt content ${index + 1}`}
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
                id={`robots-line-numbers-${index}`}
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
        ))}
        <button
          onClick={addRobotsContent}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center transition-colors duration-200 mb-4"
        >
          <Plus className="mr-2" size={16} />
          Add another robots.txt
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Link className="mr-2" size={20} />
          URLs to Test
        </label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={urls}
            onChange={(e) => onUrlsChange(e.target.value)}
            onScroll={handleScroll}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-8"
            placeholder="Enter URLs to test, one per line"
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

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Bot className="mr-2" size={20} />
          User Agents
          <Tooltip content="Select user agents to test against the robots.txt files. Blue tags are extracted from the robots.txt content.">
            <Info className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer" size={16} />
          </Tooltip>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => setGooglebot(!googlebot)}
            className={`px-3 py-1 rounded-full ${
              googlebot ? 'bg-green-color text-white' : 'bg-gray-200 text-gray-700'
            } transition-colors duration-300`}
          >
            Googlebot
          </button>
          <button
            onClick={() => setBingbot(!bingbot)}
            className={`px-3 py-1 rounded-full ${
              bingbot ? 'bg-green-color text-white' : 'bg-gray-200 text-gray-700'
            } transition-colors duration-300`}
          >
            Bingbot
          </button>
          {Object.entries(robotsUserAgents).map(([agent, isActive]) => (
            <button
              key={agent}
              onClick={() => toggleRobotsUserAgent(agent)}
              className={`px-3 py-1 rounded-full ${
                isActive ? 'bg-[#30a3c5] text-white' : 'bg-gray-200 text-gray-700'
              } transition-colors duration-300`}
            >
              {agent}
            </button>
          ))}
          {customUserAgents.map((agent) => (
            <div key={agent} className="bg-green-100 text-green-800 rounded-full px-3 py-1 flex items-center space-x-2">
              <span>{agent}</span>
              <button
                onClick={() => handleRemoveUserAgent(agent)}
                className="text-green-500 hover:text-green-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label htmlFor="newUserAgent" className="block text-sm font-medium text-gray-700 mb-2">
            Add Custom User Agent(s)
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="newUserAgent"
              type="text"
              value={newUserAgent}
              onChange={(e) => setNewUserAgent(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="e.g., Googlebot-Image, Googlebot-News, AdsBot-Google (comma-separated for multiple)"
            />
            <button
              onClick={handleAddUserAgent}
              className="bg-green-color text-white px-4 py-2 rounded-md hover:bg-green-color transition-colors duration-300"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleTest}
        className="w-full gradientButton px-6 py-3 rounded-lg font-semibold text-white flex items-center justify-center transition-all duration-300 ease-in-out mb-6"
      >
        <Link className="mr-2" size={20} />
        Test URLs
      </button>

      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Test Results</h3>
          <div className="flex justify-between items-center mb-4">
            <div className="relative inline-block text-left">
              <label htmlFor="filter-select" className="block text-sm font-medium text-gray-700 mb-1">
                Filter Results:
              </label>
              <div className="relative">
                <select
                  id="filter-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All URLs</option>
                  <option value="allowed">Allowed URLs</option>
                  <option value="disallowed">Disallowed URLs</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Filter size={16} />
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredResults.length} out of {results.length} URLs
              {filter !== 'all' && ` (filtered by ${filter} status)`}
            </div>
          </div>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  {robotsContents.map((_, idx) => (
                    <th key={idx} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      robots.txt {idx + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium">{result.url}</td>
                    {result.robots_results.map((robotsResult, idx) => (
                      <td key={idx} className="py-4 px-4">
                        {allUserAgents.map((agent, agentIdx) => (
                          <div key={agentIdx} className="flex items-center mb-1 last:mb-0">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${robotsResult.results[agent] ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-sm text-gray-700">{agent}: {robotsResult.results[agent] ? 'Allowed' : 'Disallowed'}</span>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestUrlInput;
