// app/tools/robots-txt-analyzer/RobotsTxtAnalyzer.tsx

'use client';

import React, { useState } from 'react';
import RobotsTxtInput from './components/RobotsTxtInput';
import AnalysisResult from './components/AnalysisResult';
import SyntaxValidator from './components/SyntaxValidator';
import TestUrlInput from './components/TestUrlInput';
import VersionComparator from './components/VersionComparator';
import FetchStatus from './components/FetchStatus';
import { BarChart2, Loader, SearchCode, Link, GitCompareArrows } from 'lucide-react';

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

  // New state variables for maintaining content across tabs
  const [analyzerContent, setAnalyzerContent] = useState({ url: '', content: '' });
  const [urlTesterContent, setUrlTesterContent] = useState({ urls: '', robotsContents: [''] });
  const [versionComparatorContent, setVersionComparatorContent] = useState({ content1: '', content2: '' });

  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysis = async (inputData: { url?: string; content?: string }) => {
    setIsLoading(true);
    setErrors([]);
    setAnalysisData(null);

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
        setErrors([data.error || 'An unexpected error occurred']);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setErrors(['Unable to connect to the server. Please check your internet connection and try again.']);
      } else if (error instanceof Error) {
        setErrors([error.message]);
      } else {
        setErrors(['An unexpected error occurred']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analyzer':
        return (
          <>
            <RobotsTxtInput
              onAnalyze={handleAnalysis}
              url={analyzerContent.url}
              content={analyzerContent.content}
              onUrlChange={(url) => setAnalyzerContent(prev => ({ ...prev, url }))}
              onContentChange={(content) => setAnalyzerContent(prev => ({ ...prev, content }))}
              isLoading={isLoading}
            />
            {isLoading && (
              <div className="flex items-center justify-center my-4">
                <Loader className="animate-spin mr-2" />
                <span>Analyzing robots.txt...</span>
              </div>
            )}
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
            urls={urlTesterContent.urls}
            robotsContents={urlTesterContent.robotsContents}
            onUrlsChange={(urls) => setUrlTesterContent(prev => ({ ...prev, urls }))}
            onRobotsContentsChange={(robotsContents) => setUrlTesterContent(prev => ({ ...prev, robotsContents }))}
          />
        );
      case 'versionComparator':
        return (
          <VersionComparator
            content1={versionComparatorContent.content1}
            content2={versionComparatorContent.content2}
            onContent1Change={(content1) => setVersionComparatorContent(prev => ({ ...prev, content1 }))}
            onContent2Change={(content2) => setVersionComparatorContent(prev => ({ ...prev, content2 }))}
          />
        );
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex-grow">
            <div className="flex items-center mb-2">
              <SearchCode className="text-[#804cbd] mr-2" size={24} />
              <h4 className="font-semibold">Analyzer</h4>
            </div>
            <p className="text-sm text-gray-600">
              Analyze your robots.txt file for syntax errors, user agents, and rules. Get insights into your website&apos;s crawl directives.
            </p>
          </div>
          <button
            className={`w-full py-3 px-4 font-medium transition-colors duration-200 rounded-lg ${
              activeTab === 'analyzer'
                ? 'bg-[#2dbdad] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('analyzer')}
          >
            <SearchCode className="inline-block mr-2" size={20} />
            Analyzer
          </button>
        </div>
        <div className="flex flex-col">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex-grow">
            <div className="flex items-center mb-2">
              <Link className="text-[#804cbd] mr-2" size={24} />
              <h4 className="font-semibold">URL Tester</h4>
            </div>
            <p className="text-sm text-gray-600">
              Test specific URLs against your robots.txt rules. Check if search engine bots are allowed to crawl important pages on your website.
            </p>
          </div>
          <button
            className={`w-full py-3 px-4 font-medium transition-colors duration-200 rounded-lg ${
              activeTab === 'urlTester'
                ? 'bg-[#30a3c5] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('urlTester')}
          >
            <Link className="inline-block mr-2" size={20} />
            URL Tester
          </button>
        </div>
        <div className="flex flex-col">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex-grow">
            <div className="flex items-center mb-2">
              <GitCompareArrows className="text-[#804cbd] mr-2" size={24} />
              <h4 className="font-semibold">Version Comparator</h4>
            </div>
            <p className="text-sm text-gray-600">
              Compare different versions of your robots.txt file. Identify changes and their potential impact on your site&apos;s crawlability and SEO.
            </p>
          </div>
          <button
            className={`w-full py-3 px-4 font-medium transition-colors duration-200 rounded-lg ${
              activeTab === 'versionComparator'
                ? 'bg-[#804cbd] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('versionComparator')}
          >
            <GitCompareArrows className="inline-block mr-2" size={20} />
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
