import React from 'react';
import ExpandableRow from './ExpandableRow';
import { SelectedFields, Result } from './types';

interface ResultsTableProps {
  results: Result[];
  selectedFields: SelectedFields;
  expandedRows: { [key: number]: boolean };
  toggleRowExpansion: (index: number) => void;
  copiedStates: { [key: string]: boolean };
  handleCopy: (content: string, key: string) => void;
  getStatusCodeColor: (statusCode: number) => string;
  simplifyContentType: (contentType: string) => string;
  getMetaTitleTooltip: (length: number) => string;
  getMetaTitleLengthColor: (length: number) => string;
  getMetaDescriptionTooltip: (length: number) => string;
  getMetaDescriptionLengthColor: (length: number) => string;
  getErrorTypeColor: (errorType: string) => string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  selectedFields,
  expandedRows,
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
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* URL Column */}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              URL
            </th>
            {/* Status Code Column */}
            {selectedFields.status_code && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            )}
            {/* Redirects Column */}
            {selectedFields.redirect_chain && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Redirects
              </th>
            )}
            {/* Response Time */}
            {selectedFields.response_time && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Response Time
              </th>
            )}
            {/* Content Type */}
            {selectedFields.content_type && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Content Type
              </th>
            )}
            {/* Meta Title */}
            {selectedFields.meta_title && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Meta Title
              </th>
            )}
            {/* Meta Description */}
            {selectedFields.meta_description && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Meta Description
              </th>
            )}
            {/* H1 Tags */}
            {selectedFields.h1_tags && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                H1 Tags
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result, index) => (
            <ExpandableRow
              key={index}
              result={result}
              index={index}
              selectedFields={selectedFields}
              expanded={expandedRows[index]}
              toggleRowExpansion={toggleRowExpansion}
              copiedStates={copiedStates}
              handleCopy={handleCopy}
              getStatusCodeColor={getStatusCodeColor}
              simplifyContentType={simplifyContentType}
              getMetaTitleTooltip={getMetaTitleTooltip}
              getMetaTitleLengthColor={getMetaTitleLengthColor}
              getMetaDescriptionTooltip={getMetaDescriptionTooltip}
              getMetaDescriptionLengthColor={getMetaDescriptionLengthColor}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;


