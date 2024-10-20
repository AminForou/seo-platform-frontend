'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, Info, LucideIcon } from 'lucide-react';

interface FetchStatusProps {
  status: number | null;
  error?: string;
  url?: string;
}

const FetchStatus: React.FC<FetchStatusProps> = ({ status, error, url }) => {
  let message: string;
  let icon: LucideIcon;
  let colorClass: string;
  let details: string | null = null;
  let suggestedUrl: string | null = null;

  if (status === null && !error) {
    message = 'No fetch performed';
    icon = Info;
    colorClass = 'text-gray-500';
  } else if (status === 200) {
    message = 'Successfully fetched';
    icon = CheckCircle;
    colorClass = 'text-green-500';
  } else if (error) {
    message = 'Error occurred';
    icon = AlertTriangle;
    colorClass = 'text-red-500';
    details = error;
  } else {
    message = 'Failed to fetch';
    icon = AlertTriangle;
    colorClass = 'text-red-500';
    
    switch (status) {
      case 404:
        details = 'The robots.txt file was not found. Make sure the URL is correct.';
        break;
      case 403:
        details = 'Access to the robots.txt file is forbidden. Check the server permissions.';
        break;
      case 500:
        details = 'Server error occurred. Please try again later.';
        break;
      default:
        details = `Unexpected status code: ${status}. Please check the URL and try again.`;
    }
  }

  if (url && !url.toLowerCase().endsWith('/robots.txt')) {
    suggestedUrl = `${url.replace(/\/$/, '')}/robots.txt`;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Fetch Status</h2>
      <div className="bg-gray-100 rounded-lg p-4 flex items-start">
        {React.createElement(icon, { className: `text-2xl ${colorClass} mr-4 mt-1`, size: 24 })}
        <div>
          <h4 className="text-lg font-semibold">Status</h4>
          <p className="text-2xl font-bold">{status !== null ? status : 'N/A'}</p>
          <p className={`text-sm ${colorClass}`}>{message}</p>
          {details && (
            <p className="text-sm text-gray-500 mt-2">
              {details}
            </p>
          )}
          {suggestedUrl && (
            <p className="text-sm text-blue-500 mt-2">
              Did you mean: <a href={suggestedUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{suggestedUrl}</a>?
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FetchStatus;
