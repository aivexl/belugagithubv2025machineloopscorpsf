"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showEmailInput?: boolean;
  customMessage?: string;
}

export default function ComingSoon({ 
  title = "Coming Soon",
  subtitle = "Something amazing is brewing!",
  description = "We're working hard to bring you something special. Stay tuned!",
  showEmailInput = true,
  customMessage
}: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  // Generate floating elements for background animation
  useEffect(() => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setFloatingElements(elements);
  }, []);

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

  const belugaVariants = {
    initial: { scale: 0.8, rotate: -10 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-duniacrypto-bg-darker via-gray-900 to-blue-900/20 flex items-center justify-center relative overflow-hidden">
      {/* Floating Background Elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute w-4 h-4 bg-blue-500/10 rounded-full"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + element.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay
          }}
        />
      ))}

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5 animate-pulse" />

      {/* Main Content */}
      <motion.div 
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Beluga Logo with Animation */}
        <motion.div 
          className="mb-8 flex justify-center"
          variants={belugaVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <Image
              src="/Asset/belugalogov3white.png"
              alt="Beluga Logo"
              width={120}
              height={120}
              className="relative z-10 drop-shadow-2xl"
              priority
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-white mb-4"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2 
          className="text-xl md:text-2xl font-semibold text-gray-300 mb-6"
          variants={itemVariants}
        >
          {subtitle}
        </motion.h2>

        {/* Description */}
        <motion.p 
          className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed"
          variants={itemVariants}
        >
          {customMessage || description}
        </motion.p>

        {/* Email Input Section */}
        {showEmailInput && (
          <motion.div 
            className="max-w-md mx-auto"
            variants={itemVariants}
          >
            {!isSubmitted ? (
                             <form onSubmit={handleEmailSubmit} className="space-y-4">
                 <div className="relative">
                   <motion.input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="Enter your email for updates"
                     className="w-full px-6 py-4 bg-gray-700/80 border border-blue-400/60 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-3 focus:ring-blue-400/70 focus:border-blue-300 backdrop-blur-sm transition-all duration-300 focus:bg-gray-600/90"
                     required
                     whileFocus={{ scale: 1.02 }}
                   />
                   <motion.div
                     className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full -z-10"
                     animate={{
                       opacity: [0, 0.7, 0],
                     }}
                     transition={{
                       duration: 2,
                       repeat: Infinity,
                       ease: "easeInOut"
                     }}
                   />
                 </div>
                 
                 <motion.button
                   type="submit"
                   disabled={isLoading || !email}
                   className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl border border-blue-300/30 hover:border-blue-200/50"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   {isLoading ? (
                     <motion.div 
                       className="flex items-center justify-center space-x-2"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                     >
                       <motion.div
                         className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                         animate={{ rotate: 360 }}
                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                       />
                       <span>Subscribing...</span>
                     </motion.div>
                   ) : (
                     'Notify Me!'
                   )}
                 </motion.button>
               </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                  className="w-16 h-16 bg-green-400 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <motion.div 
                    className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </motion.div>
                </motion.div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">
                  You're on the list!
                </h3>
                <p className="text-gray-300">
                  We'll let you know when we launch. Get ready for something awesome! 
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Animated Elements */}
        <motion.div 
          className="mt-12 flex justify-center space-x-4"
          variants={itemVariants}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`${index === 1 ? 'w-4 h-4 bg-purple-400' : 'w-3 h-3 bg-blue-400'} rounded-full`}
              animate={{
                y: [-5, 5, -5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3
              }}
            />
          ))}
        </motion.div>

        {/* Progress Dots */}
        <motion.div 
          className="mt-8 flex justify-center space-x-2"
          variants={itemVariants}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
