import React from 'react';
import FAQ from '../../../components/FAQ';

const ImageOptimizerFaq: React.FC = () => {
  const faqItems = [
    {
      question: "What is the Image Optimizer tool?",
      answer: "The Image Optimizer is a free, client-side tool that allows you to compress, crop, and convert images to different formats. All processing happens in your browser, ensuring your images never leave your device."
    },
    {
      question: "What image formats are supported?",
      answer: "The tool supports input formats including JPEG, PNG, GIF, BMP, WebP, TIFF, and SVG. You can convert images to WebP, AVIF, JPEG, or PNG formats for output."
    },
    {
      question: "How much can I compress my images?",
      answer: "Compression depends on the original image and settings you choose. Typically, you can achieve 50-90% file size reduction while maintaining good visual quality. WebP and AVIF formats generally provide the best compression ratios."
    },
    {
      question: "Is there a file size limit?",
      answer: "Since processing happens entirely in your browser, the only limit is your device's available memory. However, for best performance, we recommend working with images under 50MB each."
    },
    {
      question: "Can I process multiple images at once?",
      answer: "Yes! You can upload multiple images and process them individually or download all optimized images as a ZIP file. Each image can have its own compression settings and format."
    },
    {
      question: "What crop aspect ratios are available?",
      answer: "The tool supports free cropping as well as common aspect ratios including 1:1 (square), 4:3, 16:9, 3:2, and their vertical variants. Perfect for social media, web use, or print requirements."
    },
    {
      question: "Are my images uploaded to your servers?",
      answer: "No! All image processing happens locally in your browser using JavaScript. Your images never leave your device, ensuring complete privacy and security."
    },
    {
      question: "Which format should I choose for my images?",
      answer: "WebP offers excellent compression with wide browser support. AVIF provides the best compression but has limited browser support. JPEG is best for photos with universal support, while PNG is ideal for images requiring transparency."
    }
  ];

  return <FAQ items={faqItems} topic="Image Optimizer" />;
};

export default ImageOptimizerFaq;