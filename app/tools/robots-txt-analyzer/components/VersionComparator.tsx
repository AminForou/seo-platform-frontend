// app/tools/robots-txt-analyzer/components/VersionComparator.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createTwoFilesPatch } from 'diff';
import * as Diff2Html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';

const VersionComparator: React.FC = () => {
  const [content1, setContent1] = useState('');
  const [content2, setContent2] = useState('');
  const [htmlDiff, setHtmlDiff] = useState('');
  const textarea1Ref = useRef<HTMLTextAreaElement>(null);
  const textarea2Ref = useRef<HTMLTextAreaElement>(null);
  const lineNumbers1Ref = useRef<HTMLDivElement>(null);
  const lineNumbers2Ref = useRef<HTMLDivElement>(null);

  const handleCompare = async () => {
    const diff = createTwoFilesPatch('Version 1', 'Version 2', content1, content2);

    const diffHtml = Diff2Html.html(diff, {
      drawFileList: false,
      matching: 'lines',
      outputFormat: 'side-by-side',
    });

    setHtmlDiff(diffHtml);
  };

  const updateLineNumbers = (content: string, lineNumbersRef: React.RefObject<HTMLDivElement>) => {
    if (lineNumbersRef.current) {
      const lines = content.split('\n');
      const lineNumbers = lines.map((_, index) => index + 1);
      lineNumbersRef.current.innerHTML = lineNumbers
        .map((lineNumber) => `<div>${lineNumber}</div>`)
        .join('');
    }
  };

  const handleScroll = (textareaRef: React.RefObject<HTMLTextAreaElement>, lineNumbersRef: React.RefObject<HTMLDivElement>) => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    updateLineNumbers(content1, lineNumbers1Ref);
  }, [content1]);

  useEffect(() => {
    updateLineNumbers(content2, lineNumbers2Ref);
  }, [content2]);

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Compare robots.txt Versions</h2>
      <div className="flex flex-col mb-2">
        <label className="mb-1">Robots.txt Content Version 1:</label>
        <div className="relative">
          <textarea
            ref={textarea1Ref}
            value={content1}
            onChange={(e) => setContent1(e.target.value)}
            onScroll={() => handleScroll(textarea1Ref, lineNumbers1Ref)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-8"
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
            ref={lineNumbers1Ref}
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
      <div className="flex flex-col mb-2">
        <label className="mb-1">Robots.txt Content Version 2:</label>
        <div className="relative">
          <textarea
            ref={textarea2Ref}
            value={content2}
            onChange={(e) => setContent2(e.target.value)}
            onScroll={() => handleScroll(textarea2Ref, lineNumbers2Ref)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-8"
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
            ref={lineNumbers2Ref}
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
        onClick={handleCompare}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-300 mb-4"
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
