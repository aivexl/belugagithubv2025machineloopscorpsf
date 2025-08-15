"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AcademyFiltersContextType {
  activeLevel: string;
  activeTopic: string;
  activeNetwork: string;
  setActiveLevel: (level: string) => void;
  setActiveTopic: (topic: string) => void;
  setActiveNetwork: (network: string) => void;
  clearAllFilters: () => void;
  handleLevelClick: (levelId: string) => void;
  handleTopicClick: (topic: string) => void;
  handleNetworkClick: (network: string) => void;
}

const AcademyFiltersContext = createContext<AcademyFiltersContextType | undefined>(undefined);

export function useAcademyFilters() {
  const context = useContext(AcademyFiltersContext);
  if (context === undefined) {
    throw new Error('useAcademyFilters must be used within an AcademyFiltersProvider');
  }
  return context;
}

interface AcademyFiltersProviderProps {
  children: ReactNode;
}

// Level categories - EXACT copy from AcademyClient
const LEVEL_CATEGORIES = [
  { id: 'newbie', title: 'Newbie', color: 'bg-green-600', description: 'Mulai dari dasar cryptocurrency', image: '/Asset/duniacrypto.png' },
  { id: 'intermediate', title: 'Intermediate', color: 'bg-yellow-600', description: 'Tingkatkan pengetahuan blockchain', image: '/Asset/duniacrypto.png' },
  { id: 'expert', title: 'Expert', color: 'bg-red-600', description: 'Mahir dalam teknologi crypto', image: '/Asset/duniacrypto.png' }
];

// Topic categories - EXACT copy from AcademyClient
const TOPIC_CATEGORIES = [
  'DeFi', 'NFT', 'Wallet', 'Blockchain', 'Trading', 'Airdrop', 
  'Security', 'Tokenomics', 'Stablecoin', 'GameFi', 'Web3', 
  'DAO', 'Mining', 'Metaverse'
];

// Blockchain network categories - EXACT copy from AcademyClient
const NETWORK_CATEGORIES = [
  'Bitcoin Network', 'Ethereum Network', 'Binance Smart Chain (BSC)', 
  'Solana Network', 'Polygon Network', 'Avalanche Network', 
  'Arbitrum Network', 'Cardano Network'
];

export function AcademyFiltersProvider({ children }: AcademyFiltersProviderProps) {
  const [activeLevel, setActiveLevel] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [activeNetwork, setActiveNetwork] = useState('');

  // Initialize from URL params like AcademyClient does
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const level = params.get('level');
      const topic = params.get('topic');
      const network = params.get('network');
      if (level && LEVEL_CATEGORIES.some(l => l.id === level)) setActiveLevel(level);
      if (topic && TOPIC_CATEGORIES.includes(topic)) setActiveTopic(topic);
      if (network && NETWORK_CATEGORIES.includes(network)) setActiveNetwork(network);
    }
  }, []);

  // Exact same handlers as AcademyClient - NO router.push, just state changes
  const handleLevelClick = (levelId: string) => {
    const newLevel = activeLevel === levelId ? '' : levelId;
    setActiveLevel(newLevel);
    setActiveTopic('');
    setActiveNetwork('');
  };

  const handleTopicClick = (topic: string) => {
    const newTopic = activeTopic === topic ? '' : topic;
    setActiveTopic(newTopic);
    setActiveLevel('');
    setActiveNetwork('');
  };

  const handleNetworkClick = (network: string) => {
    const newNetwork = activeNetwork === network ? '' : network;
    setActiveNetwork(newNetwork);
    setActiveLevel('');
    setActiveTopic('');
  };

  const clearAllFilters = () => {
    setActiveLevel('');
    setActiveTopic('');
    setActiveNetwork('');
  };

  return (
    <AcademyFiltersContext.Provider value={{ 
      activeLevel, 
      activeTopic, 
      activeNetwork, 
      setActiveLevel, 
      setActiveTopic, 
      setActiveNetwork, 
      clearAllFilters,
      handleLevelClick,
      handleTopicClick,
      handleNetworkClick
    }}>
      {children}
    </AcademyFiltersContext.Provider>
  );
}
