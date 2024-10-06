// app/tools/robots-txt-analyzer/components/VersionComparator.tsx

'use client';

import React, { useState } from 'react';
import { createTwoFilesPatch } from 'diff';
import * as Diff2Html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';

const VersionComparator: React.FC = () => {
  const [content1, setContent1] = useState('');
  const [content2, setContent2] = useState('');
  const [htmlDiff, setHtmlDiff] = useState('');

  const handleCompare = async () => {
    const diff = createTwoFilesPatch('Version 1', 'Version 2', content1, content2);

    const diffHtml = Diff2Html.html(diff, {
      drawFileList: false,
      matching: 'lines',
      outputFormat: 'side-by-side',
    });

    setHtmlDiff(diffHtml);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Compare robots.txt Versions</h2>
      <div className="flex flex-col mb-2">
        <label className="mb-1">Robots.txt Content Version 1:</label>
        <textarea
          value={content1}
          onChange={(e) => setContent1(e.target.value)}
          className="border p-2 h-40"
          placeholder="User-agent: *..."
        ></textarea>
      </div>
      <div className="flex flex-col mb-2">
        <label className="mb-1">Robots.txt Content Version 2:</label>
        <textarea
          value={content2}
          onChange={(e) => setContent2(e.target.value)}
          className="border p-2 h-40"
          placeholder="User-agent: *..."
        ></textarea>
      </div>
      <button
        onClick={handleCompare}
        className="bg-blue-500 text-white px-4 py-2 mb-4"
      >
        Compare Versions
      </button>
      {htmlDiff && (
        <div
          className="diff-result"
          dangerouslySetInnerHTML={{ __html: htmlDiff }}
        ></div>
      )}
    </div>
  );
};

export default VersionComparator;
