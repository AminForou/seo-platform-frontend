// app/page.tsx

import { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faToolbox, faLightbulb, faExternalLinkAlt, faProjectDiagram, faRobot } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import './fontawesome'; // Import FontAwesome configuration
import dynamic from 'next/dynamic';

// Dynamically import the PrismScene to avoid SSR issues
const PrismScene = dynamic(() => import('./components/3d/PrismScene'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />
});

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL;
export const metadata: Metadata = {
  title: 'Prismiqo | Powerful SEO Tools for Professionals',
  description:
    "Boost your SEO efforts with our suite of powerful, easy-to-use tools. Streamline your workflow and improve your website's performance.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${domain}`,
  },
};

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[70vh] flex items-center">
        {/* Interactive 3D Prism Background */}
        <div className="absolute inset-0">
          <PrismScene />
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="mobile-hero-text font-bold text-white/80 sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up">
              Welcome to Prismiqo
            </h1>
            <p className="max-w-4xl mx-auto text-lg text-gray-300/70 sm:text-xl md:text-2xl leading-relaxed animate-fade-in-up-delay-1">
              Your place for finding and suggesting innovative and necessary tools for SEOs which you can&apos;t find anywhere else!
            </p>
            <div className="pt-4 animate-fade-in-up-delay-2">
              <a
                href="/contact"
                className="group inline-flex items-center px-6 py-3 text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 animate-gentle-bounce"
              >
                <span className="group-hover:animate-wiggle">Suggest a New Tool</span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tools Section */}
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white/90 mb-4">
            Try Our Tools
          </h2>
          <p className="text-gray-400/80 text-lg max-w-2xl mx-auto">
            Discover powerful SEO tools designed to streamline your workflow
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {/* Batch URL Status Checker */}
          <div className="group">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FontAwesomeIcon icon={faLink} className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="text-lg font-semibold text-white/90">
                  Mini Crawler
                </h3>
              </div>
              <p className="text-gray-400/80 text-sm mb-6 leading-relaxed">
                Check multiple URL statuses at once. Save time and identify issues efficiently.
              </p>
              <a
                href="/tools/mini-crawler"
                className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                Start crawling
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bulk URL Opener */}
          <div className="group">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="text-lg font-semibold text-white/90">
                  Bulk URL Opener
                </h3>
              </div>
              <p className="text-gray-400/80 text-sm mb-6 leading-relaxed">
                Open multiple URLs with customizable settings. Perfect for efficient browsing and link checking.
              </p>
              <a
                href="/tools/bulk-url-opener"
                className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                Open URLs
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Site Structure Analyzer */}
          <div className="group">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FontAwesomeIcon icon={faProjectDiagram} className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="text-lg font-semibold text-white/90">
                  Site Structure Analyzer
                </h3>
              </div>
              <p className="text-gray-400/80 text-sm mb-6 leading-relaxed">
                Analyze your website&apos;s structure and gain insights into your URL patterns and folder hierarchy.
              </p>
              <a
                href="/tools/site-structure-analyzer"
                className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                Analyze structure
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Robots.txt Analyzer */}
          <div className="group">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FontAwesomeIcon icon={faRobot} className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="text-lg font-semibold text-white/90">
                  Robots.txt Analyzer
                </h3>
              </div>
              <p className="text-gray-400/80 text-sm mb-6 leading-relaxed">
                Analyze and optimize your robots.txt file for better SEO and crawl efficiency.
              </p>
              <a
                href="/tools/robots-txt-analyzer"
                className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                Check robots.txt
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* More Tools Coming Soon */}
          <div className="group">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FontAwesomeIcon icon={faToolbox} className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="text-lg font-semibold text-white/90">
                  More Tools Coming Soon
                </h3>
              </div>
              <p className="text-gray-400/80 text-sm mb-6 leading-relaxed">
                We&apos;re working on exciting new SEO tools to help you optimize your website even further. Stay tuned!
              </p>
              <span className="inline-flex items-center text-sm font-medium text-gray-400 cursor-default">
                Coming Soon
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-white/10 rounded-lg mr-4">
              <FontAwesomeIcon icon={faLightbulb} className="h-6 w-6 text-white/80" />
            </div>
            <h2 className="text-2xl font-bold text-white/90">Have an Idea for a New Tool?</h2>
          </div>
          <p className="text-center text-gray-400/80 mb-8 leading-relaxed">
            We&apos;re always looking for new ways to help our users. If you have an idea for a tool that would make your SEO work easier, we&apos;d love to hear about it!
          </p>
          <a
            href="mailto:hello@prismiqo.com"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300"
          >
            Share Your Idea
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
