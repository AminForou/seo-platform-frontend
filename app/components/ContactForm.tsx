'use client';

import React from 'react';

export default function ContactForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add form submission logic here
  };

  return (
    <div className="bg-[#f9fafb] rounded-lg p-8 shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
    <form onSubmit={handleSubmit}>
    <div className="mb-4">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2dbdad]"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2dbdad]"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
        Subject
      </label>
      <input
        type="text"
        id="subject"
        name="subject"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2dbdad]"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
        Message
      </label>
      <textarea
        id="message"
        name="message"
        rows={4}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2dbdad]"
      ></textarea>
    </div>
    <button
      type="submit"
      className="w-full bg-[#2dbdad] text-white py-2 px-4 rounded-md hover:bg-[#25a193] transition-colors duration-300"
    >
      Send Message
    </button>
  </form>
          </div>
  );
}