'use client';

import { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiFilter, FiGlobe, FiCalendar, FiMapPin } from 'react-icons/fi';

// Data exchanges tanpa logo, hanya text
const exchangesData = [
  {
    id: 1,
    name: 'Binance',
    country: 'Malta',
    region: 'Europe',
    founded: '2017-07-14',
    website: 'https://www.binance.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Coinbase',
    country: 'United States',
    region: 'North America',
    founded: '2012-06-20',
    website: 'https://www.coinbase.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Kraken',
    country: 'United States',
    region: 'North America',
    founded: '2011-07-28',
    website: 'https://www.kraken.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 4,
    name: 'KuCoin',
    country: 'Seychelles',
    region: 'Africa',
    founded: '2017-09-15',
    website: 'https://www.kucoin.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Bybit',
    country: 'Singapore',
    region: 'Asia',
    founded: '2018-03-26',
    website: 'https://www.bybit.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 6,
    name: 'OKX',
    country: 'Malta',
    region: 'Europe',
    founded: '2017-10-31',
    website: 'https://www.okx.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 7,
    name: 'Uniswap',
    country: 'United States',
    region: 'North America',
    founded: '2018-11-02',
    website: 'https://app.uniswap.org',
    type: 'Decentralized',
    status: 'Active'
  },
  {
    id: 8,
    name: 'PancakeSwap',
    country: 'Cayman Islands',
    region: 'Caribbean',
    founded: '2020-09-20',
    website: 'https://pancakeswap.finance',
    type: 'Decentralized',
    status: 'Active'
  },
  {
    id: 9,
    name: 'dYdX',
    country: 'Switzerland',
    region: 'Europe',
    founded: '2017-08-15',
    website: 'https://dydx.exchange',
    type: 'Decentralized',
    status: 'Active'
  },
  {
    id: 10,
    name: 'SushiSwap',
    country: 'United States',
    region: 'North America',
    founded: '2020-08-28',
    website: 'https://www.sushi.com',
    type: 'Decentralized',
    status: 'Active'
  },
  {
    id: 11,
    name: 'Bitfinex',
    country: 'British Virgin Islands',
    region: 'Caribbean',
    founded: '2012-12-07',
    website: 'https://www.bitfinex.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 12,
    name: 'Bitstamp',
    country: 'Luxembourg',
    region: 'Europe',
    founded: '2011-08-18',
    website: 'https://www.bitstamp.net',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 13,
    name: 'Gemini',
    country: 'United States',
    region: 'North America',
    founded: '2014-10-29',
    website: 'https://www.gemini.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 14,
    name: 'Huobi',
    country: 'Singapore',
    region: 'Asia',
    founded: '2013-09-01',
    website: 'https://www.huobi.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 15,
    name: 'Gate.io',
    country: 'Cayman Islands',
    region: 'Caribbean',
    founded: '2013-04-01',
    website: 'https://gate.io',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 16,
    name: 'MEXC Global',
    country: 'Seychelles',
    region: 'Africa',
    founded: '2018-04-01',
    website: 'https://www.mexc.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 17,
    name: 'LBank',
    country: 'Hong Kong',
    region: 'Asia',
    founded: '2016-10-01',
    website: 'https://www.lbank.info',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 18,
    name: 'DigiFinex',
    country: 'Hong Kong',
    region: 'Asia',
    founded: '2018-01-01',
    website: 'https://www.digifinex.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 19,
    name: 'Upbit',
    country: 'South Korea',
    region: 'Asia',
    founded: '2017-10-01',
    website: 'https://upbit.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 20,
    name: 'Bithumb',
    country: 'South Korea',
    region: 'Asia',
    founded: '2014-01-01',
    website: 'https://www.bithumb.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 21,
    name: 'Korbit',
    country: 'South Korea',
    region: 'Asia',
    founded: '2013-07-01',
    website: 'https://www.korbit.co.kr',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 22,
    name: 'Coinone',
    country: 'South Korea',
    region: 'Asia',
    founded: '2014-07-01',
    website: 'https://coinone.co.kr',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 23,
    name: 'BitFlyer',
    country: 'Japan',
    region: 'Asia',
    founded: '2014-01-01',
    website: 'https://bitflyer.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 24,
    name: 'Liquid',
    country: 'Japan',
    region: 'Asia',
    founded: '2014-08-01',
    website: 'https://liquid.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 25,
    name: 'Zaif',
    country: 'Japan',
    region: 'Asia',
    founded: '2014-05-01',
    website: 'https://zaif.jp',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 26,
    name: 'Coincheck',
    country: 'Japan',
    region: 'Asia',
    founded: '2012-08-01',
    website: 'https://coincheck.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 27,
    name: 'GMO Coin',
    country: 'Japan',
    region: 'Asia',
    founded: '2016-05-01',
    website: 'https://coin.z.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 28,
    name: 'SBI Virtual Currencies',
    country: 'Japan',
    region: 'Asia',
    founded: '2017-06-01',
    website: 'https://www.sbivc.co.jp',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 29,
    name: 'DMM Bitcoin',
    country: 'Japan',
    region: 'Asia',
    founded: '2018-01-01',
    website: 'https://bitcoin.dmm.com',
    type: 'Centralized',
    status: 'Active'
  },
  {
    id: 30,
    name: 'Fisco',
    country: 'Japan',
    region: 'Asia',
    founded: '2018-03-01',
    website: 'https://fc2.jp',
    type: 'Centralized',
    status: 'Active'
  }
];

export default function ExchangesClient() {
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
  }, [activeType, searchQuery, selectedRegion, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedExchanges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExchanges = filteredAndSortedExchanges.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeType, searchQuery, selectedRegion]);

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

  return (
    <div className="min-h-screen bg-duniacrypto-panel text-white">
      {/* Header */}
      <div className="bg-duniacrypto-panel py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4 text-white">
            Cryptocurrency Exchanges
          </h1>
          <p className="text-xl text-center text-gray-300">
            Discover and explore exchanges from around the world
          </p>
        </div>
      </div>

      {/* Submenu - seperti di Academy */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 py-4">
            {['All', 'Centralized', 'Decentralized'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeType === type
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {type}
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
                placeholder="Search exchanges by name, country, or website..."
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

          {/* Region Filter */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                <FiGlobe />
                Filter by Region
              </h3>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedRegion === region
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm">
            <div className="text-2xl font-bold text-blue-400">{exchangesData.length}</div>
            <div className="text-sm text-gray-300">Total Exchanges</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm">
            <div className="text-2xl font-bold text-green-400">
              {exchangesData.filter(e => e.type === 'Centralized').length}
            </div>
            <div className="text-sm text-gray-300">Centralized</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm">
            <div className="text-2xl font-bold text-purple-400">
              {exchangesData.filter(e => e.type === 'Decentralized').length}
            </div>
            <div className="text-sm text-gray-300">Decentralized</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm">
            <div className="text-2xl font-bold text-indigo-400">
              {new Set(exchangesData.map(e => e.region)).size}
            </div>
            <div className="text-sm text-gray-300">Regions</div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedExchanges.length)} of {filteredAndSortedExchanges.length} exchanges
          </p>
        </div>

        {/* Exchanges Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Exchange
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiMapPin />
                      Country
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiGlobe />
                      Region
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiCalendar />
                      Founded
                    </div>
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
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                {paginatedExchanges.map((exchange) => (
                  <tr key={exchange.id} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-lg font-bold text-white">
                          {exchange.name}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results Message */}
        {filteredAndSortedExchanges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No exchanges found</div>
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
