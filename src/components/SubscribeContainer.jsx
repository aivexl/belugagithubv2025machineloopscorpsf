"use client";

import React, { useState } from 'react';
import StarBorder from './StarBorder';

export default function SubscribeContainer({
  title = "Subscribe for Crypto Updates",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  onSubmit,
  className = "",
  showStarBorder = true,
  starBorderColor = "cyan",
  starBorderSpeed = "6s",
  starBorderThickness = 1,
  containerClassName = "w-full max-w-full mt-0 mb-8",
  titleClassName = "text-base font-bold mb-3 text-white",
  inputClassName = "w-full sm:w-auto flex-1 px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-duniacrypto-green text-sm",
  buttonClassName = "px-4 py-2 rounded bg-duniacrypto-green text-black font-bold hover:bg-green-400 transition text-sm"
}) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      if (onSubmit) {
        await onSubmit(email);
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        // Default behavior - just show success message
        setMessage('Thank you for subscribing!');
        setEmail('');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <h3 className={titleClassName}>{title}</h3>
      <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2 items-center justify-center mt-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className={inputClassName}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={buttonClassName}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Subscribing...' : buttonText}
        </button>
      </form>
      {message && (
        <div className={`text-sm mt-2 ${message.includes('Thank you') ? 'text-duniacrypto-green' : 'text-duniacrypto-red'}`}>
          {message}
        </div>
      )}
    </div>
  );

  if (!showStarBorder) {
    return (
      <div className={containerClassName}>
        <div className="bg-duniacrypto-panel rounded-lg shadow p-4 border border-gray-700">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <StarBorder 
        as="div" 
        className="w-full" 
        color={starBorderColor} 
        speed={starBorderSpeed} 
        thickness={starBorderThickness}
      >
        {content}
      </StarBorder>
    </div>
  );
} 