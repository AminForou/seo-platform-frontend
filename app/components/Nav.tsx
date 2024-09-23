// app/components/Nav.tsx

'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="text-gray-600 hover:text-indigo-600">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/tool"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Tool
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-indigo-600"
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
              <a href="/" className="text-gray-600 hover:text-indigo-600">
                Home
              </a>
            </li>
            <li>
              <a
                href="/tool"
                className="text-gray-600 hover:text-indigo-600"
              >
                Tool
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-gray-600 hover:text-indigo-600"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-gray-600 hover:text-indigo-600"
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
