// app/components/Footer.tsx

'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';
import Tooltip from './Tooltip';

export default function Footer() {
  return (
    <footer className="mt-8 mb-8 border-t border-white/10 pt-8 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-center md:text-left">
          <h3 className="font-bold mb-2 text-white/90">About</h3>
          <p className="mb-2 text-gray-400/80">
            Made with <span className="gradientHeart">❤</span> by Amin Foroutan
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mb-4">
            <a
              href="https://linkedin.com/in/ma-foroutan/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
            </a>
            <a
              href="https://aminforoutan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faGlobe} size="lg" />
            </a>
            <a
              href="https://www.youtube.com/@aminforoutan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-400 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faYoutube} size="lg" />
            </a>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-bold mb-2 text-white/90">My Chrome Extensions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Tooltip
                content={
                  <div>
                    <p>
                      Advanced data visualization tool for Google Search Console that enables interactive charting and analysis
                    </p>
                    <p className="mt-2">
                      <FontAwesomeIcon icon={faUsers} /> 12,423 users
                    </p>
                  </div>
                }
              >
                <a
                  href="https://chromewebstore.google.com/detail/advanced-gsc-visualizer/cdiccpnglfpnclonhpchpaaoigfpieel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400/80 hover:text-white block mb-2 transition-colors duration-200"
                >
                  Advanced GSC Visualizer
                </a>
              </Tooltip>
              <Tooltip
                content={
                  <div>
                    <p>
                      Identifies server-side vs. client-side rendered elements
                    </p>
                    <p className="mt-2">
                      <FontAwesomeIcon icon={faUsers} /> 4,994 users
                    </p>
                  </div>
                }
              >
                <a
                  href="https://chromewebstore.google.com/detail/seo-render-insight-tool/ignachbibbeengfepmkeogegpfkigljc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400/80 hover:text-white block transition-colors duration-200"
                >
                  SEO Render Insight Tool
                </a>
              </Tooltip>
            </div>
            <div>
              <Tooltip
                content={
                  <div>
                    <p>
                      Bulk keyword analysis for AI Overview status on Google
                      search results
                    </p>
                    <p className="mt-2">
                      <FontAwesomeIcon icon={faUsers} /> 3,100 users
                    </p>
                  </div>
                }
              >
                <a
                  href="https://chromewebstore.google.com/detail/google-ai-overview-impact/bfaijiabgmdblmhbnangkgiboefomdfj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400/80 hover:text-white block mb-2 transition-colors duration-200"
                >
                  AI Search Impact Analysis
                </a>
              </Tooltip>
              <Tooltip
                content={
                  <div>
                    <p>
                      Compares cited websites in AI Overviews with traditional
                      SERP results
                    </p>
                    <p className="mt-2">
                      <FontAwesomeIcon icon={faUsers} /> 2,095 users
                    </p>
                  </div>
                }
              >
                <a
                  href="https://chromewebstore.google.com/detail/google-ai-overview-citati/doobkkcnlfiglhoafllloikhabjgblae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400/80 hover:text-white block transition-colors duration-200"
                >
                  Google AI Citation Analysis
                </a>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
