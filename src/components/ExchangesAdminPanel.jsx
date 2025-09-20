'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiSearch, FiFilter } from 'react-icons/fi';
import { exchangesData, addExchange, updateExchange, deleteExchange } from '@/data/exchangesData';

export default function ExchangesAdminPanel() {
  const [exchanges, setExchanges] = useState(exchangesData);
  const [editingExchange, setEditingExchange] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Form state untuk exchange baru/edit
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    region: '',
    founded: '',
    website: '',
    type: 'Centralized',
    status: 'Active',
    description: '',
    logo: '',
    tradingVolume: '',
    pairs: '',
    features: []
  });

  // Filter exchanges
  const filteredExchanges = exchanges.filter(exchange => {
    const matchesSearch = exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exchange.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || exchange.type === filterType;
    return matchesSearch && matchesType;
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      region: '',
      founded: '',
      website: '',
      type: 'Centralized',
      status: 'Active',
      description: '',
      logo: '',
      tradingVolume: '',
      pairs: '',
      features: []
    });
    setEditingExchange(null);
    setIsAddingNew(false);
  };

  // Helper function untuk generate exchange logo
  const generateExchangeLogo = (name) => {
    if (!name) return '/images/exchanges/default-exchange.svg';
    const firstLetter = name.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=F7931A&color=fff&size=64&font-size=0.4`;
  };

  // Handle add new exchange
  const handleAddNew = () => {
    resetForm();
    setIsAddingNew(true);
  };

  // Handle edit exchange
  const handleEdit = (exchange) => {
    setFormData({
      name: exchange.name,
      country: exchange.country,
      region: exchange.region,
      founded: exchange.founded,
      website: exchange.website,
      type: exchange.type,
      status: exchange.status,
      description: exchange.description || '',
      logo: exchange.logo || '',
      tradingVolume: exchange.tradingVolume || '',
      pairs: exchange.pairs || '',
      features: exchange.features || []
    });
    setEditingExchange(exchange);
    setIsAddingNew(false);
  };

  // Handle save exchange
  const handleSave = () => {
    if (isAddingNew) {
      const newExchange = addExchange(formData);
      setExchanges([...exchanges, newExchange]);
    } else if (editingExchange) {
      const updatedExchange = updateExchange(editingExchange.id, formData);
      setExchanges(exchanges.map(e => e.id === editingExchange.id ? updatedExchange : e));
    }
    resetForm();
  };

  // Handle delete exchange
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this exchange?')) {
      deleteExchange(id);
      setExchanges(exchanges.filter(e => e.id !== id));
    }
  };

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle features change
  const handleFeaturesChange = (value) => {
    const features = value.split(',').map(f => f.trim()).filter(f => f);
    setFormData(prev => ({
      ...prev,
      features
    }));
  };

  return (
    <div className="min-h-screen bg-duniacrypto-panel text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Exchanges Admin Panel</h1>
          <p className="text-gray-300">Manage cryptocurrency exchanges data</p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search exchanges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600"
            >
              <FiFilter />
              Filter
            </button>

            {/* Add New */}
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiPlus />
              Add Exchange
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex gap-2">
              {['All', 'Centralized', 'Decentralized'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filterType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Modal */}
        {(isAddingNew || editingExchange) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isAddingNew ? 'Add New Exchange' : 'Edit Exchange'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Country *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Region *</label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Region</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Africa">Africa</option>
                    <option value="Oceania">Oceania</option>
                    <option value="Caribbean">Caribbean</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Founded Date *</label>
                  <input
                    type="date"
                    value={formData.founded}
                    onChange={(e) => handleInputChange('founded', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Website *</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Centralized">Centralized</option>
                    <option value="Decentralized">Decentralized</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Logo URL</label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Trading Volume</label>
                  <input
                    type="text"
                    value={formData.tradingVolume}
                    onChange={(e) => handleInputChange('tradingVolume', e.target.value)}
                    placeholder="e.g., $1.5B"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Trading Pairs</label>
                  <input
                    type="text"
                    value={formData.pairs}
                    onChange={(e) => handleInputChange('pairs', e.target.value)}
                    placeholder="e.g., 200+"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Features (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.features.join(', ')}
                    onChange={(e) => handleFeaturesChange(e.target.value)}
                    placeholder="e.g., Spot Trading, Futures, Staking"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FiSave />
                  Save
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exchanges Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Exchange</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Country</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredExchanges.map((exchange) => (
                  <tr key={exchange.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          className="h-8 w-8 rounded-full mr-3" 
                          src={exchange.logo || exchange.logo_url || generateExchangeLogo(exchange.name)} 
                          alt={exchange.name}
                          onError={(e) => {
                            e.target.src = generateExchangeLogo(exchange.name);
                          }}
                        />
                        <div>
                          <div className="font-medium text-white">{exchange.name}</div>
                          {exchange.tradingVolume && (
                            <div className="text-sm text-gray-400">{exchange.tradingVolume}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{exchange.country}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        exchange.type === 'Centralized'
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-green-900 text-green-200'
                      }`}>
                        {exchange.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        exchange.status === 'Active'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-red-900 text-red-200'
                      }`}>
                        {exchange.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(exchange)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(exchange.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{exchanges.length}</div>
            <div className="text-sm text-gray-300">Total Exchanges</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {exchanges.filter(e => e.type === 'Centralized').length}
            </div>
            <div className="text-sm text-gray-300">Centralized</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {exchanges.filter(e => e.type === 'Decentralized').length}
            </div>
            <div className="text-sm text-gray-300">Decentralized</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-400">
              {new Set(exchanges.map(e => e.region)).size}
            </div>
            <div className="text-sm text-gray-300">Regions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
