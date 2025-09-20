'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiGlobe, 
  FiCalendar, 
  FiMapPin, 
  FiExternalLink, 
  FiStar,
  FiTrendingUp,
  FiDollarSign,
  FiBook,
  FiGift,
  FiZap
} from 'react-icons/fi';
import { 
  exchangesData, 
  airdropData, 
  icoIdoData, 
  fundraisingData, 
  web3GlossaryData 
} from '@/data/cryptoData';

const TABS = [
  { id: 'exchanges', label: 'Exchanges', icon: FiZap },
  { id: 'airdrop', label: 'Airdrop', icon: FiGift },
  { id: 'ico-ido', label: 'ICO/IDO', icon: FiTrendingUp },
  { id: 'fundraising', label: 'Fundraising', icon: FiDollarSign },
  { id: 'glossary', label: 'Kamus WEB3', icon: FiBook }
];

export default function CryptoUnifiedClient() {
  const [activeTab, setActiveTab] = useState('exchanges');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'exchanges': return exchangesData;
      case 'airdrop': return airdropData;
      case 'ico-ido': return icoIdoData;
      case 'fundraising': return fundraisingData;
      case 'glossary': return web3GlossaryData;
      default: return exchangesData;
    }
  };

  const currentData = getCurrentData();

  // Get filter options based on active tab
  const getFilterOptions = () => {
    switch (activeTab) {
      case 'exchanges':
        return ['All', 'Centralized', 'Decentralized'];
      case 'airdrop':
        return ['All', 'Completed', 'Ongoing', 'Upcoming'];
      case 'ico-ido':
        return ['All', 'Completed', 'Ongoing', 'Upcoming'];
      case 'fundraising':
        return ['All', 'Completed', 'Ongoing', 'Upcoming'];
      case 'glossary':
        return ['All', 'Protocol', 'Token', 'Strategy', 'Technology', 'Organization'];
      default:
        return ['All'];
    }
  };

  // Filter and search data
  const filteredData = useMemo(() => {
    const data = currentData;
    let filtered = data.filter(item => {
      const matchesFilter = selectedFilter === 'All' || 
        (activeTab === 'exchanges' && item.type === selectedFilter) ||
        (activeTab === 'airdrop' && item.status === selectedFilter) ||
        (activeTab === 'ico-ido' && item.status === selectedFilter) ||
        (activeTab === 'fundraising' && item.status === selectedFilter) ||
        (activeTab === 'glossary' && item.category === selectedFilter);

      const matchesSearch = searchQuery === '' || 
        (activeTab === 'exchanges' && (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (activeTab === 'airdrop' && (
          item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (activeTab === 'ico-ido' && (
          item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (activeTab === 'fundraising' && (
          item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.useCase.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (activeTab === 'glossary' && (
          item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.example.toLowerCase().includes(searchQuery.toLowerCase())
        ));

      return matchesFilter && matchesSearch;
    });

    return filtered;
  }, [activeTab, searchQuery, selectedFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedFilter]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function untuk generate exchange logo
  const generateExchangeLogo = (name) => {
    if (!name) return '/images/exchanges/default-exchange.svg';
    const firstLetter = name.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=F7931A&color=fff&size=64&font-size=0.4`;
  };

  // Render table headers based on active tab
  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'exchanges':
        return (
          <>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Exchange</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              <div className="flex items-center gap-2"><FiMapPin />Country</div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              <div className="flex items-center gap-2"><FiGlobe />Region</div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              <div className="flex items-center gap-2"><FiCalendar />Founded</div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Website</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Features</th>
          </>
        );
      case 'airdrop':
        return (
          <>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Project</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Token</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Network</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reward</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Participants</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estimated Value</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Website</th>
          </>
        );
      case 'ico-ido':
        return (
          <>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Project</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Token</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Network</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Raised</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ROI</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Website</th>
          </>
        );
      case 'fundraising':
        return (
          <>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Project</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Raised</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valuation</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Round</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Investors</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Website</th>
          </>
        );
      case 'glossary':
        return (
          <>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Term</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Definition</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Example</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Related Terms</th>
          </>
        );
      default:
        return null;
    }
  };

  // Render table rows based on active tab
  const renderTableRows = () => {
    return paginatedData.map((item) => {
      switch (activeTab) {
        case 'exchanges':
          return (
            <tr key={item.id} className="hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={item.logo || item.logo_url || generateExchangeLogo(item.name)} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = generateExchangeLogo(item.name);
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-bold text-white">{item.name}</div>
                    {item.tradingVolume && (
                      <div className="text-sm text-gray-400">Volume: {item.tradingVolume}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.country}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.region}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(item.founded)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a 
                  href={item.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline"
                >
                  Visit Website
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.type === 'Centralized' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'
                }`}>
                  {item.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Active' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {item.features && item.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-700 text-gray-300">
                      {feature}
                    </span>
                  ))}
                  {item.features && item.features.length > 3 && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-600 text-gray-400">
                      +{item.features.length - 3}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          );
        case 'airdrop':
          return (
            <tr key={item.id} className="hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={item.logo || '/images/exchanges/default-exchange.svg'} 
                      alt={item.project}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-bold text-white">{item.project}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.token}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.network}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Completed' ? 'bg-green-900 text-green-200' : 
                  item.status === 'Ongoing' ? 'bg-blue-900 text-blue-200' : 'bg-yellow-900 text-yellow-200'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.totalReward}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.participants}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.estimatedValue}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a 
                  href={item.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline"
                >
                  Visit Website
                </a>
              </td>
            </tr>
          );
        case 'ico-ido':
          return (
            <tr key={item.id} className="hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={item.logo || '/images/exchanges/default-exchange.svg'} 
                      alt={item.project}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-bold text-white">{item.project}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.token}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.network}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Completed' ? 'bg-green-900 text-green-200' : 
                  item.status === 'Ongoing' ? 'bg-blue-900 text-blue-200' : 'bg-yellow-900 text-yellow-200'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.price}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.raised}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <span className={`font-semibold ${item.roi?.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {item.roi}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a 
                  href={item.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline"
                >
                  Visit Website
                </a>
              </td>
            </tr>
          );
        case 'fundraising':
          return (
            <tr key={item.id} className="hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={item.logo || '/images/exchanges/default-exchange.svg'} 
                      alt={item.project}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-bold text-white">{item.project}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Completed' ? 'bg-green-900 text-green-200' : 
                  item.status === 'Ongoing' ? 'bg-blue-900 text-blue-200' : 'bg-yellow-900 text-yellow-200'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.raised}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.valuation}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.round}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="max-w-xs truncate">{item.investors.join(', ')}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a 
                  href={item.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline"
                >
                  Visit Website
                </a>
              </td>
            </tr>
          );
        case 'glossary':
          return (
            <tr key={item.id} className="hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={item.logo || '/images/exchanges/default-exchange.svg'} 
                      alt={item.term}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-bold text-white">{item.term}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.category}</td>
              <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">{item.definition}</td>
              <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">{item.example}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {item.relatedTerms && item.relatedTerms.slice(0, 2).map((term, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-700 text-gray-300">
                      {term}
                    </span>
                  ))}
                  {item.relatedTerms && item.relatedTerms.length > 2 && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-600 text-gray-400">
                      +{item.relatedTerms.length - 2}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

  // Get statistics for current tab
  const getStatistics = () => {
    const data = currentData;
    switch (activeTab) {
      case 'exchanges':
        return [
          { label: 'Total Exchanges', value: data.length, color: 'text-blue-400' },
          { label: 'Centralized', value: data.filter(e => e.type === 'Centralized').length, color: 'text-green-400' },
          { label: 'Decentralized', value: data.filter(e => e.type === 'Decentralized').length, color: 'text-purple-400' },
          { label: 'Regions', value: new Set(data.map(e => e.region)).size, color: 'text-indigo-400' }
        ];
      case 'airdrop':
        return [
          { label: 'Total Airdrops', value: data.length, color: 'text-blue-400' },
          { label: 'Completed', value: data.filter(a => a.status === 'Completed').length, color: 'text-green-400' },
          { label: 'Ongoing', value: data.filter(a => a.status === 'Ongoing').length, color: 'text-yellow-400' },
          { label: 'Upcoming', value: data.filter(a => a.status === 'Upcoming').length, color: 'text-purple-400' }
        ];
      case 'ico-ido':
        return [
          { label: 'Total ICO/IDO', value: data.length, color: 'text-blue-400' },
          { label: 'Completed', value: data.filter(i => i.status === 'Completed').length, color: 'text-green-400' },
          { label: 'Ongoing', value: data.filter(i => i.status === 'Ongoing').length, color: 'text-yellow-400' },
          { label: 'Upcoming', value: data.filter(i => i.status === 'Upcoming').length, color: 'text-purple-400' }
        ];
      case 'fundraising':
        return [
          { label: 'Total Fundraising', value: data.length, color: 'text-blue-400' },
          { label: 'Completed', value: data.filter(f => f.status === 'Completed').length, color: 'text-green-400' },
          { label: 'Ongoing', value: data.filter(f => f.status === 'Ongoing').length, color: 'text-yellow-400' },
          { label: 'Upcoming', value: data.filter(f => f.status === 'Upcoming').length, color: 'text-purple-400' }
        ];
      case 'glossary':
        return [
          { label: 'Total Terms', value: data.length, color: 'text-blue-400' },
          { label: 'Protocols', value: data.filter(t => t.category === 'Protocol').length, color: 'text-green-400' },
          { label: 'Tokens', value: data.filter(t => t.category === 'Token').length, color: 'text-purple-400' },
          { label: 'Technologies', value: data.filter(t => t.category === 'Technology').length, color: 'text-indigo-400' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-duniacrypto-panel text-white">
      {/* Header */}
      <div className="bg-duniacrypto-panel py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4 text-white">
            Crypto Ecosystem Hub
          </h1>
          <p className="text-xl text-center text-gray-300">
            Explore exchanges, airdrops, ICOs, fundraising, and Web3 glossary
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 py-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200"
          >
            <FiFilter />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
              <FiGlobe />
              Filter Options
            </h3>
            <div className="flex flex-wrap gap-2">
              {getFilterOptions().map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedFilter(option)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedFilter === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {getStatistics().map((stat, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} {activeTab}
          </p>
        </div>

        {/* Data Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  {renderTableHeaders()}
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {renderTableRows()}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results Message */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No {activeTab} found</div>
            <div className="text-gray-500">Try adjusting your search or filters</div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-300">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
