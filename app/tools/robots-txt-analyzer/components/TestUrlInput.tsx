// app/tools/robots-txt-analyzer/components/TestUrlInput.tsx

'use client';

import React, { useState } from 'react';

interface TestUrlInputProps {
  availableUserAgents?: string[];
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

const TestUrlInput: React.FC<TestUrlInputProps> = ({ availableUserAgents = [] }) => {
  const [urls, setUrls] = useState('');
  const [userAgents, setUserAgents] = useState<string[]>(['Googlebot', 'Bingbot']);
  const [customUserAgent, setCustomUserAgent] = useState('');
  const [robotsContents, setRobotsContents] = useState<string[]>(['']); // Start with one robots.txt
  const [results, setResults] = useState<TestResult[]>([]);
  const [filter, setFilter] = useState('all');

  const handleTest = async () => {
    const agents = [...userAgents];
    if (customUserAgent) {
      agents.push(customUserAgent);
    }

    const data = {
      robots_contents: robotsContents.filter(content => content.trim() !== ''),
      test_urls: urls.split('\n').map((url) => url.trim()).filter(Boolean),
      user_agents: agents,
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

  const handleUserAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedAgents: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedAgents.push(options[i].value);
      }
    }
    setUserAgents(selectedAgents);
  };

  const handleRobotsContentChange = (index: number, value: string) => {
    const newContents = [...robotsContents];
    newContents[index] = value;
    setRobotsContents(newContents);
  };

  const addRobotsContent = () => {
    setRobotsContents([...robotsContents, '']);
  };

  const removeRobotsContent = (index: number) => {
    const newContents = [...robotsContents];
    newContents.splice(index, 1);
    setRobotsContents(newContents);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Test URLs Against robots.txt Files</h2>
      <div className="flex flex-col mb-2">
        <label className="mb-1">Enter robots.txt content:</label>
        {robotsContents.map((content, index) => (
          <div key={index} className="mb-2">
            <textarea
              value={content}
              onChange={(e) => handleRobotsContentChange(index, e.target.value)}
              className="border p-2 h-32 w-full"
              placeholder={`robots.txt content ${index + 1}`}
            ></textarea>
            {index > 0 && (
              <button
                onClick={() => removeRobotsContent(index)}
                className="bg-red-500 text-white px-2 py-1 mt-1"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addRobotsContent}
          className="bg-gray-500 text-white px-4 py-2 mb-4 mt-2"
        >
          Add another robots.txt
        </button>
      </div>
      {/* Rest of the component remains the same */}
      <div className="flex flex-col mb-2">
        <label className="mb-1">URLs to Test (one per line):</label>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="border p-2 h-32"
          placeholder="https://www.example.com/page1"
        ></textarea>
      </div>
      <div className="flex flex-col mb-2">
        <label className="mb-1">Select User Agents:</label>
        <select
          multiple
          value={userAgents}
          onChange={handleUserAgentChange}
          className="border p-2 h-32"
        >
          <option value="Googlebot">Googlebot</option>
          <option value="Bingbot">Bingbot</option>
          {Array.from(new Set(availableUserAgents)).map((agent, index) => (
            <option key={index} value={agent}>
              {agent}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col mb-2">
        <label className="mb-1">Enter Custom User Agent:</label>
        <input
          type="text"
          value={customUserAgent}
          onChange={(e) => setCustomUserAgent(e.target.value)}
          className="border p-2"
          placeholder="Enter custom user agent"
        />
      </div>
      <div className="flex items-center mb-2">
        <label className="mr-2">Filter Results:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2"
        >
          <option value="all">All</option>
          <option value="allowed">Allowed URLs</option>
          <option value="disallowed">Disallowed URLs</option>
        </select>
      </div>
      <button
        onClick={handleTest}
        className="bg-blue-500 text-white px-4 py-2 mb-4"
      >
        Test URLs
      </button>
      {results.length > 0 && (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">URL</th>
              {robotsContents.map((_, idx) => (
                <th key={idx} className="py-2 px-4 border-b">robots.txt {idx + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{result.url}</td>
                {result.robots_results.map((robotsResult, idx) => (
                  <td key={idx} className="py-2 px-4 border-b">
                    {userAgents.concat(customUserAgent ? [customUserAgent] : []).map((agent, agentIdx) => (
                      <div key={agentIdx}>
                        {agent}: {robotsResult.results[agent] ? 'Allowed' : 'Disallowed'}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TestUrlInput;
