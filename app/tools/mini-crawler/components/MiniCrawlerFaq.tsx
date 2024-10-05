import React from 'react';
import FAQ from '../../../components/FAQ';

const MiniCrawlerFaq: React.FC = () => {
  const faqItems = [
    {
      question: "What is a Batch URL Status Checker?",
      answer: "A Batch URL Status Checker is a tool that allows you to check the status of multiple URLs simultaneously. It provides information such as HTTP status codes, redirect chains, and metadata for each URL."
    },
    {
      question: "How many URLs can I check at once?",
      answer: "The number of URLs you can check at once depends on the server's capacity. Generally, you can check up to 100 URLs in a single batch, but for best performance, we recommend checking 50 or fewer URLs at a time."
    },
    {
      question: "What information does the tool provide?",
      answer: "The tool provides various pieces of information including status code, redirect chain, response time, content type, meta title, meta description, and H1 tags. You can customize which fields to display in the results."
    },
    {
      question: "How accurate is the tool?",
      answer: "The tool provides real-time results based on the current state of the URLs. However, website statuses can change rapidly, so results may vary if you check the same URL at different times."
    },
    {
      question: "Is there a limit to how often I can use the tool?",
      answer: "There are no strict limits, but we encourage responsible use. If you need to check a very large number of URLs frequently, please contact us about our API or enterprise solutions."
    }
  ];

  return <FAQ items={faqItems} topic="Batch URL Status Checker" />;
};

export default MiniCrawlerFaq;
