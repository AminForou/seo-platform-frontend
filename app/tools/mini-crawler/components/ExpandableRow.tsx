import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faChevronDown, faChevronRight, faExternalLinkAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../../../components/Tooltip';
import { SelectedFields } from '../types';

interface RedirectStep {
  url: string;
  status_code: number;
}

interface Result {
  url: string;
  initial_status_code: number;
  is_redirected: boolean;
  response_time?: number;
  content_type?: string;
  meta_title?: string;
  meta_description?: string;
  h1_tags?: string[];
  redirect_steps: RedirectStep[];
}

interface ExpandableRowProps {
  result: Result;
  index: number;
  selectedFields: SelectedFields;
  expanded: boolean;
  toggleRowExpansion: (index: number) => void;
  copiedStates: { [key: string]: boolean };
  handleCopy: (content: string, key: string) => void;
  getStatusCodeColor: (statusCode: number) => string;
  simplifyContentType: (contentType: string) => string;
  getMetaTitleTooltip: (length: number) => string;
  getMetaTitleLengthColor: (length: number) => string;
  getMetaDescriptionTooltip: (length: number) => string;
  getMetaDescriptionLengthColor: (length: number) => string;
}

const ExpandableRow: React.FC<ExpandableRowProps> = ({
  result,
  index,
  selectedFields,
  expanded,
  toggleRowExpansion,
  copiedStates,
  handleCopy,
  getStatusCodeColor,
  simplifyContentType,
  getMetaTitleTooltip,
  getMetaTitleLengthColor,
  getMetaDescriptionTooltip,
  getMetaDescriptionLengthColor,
}) => {
  // Calculate the total number of columns for colspan
  const totalColumns = 1 + Object.values(selectedFields).filter(Boolean).length;

  return (
    <>
      <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        {/* URL */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          <div className="flex items-center">
            <span className="truncate max-w-xs">{result.url}</span>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-500 hover:text-blue-700 flex-shrink-0"
              aria-label="Open URL in new tab"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          </div>
        </td>
        {/* Status Code */}
        {selectedFields.status_code && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusCodeColor(
                result.initial_status_code
              )}`}
            >
              {result.initial_status_code}
            </span>
          </td>
        )}
        {/* Redirects Column */}
        {selectedFields.redirect_chain && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <div className="flex items-center">
              <span className="mr-2">{result.is_redirected ? 'Yes' : 'No'}</span>
              {result.is_redirected && (
                <button
                  onClick={() => toggleRowExpansion(index)}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronRight} />
                </button>
              )}
            </div>
          </td>
        )}
        {/* Response Time */}
        {selectedFields.response_time && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {result.response_time ? `${result.response_time.toFixed(3)}s` : 'N/A'}
          </td>
        )}
        {/* Content Type */}
        {selectedFields.content_type && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {result.content_type ? simplifyContentType(result.content_type) : 'N/A'}
          </td>
        )}
        {/* Meta Title */}
        {selectedFields.meta_title && (
          <td className="px-6 py-4 text-sm text-gray-900">
            <p>{result.meta_title || 'N/A'}</p>
            {result.meta_title && (
              <div className="flex items-center mt-1">
                <Tooltip content={getMetaTitleTooltip(result.meta_title.length)}>
                  <span className={`text-xs ${getMetaTitleLengthColor(result.meta_title.length)}`}>
                    Length: {result.meta_title.length} characters
                  </span>
                </Tooltip>
                <button
                  onClick={() => handleCopy(result.meta_title ?? '', `metaTitle-${index}`)}
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <FontAwesomeIcon
                    icon={faCopy}
                    className={copiedStates[`metaTitle-${index}`] ? 'text-green-500' : ''}
                  />
                  {copiedStates[`metaTitle-${index}`] && (
                    <span className="ml-1 text-xs text-green-500">Copied!</span>
                  )}
                </button>
              </div>
            )}
          </td>
        )}
        {/* Meta Description */}
        {selectedFields.meta_description && (
          <td className="px-6 py-4 text-sm text-gray-900">
            <p>{result.meta_description || 'N/A'}</p>
            {result.meta_description && (
              <div className="flex items-center mt-1">
                <Tooltip content={getMetaDescriptionTooltip(result.meta_description.length)}>
                  <span
                    className={`text-xs ${getMetaDescriptionLengthColor(
                      result.meta_description.length
                    )}`}
                  >
                    Length: {result.meta_description.length} characters
                  </span>
                </Tooltip>
                <button
                  onClick={() => handleCopy(result.meta_description ?? '', `metaDescription-${index}`)}
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <FontAwesomeIcon
                    icon={faCopy}
                    className={
                      copiedStates[`metaDescription-${index}`] ? 'text-green-500' : ''
                    }
                  />
                  {copiedStates[`metaDescription-${index}`] && (
                    <span className="ml-1 text-xs text-green-500">Copied!</span>
                  )}
                </button>
              </div>
            )}
          </td>
        )}
        {/* H1 Tags */}
        {selectedFields.h1_tags && (
          <td className="px-6 py-4 text-sm text-gray-500">
            {result.h1_tags && result.h1_tags.length > 0
              ? result.h1_tags.join(', ')
              : 'N/A'}
          </td>
        )}
      </tr>
      {/* Expanded Row */}
      {expanded && result.is_redirected && (
        <tr>
          <td colSpan={totalColumns} className="px-0 py-0">
            <div className="ml-8 my-2 p-4 bg-gray-50 rounded-md shadow-inner overflow-x-auto">
              <div className="text-sm text-gray-600">
                <div className="flex items-center">
                  {result.redirect_steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      {/* URL */}
                      <div className="flex flex-col items-center">
                        <span>{step.url}</span>
                      </div>

                      {/* If not the last step, display arrow and status code */}
                      {idx < result.redirect_steps.length - 1 && (
                        <div className="flex flex-col items-center mx-2">
                          {/* Status code above arrow */}
                          <span
                            className={`mb-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusCodeColor(
                              step.status_code
                            )}`}
                          >
                            {step.status_code}
                          </span>
                          {/* Arrow */}
                          <FontAwesomeIcon icon={faArrowRight} />
                        </div>
                      )}

                      {/* For the last step, display status code after URL */}
                      {idx === result.redirect_steps.length - 1 && (
                        <div className="flex flex-col items-center ml-2">
                          {/* Status code of the final URL */}
                          <span
                            className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusCodeColor(
                              step.status_code
                            )}`}
                          >
                            {step.status_code}
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ExpandableRow;


