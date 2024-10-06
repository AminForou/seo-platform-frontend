'use client';

import React from 'react';

interface FetchStatusProps {
  status: number | null;
}

const FetchStatus: React.FC<FetchStatusProps> = ({ status }) => {
  let message;
  if (status === null) {
    message = 'No fetch performed.';
  } else if (status === 200) {
    message = `The robots.txt file was successfully fetched with HTTP status code: ${status}`;
  } else {
    message = `Failed to fetch robots.txt file. HTTP status code: ${status}`;
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Fetch Status</h2>
      <p>{message}</p>
    </div>
  );
};

export default FetchStatus;
