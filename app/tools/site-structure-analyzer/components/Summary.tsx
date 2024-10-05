import React from 'react';

interface SummaryProps {
  data: any;
  hasIndexabilityData: boolean;
}

const Summary: React.FC<SummaryProps> = ({ data, hasIndexabilityData }) => {
  const totalUrls = Object.values(data).reduce(
    (sum: number, folder: any) => sum + folder.count,
    0
  );
  const totalNonIndexable = hasIndexabilityData
    ? Object.values(data).reduce(
        (sum: number, folder: any) => sum + (folder.nonIndexableCount || 0),
        0
      )
    : 0;

  const topFolders = Object.entries(data)
    .sort((a: any, b: any) => b[1].count - a[1].count)
    .slice(0, 5);

  const formatNumber = (num: number) => num.toLocaleString();
  const truncate = (str: string, n: number) =>
    str.length > n ? str.substr(0, n - 1) + '...' : str;

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-md gradient-border">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total URLs</h3>
            <p className="text-2xl font-bold">{formatNumber(totalUrls)}</p>
          </div>
          {hasIndexabilityData && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Non-indexable URLs</h3>
              <p className="text-2xl font-bold">
                {formatNumber(totalNonIndexable)} ({((totalNonIndexable / totalUrls) * 100).toFixed(2)}%)
              </p>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Top-level Folders</h3>
            <p className="text-2xl font-bold">{formatNumber(Object.keys(data).length)}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Top 5 Folders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Folder Name</th>
                  <th className="text-right p-2">URL Count</th>
                  <th className="text-right p-2">Share</th>
                  {hasIndexabilityData && <th className="text-right p-2">Non-Indexable %</th>}
                </tr>
              </thead>
              <tbody>
                {topFolders.map(([name, folder]: any) => {
                  const nonIndexablePercentage =
                    hasIndexabilityData && folder.nonIndexableCount
                      ? ((folder.nonIndexableCount / folder.count) * 100).toFixed(2)
                      : null;
                  return (
                    <tr key={name} className="border-t hover:bg-gray-50">
                      <td className="p-2" title={name}>
                        {truncate(name, 25)}
                      </td>
                      <td className="text-right p-2">{formatNumber(folder.count)}</td>
                      <td className="text-right p-2">
                        {((folder.count / totalUrls) * 100).toFixed(2)}%
                      </td>
                      {hasIndexabilityData && (
                        <td className="text-right p-2">
                          {nonIndexablePercentage ? `${nonIndexablePercentage}%` : 'N/A'}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
