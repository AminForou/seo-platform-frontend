import React from 'react';
import FAQ from '../../../components/FAQ';

const BulkUrlFaq: React.FC = () => {
  const faqItems = [
    {
      question: "What is a Bulk URL Opener?",
      answer: "A Bulk URL Opener is a tool that allows you to open multiple URLs simultaneously in separate browser tabs. It's useful for quickly accessing multiple web pages without manually opening each one."
    },
    {
      question: "How many URLs can I open at once?",
      answer: "The number of URLs you can open at once depends on your browser's capabilities and your system resources. However, to avoid overwhelming your browser, we recommend opening no more than 50 URLs at a time."
    },
    {
      question: "Can I customize the delay between opening URLs?",
      answer: "Yes, you can set both minimum and maximum delay times between URL openings. This helps mimic human behavior and can prevent triggering security measures on websites."
    },
    {
      question: "What are UTM parameters and how can I use them?",
      answer: "UTM parameters are tags you can add to URLs to track the effectiveness of your marketing campaigns. With our tool, you can append UTM parameters to all URLs you're opening, making it easier to track their performance in analytics tools."
    },
    {
      question: "Can I filter the URLs I want to open?",
      answer: "Yes, you can use the filter feature to only open URLs containing specific words or domains. This is useful when you want to focus on a subset of URLs from a larger list."
    },
    {
      question: "What is the 'URLs per Batch' setting?",
      answer: "The 'URLs per Batch' setting allows you to split your list of URLs into smaller groups. This is useful for managing large lists of URLs, as you can open a set number at a time and save your position for sequential opening."
    }
  ];

  return <FAQ items={faqItems} topic="Bulk URL Opener" />;
};

export default BulkUrlFaq;
