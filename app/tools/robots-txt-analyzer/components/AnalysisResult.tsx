// app/tools/robots-txt-analyzer/components/AnalysisResult.tsx

'use client';

import React, { useState } from 'react';

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
    if (openAccordions.includes(index)) {
      setOpenAccordions(openAccordions.filter((i) => i !== index));
    } else {
      setOpenAccordions([...openAccordions, index]);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Analysis Result</h2>

      <div className="mb-4">
        <h3 className="font-semibold">Summary</h3>
        <ul className="list-disc pl-5">
          <li>Total User-agents: {data.stats.total_user_agents}</li>
          <li>Total Rules: {data.stats.total_rules}</li>
          <li>Total Disallow Rules: {data.stats.total_disallow_rules} (Unique: {data.stats.unique_disallow_rules})</li>
          <li>Total Allow Rules: {data.stats.total_allow_rules} (Unique: {data.stats.unique_allow_rules})</li>
        </ul>
      </div>

      {data.sitemaps.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Sitemaps</h3>
          <ul className="list-disc pl-5">
            {data.sitemaps.map((sitemap, index) => (
              <li key={index}>
                <a href={sitemap.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {sitemap.url}
                </a>
                {' '}
                (Status: {sitemap.status})
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.agents.map((entry, index) => (
        <div key={index} className="border p-2 mb-2">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleAccordion(index)}
          >
            <h3 className="font-semibold">
              User-agent: {entry.user_agent.join(', ')}
            </h3>
            <span>Rules: {entry.rule_count} {openAccordions.includes(index) ? '-' : '+'}</span>
          </div>
          {openAccordions.includes(index) && (
            <>
              {entry.rules.length > 0 ? (
                <ul className="list-disc pl-5 mt-2">
                  {entry.rules.map((rule, idx) => (
                    <li key={idx}>
                      {rule.allowance ? 'Allow' : 'Disallow'}: {rule.path}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No rules specified for this user-agent.</p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnalysisResult;
