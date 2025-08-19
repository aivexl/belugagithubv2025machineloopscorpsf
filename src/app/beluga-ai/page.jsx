import React from 'react';

export const metadata = {
  title: 'Beluga AI - Artificial Intelligence for Crypto',
  description: 'Advanced AI-powered cryptocurrency analysis, predictions, and insights powered by Beluga AI.',
};

export default function BelugaAiPage() {
  return (
    <div className="min-h-screen bg-duniacrypto-panel text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/Asset/aistar.png" 
              alt="Beluga AI" 
              className="w-24 h-24 brightness-0 invert"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Beluga AI
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced artificial intelligence for cryptocurrency analysis, market predictions, and blockchain insights
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12 text-center border border-gray-700">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-lg text-gray-300 mb-6">
              We're building the most advanced AI-powered cryptocurrency analysis platform
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Predictions</h3>
              <p className="text-gray-400">AI-powered price predictions and market trend analysis</p>
            </div>

            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Risk Analysis</h3>
              <p className="text-gray-400">Comprehensive risk assessment for crypto investments</p>
            </div>

            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
              <p className="text-gray-400">Real-time blockchain data analysis and insights</p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
            <h3 className="text-xl font-semibold mb-4">Get Early Access</h3>
            <p className="text-gray-300 mb-4">
              Be the first to know when Beluga AI launches
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
