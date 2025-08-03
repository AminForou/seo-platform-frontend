'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        const errorData = await response.json();
        setStatus(`Failed to send message: ${errorData.message || 'Unknown error.'}`);
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Network or server error:', error);
      setStatus('An error occurred. Please try again later.');
    }
  };  

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-8 backdrop-blur-sm transition-all duration-300">
      <h2 className="text-2xl font-bold text-white/90 mb-6">Send Us a Message</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-white/10 border border-white/20 focus:border-white/40 p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-white/10 border border-white/20 focus:border-white/40 p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full bg-white/10 border border-white/20 focus:border-white/40 p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full bg-white/10 border border-white/20 focus:border-white/40 p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 resize-vertical"
          rows={5}
        />
      </div>
      <button
        type="submit"
        className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300 font-medium"
      >
        Send Message
      </button>
      {status && <p className="mt-4 text-center text-gray-300">{status}</p>}
    </form> 
    
  );
}