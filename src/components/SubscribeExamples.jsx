"use client";

import React from 'react';
import SubscribeContainer from './SubscribeContainer';

export default function SubscribeExamples() {
  // Custom submit handler
  const handleCustomSubmit = async (email) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Custom submit:', email);
    // You can add your own logic here (API call, validation, etc.)
  };

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Subscribe Component Examples</h2>
      
      {/* Default Subscribe */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">1. Default Subscribe</h3>
        <SubscribeContainer />
      </div>

      {/* Custom Title and Button */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">2. Custom Title and Button</h3>
        <SubscribeContainer 
          title="Get Daily Crypto News"
          buttonText="Join Now"
          placeholder="Your email address"
        />
      </div>

      {/* Without StarBorder */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">3. Without StarBorder</h3>
        <SubscribeContainer 
          showStarBorder={false}
          title="Simple Newsletter"
          buttonText="Sign Up"
        />
      </div>

      {/* Custom StarBorder */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">4. Custom StarBorder</h3>
        <SubscribeContainer 
          starBorderColor="green"
          starBorderSpeed="4s"
          starBorderThickness={2}
          title="Premium Updates"
          buttonText="Upgrade"
        />
      </div>

      {/* With Custom Submit Handler */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">5. With Custom Submit Handler</h3>
        <SubscribeContainer 
          onSubmit={handleCustomSubmit}
          title="Custom Handler"
          buttonText="Submit"
        />
      </div>

      {/* Custom Styling */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">6. Custom Styling</h3>
        <SubscribeContainer 
          titleClassName="text-xl font-bold mb-4 text-blue-400"
          buttonClassName="px-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition text-sm"
          inputClassName="w-full sm:w-auto flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-500 focus:outline-none focus:border-blue-400 text-sm"
          title="Custom Styled"
          buttonText="Join"
        />
      </div>

      {/* Compact Version */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">7. Compact Version</h3>
        <SubscribeContainer 
          containerClassName="w-full max-w-md mx-auto"
          titleClassName="text-sm font-semibold mb-2 text-gray-300"
          buttonClassName="px-3 py-1 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition text-xs"
          inputClassName="w-full sm:w-auto flex-1 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-green-500 text-xs"
          title="Quick Subscribe"
          buttonText="Go"
          placeholder="Email"
        />
      </div>
    </div>
  );
} 