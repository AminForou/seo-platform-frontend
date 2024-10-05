import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, ChevronUp, Info, Search } from 'lucide-react';
import Tooltip from '@/app/components/Tooltip';

interface SecondLevelFolderAnalysisProps {
  secondLevelFolders: {
    [key: string]: {
      count: number;
      nonIndexableCount?: number;
      subfolders: { [key: string]: any };
      sampleUrl: string;
    };
  };
  hasIndexabilityData: boolean;
}

const SecondLevelFolderAnalysis: React.FC<SecondLevelFolderAnalysisProps> = ({
  secondLevelFolders,
  hasIndexabilityData,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({});
  const [folderSearchTerm, setFolderSearchTerm] = useState<string>('');
  const [folderThreshold, setFolderThreshold] = useState<number>(500);

  const formatNumber = (num: number) => num.toLocaleString();
  const truncate = (str: string, n: number) => (str.length > n ? str.substr(0, n - 1) + '...' : str);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const sortedFolders = useMemo(() => {
    return Object.entries(secondLevelFolders || {})
      .sort((a, b) => b[1].count - a[1].count)
      .filter(
        ([name, data]) =>
          name.toLowerCase().includes(folderSearchTerm.toLowerCase()) &&
          data.count > folderThreshold
      );
  }, [secondLevelFolders, folderSearchTerm, folderThreshold]);

  const totalFolders = Object.keys(secondLevelFolders || {}).length;

  const highlightFolderInUrl = (url: string, folderName: string) => {
    const regex = new RegExp(`(/${folderName}/)`, 'i');
    return url.replace(regex, '<span class="bg-yellow-200">$1</span>');
  };

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-md gradient-border">
      <div className="flex items-center cursor-pointer mb-4" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronDown size={24} className="text-custom-color" /> : <ChevronRight size={24} className="text-custom-color" />}
        <h2 className="text-xl font-semibold ml-2">Second-Level Folder Analysis</h2>
      </div>
      {isOpen && (
        <div className="mt-4 space-y-6">
          <p className="text-sm text-gray-600">
            In this section, you can see the structure of second-level folders, their names, URL counts, and how many unique subfolders are under them. The table only shows folders with more than 500 URLs by default. Adjust the "Minimum URL threshold" to see more or fewer folders in the table. Your website has {totalFolders.toLocaleString()} folders, and you currently see {sortedFolders.length.toLocaleString()} folders in the table.
          </p>
          <div className="space-y-4">
            <div className="flex items-end space-x-4">
              <div className="flex-grow">
                <label htmlFor="folderSearch" className="block text-sm font-medium text-gray-700 mb-1">
                  Search folders
                </label>
                <div className="relative">
                  <input
                    id="folderSearch"
                    type="text"
                    placeholder="Enter folder name or keyword to filter results..."
                    value={folderSearchTerm}
                    onChange={(e) => setFolderSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2 mb-1">
                  <label htmlFor="folderThreshold" className="block text-sm font-medium text-gray-700">
                    Minimum URL threshold
                  </label>
                  <Tooltip content="Set the minimum number of URLs a folder must have to be displayed in the table">
                    <Info size={16} className="text-custom-color" />
                  </Tooltip>
                </div>
                <input
                  id="folderThreshold"
                  type="number"
                  value={folderThreshold}
                  onChange={(e) => setFolderThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-32 px-2 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          {sortedFolders.length === 0 ? (
            <p className="text-gray-600">No matching folders found. Try adjusting your search or lowering the URL count threshold.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full mt-2 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2">Folder Name</th>
                    <th className="text-right p-2">URL Count</th>
                    {hasIndexabilityData && <th className="text-right p-2">Non-Indexable %</th>}
                    <th className="text-right p-2">Subfolders</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFolders.map(([folderName, folderData]) => {
                    const folderNonIndexablePercentage =
                      hasIndexabilityData && folderData.nonIndexableCount !== undefined && folderData.count > 0
                        ? ((folderData.nonIndexableCount / folderData.count) * 100).toFixed(2)
                        : null;

                    return (
                      <React.Fragment key={folderName}>
                        <tr className="border-t hover:bg-gray-50">
                          <td className="p-2 flex items-center" title={folderName}>
                            <button
                              onClick={() => toggleFolder(folderName)}
                              className="mr-2 text-custom-color hover:text-blue-700 flex items-center"
                              aria-label={expandedFolders[folderName] ? "Hide details" : "Show details"}
                            >
                              {expandedFolders[folderName] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                            <span className="truncate">{folderName}</span>
                          </td>
                          <td className="text-right p-2">{formatNumber(folderData.count)}</td>
                          {hasIndexabilityData && (
                            <td className="text-right p-2">
                              {folderNonIndexablePercentage ? `${folderNonIndexablePercentage}%` : 'N/A'}
                            </td>
                          )}
                          <td className="text-right p-2">
                            {formatNumber(Object.keys(folderData.subfolders || {}).length)}
                          </td>
                        </tr>
                        {expandedFolders[folderName] && (
                          <tr>
                            <td colSpan={4} className="p-4 bg-gray-50">
                              <div className="text-sm text-gray-600">
                                <p className="font-medium mb-2">Sample URL:</p>
                                <a
                                  href={folderData.sampleUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 break-all"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightFolderInUrl(folderData.sampleUrl, folderName),
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecondLevelFolderAnalysis;