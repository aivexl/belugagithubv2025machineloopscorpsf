// Komponen Input untuk Comma-Separated Values
import { useState, useEffect } from 'react';

export const CommaSeparatedInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  className = "",
  required = false 
}) => {
  const [inputValue, setInputValue] = useState('');

  // Update input value when prop value changes
  useEffect(() => {
    if (Array.isArray(value)) {
      setInputValue(value.join(', '));
    } else if (typeof value === 'string') {
      setInputValue(value);
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Convert to array for the parent component
    const arrayValue = newValue
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    // Call onChange with correct parameters (field, value)
    onChange(name, arrayValue);
  };

  const handleKeyDown = (e) => {
    // Allow Enter to add new item
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentValue = inputValue.trim();
      if (currentValue && !currentValue.endsWith(',')) {
        setInputValue(currentValue + ', ');
        const arrayValue = (currentValue + ', ')
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0);
        onChange(name, arrayValue);
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        required={required}
      />
      <div className="mt-1 text-xs text-gray-400">
        💡 Tip: Gunakan koma untuk memisahkan item. Tekan Enter untuk menambah item baru.
      </div>
      {Array.isArray(value) && value.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-400 mb-1">Preview:</div>
          <div className="flex flex-wrap gap-1">
            {value.map((item, index) => (
              <span
                key={index}
                className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-600 text-gray-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
