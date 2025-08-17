'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiRefreshCw, FiFilter, FiGlobe, FiExternalLink, FiCalendar, FiDollarSign, FiUsers, FiTrendingUp } from 'react-icons/fi';

export default function FundraisingClient() {
  const [fundraising, setFundraising] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Funding types for filtering
  const types = ['All', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'Pre-IPO', 'Private Sale'];

  useEffect(() => {
    fetchFundraising();
  }, []);

  const fetchFundraising = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dummy-data?type=fundraising');
      const data = await response.json();
      
      if (data.success) {
        setFundraising(data.data);
      } else {
        console.error('Failed to fetch fundraising data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching fundraising data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter fundraising based on search and filters
  const filteredFundraising = fundraising.filter((fund) => {
    const matchesSearch = 
      fund.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.investors.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeStatus === 'All' || fund.status === activeStatus;
    const matchesType = selectedType === 'All' || fund.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleLogoError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  if (loading && fundraising.length === 0) {
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
            {['All', 'Active', 'Completed', 'Upcoming'].map((status) => (
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
              placeholder="Search fundraising by project, description, or investors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchFundraising}
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
              {/* Funding Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Funding Type</label>
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
            Showing {filteredFundraising.length} of {fundraising.length} fundraising projects
          </p>
        </div>

        {/* Fundraising Grid */}
        {filteredFundraising.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-xl mb-4">No fundraising projects found</div>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFundraising.map((fund) => (
              <div
                key={fund.id}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
              >
                {/* Header with Logo and Project Info */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={fund.logo}
                        alt={`${fund.project} logo`}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={handleLogoError}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white bg-gray-700 rounded-lg">
                        {fund.project.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">{fund.project}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          fund.status === 'Active' ? 'bg-green-600 text-white' :
                          fund.status === 'Upcoming' ? 'bg-yellow-600 text-white' :
                          fund.status === 'Completed' ? 'bg-gray-600 text-white' :
                          'bg-blue-600 text-white'
                        }`}>
                          {fund.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">{fund.type}</div>
                      <div className="text-xs text-gray-400">Funding Round</div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 space-y-4">
                  <p className="text-gray-300 text-sm">{fund.description}</p>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Amount Raised</div>
                      <div className="text-lg font-bold text-white">{fund.amount}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Date</div>
                      <div className="text-lg font-bold text-white">{fund.date}</div>
                    </div>
                  </div>

                  {/* Investors */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FiUsers className="text-gray-400" />
                      <span className="text-gray-300 font-medium">Investors:</span>
                    </div>
                    <div className="text-xs text-gray-400 leading-relaxed">
                      {fund.investors}
                    </div>
                  </div>

                  {/* Action Button */}
                  <a
                    href={fund.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
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
