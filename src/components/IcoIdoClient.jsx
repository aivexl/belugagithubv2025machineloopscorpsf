'use client';

import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiRefreshCw, FiFilter, FiGlobe, FiExternalLink, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { icoIdoAPI } from '@/utils/apiClient';

export default function IcoIdoClient() {
  const [apiIcoIdos, setApiIcoIdos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [selectedNetwork, setSelectedNetwork] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Get persistent data only on client side
  const persistentIcoIdos = isClient ? getPersistentData('ico-ido') : [];

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Combine API data and persistent data
  const allIcoIdos = useMemo(() => {
    if (!isClient) return apiIcoIdos;
    
    // Combine API data with persistent data
    const combined = [...apiIcoIdos];
    
    // Add persistent ico/ido that are not already in API data
    persistentIcoIdos.forEach(persistentIcoIdo => {
      const exists = combined.some(apiIcoIdo => 
        apiIcoIdo.project === persistentIcoIdo.project && 
        apiIcoIdo.token === persistentIcoIdo.token
      );
      
      if (!exists) {
        // Add a flag to identify admin-added ico/ido
        combined.push({
          ...persistentIcoIdo,
          source: 'admin',
          isAdminAdded: true
        });
      }
    });
    
    return combined;
  }, [apiIcoIdos, persistentIcoIdos, isClient]);

  // Networks and types for filtering
  const networks = ['All', ...new Set(allIcoIdos.map(ico => ico.network))];
  const types = ['All', ...new Set(allIcoIdos.map(ico => ico.type))];

  useEffect(() => {
    fetchIcoIdos();
  }, []);

  const fetchIcoIdos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dummy-data?type=ico');
      const data = await response.json();
      
      if (data.success) {
        setApiIcoIdos(data.data);
      } else {
        console.error('Failed to fetch ICO/IDO data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching ICO/IDO data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter ICO/IDOs based on search and filters
  const filteredIcoIdos = allIcoIdos.filter((ico) => {
    const matchesSearch = 
      ico.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ico.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ico.network.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ico.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeStatus === 'All' || ico.status === activeStatus;
    const matchesNetwork = selectedNetwork === 'All' || ico.network === selectedNetwork;
    const matchesType = selectedType === 'All' || ico.type === selectedType;

    return matchesSearch && matchesStatus && matchesNetwork && matchesType;
  });

  const handleLogoError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  if (loading && allIcoIdos.length === 0) {
    return (
      <div className="min-h-screen bg-duniacrypto-panel text-white">
        {/* Header */}
        <div className="bg-duniacrypto-panel py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center mb-4 text-white">
              ICO/IDO Projects
            </h1>
            <p className="text-xl text-center text-gray-300">
              Discover the latest Initial Coin Offerings and Initial DEX Offerings
            </p>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-400">Loading ICO/IDO projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-duniacrypto-panel text-white">
      {/* Submenu - Status Filter */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 py-4">
            {['All', 'Active', 'Upcoming', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeStatus === status
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
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
              placeholder="Search ICO/IDO by project, token, network, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchIcoIdos}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 border border-blue-500 rounded-lg text-white hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200"
          >
            <FiFilter />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
              <FiGlobe />
              Advanced Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Network Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Network</label>
                <div className="flex flex-wrap gap-2">
                  {networks.map((network) => (
                    <button
                      key={network}
                      onClick={() => setSelectedNetwork(network)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedNetwork === network
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}
                    >
                      {network}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredIcoIdos.length} of {allIcoIdos.length} ICO/IDO projects
          </p>
        </div>

        {/* ICO/IDO Grid */}
        {filteredIcoIdos.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-xl mb-4">No ICO/IDO projects found</div>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredIcoIdos.map((ico, index) => (
              <div
                key={`${ico.id}-${ico.source || 'api'}-${index}`}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col h-full"
              >
                {/* Header with Logo and Project Info */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {ico.logo ? (
                        <>
                          <img
                            src={ico.logo}
                            alt={`${ico.project} logo`}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={handleLogoError}
                          />
                          <span className="absolute inset-0 items-center justify-center text-lg font-bold text-white bg-gray-700 rounded-lg hidden">
                            {ico.token ? ico.token.charAt(0) : ico.project.charAt(0)}
                          </span>
                        </>
                      ) : (
                        <span className="w-16 h-16 flex items-center justify-center text-lg font-bold text-white bg-gray-700 rounded-lg">
                          {ico.token ? ico.token.charAt(0) : ico.project.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">{ico.project}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ico.status === 'Active' ? 'bg-green-600 text-white' :
                          ico.status === 'Upcoming' ? 'bg-yellow-600 text-white' :
                          ico.status === 'Completed' ? 'bg-gray-600 text-white' :
                          'bg-blue-600 text-white'
                        }`}>
                          {ico.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">{ico.token}</div>
                      <div className="text-xs text-gray-400">{ico.category || ico.type} • {ico.network}</div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <p className="text-gray-300 text-sm" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{ico.description}</p>
                  
                  {/* Key Metrics - 5 consistent metrics */}
                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-xs text-gray-400">Token Price</span>
                      <span className="text-sm font-medium text-white">{ico.price || ico.currentPrice || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-xs text-gray-400">Amount Raised</span>
                      <span className="text-sm font-medium text-white">{ico.raised || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-xs text-gray-400">Participants</span>
                      <span className="text-sm font-medium text-white">{ico.participants || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-xs text-gray-400">ROI</span>
                      <span className="text-sm font-medium text-white">{ico.roi || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-gray-400">Vesting</span>
                      <span className="text-sm font-medium text-white">{ico.vesting || 'TBD'}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <a
                    href={ico.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 mt-auto"
                  >
                    <FiExternalLink />
                    Visit Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
