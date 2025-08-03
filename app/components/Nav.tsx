'use client';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Oxanium } from 'next/font/google';
import { useTheme } from '../contexts/ThemeContext';

const oxanium = Oxanium({ 
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

export default function Nav() {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Theme-aware styles
  const headerStyles = theme === 'light' 
    ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 relative z-[999]'
    : 'bg-black/95 backdrop-blur-sm border-b border-white/10 relative z-[999]';
    
  const logoTextStyles = theme === 'light' 
    ? 'font-bold text-gray-900 leading-none'
    : 'font-bold text-white/90 leading-none';
    
  const mobileButtonStyles = theme === 'light'
    ? 'md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200'
    : 'md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200';
    
  const navItemStyles = theme === 'light'
    ? 'flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200'
    : 'flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200';
    
  const dropdownStyles = theme === 'light'
    ? 'absolute left-0 mt-1 w-64 rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200 py-2 z-[999] shadow-lg'
    : 'absolute left-0 mt-1 w-64 rounded-xl bg-black/95 backdrop-blur-sm border border-white/20 py-2 z-[999]';
    
  const dropdownLinkStyles = theme === 'light'
    ? 'flex flex-col px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-150'
    : 'flex flex-col px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-150';
    
  const dropdownSubtextStyles = theme === 'light'
    ? 'text-xs text-gray-500 mt-1'
    : 'text-xs text-gray-400 mt-1';
    
  const mobileBorderStyles = theme === 'light'
    ? 'pt-4 border-t border-gray-200'
    : 'pt-4 border-t border-white/10';
    
  const mobileLinkStyles = theme === 'light'
    ? 'w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200'
    : 'w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200';
    
  const mobileDropdownLinkStyles = theme === 'light'
    ? 'flex flex-col px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200'
    : 'flex flex-col px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200';
    
  const pageNavStyles = theme === 'light'
    ? 'px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200'
    : 'px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200';
    
  const pageNavMobileStyles = theme === 'light'
    ? 'block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200'
    : 'block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDesktopDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  return (
    <header className={headerStyles}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
            <img
              src="/prismiqo-logo.png"
              alt="Prismiqo Logo"
              className="h-8 w-8 flex-shrink-0"
              style={{ width: '33px', height: '33px' }}
            />
            <span className={`${logoTextStyles} ${oxanium.className}`} style={{ fontSize: '1.96rem', marginTop: '5px' }}>Prismiqo</span>
          </a>
          
          {/* Hamburger menu button for mobile */}
          <button
            className={mobileButtonStyles}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon
              icon={isMenuOpen ? faTimes : faBars}
              className="text-xl"
            />
          </button>

          {/* Desktop menu */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-1">
              <li className="relative" ref={dropdownRef}>
                <button
                  className={navItemStyles}
                  onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
                  onMouseEnter={() => setIsDesktopDropdownOpen(true)}
                >
                  Tools
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`ml-2 text-xs transition-transform duration-200 ${isDesktopDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                {isDesktopDropdownOpen && (
                  <div 
                    className={dropdownStyles}
                    onMouseLeave={() => setIsDesktopDropdownOpen(false)}
                  >
                    <a
                      href="/tools/mini-crawler"
                      className={dropdownLinkStyles}
                    >
                      <span className="font-medium text-sm">Mini Crawler</span>
                      <span className={dropdownSubtextStyles}>Check multiple URL statuses</span>
                    </a>
                    <a
                      href="/tools/bulk-url-opener"
                      className={dropdownLinkStyles}
                    >
                      <span className="font-medium text-sm">Bulk URL Opener</span>
                      <span className={dropdownSubtextStyles}>Open multiple URLs efficiently</span>
                    </a>
                    <a
                      href="/tools/site-structure-analyzer"
                      className={dropdownLinkStyles}
                    >
                      <span className="font-medium text-sm">Site Structure Analyzer</span>
                      <span className={dropdownSubtextStyles}>Analyze URL patterns & hierarchy</span>
                    </a>
                    <a
                      href="/tools/robots-txt-analyzer"
                      className={dropdownLinkStyles}
                    >
                      <span className="font-medium text-sm">Robots.txt Analyzer</span>
                      <span className={dropdownSubtextStyles}>Optimize crawl directives</span>
                    </a>
                  </div>
                )}
              </li>
              <li>
                <a
                  href="/about"
                  className={pageNavStyles}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className={pageNavStyles}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
          <nav className={mobileBorderStyles}>
            <ul className="space-y-1">
            <li>
              <button
                  className={mobileLinkStyles}
                onClick={toggleMobileDropdown}
              >
                Tools
                  <FontAwesomeIcon 
                    icon={isMobileDropdownOpen ? faChevronUp : faChevronDown} 
                    className="text-sm" 
                  />
              </button>
              {isMobileDropdownOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                  <a
                    href="/tools/mini-crawler"
                      className={mobileDropdownLinkStyles}
                  >
                      <span className="font-medium text-sm">Mini Crawler</span>
                      <span className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Check multiple URL statuses</span>
                  </a>
                  <a
                    href="/tools/bulk-url-opener"
                      className={mobileDropdownLinkStyles}
                  >
                      <span className="font-medium text-sm">Bulk URL Opener</span>
                      <span className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Open multiple URLs efficiently</span>
                  </a>
                  <a
                    href="/tools/site-structure-analyzer"
                      className={mobileDropdownLinkStyles}
                  >
                      <span className="font-medium text-sm">Site Structure Analyzer</span>
                      <span className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Analyze URL patterns & hierarchy</span>
                  </a>
                  <a
                    href="/tools/robots-txt-analyzer"
                      className={mobileDropdownLinkStyles}
                  >
                      <span className="font-medium text-sm">Robots.txt Analyzer</span>
                      <span className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Optimize crawl directives</span>
                  </a>
                </div>
              )}
            </li>
            <li>
              <a
                href="/about"
                  className={pageNavMobileStyles}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/contact"
                  className={pageNavMobileStyles}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
        </div>
      </div>
    </header>
  );
}