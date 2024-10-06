// app/tools/robots-txt-analyzer/RobotsTxtAnalyzer.tsx

'use client';

import React, { useState } from 'react';
import RobotsTxtInput from './components/RobotsTxtInput';
import AnalysisResult from './components/AnalysisResult';
import SyntaxValidator from './components/SyntaxValidator';
import TestUrlInput from './components/TestUrlInput';
import VersionComparator from './components/VersionComparator';
import FetchStatus from './components/FetchStatus';
import { BarChart2 } from 'lucide-react';

interface AnalysisData {
  fetch_status: number | null;
  errors: string[];
  parsed_data: {
    agents: ParsedEntry[];
    sitemaps: SitemapData[];
    stats: StatsData;
  } | null;
  robots_content: string;
}

interface ParsedEntry {
  user_agent: string[];
  rules: Rule[];
  rule_count: number;
}

interface Rule {
  path: string;
  allowance: boolean;
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

const RobotsTxtAnalyzer: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleAnalysis = async (inputData: { url?: string; content?: string }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/robots-analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysisData(data);
        setErrors(data.errors || []);
      } else {
        setAnalysisData(null);
        setErrors([data.error]);
      }
    } catch (error) {
      setErrors([(error as Error).message]);
    }
  };

  return (
    <div className="bg-gray-50 shadow rounded-lg p-6">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-center mb-2">
          <BarChart2 className="text-2xl text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Robots.txt Analyzer</h1>
        </div>
        <p className="text-center text-sm text-gray-500">
          Analyze and optimize your robots.txt file for better SEO
        </p>
      </div>

      <div className="space-y-4">
        <RobotsTxtInput onAnalyze={handleAnalysis} />
        {analysisData && analysisData.fetch_status !== null && (
          <FetchStatus status={analysisData.fetch_status} />
        )}
        {errors.length > 0 && <SyntaxValidator errors={errors} />}
        {analysisData?.parsed_data && (
          <AnalysisResult data={analysisData.parsed_data} />
        )}
        <TestUrlInput
          availableUserAgents={analysisData?.parsed_data?.agents.map(agent => agent.user_agent).flat() || []}
        />
        <VersionComparator />
      </div>
    </div>
  );
};

export default RobotsTxtAnalyzer;
