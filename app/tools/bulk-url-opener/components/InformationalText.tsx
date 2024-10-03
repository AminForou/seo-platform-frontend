'use client';

import React from 'react';

// InformationalText.tsx
// Renders the informational text about the current state
// Displays details about filtered URLs, ranges, and parameters

interface InformationalTextProps {
  totalUrls: number;
  filteredUrlList: string[];
  filters: string;
  startRange: number;
  endRange: number;
  urlsToOpen: number;
  startPosition: number;
  endPosition: number;
  delayText: string;
  processComplete: boolean;
  appendParams: string;
}

const InformationalText: React.FC<InformationalTextProps> = ({
  totalUrls,
  filteredUrlList,
  filters,
  startRange,
  endRange,
  urlsToOpen,
  startPosition,
  endPosition,
  delayText,
  processComplete,
  appendParams,
}) => {
  return (
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
  );
};

export default InformationalText;
