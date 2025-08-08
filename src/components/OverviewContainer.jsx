"use client";

import React from 'react';
import StarBorder from './StarBorder';

export default function OverviewContainer({ children, title, className = "" }) {
  return (
    <div className={`bg-duniacrypto-panel rounded-lg shadow p-4 border border-gray-700 ${className}`}>
      <StarBorder>
        {title && (
          <h3 className="text-base font-bold mb-3 text-white">{title}</h3>
        )}
        {children}
      </StarBorder>
    </div>
  );
} 