import React, { useState } from 'react';
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const title = topic
    ? `Frequently Asked Questions about ${topic}`
    : "Frequently Asked Questions";

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="gradientText text-3xl font-extrabold text-center mb-12 relative">
          {title}
        </h2>
        <dl className="space-y-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`border border-gray-200 rounded-xl overflow-hidden transition-shadow duration-300 ${
                openIndex === index ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
              }`}
            >
              <dt className="text-lg">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-6 flex justify-between items-center focus:outline-none"
                >
                  <span className={`font-medium ${openIndex === index ? 'gradientText' : 'text-gray-900'}`}>
                    {item.question}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`h-5 w-5 text-[#2dbdad] transform transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </dt>
              <dd
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 gradient-border' : 'max-h-0'
                }`}
              >
                <p className="px-6 py-6 text-base text-gray-600 leading-relaxed">{item.answer}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default FAQ;