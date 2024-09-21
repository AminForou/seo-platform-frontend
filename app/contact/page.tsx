// app/contact/page.tsx

import { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedinIn,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import ContactForm from '../components/ContactForm';

const domain = process.env.NEXT_PUBLIC_CANONICAL_URL;

export const metadata: Metadata = {
  title: 'Contact SEO Tools Hub',
  description:
    "Have questions or suggestions? Reach out to the SEO Tools Hub team. We're here to help you optimize your SEO workflow and improve your website's performance.",
    robots: {
        index: false, // Equivalent to "noindex"
      },
      alternates: {
        canonical: `${domain}/contact`,
      },
};

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-4">
          Contact <span className="gradientText">Us</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:text-xl">
          We&apos;d love to hear from you. Get in touch with us!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactForm />

        <div className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-[#30a3c5] mr-3" />
              <a
                href="mailto:tools@aminforoutan.com"
                className="text-gray-600 hover:text-[#30a3c5]"
              >
                tools@aminforoutan.com
              </a>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLinkedinIn} className="text-[#30a3c5] mr-3" />
              <a
                href="https://linkedin.com/in/ma-foroutan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#30a3c5]"
              >
                LinkedIn
              </a>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faXTwitter} className="text-[#30a3c5] mr-3" />
              <a
                href="https://x.com/aminfseo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#30a3c5]"
              >
                @aminfseo
              </a>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-gray-600">
              Feel free to reach out through any of these channels. I&apos;ll do my best to respond as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
