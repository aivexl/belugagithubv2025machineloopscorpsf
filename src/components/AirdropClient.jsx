'use client';

import { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiFilter, FiGlobe, FiCalendar, FiMapPin, FiGift, FiDollarSign, FiUsers, FiClock, FiRefreshCw } from 'react-icons/fi';

export default function AirdropClient() {
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [airdrops, setAirdrops] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const itemsPerPage = 10;

  // Fetch airdrop data from API
  const fetchAirdrops = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/airdrops');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setAirdrops(data.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.error || 'Failed to fetch airdrops');
      }
    } catch (err) {
      console.error('Error fetching airdrops:', err);
      setError(err.message);
      // Fallback to sample data if API fails
      setAirdrops(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  // Sample data as fallback
  const getSampleData = () => [
    {
      id: 1,
      project: 'Jupiter',
      token: 'JUP',
      network: 'Solana',
      status: 'Active',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      totalAllocation: '100,000,000',
      minAllocation: '100',
      maxAllocation: '10,000',
      requirements: 'Hold SOL, Use Jupiter DEX',
      estimatedValue: '$50 - $500',
      participants: '50,000+',
      website: 'https://jup.ag',
      type: 'DeFi',
      category: 'DEX',
      logo: 'https://assets.coingecko.com/coins/images/34184/large/jupiter.png'
    },
    {
      id: 2,
      project: 'Pyth Network',
      token: 'PYTH',
      network: 'Multi-chain',
      status: 'Completed',
      startDate: '2023-11-20',
      endDate: '2023-12-20',
      totalAllocation: '50,000,000',
      minAllocation: '50',
      maxAllocation: '5,000',
      requirements: 'Use Pyth Oracle, Deploy contracts',
      estimatedValue: '$25 - $250',
      participants: '30,000+',
      website: 'https://pyth.network',
      type: 'Infrastructure',
      category: 'Oracle',
      logo: 'https://assets.coingecko.com/coins/images/31924/large/pyth.png'
    }
  ];

  // Initial fetch
  useEffect(() => {
    fetchAirdrops();
  }, []);

  // Filter dan sort airdrops
  const filteredAndSortedAirdrops = useMemo(() => {
    let filtered = airdrops.filter(airdrop => {
      const matchesStatus = activeStatus === 'All' || airdrop.status === activeStatus;
      const matchesSearch = airdrop.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           airdrop.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           airdrop.network.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           airdrop.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNetwork = selectedNetwork === 'All' || airdrop.network === selectedNetwork;
      const matchesType = selectedType === 'All' || airdrop.type === selectedType;
      
      return matchesStatus && matchesSearch && matchesNetwork && matchesType;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'startDate' || sortBy === 'endDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [airdrops, activeStatus, searchQuery, selectedNetwork, selectedType, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedAirdrops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAirdrops = filteredAndSortedAirdrops.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus, searchQuery, selectedNetwork, selectedType]);

  // Get unique networks and types
  const networks = ['All', ...new Set(airdrops.map(airdrop => airdrop.network))];
  const types = ['All', ...new Set(airdrops.map(airdrop => airdrop.type))];

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-900 text-green-200';
      case 'Upcoming':
        return 'bg-blue-900 text-blue-200';
      case 'Completed':
        return 'bg-gray-900 text-gray-200';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  // Handle logo error
  const handleLogoError = (e, projectName) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  if (loading && airdrops.length === 0) {
    return (
      <div className="min-h-screen bg-duniacrypto-panel text-white">

        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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
              placeholder="Search airdrops by project, token, network, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchAirdrops}
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200">Error: {error}</p>
            <p className="text-red-300 text-sm mt-1">Using fallback data. Please try refreshing.</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm">
            <div className="text-2xl font-bold text-blue-400">{airdrops.length}</div>
            <div className="text-sm text-gray-300">Total Airdrops</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm">
            <div className="text-2xl font-bold text-green-400">
              {airdrops.filter(a => a.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-300">Active</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm">
            <div className="text-2xl font-bold text-blue-400">
              {airdrops.filter(a => a.status === 'Upcoming').length}
            </div>
            <div className="text-sm text-gray-300">Upcoming</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm">
            <div className="text-2xl font-bold text-indigo-400">
              {new Set(airdrops.map(a => a.network)).size}
            </div>
            <div className="text-sm text-gray-300">Networks</div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedAirdrops.length)} of {filteredAndSortedAirdrops.length} airdrops
          </p>
        </div>

        {/* Airdrops Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiGift />
                      Project
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Network
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiCalendar />
                      Timeline
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiDollarSign />
                      Allocation
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiUsers />
                      Requirements
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiClock />
                      Estimated Value
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Website
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {paginatedAirdrops.map((airdrop) => (
                  <tr key={airdrop.id} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gray-600 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                          {airdrop.logo ? (
                            <>
                              <img 
                                src={airdrop.logo} 
                                alt={`${airdrop.project} logo`}
                                className="h-10 w-10 rounded object-contain"
                                loading="lazy"
                                onError={(e) => handleLogoError(e, airdrop.project)}
                              />
                              <span className="text-lg font-bold text-white hidden">
                                {airdrop.token ? airdrop.token.charAt(0) : airdrop.project.charAt(0)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-white">
                              {airdrop.token ? airdrop.token.charAt(0) : airdrop.project.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{airdrop.project}</div>
                          <div className="text-sm text-gray-300">{airdrop.token || 'N/A'}</div>
                          <div className="text-xs text-gray-400">
                            {airdrop.type || 'DeFi'} • {airdrop.category || 'Airdrop'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {airdrop.network || 'Multi-chain'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(airdrop.status)}`}>
                        {airdrop.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div className="text-xs text-gray-400">Start: {airdrop.startDate ? formatDate(airdrop.startDate) : 'TBD'}</div>
                        <div className="text-xs text-gray-400">End: {airdrop.endDate ? formatDate(airdrop.endDate) : 'TBD'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div className="text-xs text-gray-400">Total: {airdrop.totalAllocation || 'TBD'}</div>
                        <div className="text-xs text-gray-400">Min: {airdrop.minAllocation || 'N/A'}</div>
                        <div className="text-xs text-gray-400">Max: {airdrop.maxAllocation || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300 max-w-xs">
                      <div className="text-xs">{airdrop.requirements || 'Complete required tasks'}</div>
                      <div className="text-xs text-gray-400 mt-1">Participants: {airdrop.participants || 'TBD'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className="text-green-400 font-medium">{airdrop.estimatedValue}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <a 
                        href={airdrop.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline"
                      >
                        Visit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results Message */}
        {filteredAndSortedAirdrops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No airdrops found</div>
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
