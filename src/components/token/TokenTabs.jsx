"use client";

import React from "react";

const TokenTabs = ({ activeTab, onChange, isSolana = false }) => {
  const tabs = [
    { id: "transactions", label: "Transactions" },
    { id: "holders", label: "Holders", disabled: isSolana },
    { id: "holder-insights", label: "Holder Insights", disabled: isSolana },
    { id: "snipers", label: "Snipers" },
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="flex space-x-1 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? "bg-gray-900 text-white border-b-2 border-blue-500"
                : tab.disabled
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TokenTabs; 