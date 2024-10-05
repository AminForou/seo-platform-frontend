'use client';

import React, { useState } from 'react';
import URLAnalysisDashboard from './URLAnalysisDashboard';
import FAQ from '../../components/FAQ';

export default function SiteStructureAnalyzer() {
  const faqItems = [
    {
      question: "What is the Site Structure Analyzer?",
      answer: "The Site Structure Analyzer is a tool that helps you understand your website's structure by analyzing a list of URLs. It provides insights into first-level URLs, second-level URLs, and query string parameters, which can be useful for SEO, sitemap creation, and overall site organization."
    },
    {
      question: "What file format should I use?",
      answer: "You should upload a CSV file with URLs in the first column (column A). Optionally, you can include indexability information (TRUE/FALSE) in the second column (column B)."
    },
    {
      question: "How many URLs can the tool handle?",
      answer: "The tool has been tested with up to 5 million URLs, so it can handle large websites efficiently."
    },
    {
      question: "What insights does the tool provide?",
      answer: "The tool analyzes first-level URLs (e.g., /about/, /products/), second-level URLs (e.g., /products/category1/, /products/category2/), and query string parameters. It provides information on URL counts, indexability percentages (if provided), and helps identify patterns in your site's structure."
    },
    {
      question: "How can I use the results?",
      answer: "The results can be used to optimize your website's structure, create more efficient sitemaps, improve your robots.txt file, identify potential SEO issues, and gain a better understanding of your site's overall organization."
    },
    {
      question: "Is indexability information required?",
      answer: "No, indexability information is optional. If provided, the tool will calculate indexability percentages for folders and query parameters, giving you additional insights into your site's SEO performance."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <URLAnalysisDashboard />
        <FAQ items={faqItems} topic="Site Structure Analyzer" />
      </main>
    </div>
  );
}
