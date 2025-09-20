'use client';

import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiRefreshCw, FiFilter, FiBook, FiExternalLink, FiTag } from 'react-icons/fi';
import { getPersistentData } from '@/utils/persistentData';
import { getDatabaseData } from '@/utils/databaseServiceAPI';

export default function GlossaryClient() {
  const [adminGlossary, setAdminGlossary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Get persistent data only on client side
  const persistentGlossary = isClient ? getPersistentData('glossary') : [];

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
    fetchAdminGlossary();
  }, []);

  // Fetch glossary data from admin panel database
  const fetchAdminGlossary = async () => {
    try {
      const data = await getDatabaseData('glossary');
      setAdminGlossary(data || []);
    } catch (error) {
      console.error('Error loading admin glossary:', error);
      setAdminGlossary([]);
    } finally {
      setLoading(false);
    }
  };

  // Combine admin data and persistent data
  const allGlossary = useMemo(() => {
    if (!isClient) return adminGlossary;
    
    // Start with admin data
    const combined = [...adminGlossary];
    
    // Add persistent glossary that are not already in admin data
    persistentGlossary.forEach(persistentTerm => {
      const exists = combined.some(adminTerm => 
        adminTerm.term === persistentTerm.term
      );
      
      if (!exists) {
        combined.push(persistentTerm);
      }
    });
    
    return combined;
  }, [adminGlossary, persistentGlossary, isClient]);

  // Categories for filtering
  const categories = ['All', ...new Set(allGlossary.map(term => term.category))];

  // Filter glossary based on search and filters
  const filteredGlossary = allGlossary.filter((term) => {
    const matchesSearch = 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.example.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.relatedTerms.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleLogoError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  if (loading && allGlossary.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Kamus WEB3</h1>
          <p className="text-gray-400 text-lg">
            Pelajari istilah-istilah penting dalam dunia cryptocurrency dan blockchain
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari istilah, definisi, atau contoh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchAdminGlossary}
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
            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Menampilkan {filteredGlossary.length} dari {allGlossary.length} istilah
          </p>
        </div>

        {/* Glossary Grid */}
        {filteredGlossary.length === 0 ? (
          <div className="text-center py-12">
            <FiBook className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Tidak ada istilah ditemukan</h3>
            <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGlossary.map((term) => (
              <div key={term.id || term.term} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={term.logo || `https://ui-avatars.com/api/?name=${term.term?.charAt(0)}&background=10B981&color=fff&size=48&font-size=0.4`}
                        alt={term.term}
                        className="w-12 h-12 rounded-lg"
                        onError={handleLogoError}
                      />
                      <div className="absolute inset-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ display: 'none' }}>
                        {term.term?.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{term.term}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <FiTag className="text-gray-400 text-sm" />
                        <span className="text-sm text-gray-400">{term.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Definition */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Definisi</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{term.definition}</p>
                </div>

                {/* Example */}
                {term.example && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Contoh</h4>
                    <p className="text-gray-400 text-sm leading-relaxed italic">"{term.example}"</p>
                  </div>
                )}

                {/* Related Terms */}
                {term.relatedTerms && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Istilah Terkait</h4>
                    <div className="flex flex-wrap gap-2">
                      {term.relatedTerms.split(',').map((relatedTerm, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                        >
                          {relatedTerm.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Difficulty Level */}
                {term.difficulty_level && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Tingkat:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      term.difficulty_level === 'Beginner' ? 'bg-green-900 text-green-300' :
                      term.difficulty_level === 'Intermediate' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {term.difficulty_level}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
