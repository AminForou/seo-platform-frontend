'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRedo } from '@fortawesome/free-solid-svg-icons';

interface OpenUrlsButtonProps {
  processComplete: boolean;
  isOpening: boolean;
  isPaused: boolean;
  urlsToOpen: number;
  startPosition: number;
  endPosition: number;
  openUrls: () => void;
  pauseOpening: () => void;
  resumeOpening: () => void;
  redoOpening: () => void;
}

const OpenUrlsButton: React.FC<OpenUrlsButtonProps> = ({
  processComplete,
  isOpening,
  isPaused,
  urlsToOpen,
  startPosition,
  endPosition,
  openUrls,
  pauseOpening,
  resumeOpening,
  redoOpening,
}) => {
  return (
    <div className="flex space-x-4 mt-4">
      {processComplete ? (
        <button
          onClick={redoOpening}
          className="flex-1 py-2 rounded-md bg-purple-color text-white hover:bg-blue-color focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
        >
          <FontAwesomeIcon icon={faRedo} className="mr-2" />
          Redo Opening URLs
        </button>
      ) : (
        <button
          onClick={openUrls}
          disabled={urlsToOpen <= 0}
          className={`flex-1 py-2 rounded-md ${
            urlsToOpen > 0
              ? 'hover:bg-gradient-hover focus:ring-2 focus:ring-blue-400 gradientButton'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } focus:outline-none transition-all duration-300 ease-in-out`}
        >
          {isOpening
            ? 'Opening URLs...'
            : `Open URLs ${startPosition} to ${endPosition > 0 ? endPosition : startPosition}`}
        </button>
      )}
      {isOpening && !isPaused && (
        <button
          onClick={pauseOpening}
          className="flex-1 py-2 rounded-md bg-blue-color text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
        >
          <FontAwesomeIcon icon={faPause} className="mr-2 text-white" />
          Pause
        </button>
      )}
      {isPaused && (
        <button
          onClick={resumeOpening}
          className="flex-1 py-2 rounded-md bg-green-color text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 ease-in-out"
        >
          <FontAwesomeIcon icon={faPlay} className="mr-2" />
          Resume
        </button>
      )}
    </div>
  );
};

export default OpenUrlsButton;
