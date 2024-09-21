// app/components/Nav.tsx

'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools } from '@fortawesome/free-solid-svg-icons';

export default function Nav() {
  return (
    <header className="bg-gray-50 shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center">
          <FontAwesomeIcon
              icon={faTools}
              size="2x" // Use the size prop
              className="text-indigo-600 mr-3"
            />
            <p className="text-2xl font-bold text-gray-900">SEO Tools Hub</p>
          </a>
          <nav>
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
      </div>
    </header>
  );
}
