// Form fields untuk semua kategori di CryptoAdminPanel
import { LogoUploadSection } from './LogoUploadSection';

export const getFormFields = (activeTab, formData, handleInputChange) => {
  switch (activeTab) {
    case 'exchanges':
      return (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country *</label>
            <input
              type="text"
              value={formData.country || ''}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Region *</label>
            <select
              value={formData.region || ''}
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
              value={formData.founded || ''}
              onChange={(e) => handleInputChange('founded', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Website *</label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type *</label>
            <select
              value={formData.type || ''}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="Centralized">Centralized</option>
              <option value="Decentralized">Decentralized</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <select
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <LogoUploadSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            category="exchanges" 
          />
          <div>
            <label className="block text-sm font-medium mb-2">Trading Volume</label>
            <input
              type="text"
              value={formData.tradingVolume || ''}
              onChange={(e) => handleInputChange('tradingVolume', e.target.value)}
              placeholder="e.g., $1.5B"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Trading Pairs</label>
            <input
              type="text"
              value={formData.pairs || ''}
              onChange={(e) => handleInputChange('pairs', e.target.value)}
              placeholder="e.g., 200+"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Features</label>
            <input
              type="text"
              value={formData.features || ''}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange('features', value);
              }}
              placeholder="e.g., Spot Trading, Futures, Staking"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-1 text-xs text-gray-400">
              💡 Gunakan koma untuk memisahkan features
            </div>
            {formData.features && (
              <div className="mt-2">
                <div className="text-xs text-gray-400 mb-1">Preview:</div>
                <div className="flex flex-wrap gap-1">
                  {formData.features.split(',').map((feature, index) => {
                    const trimmedFeature = feature.trim();
                    if (trimmedFeature) {
                      return (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-600 text-gray-300"
                        >
                          {trimmedFeature}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      );

    case 'airdrop':
      return (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Project *</label>
            <input
              type="text"
              value={formData.project || ''}
              onChange={(e) => handleInputChange('project', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Token *</label>
            <input
              type="text"
              value={formData.token || ''}
              onChange={(e) => handleInputChange('token', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Network *</label>
            <input
              type="text"
              value={formData.network || ''}
              onChange={(e) => handleInputChange('network', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <select
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={formData.endDate || ''}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Reward</label>
            <input
              type="text"
              value={formData.totalReward || ''}
              onChange={(e) => handleInputChange('totalReward', e.target.value)}
              placeholder="e.g., 1,000,000,000 JUP"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Participants</label>
            <input
              type="text"
              value={formData.participants || ''}
              onChange={(e) => handleInputChange('participants', e.target.value)}
              placeholder="e.g., 955,000+"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Estimated Value</label>
            <input
              type="text"
              value={formData.estimatedValue || ''}
              onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
              placeholder="e.g., $0.50 - $2.00"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <LogoUploadSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            category="airdrop" 
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      );

    case 'ico-ido':
      return (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Project *</label>
            <input
              type="text"
              value={formData.project || ''}
              onChange={(e) => handleInputChange('project', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Token *</label>
            <input
              type="text"
              value={formData.token || ''}
              onChange={(e) => handleInputChange('token', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Network *</label>
            <input
              type="text"
              value={formData.network || ''}
              onChange={(e) => handleInputChange('network', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <select
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="text"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="e.g., $0.05"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Raised</label>
            <input
              type="text"
              value={formData.raised || ''}
              onChange={(e) => handleInputChange('raised', e.target.value)}
              placeholder="e.g., $14,000,000"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Participants</label>
            <input
              type="text"
              value={formData.participants || ''}
              onChange={(e) => handleInputChange('participants', e.target.value)}
              placeholder="e.g., 50,000+"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="DeFi">DeFi</option>
              <option value="NFT">NFT</option>
              <option value="Gaming">Gaming</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Current Price</label>
            <input
              type="text"
              value={formData.currentPrice || ''}
              onChange={(e) => handleInputChange('currentPrice', e.target.value)}
              placeholder="e.g., $0.85"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">ROI</label>
            <input
              type="text"
              value={formData.roi || ''}
              onChange={(e) => handleInputChange('roi', e.target.value)}
              placeholder="e.g., +1600%"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Vesting</label>
            <input
              type="text"
              value={formData.vesting || ''}
              onChange={(e) => handleInputChange('vesting', e.target.value)}
              placeholder="e.g., 6 months"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <LogoUploadSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            category="ico-ido" 
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      );

    case 'fundraising':
      return (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Project *</label>
            <input
              type="text"
              value={formData.project || ''}
              onChange={(e) => handleInputChange('project', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={formData.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="DeFi">DeFi</option>
              <option value="Gaming">Gaming</option>
              <option value="NFT">NFT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <select
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Raised</label>
            <input
              type="text"
              value={formData.raised || ''}
              onChange={(e) => handleInputChange('raised', e.target.value)}
              placeholder="e.g., $225,000,000"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Valuation</label>
            <input
              type="text"
              value={formData.valuation || ''}
              onChange={(e) => handleInputChange('valuation', e.target.value)}
              placeholder="e.g., $3,000,000,000"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Round</label>
            <select
              value={formData.round || ''}
              onChange={(e) => handleInputChange('round', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Round</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Series C">Series C</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Use Case</label>
            <input
              type="text"
              value={formData.useCase || ''}
              onChange={(e) => handleInputChange('useCase', e.target.value)}
              placeholder="e.g., EVM scaling solution"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <LogoUploadSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            category="fundraising" 
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Investors</label>
            <input
              type="text"
              value={formData.investors || ''}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange('investors', value);
              }}
              placeholder="e.g., Paradigm, Electric Capital, Coinbase Ventures"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-1 text-xs text-gray-400">
              💡 Gunakan koma untuk memisahkan investors
            </div>
            {formData.investors && (
              <div className="mt-2">
                <div className="text-xs text-gray-400 mb-1">Preview:</div>
                <div className="flex flex-wrap gap-1">
                  {formData.investors.split(',').map((investor, index) => {
                    const trimmedInvestor = investor.trim();
                    if (trimmedInvestor) {
                      return (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-600 text-gray-300"
                        >
                          {trimmedInvestor}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      );

    case 'glossary':
      return (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Term *</label>
            <input
              type="text"
              value={formData.term || ''}
              onChange={(e) => handleInputChange('term', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={formData.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Protocol">Protocol</option>
              <option value="Token">Token</option>
              <option value="Strategy">Strategy</option>
              <option value="Technology">Technology</option>
              <option value="Organization">Organization</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Definition *</label>
            <textarea
              value={formData.definition || ''}
              onChange={(e) => handleInputChange('definition', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Example *</label>
            <textarea
              value={formData.example || ''}
              onChange={(e) => handleInputChange('example', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Related Terms</label>
            <input
              type="text"
              value={formData.relatedTerms || ''}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange('relatedTerms', value);
              }}
              placeholder="e.g., AMM, Liquidity Pool, Impermanent Loss"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-1 text-xs text-gray-400">
              💡 Gunakan koma untuk memisahkan related terms
            </div>
            {formData.relatedTerms && (
              <div className="mt-2">
                <div className="text-xs text-gray-400 mb-1">Preview:</div>
                <div className="flex flex-wrap gap-1">
                  {formData.relatedTerms.split(',').map((term, index) => {
                    const trimmedTerm = term.trim();
                    if (trimmedTerm) {
                      return (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-600 text-gray-300"
                        >
                          {trimmedTerm}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
          <LogoUploadSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            category="glossary" 
          />
        </>
      );

    default:
      return <div>Form fields for {activeTab} coming soon...</div>;
  }
};