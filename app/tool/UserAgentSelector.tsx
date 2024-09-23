import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../components/Tooltip';

interface UserAgentSelectorProps {
  userAgent: string;
  setUserAgent: (userAgent: string) => void;
}

const UserAgentSelector: React.FC<UserAgentSelectorProps> = ({ userAgent, setUserAgent }) => {
  const predefinedUserAgents = useMemo(
    () => [
      { label: 'Default (Browser User-Agent)', value: 'default' },
      { label: 'Windows Chrome', value: 'Windows' },
      { label: 'macOS Safari', value: 'Mac' },
      { label: 'iPhone Safari', value: 'iPhone' },
      { label: 'Googlebot', value: 'Googlebot' },
      { label: 'Bingbot', value: 'Bingbot' },
      { label: 'Custom', value: 'custom' },
    ],
    []
  );

  const userAgentStrings = useMemo(
    () => ({
      default:
        typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0',
      Windows:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      Mac:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
      iPhone:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
      Googlebot:
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      Bingbot:
        'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    }),
    []
  );

  type UserAgentOption =
    | 'default'
    | 'Windows'
    | 'Mac'
    | 'iPhone'
    | 'Googlebot'
    | 'Bingbot'
    | 'custom';

  // Initialize selectedOption based on the initial userAgent prop
  const [selectedOption, setSelectedOption] = useState<UserAgentOption>(() => {
    const option = (Object.entries(userAgentStrings).find(
      ([, value]) => value === userAgent
    )?.[0] as UserAgentOption) || 'default';

    if (option !== 'default') {
      return option;
    } else if (userAgent && userAgent !== userAgentStrings.default) {
      return 'custom';
    } else {
      return 'default';
    }
  });

  // Initialize customUserAgent if the initial userAgent is custom
  const [customUserAgent, setCustomUserAgent] = useState(() => {
    if (
      userAgent &&
      !Object.values(userAgentStrings).includes(userAgent)
    ) {
      return userAgent;
    }
    return '';
  });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedOption === 'custom') {
      setUserAgent(customUserAgent);
    } else {
      setUserAgent(userAgentStrings[selectedOption]);
    }
  }, [selectedOption, customUserAgent, setUserAgent, userAgentStrings]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserAgentChange = (value: UserAgentOption) => {
    setSelectedOption(value);
    setIsOpen(false);
    if (value !== 'custom') {
      setCustomUserAgent('');
    }
  };

  const handleCustomUserAgentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const customValue = e.target.value;
    setCustomUserAgent(customValue);
    setUserAgent(customValue);
  };

  return (
    <div className="space-y-2 mt-4 mb-6">
      <label
        htmlFor="userAgent"
        className="block text-sm font-medium text-gray-700 flex items-center"
      >
        Select User-Agent
        <Tooltip content="Selecting different user agents allows you to simulate requests from various browsers or bots. This is useful for SEOs to see how search engine crawlers or different devices view your website.">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="ml-2 text-gray-400 hover:text-gray-600"
          />
        </Tooltip>
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block truncate">
            {predefinedUserAgents.find(
              (ua) => ua.value === selectedOption
            )?.label}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <FontAwesomeIcon
              icon={faChevronDown}
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {predefinedUserAgents.map((ua) => (
              <div
                key={ua.value}
                className={`${
                  selectedOption === ua.value
                    ? 'text-white bg-indigo-600'
                    : 'text-gray-900'
                } cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-100`}
                onClick={() =>
                  handleUserAgentChange(ua.value as UserAgentOption)
                }
              >
                <span
                  className={`block truncate ${
                    selectedOption === ua.value
                      ? 'font-semibold'
                      : 'font-normal'
                  }`}
                >
                  {ua.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedOption === 'custom' && (
        <>
          <label
            htmlFor="customUserAgent"
            className="block text-sm font-medium text-gray-700 mt-2"
          >
            Enter Custom User-Agent
          </label>
          <input
            type="text"
            id="customUserAgent"
            name="customUserAgent"
            value={customUserAgent}
            onChange={handleCustomUserAgentChange}
            placeholder="E.g., MyCustomUserAgent/1.0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter your custom User-Agent string. Example: &quot;MyCustomUserAgent/1.0&quot;
          </p>
        </>
      )}
    </div>
  );
};

export default UserAgentSelector;
