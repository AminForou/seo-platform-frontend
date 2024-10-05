import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Info, Search } from 'lucide-react';
import Tooltip from '@/app/components/Tooltip';
import FolderCard from './FolderCard';

interface FolderData {
  count: number;
  nonIndexableCount?: number;
  sampleUrl: string;
  subfolders: any; // Add this line to include the 'subfolders' property
}

interface FolderStructure {
  [key: string]: FolderData;
}

interface FolderDetailsProps {
  folderStructure: FolderStructure;
  hasIndexabilityData: boolean;
}

const FolderDetails: React.FC<FolderDetailsProps> = ({
  folderStructure,
  hasIndexabilityData,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [folderThreshold, setFolderThreshold] = useState<number>(100);

  const formatNumber = (num: number) => num.toLocaleString();
  const truncate = (str: string, n: number) =>
    str.length > n ? str.substr(0, n - 1) + '...' : str;

  const foldersArray = useMemo(() => {
    return Object.entries(folderStructure)
      .sort((a: [string, FolderData], b: [string, FolderData]) => {
        if (a[0] === 'root') return -1;
        if (b[0] === 'root') return 1;
        return b[1].count - a[1].count;
      })
      .filter(
        ([name, folder]: [string, FolderData]) =>
          name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          folder.count > folderThreshold
      );
  }, [folderStructure, searchTerm, folderThreshold]);

  const totalFolders = Object.keys(folderStructure).length;

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-md gradient-border">
      <div className="flex items-center cursor-pointer mb-4" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronDown size={24} className="text-custom-color" /> : <ChevronRight size={24} className="text-custom-color" />}
        <h2 className="text-xl font-semibold ml-2">First-Level Folder Analysis</h2>
      </div>
      {isOpen && (
        <div className="mt-4 space-y-6">
          <p className="text-sm text-gray-600">
            This section displays the structure of your website&apos;s folders, including URL counts and indexability data (if available). By default, it shows folders with more than 100 URLs. Adjust the &quot;Minimum URL threshold&quot; to see more or fewer folders. Your website has {totalFolders.toLocaleString()} folders, and you currently see {foldersArray.length.toLocaleString()} folders in the view.
          </p>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <Tooltip content="Set the minimum number of URLs a folder must have to be displayed">
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
          {foldersArray.length === 0 ? (
            <p className="text-gray-600">No matching folders found. Try adjusting your search or lowering the URL count threshold.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foldersArray.map(([name, folder]: [string, FolderData]) => (
                <FolderCard
                  key={name}
                  name={name}
                  folder={folder}
                  parentFolderCount={folder.count}
                  hasIndexabilityData={hasIndexabilityData}
                  formatNumber={formatNumber}
                  truncate={truncate}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FolderDetails;
