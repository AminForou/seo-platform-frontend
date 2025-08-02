'use client';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Oxanium } from 'next/font/google';

const oxanium = Oxanium({ 
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

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
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
            <img
              src="/prismiqo-logo.png"
              alt="Prismiqo Logo"
              className="h-8 w-8 flex-shrink-0"
              style={{ width: '33px', height: '33px' }}
            />
            <span className={`font-bold gradientText ${oxanium.className} leading-none`} style={{ fontSize: '1.96rem', marginTop: '5px' }}>Prismiqo</span>
          </a>
          
          {/* Hamburger menu button for mobile */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
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
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
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
                    className="absolute left-0 mt-1 w-64 rounded-xl shadow-lg bg-white ring-1 ring-gray-200 py-2 z-50"
                    onMouseLeave={() => setIsDesktopDropdownOpen(false)}
                  >
                    <a
                      href="/tools/mini-crawler"
                      className="flex flex-col px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <span className="font-medium text-sm">Mini Crawler</span>
                      <span className="text-xs text-gray-500 mt-1">Check multiple URL statuses</span>
                    </a>
                    <a
                      href="/tools/bulk-url-opener"
                      className="flex flex-col px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <span className="font-medium text-sm">Bulk URL Opener</span>
                      <span className="text-xs text-gray-500 mt-1">Open multiple URLs efficiently</span>
                    </a>
                    <a
                      href="/tools/site-structure-analyzer"
                      className="flex flex-col px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <span className="font-medium text-sm">Site Structure Analyzer</span>
                      <span className="text-xs text-gray-500 mt-1">Analyze URL patterns & hierarchy</span>
                    </a>
                    <a
                      href="/tools/robots-txt-analyzer"
                      className="flex flex-col px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <span className="font-medium text-sm">Robots.txt Analyzer</span>
                      <span className="text-xs text-gray-500 mt-1">Optimize crawl directives</span>
                    </a>
                  </div>
                )}
              </li>
              <li>
                <a
                  href="/about"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
          <nav className="pt-4 border-t border-gray-200">
            <ul className="space-y-1">
              <li>
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
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
                      className="flex flex-col px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                    >
                      <span className="font-medium text-sm">Mini Crawler</span>
                      <span className="text-xs text-gray-500 mt-1">Check multiple URL statuses</span>
                    </a>
                    <a
                      href="/tools/bulk-url-opener"
                      className="flex flex-col px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                    >
                      <span className="font-medium text-sm">Bulk URL Opener</span>
                      <span className="text-xs text-gray-500 mt-1">Open multiple URLs efficiently</span>
                    </a>
                    <a
                      href="/tools/site-structure-analyzer"
                      className="flex flex-col px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                    >
                      <span className="font-medium text-sm">Site Structure Analyzer</span>
                      <span className="text-xs text-gray-500 mt-1">Analyze URL patterns & hierarchy</span>
                    </a>
                    <a
                      href="/tools/robots-txt-analyzer"
                      className="flex flex-col px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                    >
                      <span className="font-medium text-sm">Robots.txt Analyzer</span>
                      <span className="text-xs text-gray-500 mt-1">Optimize crawl directives</span>
                    </a>
                  </div>
                )}
              </li>
              <li>
                <a
                  href="/about"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
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