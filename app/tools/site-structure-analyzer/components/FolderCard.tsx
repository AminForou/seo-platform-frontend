import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SubfolderData {
  count: number;
  nonIndexableCount?: number;
  sampleUrl: string;
}

interface FolderData {
  count: number;
  nonIndexableCount?: number;
  sampleUrl: string;
  subfolders: { [key: string]: SubfolderData };
}

interface FolderCardProps {
  name: string;
  folder: FolderData;
  hasIndexabilityData: boolean;
  formatNumber: (num: number) => string;
  truncate: (str: string, n: number) => string;
  parentFolderCount: number; // Add this line to include the 'parentFolderCount' property
}

const FolderCard: React.FC<FolderCardProps> = ({
  name,
  folder,
  hasIndexabilityData,
  formatNumber,
  truncate,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expandedSubfolders, setExpandedSubfolders] = useState<{ [key: string]: boolean }>({});
  const [showAllSubfolders, setShowAllSubfolders] = useState<boolean>(false);

  const nonIndexablePercentage =
    hasIndexabilityData && folder.nonIndexableCount !== undefined && folder.count > 0
      ? ((folder.nonIndexableCount / folder.count) * 100).toFixed(2)
      : null;

  const sortedSubfolders = Object.entries(folder.subfolders || {}).sort(
    ([, a]: [string, SubfolderData], [, b]: [string, SubfolderData]) => b.count - a.count
  );

  const visibleSubfolders = showAllSubfolders ? sortedSubfolders : sortedSubfolders.slice(0, 5);

  const toggleSubfolder = (subName: string) => {
    setExpandedSubfolders((prev) => ({ ...prev, [subName]: !prev[subName] }));
  };

  return (
    <div className="mb-4 border rounded p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="font-semibold ml-2" title={name}>
          {truncate(name, 25)}
        </span>
        <span className="ml-2 text-gray-600">({formatNumber(folder.count)} URLs)</span>
        {nonIndexablePercentage !== null && (
          <span className="ml-2 text-xs text-red-500">
            ({nonIndexablePercentage}% non-indexable)
          </span>
        )}
      </div>
      {isOpen && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Sample URL:{' '}
            <a
              href={folder.sampleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              {folder.sampleUrl}
            </a>
          </p>

          {/* Subfolders table */}
          {sortedSubfolders.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-2">Subfolders:</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2">Name</th>
                    <th className="text-right p-2">Count</th>
                    <th className="text-right p-2">Share</th>
                    {hasIndexabilityData && (
                      <th className="text-right p-2">Non-Indexable</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visibleSubfolders.map(([subName, subFolder]: [string, SubfolderData]) => {
                    const subFolderNonIndexablePercentage =
                      hasIndexabilityData &&
                      subFolder.nonIndexableCount !== undefined &&
                      subFolder.count > 0
                        ? ((subFolder.nonIndexableCount / subFolder.count) * 100).toFixed(2)
                        : null;
                    return (
                      <React.Fragment key={subName}>
                        <tr className="border-t">
                          <td className="p-2 flex items-center" title={subName}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubfolder(subName);
                              }}
                              className="mr-2 text-custom-color hover:text-blue-700"
                            >
                              {expandedSubfolders[subName] ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </button>
                            <span className="truncate">{truncate(subName, 15)}</span>
                          </td>
                          <td className="text-right p-2">{formatNumber(subFolder.count)}</td>
                          <td className="text-right p-2">
                            {((subFolder.count / folder.count) * 100).toFixed(2)}%
                          </td>
                          {hasIndexabilityData && (
                            <td className="text-right p-2 text-xs">
                              {subFolderNonIndexablePercentage
                                ? `${subFolderNonIndexablePercentage}%`
                                : 'N/A'}
                            </td>
                          )}
                        </tr>
                        {expandedSubfolders[subName] && (
                          <tr>
                            <td colSpan={hasIndexabilityData ? 4 : 3} className="p-2 bg-gray-50">
                              <div className="text-xs text-gray-600">
                                Sample URL:{' '}
                                <a
                                  href={subFolder.sampleUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  {subFolder.sampleUrl}
                                </a>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              {sortedSubfolders.length > 5 && (
                <div className="mt-2 text-center">
                  <button
                    onClick={() => setShowAllSubfolders(!showAllSubfolders)}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    {showAllSubfolders ? 'Show Less' : `Show ${sortedSubfolders.length - 5} More`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FolderCard;