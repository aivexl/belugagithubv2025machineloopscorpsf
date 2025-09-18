// Komponen Upload Logo untuk Form
import { useState } from 'react';

export const LogoUploadSection = ({ formData, handleInputChange, category = 'airdrop' }) => {
  const [logoText, setLogoText] = useState('');

  // Generate logo berdasarkan text
  const generateLogo = (text, bgColor = '9945FF') => {
    if (text) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=${bgColor}&color=fff&size=64&font-size=0.4`;
    }
    return '';
  };

  // Color berdasarkan kategori
  const getCategoryColor = () => {
    switch (category) {
      case 'airdrop': return '9945FF'; // Purple
      case 'ico-ido': return 'FF6B35'; // Orange
      case 'fundraising': return '00D4FF'; // Blue
      case 'exchanges': return 'F7931A'; // Orange
      case 'glossary': return '1E40AF'; // Blue
      default: return '9945FF';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Logo</label>
      <div className="space-y-3">
        {/* Logo Preview */}
        {formData.logo && (
          <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
            <img 
              src={formData.logo} 
              alt="Logo preview" 
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="flex-1">
              <p className="text-sm text-gray-300">Current Logo</p>
              <p className="text-xs text-gray-400 truncate max-w-xs">{formData.logo}</p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange('logo', '')}
              className="text-red-400 hover:text-red-300 p-1"
              title="Remove logo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Upload Options */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm font-medium text-gray-300">Upload Options</span>
          </div>
          
          {/* Option 1: URL Input */}
          <div className="space-y-1">
            <label className="block text-xs text-gray-400">Option 1: Logo URL</label>
            <input
              type="url"
              value={formData.logo || ''}
              onChange={(e) => handleInputChange('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500"
            />
          </div>
          
          {/* Option 2: File Upload */}
          <div className="space-y-1">
            <label className="block text-xs text-gray-400">Option 2: Upload File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // Validasi ukuran file (max 2MB)
                  if (file.size > 2 * 1024 * 1024) {
                    alert('File size must be less than 2MB');
                    return;
                  }
                  
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    handleInputChange('logo', event.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
            />
            <p className="text-xs text-gray-500">Max file size: 2MB (PNG, JPG, SVG)</p>
          </div>
          
          {/* Option 3: Quick Logo Generator */}
          <div className="space-y-1">
            <label className="block text-xs text-gray-400">Option 3: Generate Logo</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter text (e.g., 'JUP', 'ENA')"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (logoText.trim()) {
                    const generatedLogo = generateLogo(logoText.trim(), getCategoryColor());
                    handleInputChange('logo', generatedLogo);
                  }
                }}
                disabled={!logoText.trim()}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500">Generate a logo using text and category color</p>
          </div>
          
          {/* Quick Presets */}
          <div className="space-y-1">
            <label className="block text-xs text-gray-400">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {category === 'airdrop' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleInputChange('logo', generateLogo('AIR', '9945FF'))}
                    className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500"
                  >
                    AIR
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('logo', generateLogo('DROP', '9945FF'))}
                    className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500"
                  >
                    DROP
                  </button>
                </>
              )}
              {category === 'ico-ido' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleInputChange('logo', generateLogo('ICO', 'FF6B35'))}
                    className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500"
                  >
                    ICO
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('logo', generateLogo('IDO', 'FF6B35'))}
                    className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500"
                  >
                    IDO
                  </button>
                </>
              )}
              {category === 'fundraising' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleInputChange('logo', generateLogo('FUND', '00D4FF'))}
                    className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500"
                  >
                    FUND
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('logo', generateLogo('RAISE', '00D4FF'))}
                    className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500"
                  >
                    RAISE
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
