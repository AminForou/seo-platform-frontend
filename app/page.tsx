// app/page.tsx

import { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faToolbox, faLightbulb, faExternalLinkAlt, faProjectDiagram, faRobot } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import './fontawesome'; // Import FontAwesome configuration

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL;
export const metadata: Metadata = {
  title: 'Prismiqo | Powerful SEO Tools for Professionals',
  description:
    "Boost your SEO efforts with our suite of powerful, easy-to-use tools. Streamline your workflow and improve your website's performance.",
    robots: {
      index: false, // Equivalent to "noindex"
    },
    alternates: {
      canonical: `${domain}`,
    },
};

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to <span className="gradientText">Prismiqo</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Boost your SEO efforts with our powerful and easy-to-use tools
        </p>
      </div>

      <div className="mt-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Batch URL Status Checker */}
          <div className="pt-6">
            <div className="flow-root bg-[#f9fafb] rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-[#2dbdad]">
                    <FontAwesomeIcon icon={faLink} className="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Batch URL Status Checker
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Quickly check the status of multiple URLs at once. Save time and identify issues efficiently.
                </p>
                <div className="mt-6">
                  <a
                    href="/tools/mini-crawler"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#2dbdad] hover:bg-[#25a193] transition-colors duration-300"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk URL Opener */}
          <div className="pt-6">
            <div className="flow-root bg-[#f9fafb] rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-[#30a3c5]">
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Bulk URL Opener
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Open multiple URLs with customizable settings. Perfect for efficient browsing and link checking.
                </p>
                <div className="mt-6">
                  <a
                    href="/tools/bulk-url-opener"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#30a3c5] hover:bg-[#2b92b1] transition-colors duration-300"
                  >
                    Open URLs
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Site Structure Analyzer */}
          <div className="pt-6">
            <div className="flow-root bg-[#f9fafb] rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-[#4a5568]">
                    <FontAwesomeIcon icon={faProjectDiagram} className="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Site Structure Analyzer
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Analyze your website&apos;s structure and gain insights into your URL patterns and folder hierarchy.
                </p>
                <div className="mt-6">
                  <a
                    href="/tools/site-structure-analyzer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#4a5568] hover:bg-[#2d3748] transition-colors duration-300"
                  >
                    Analyze Structure
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Robots.txt Analyzer */}
          <div className="pt-6">
            <div className="flow-root bg-[#f9fafb] rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-[#6366f1]">
                    <FontAwesomeIcon icon={faRobot} className="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Robots.txt Analyzer
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Analyze and optimize your robots.txt file for better SEO and crawl efficiency.
                </p>
                <div className="mt-6">
                  <a
                    href="/tools/robots-txt-analyzer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#6366f1] hover:bg-[#4f46e5] transition-colors duration-300"
                  >
                    Analyze Robots.txt
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* More Tools Coming Soon */}
          <div className="pt-6">
            <div className="flow-root bg-[#f9fafb] rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-[#804cbd]">
                    <FontAwesomeIcon icon={faToolbox} className="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  More Tools Coming Soon
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  We&apos;re working on exciting new SEO tools to help you optimize your website even further. Stay tuned!
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-[#804cbd] bg-white">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-[#f9fafb] rounded-lg p-8 shadow-md">
        <div className="flex items-center justify-center mb-6">
          <FontAwesomeIcon icon={faLightbulb} className="h-10 w-10 text-[#30a3c5] mr-4" />
          <h2 className="text-2xl font-bold text-gray-900">Have an Idea for a New Tool?</h2>
        </div>
        <p className="text-center text-gray-600 mb-6">
          We&apos;re always looking for new ways to help our users. If you have an idea for a tool that would make your SEO work easier, we&apos;d love to hear about it!
        </p>
        <div className="text-center">
          <a
            href="mailto:contact@seotoolshub.com"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#30a3c5] hover:bg-[#2b92b1] transition-colors duration-300"
          >
            Share Your Idea
          </a>
        </div>
      </div>
    </div>
  );
}
