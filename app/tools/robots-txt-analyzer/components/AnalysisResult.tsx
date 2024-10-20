// app/tools/robots-txt-analyzer/components/AnalysisResult.tsx

'use client';

import React, { useState } from 'react';
import { List, Network, ChevronDown, ChevronUp } from 'lucide-react';

interface Rule {
  path: string;
  allowance: boolean;
}

interface ParsedEntry {
  user_agent: string[];
  rules: Rule[];
  rule_count: number;
}

interface SitemapData {
  url: string;
  status: number | string;
}

interface StatsData {
  total_user_agents: number;
  total_rules: number;
  total_disallow_rules: number;
  unique_disallow_rules: number;
  total_allow_rules: number;
  unique_allow_rules: number;
}

interface AnalysisData {
  agents: ParsedEntry[];
  sitemaps: SitemapData[];
  stats: StatsData;
}

interface AnalysisResultProps {
  data: AnalysisData;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenAccordions(openAccordions.includes(index)
      ? openAccordions.filter((i) => i !== index)
      : [...openAccordions, index]
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Robots.txt Analysis Report</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="User-agents" value={data.stats.total_user_agents} />
        <StatCard title="Total Rules" value={data.stats.total_rules} />
        <StatCard 
          title="Disallow Rules" 
          value={data.stats.total_disallow_rules} 
          subvalue={`${data.stats.unique_disallow_rules} unique`} 
        />
        <StatCard 
          title="Allow Rules" 
          value={data.stats.total_allow_rules} 
          subvalue={`${data.stats.unique_allow_rules} unique`} 
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <List className="mr-2 text-[#804cbd]" size={24} />
          User-agent Rules
        </h3>
        {data.agents.map((entry, index) => (
          <div key={index} className="border rounded-lg mb-4 overflow-hidden">
            <div
              className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
              onClick={() => toggleAccordion(index)}
            >
              <h4 className="font-semibold">
                User-agent: {entry.user_agent.join(', ')}
              </h4>
              <div className="flex items-center">
                <span className="mr-2">Rules: {entry.rule_count}</span>
                {openAccordions.includes(index) ? (
                  <ChevronUp className="text-[#804cbd]" size={20} />
                ) : (
                  <ChevronDown className="text-[#804cbd]" size={20} />
                )}
              </div>
            </div>
            {openAccordions.includes(index) && (
              <div className="p-4">
                {entry.rules.length > 0 ? (
                  <ul className="space-y-2">
                    {entry.rules.map((rule, idx) => (
                      <li key={idx} className={`flex items-center ${rule.allowance ? 'text-green-600' : 'text-red-600'}`}>
                        <span className={`inline-block w-20 font-semibold ${rule.allowance ? 'text-green-600' : 'text-red-600'}`}>
                          {rule.allowance ? 'Allow:' : 'Disallow:'}
                        </span>
                        {rule.path}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No rules specified for this user-agent.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {data.sitemaps.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Network className="mr-2 text-[#804cbd]" size={24} />
            Sitemaps
          </h3>
          <div className="bg-gray-100 rounded-lg p-4">
            {data.sitemaps.map((sitemap, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <a href={sitemap.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {sitemap.url}
                </a>
                <span className={`px-2 py-1 rounded ${sitemap.status === 200 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  Status: {sitemap.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; subvalue?: string }> = ({ title, value, subvalue }) => (
  <div className="bg-gray-100 rounded-lg p-4">
    <h4 className="text-lg font-semibold">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
    {subvalue && <p className="text-sm text-gray-600">{subvalue}</p>}
  </div>
);

export default AnalysisResult;
