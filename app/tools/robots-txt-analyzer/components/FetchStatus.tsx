'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface FetchStatusProps {
  status: number | null;
}

const FetchStatus: React.FC<FetchStatusProps> = ({ status }) => {
  let message: string;
  let icon: any;
  let colorClass: string;

  if (status === null) {
    message = 'No fetch performed';
    icon = faInfoCircle;
    colorClass = 'text-gray-500';
  } else if (status === 200) {
    message = 'Successfully fetched';
    icon = faCheckCircle;
    colorClass = 'text-green-500';
  } else {
    message = 'Failed to fetch';
    icon = faExclamationTriangle;
    colorClass = 'text-red-500';
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Fetch Status</h2>
      <div className="bg-gray-100 rounded-lg p-4 flex items-center">
        <FontAwesomeIcon icon={icon} className={`text-2xl ${colorClass} mr-4`} />
        <div>
          <h4 className="text-lg font-semibold">Status</h4>
          <p className="text-2xl font-bold">{status !== null ? status : 'N/A'}</p>
          <p className={`text-sm ${colorClass}`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default FetchStatus;
