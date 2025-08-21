"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ComingSoonLiteProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showEmailInput?: boolean;
  customMessage?: string;
}

export default function ComingSoonLite({ 
  title = "Coming Soon",
  subtitle = "Something amazing is brewing!",
  description = "We're working hard to bring you something special. Stay tuned!",
  showEmailInput = true,
  customMessage
}: ComingSoonLiteProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsLoading(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-duniacrypto-bg-darker via-gray-900 to-blue-900/20 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5 animate-pulse" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-500/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-32 w-3 h-3 bg-purple-500/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-40 w-5 h-5 bg-cyan-500/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-20 w-4 h-4 bg-pink-500/20 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in">
        {/* Beluga Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <Image
              src="/Asset/beluganewlogov2.png"
              alt="Beluga Logo"
              width={120}
              height={120}
              className="relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300 w-[120px] h-[120px]"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
            {title}
          </span>
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-300 mb-6 animate-fade-in-delay-1">
          {subtitle}
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed animate-fade-in-delay-2">
          {customMessage || description}
        </p>

        {/* Email Input Section */}
        {showEmailInput && (
          <div className="max-w-md mx-auto animate-fade-in-delay-3">
            {!isSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                                 <div className="relative">
                   <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="Enter your email for updates"
                     className="w-full px-6 py-4 bg-gray-700/80 border border-blue-400/60 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-3 focus:ring-blue-400/70 focus:border-blue-300 backdrop-blur-sm transition-all duration-300 focus:scale-105 focus:bg-gray-600/90"
                     required
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full -z-10 animate-pulse" />
                 </div>
                 
                 <button
                   type="submit"
                   disabled={isLoading || !email}
                   className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 border border-blue-300/30 hover:border-blue-200/50"
                 >
                   {isLoading ? (
                     <div className="flex items-center justify-center space-x-2">
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                       <span>Subscribing...</span>
                     </div>
                   ) : (
                     'Notify Me!'
                   )}
                 </button>
              </form>
            ) : (
              <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 animate-success">
                <div className="w-16 h-16 bg-green-400 rounded-full mx-auto mb-4 animate-bounce flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">
                  You&apos;re on the list!
                </h3>
                <p className="text-gray-300">
                  We&apos;ll let you know when we launch. Get ready for something awesome! 
                </p>
              </div>
            )}
          </div>
        )}

        {/* Animated Elements */}
        <div className="mt-12 flex justify-center space-x-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Progress Dots */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
