// app/components/Footer.tsx

'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';
import Tooltip from './Tooltip';
import { useTheme } from '../contexts/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  
  // Theme-aware styles
  const footerStyles = theme === 'light'
    ? 'mt-8 mb-8 border-t border-gray-200 pt-8 bg-white'
    : 'mt-8 mb-8 border-t border-white/10 pt-8 bg-black';
    
  const headingStyles = theme === 'light'
    ? 'font-bold mb-2 text-gray-900'
    : 'font-bold mb-2 text-white/90';
    
  const textStyles = theme === 'light'
    ? 'mb-2 text-gray-600'
    : 'mb-2 text-gray-400/80';
    
  const linkStyles = theme === 'light'
    ? 'text-gray-600 hover:text-gray-900 transition-colors duration-200'
    : 'text-gray-400 hover:text-white transition-colors duration-200';
    
  const socialLinkStyles = {
    linkedin: theme === 'light' ? 'text-gray-600 hover:text-blue-600 transition-colors duration-200' : 'text-gray-400 hover:text-blue-400 transition-colors duration-200',
    youtube: theme === 'light' ? 'text-gray-600 hover:text-red-600 transition-colors duration-200' : 'text-gray-400 hover:text-red-400 transition-colors duration-200',
    website: theme === 'light' ? 'text-gray-600 hover:text-gray-900 transition-colors duration-200' : 'text-gray-400 hover:text-white transition-colors duration-200'
  };
  
  const extensionLinkStyles = theme === 'light'
    ? 'text-gray-600 hover:text-gray-900 block mb-2 transition-colors duration-200'
    : 'text-gray-400/80 hover:text-white block mb-2 transition-colors duration-200';
    
  const extensionLinkLastStyles = theme === 'light'
    ? 'text-gray-600 hover:text-gray-900 block transition-colors duration-200'
    : 'text-gray-400/80 hover:text-white block transition-colors duration-200';

  return (
    <footer className={footerStyles}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-center md:text-left">
          <h3 className={headingStyles}>About</h3>
          <p className={textStyles}>
            Made with <span className="gradientHeart">❤</span> by Amin Foroutan
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mb-4">
            <a
              href="https://linkedin.com/in/ma-foroutan/"
              target="_blank"
              rel="noopener noreferrer"
              className={socialLinkStyles.linkedin}
            >
              <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
            </a>
            <a
              href="https://aminforoutan.com"
              target="_blank"
              rel="noopener noreferrer"
              className={socialLinkStyles.website}
            >
              <FontAwesomeIcon icon={faGlobe} size="lg" />
            </a>
            <a
              href="https://www.youtube.com/@aminforoutan"
              target="_blank"
              rel="noopener noreferrer"
              className={socialLinkStyles.youtube}
            >
              <FontAwesomeIcon icon={faYoutube} size="lg" />
            </a>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h3 className={headingStyles}>My Chrome Extensions</h3>
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
                  className={extensionLinkStyles}
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
                  className={extensionLinkLastStyles}
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
                  className={extensionLinkStyles}
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
                  className={extensionLinkLastStyles}
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
