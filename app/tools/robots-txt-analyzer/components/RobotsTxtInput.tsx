'use client';

import React, { useState } from 'react';

interface RobotsTxtInputProps {
  onAnalyze: (inputData: { url?: string; content?: string }) => void;
}

const RobotsTxtInput: React.FC<RobotsTxtInputProps> = ({ onAnalyze }) => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    const data = {
      url: url || undefined,
      content: content || undefined
    };
    onAnalyze(data);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Input robots.txt</h2>
      <div className="flex flex-col mb-2">
        <label className="mb-1">Robots.txt URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2"
          placeholder="https://www.example.com/robots.txt"
        />
      </div>
      <div className="flex flex-col mb-2">
        <label className="mb-1">Or paste robots.txt content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 h-40"
          placeholder="User-agent: *..."
        ></textarea>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Analyze
      </button>
    </div>
  );
};

export default RobotsTxtInput;
