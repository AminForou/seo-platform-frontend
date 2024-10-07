// app/tools/robots-txt-analyzer/RobotsTxtAnalyzer.tsx

'use client';

import React, { useState } from 'react';
import RobotsTxtInput from './components/RobotsTxtInput';
import AnalysisResult from './components/AnalysisResult';
import SyntaxValidator from './components/SyntaxValidator';
import TestUrlInput from './components/TestUrlInput';
import VersionComparator from './components/VersionComparator';
import FetchStatus from './components/FetchStatus';
import { BarChart2, Search, GitCompare, FileText, Globe, History } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('analyzer');

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analyzer':
        return (
          <>
            <RobotsTxtInput onAnalyze={handleAnalysis} />
            {analysisData && analysisData.fetch_status !== null && (
              <FetchStatus status={analysisData.fetch_status} />
            )}
            {errors.length > 0 && <SyntaxValidator errors={errors} />}
            {analysisData?.parsed_data && (
              <AnalysisResult data={analysisData.parsed_data} />
            )}
          </>
        );
      case 'urlTester':
        return (
          <TestUrlInput
            availableUserAgents={analysisData?.parsed_data?.agents.map(agent => agent.user_agent).flat() || []}
          />
        );
      case 'versionComparator':
        return <VersionComparator />;
      default:
        return null;
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

      {/* Feature cards */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <FileText className="text-indigo-600 mr-2" size={24} />
              <h4 className="font-semibold">Robots.txt Analyzer</h4>
            </div>
            <p className="text-sm text-gray-600">
              Analyze your robots.txt file for syntax errors, user agents, and rules. Get insights into your crawl directives and optimize for search engines.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Globe className="text-indigo-600 mr-2" size={24} />
              <h4 className="font-semibold">URL Tester</h4>
            </div>
            <p className="text-sm text-gray-600">
              Test specific URLs against your robots.txt rules. Check if search engine bots are allowed to crawl important pages on your website.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <History className="text-indigo-600 mr-2" size={24} />
              <h4 className="font-semibold">Version Comparator</h4>
            </div>
            <p className="text-sm text-gray-600">
              Compare different versions of your robots.txt file. Identify changes and their potential impact on your site's crawlability and SEO.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium transition-colors duration-200 ${
              activeTab === 'analyzer'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('analyzer')}
          >
            <BarChart2 className="inline-block mr-2" />
            Analyzer
          </button>
          <button
            className={`py-2 px-4 font-medium transition-colors duration-200 ${
              activeTab === 'urlTester'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('urlTester')}
          >
            <Search className="inline-block mr-2" />
            URL Tester
          </button>
          <button
            className={`py-2 px-4 font-medium transition-colors duration-200 ${
              activeTab === 'versionComparator'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('versionComparator')}
          >
            <GitCompare className="inline-block mr-2" />
            Version Comparator
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default RobotsTxtAnalyzer;
