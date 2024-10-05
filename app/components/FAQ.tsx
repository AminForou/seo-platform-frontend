import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  topic?: string;
}

const FAQ: React.FC<FAQProps> = ({ items, topic }) => {
  const title = topic
    ? `Frequently Asked Questions about ${topic}`
    : "Frequently Asked Questions";

  return (
    <section className="py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="gradientText text-2xl sm:text-3xl font-extrabold text-center mb-8 sm:mb-12 relative">
          {title}
        </h2>
        <dl className="space-y-4 sm:space-y-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="faq-item border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <dt className="text-base sm:text-lg">
                <button
                  className="faq-question w-full px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-start focus:outline-none"
                  data-index={index}
                >
                  <span className="font-medium text-left">
                    {item.question}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="faq-icon h-4 w-4 sm:h-5 sm:w-5 text-[#2dbdad] transform transition-transform duration-300 flex-shrink-0 mt-1"
                  />
                </button>
              </dt>
              <dd className="faq-answer overflow-hidden max-h-0 transition-all duration-300 ease-in-out gradient-border">
                <p className="px-4 sm:px-6 py-4 sm:py-6 text-sm sm:text-base text-gray-600 leading-relaxed">{item.answer}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
    
  );
};

export default FAQ;