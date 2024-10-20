'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faInfoCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

interface FetchStatusProps {
  status: number | null;
  error?: string;
}

const FetchStatus: React.FC<FetchStatusProps> = ({ status, error }) => {
  let message: string;
  let icon: any;
  let colorClass: string;
  let details: string | null = null;

  if (status === null && !error) {
    message = 'No fetch performed';
    icon = faInfoCircle;
    colorClass = 'text-gray-500';
  } else if (status === 200) {
    message = 'Successfully fetched';
    icon = faCheckCircle;
    colorClass = 'text-green-500';
  } else if (error) {
    message = 'Error occurred';
    icon = faExclamationTriangle;
    colorClass = 'text-red-500';
    details = error;
  } else {
    message = 'Failed to fetch';
    icon = faExclamationTriangle;
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

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Fetch Status</h2>
      <div className="bg-gray-100 rounded-lg p-4 flex items-start">
        <FontAwesomeIcon icon={icon} className={`text-2xl ${colorClass} mr-4 mt-1`} />
        <div>
          <h4 className="text-lg font-semibold">Status</h4>
          <p className="text-2xl font-bold">{status !== null ? status : 'N/A'}</p>
          <p className={`text-sm ${colorClass}`}>{message}</p>
          {details && <p className="text-sm text-gray-500">{details}</p>}
        </div>
      </div>
    </div>
  );
};

export default FetchStatus;
