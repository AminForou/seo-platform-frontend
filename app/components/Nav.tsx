'use client';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faBars, faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

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
    <header className="bg-gray-50 shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center">
            <FontAwesomeIcon
              icon={faTools}
              size="2x"
              className="text-indigo-600 mr-3"
            />
            <p className="text-2xl font-bold text-gray-900">SEO Tools Hub</p>
          </a>
          
          {/* Hamburger menu button for mobile */}
          <button
            className="md:hidden text-gray-600 hover:text-indigo-600 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon
              icon={isMenuOpen ? faTimes : faBars}
              className="text-2xl"
            />
          </button>

          {/* Desktop menu */}
          <nav className="hidden md:block">
            <ul className="flex space-x-4 items-center">
              <li>
                <a href="/" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </a>
              </li>
              <li className="relative" ref={dropdownRef}>
                <button
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
                  onMouseEnter={() => setIsDesktopDropdownOpen(true)}
                >
                  Tools
                  <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-xs" />
                </button>
                {isDesktopDropdownOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-10"
                    onMouseLeave={() => setIsDesktopDropdownOpen(false)}
                  >
                    <a
                      href="/tools/mini-crawler"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                    >
                      Mini Crawler
                    </a>
                    <a
                      href="/tools/bulk-url-opener"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                    >
                      Bulk URL Opener
                    </a>
                    <a
                      href="/tools/site-structure-analyzer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                    >
                      Site Structure Analyzer
                    </a>
                  </div>
                )}
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile menu */}
        <nav className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <ul className="flex flex-col space-y-2">
            <li>
              <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100">
                Home
              </a>
            </li>
            <li>
              <button
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 flex items-center justify-between"
                onClick={toggleMobileDropdown}
              >
                Tools
                <FontAwesomeIcon icon={isMobileDropdownOpen ? faChevronUp : faChevronDown} className="ml-1 text-xs" />
              </button>
              {isMobileDropdownOpen && (
                <div className="pl-4 mt-2">
                  <a
                    href="/tools/mini-crawler"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                  >
                    Mini Crawler
                  </a>
                  <a
                    href="/tools/bulk-url-opener"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                  >
                    Bulk URL Opener
                  </a>
                  <a
                    href="/tools/site-structure-analyzer"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                  >
                    Site Structure Analyzer
                  </a>
                </div>
              )}
            </li>
            <li>
              <a
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}