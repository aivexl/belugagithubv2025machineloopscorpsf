'use client';

import { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiFilter, FiGlobe, FiCalendar, FiMapPin, FiExternalLink, FiStar } from 'react-icons/fi';
import { getDatabaseData } from '@/utils/databaseServiceAPI';

export default function ExchangesClient() {
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [exchangesData, setExchangesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10; // Number of exchanges per page

  // Load data from database
  useEffect(() => {
    const loadExchangesData = async () => {
      try {
        setLoading(true);
        const data = await getDatabaseData('exchanges');
        setExchangesData(data);
      } catch (error) {
        console.error('Error loading exchanges data:', error);
        setExchangesData([]);
      } finally {
        setLoading(false);
      }
    };

    loadExchangesData();
  }, []);

  // Filter dan sort exchanges
  const filteredAndSortedExchanges = useMemo(() => {
    let filtered = exchangesData.filter(exchange => {
      const matchesType = activeType === 'All' || exchange.type === activeType;
      const matchesSearch = exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           exchange.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           exchange.website.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || exchange.region === selectedRegion;
      
      return matchesType && matchesSearch && matchesRegion;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'founded') {
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
  }, [exchangesData, activeType, searchQuery, selectedRegion, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedExchanges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExchanges = filteredAndSortedExchanges.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'type') setActiveType(value);
    if (filterType === 'region') setSelectedRegion(value);
    setCurrentPage(1);
  };

  // Get unique regions
  const regions = ['All', ...new Set(exchangesData.map(exchange => exchange.region))];

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function untuk mendapatkan features sebagai array
  const getFeaturesArray = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === 'string') {
      // Split by comma and trim each feature
      return features.split(',').map(feature => feature.trim()).filter(feature => feature);
    }
    return [];
  };

  // Helper function untuk generate exchange logo
  const generateExchangeLogo = (name) => {
    if (!name) return '/images/exchanges/default-exchange.svg';
    const firstLetter = name.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=F7931A&color=fff&size=64&font-size=0.4`;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-duniacrypto-panel text-white">
        {/* Header */}
        <div className="bg-duniacrypto-panel py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center mb-4 text-white">
              Cryptocurrency Exchanges
            </h1>
            <p className="text-xl text-center text-gray-300">
              Discover and explore the world's leading cryptocurrency exchanges
            </p>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-400">Loading exchanges...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-duniacrypto-panel text-white">
      {/* Header */}
      <div className="bg-duniacrypto-panel py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4 text-white">
            Cryptocurrency Exchanges
          </h1>
          <p className="text-xl text-center text-gray-300">
            Discover and explore the world's leading cryptocurrency exchanges
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                  placeholder="Search exchanges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              <FiFilter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Exchange Type
                  </label>
                  <div className="flex space-x-2">
                    {['All', 'Centralized', 'Decentralized'].map((type) => (
                  <button
                        key={type}
                        onClick={() => handleFilterChange('type', type)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeType === type
                        ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {regions.map((region) => (
                      <option key={region} value={region}>
                    {region}
                      </option>
                ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-300">
            Showing {paginatedExchanges.length} of {filteredAndSortedExchanges.length} exchanges
          </p>
        </div>

        {/* Exchanges Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Exchange
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Country
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Region
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Founded
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                    </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Features
                  </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                {paginatedExchanges.map((exchange, index) => (
                  <tr key={`${exchange.id}-${exchange.source || 'api'}-${index}`} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={exchange.logo || exchange.logo_url || generateExchangeLogo(exchange.name)} 
                            alt={exchange.name}
                            onError={(e) => {
                              e.target.src = generateExchangeLogo(exchange.name);
                            }}
                          />
                        </div>
                        <div className="ml-4">
                        <div className="text-lg font-bold text-white">
                          {exchange.name}
                          </div>
                          {exchange.tradingVolume && (
                            <div className="text-sm text-gray-400">
                              Volume: {exchange.tradingVolume}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {exchange.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {exchange.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(exchange.founded)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={exchange.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline"
                      >
                        Visit Website
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        exchange.type === 'Centralized'
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-green-900 text-green-200'
                      }`}>
                        {exchange.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        exchange.status === 'Active'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-red-900 text-red-200'
                      }`}>
                        {exchange.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {getFeaturesArray(exchange.features).slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-700 text-gray-300"
                          >
                            {feature}
                          </span>
                        ))}
                        {getFeaturesArray(exchange.features).length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-600 text-gray-400">
                            +{getFeaturesArray(exchange.features).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}