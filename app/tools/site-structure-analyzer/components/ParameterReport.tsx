import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Info, Search } from 'lucide-react';
import Tooltip from '@/app/components/Tooltip';

interface ParameterReportProps {
  globalParams: any;
}

const ParameterReport: React.FC<ParameterReportProps> = ({ globalParams }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [paramThreshold, setParamThreshold] = useState<number>(0);

  const formatNumber = (num: number) => num.toLocaleString();

  const highlightParameter = (url: string, param: string) => {
    const regex = new RegExp(`(\\?${param}=([^&]+))`, 'g');
    return url.replace(regex, '<span class="bg-yellow-200">$1</span>');
  };

  const sortedParams = useMemo(() => {
    return Object.entries(globalParams)
      .sort((a: any, b: any) => b[1].count - a[1].count)
      .filter(
        ([param, data]: any) =>
          param.toLowerCase().includes(searchTerm.toLowerCase()) &&
          data.count > paramThreshold
      );
  }, [globalParams, searchTerm, paramThreshold]);

  const totalParams = Object.keys(globalParams).length;

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-md gradient-border">
      <div className="flex items-center cursor-pointer mb-4" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronDown size={24} className="text-custom-color" /> : <ChevronRight size={24} className="text-custom-color" />}
        <h2 className="text-xl font-semibold ml-2">Parameter Report</h2>
      </div>
      {isOpen && (
        <div className="mt-4 space-y-6">
          <p className="text-sm text-gray-600">
            This section displays URL parameters found across your website, their frequency, and the top folders where they appear. Adjust the &quot;Minimum occurrence threshold&quot; to see more or fewer parameters. Your website has {totalParams.toLocaleString()} unique parameters, and you currently see {sortedParams.length.toLocaleString()} parameters in the table.
          </p>
          <div className="flex items-end space-x-4">
            <div className="flex-grow">
              <label htmlFor="paramSearch" className="block text-sm font-medium text-gray-700 mb-1">
                Search parameters
              </label>
              <div className="relative">
                <input
                  id="paramSearch"
                  type="text"
                  placeholder="Enter parameter name to filter results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2 mb-1">
                <label htmlFor="paramThreshold" className="block text-sm font-medium text-gray-700">
                  Minimum occurrence threshold
                </label>
                <Tooltip content="Set the minimum number of occurrences a parameter must have to be displayed in the table">
                  <Info size={16} className="text-custom-color" />
                </Tooltip>
              </div>
              <input
                id="paramThreshold"
                type="number"
                value={paramThreshold}
                onChange={(e) => setParamThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-32 px-2 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {sortedParams.length === 0 ? (
            <p className="text-gray-600">No matching parameters found. Try adjusting your search or lowering the occurrence threshold.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full mt-2 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2">Parameter</th>
                    <th className="text-right p-2">Count</th>
                    <th className="text-left p-2">Top Folders</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedParams.map(([param, data]: any) => (
                    <tr key={param} className="border-t hover:bg-gray-50">
                      <td className="p-2">?{param}</td>
                      <td className="text-right p-2">{formatNumber(data.count)}</td>
                      <td className="p-2">
                        {Object.entries(data.folders)
                          .sort((a: any, b: any) => b[1].count - a[1].count)
                          .slice(0, 3)
                          .map(([folder, folderData]: any, index: number) => (
                            <div key={folder} className={index > 0 ? 'mt-1' : ''}>
                              {folder}: {formatNumber(folderData.count)}
                              <br />
                              <div className="text-xs text-gray-500 flex items-center">
                                <span className="mr-1">Sample:</span>
                                <span
                                  className="truncate flex-grow"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightParameter(folderData.sampleUrl, param),
                                  }}
                                />
                                <a
                                  href={folderData.sampleUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-1 text-blue-500 hover:text-blue-700"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              </div>
                            </div>
                          ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParameterReport;