'use client';

import { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSave, 
  FiX, 
  FiSearch, 
  FiFilter,
  FiRefreshCw,
  FiZap,
  FiGift,
  FiTrendingUp,
  FiDollarSign,
  FiBook
} from 'react-icons/fi';
import { getAPIForCategory } from '@/utils/apiClient';
import { getFormFields } from './FormFields';

const ADMIN_TABS = [
  { id: 'exchanges', label: 'Exchanges', icon: FiZap },
  { id: 'airdrop', label: 'Airdrop', icon: FiGift },
  { id: 'ico-ido', label: 'ICO/IDO', icon: FiTrendingUp },
  { id: 'fundraising', label: 'Fundraising', icon: FiDollarSign },
  { id: 'glossary', label: 'Kamus WEB3', icon: FiBook }
];

export default function CryptoAdminPanel() {
  const [activeTab, setActiveTab] = useState('exchanges');
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({});
  
  // Data state
  const [data, setData] = useState([]);

  // Get API functions for current category
  const api = getAPIForCategory(activeTab);

  // Load data when tab changes
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await api.getAll();
      setData(result || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  const filteredData = data.filter(item => {
    const matchesFilter = filterValue === 'All' || 
      (activeTab === 'exchanges' && item.type === filterValue) ||
      (activeTab === 'airdrop' && item.status === filterValue) ||
      (activeTab === 'ico-ido' && item.status === filterValue) ||
      (activeTab === 'fundraising' && item.status === filterValue) ||
      (activeTab === 'glossary' && item.category === filterValue);

    const matchesSearch = searchQuery === '' || 
      (activeTab === 'exchanges' && (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase())
      )) ||
      (activeTab === 'airdrop' && (
        item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.token.toLowerCase().includes(searchQuery.toLowerCase())
      )) ||
      (activeTab === 'ico-ido' && (
        item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.token.toLowerCase().includes(searchQuery.toLowerCase())
      )) ||
      (activeTab === 'fundraising' && (
        item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )) ||
      (activeTab === 'glossary' && (
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase())
      ));

    return matchesFilter && matchesSearch;
  });

  // Reset form
  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
    setIsAddingNew(false);
  };

  // Handle add new item
  const handleAddNew = () => {
    resetForm();
    setIsAddingNew(true);
  };

  // Handle edit item
  const handleEdit = (item) => {
    setFormData({ ...item });
    setEditingItem(item);
    setIsAddingNew(false);
  };

  // Handle save item
  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (isAddingNew) {
        await api.create(formData);
      } else if (editingItem) {
        await api.update({ ...formData, id: editingItem.id });
      }
      
      // Reload data after save
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete item
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        setLoading(true);
        await api.delete(id);
        await loadData(); // Reload data after delete
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Render form fields based on active tab
  const renderFormFields = () => {
    return getFormFields(activeTab, formData, handleInputChange);
  };

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

  // Render table headers based on active tab
  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'exchanges':
        return (
          <>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Country</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </>
        );
      case 'airdrop':
        return (
          <>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Project</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Token</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Network</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </>
        );
      case 'ico-ido':
        return (
          <>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Project</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Token</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Network</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </>
        );
      case 'fundraising':
        return (
          <>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Project</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Raised</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </>
        );
      case 'glossary':
        return (
          <>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Term</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Definition</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </>
        );
      default:
        return null;
    }
  };

  // Render table rows based on active tab
  const renderTableRows = () => {
    return filteredData.map((item) => {
      switch (activeTab) {
        case 'exchanges':
          return (
            <tr key={item.id} className="hover:bg-gray-700">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img 
                    className="h-8 w-8 rounded-full mr-3" 
                    src={item.logo || '/images/exchanges/default-exchange.svg'} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/images/exchanges/default-exchange.svg';
                    }}
                  />
                  <div>
                    <div className="font-medium text-white">{item.name}</div>
                    {item.tradingVolume && (
                      <div className="text-sm text-gray-400">{item.tradingVolume}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">{item.country}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.type === 'Centralized'
                    ? 'bg-blue-900 text-blue-200'
                    : 'bg-green-900 text-green-200'
                }`}>
                  {item.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Active'
                    ? 'bg-green-900 text-green-200'
                    : 'bg-red-900 text-red-200'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-400 hover:text-blue-300 mr-3"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          );
        case 'airdrop':
          return (
            <tr key={item.id} className="hover:bg-gray-700">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img 
                    className="h-8 w-8 rounded-full mr-3" 
                    src={item.logo || '/images/exchanges/default-exchange.svg'} 
                    alt={item.project}
                    onError={(e) => {
                      e.target.src = '/images/exchanges/default-exchange.svg';
                    }}
                  />
                  <div className="font-medium text-white">{item.project}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">{item.token}</td>
              <td className="px-6 py-4 text-sm text-gray-300">{item.network}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Completed'
                    ? 'bg-green-900 text-green-200'
                    : item.status === 'Ongoing'
                    ? 'bg-blue-900 text-blue-200'
                    : 'bg-yellow-900 text-yellow-200'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-400 hover:text-blue-300 mr-3"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          );
        case 'ico-ido':
          return (
            <tr key={item.id} className="hover:bg-gray-700">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img 
                    className="h-8 w-8 rounded-full mr-3" 
                    src={item.logo || '/images/exchanges/default-exchange.svg'} 
                    alt={item.project}
                    onError={(e) => {
                      e.target.src = '/images/exchanges/default-exchange.svg';
                    }}
                  />
                  <div className="font-medium text-white">{item.project}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">{item.token}</td>
              <td className="px-6 py-4 text-sm text-gray-300">{item.network}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Completed'
                    ? 'bg-green-900 text-green-200'
                    : item.status === 'Ongoing'
                    ? 'bg-blue-900 text-blue-200'
                    : 'bg-yellow-900 text-yellow-200'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-400 hover:text-blue-300 mr-3"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          );
        case 'fundraising':
          return (
            <tr key={item.id} className="hover:bg-gray-700">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img 
                    className="h-8 w-8 rounded-full mr-3" 
                    src={item.logo || '/images/exchanges/default-exchange.svg'} 
                    alt={item.project}
                    onError={(e) => {
                      e.target.src = '/images/exchanges/default-exchange.svg';
                    }}
                  />
                  <div className="font-medium text-white">{item.project}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">{item.category}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'Completed'
                    ? 'bg-green-900 text-green-200'
                    : item.status === 'Ongoing'
                    ? 'bg-blue-900 text-blue-200'
                    : 'bg-yellow-900 text-yellow-200'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">{item.raised}</td>
              <td className="px-6 py-4 text-sm font-medium">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-400 hover:text-blue-300 mr-3"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          );
        case 'glossary':
          return (
            <tr key={item.id} className="hover:bg-gray-700">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img 
                    className="h-8 w-8 rounded-full mr-3" 
                    src={item.logo || '/images/exchanges/default-exchange.svg'} 
                    alt={item.term}
                    onError={(e) => {
                      e.target.src = '/images/exchanges/default-exchange.svg';
                    }}
                  />
                  <div className="font-medium text-white">{item.term}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">{item.category}</td>
              <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{item.definition}</td>
              <td className="px-6 py-4 text-sm font-medium">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-400 hover:text-blue-300 mr-3"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="min-h-screen bg-duniacrypto-panel text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crypto Ecosystem Admin Panel</h1>
          <p className="text-gray-300">Manage all crypto ecosystem data</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button
              onClick={loadData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add {ADMIN_TABS.find(tab => tab.id === activeTab)?.label}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {getFilterOptions().map((option) => (
                <button
                  key={option}
                  onClick={() => setFilterValue(option)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterValue === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        {(isAddingNew || editingItem) && (
          <div className="mb-6 p-6 bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isAddingNew ? `Add ${ADMIN_TABS.find(tab => tab.id === activeTab)?.label}` : 'Edit Item'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {renderFormFields()}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiSave className="w-4 h-4 mr-2 inline" />
                Save
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-400">Loading data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
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
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 text-sm text-gray-400">
          Showing {filteredData.length} of {data.length} items
        </div>
      </div>
    </div>
  );
}