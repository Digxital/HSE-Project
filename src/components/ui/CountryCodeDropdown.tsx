import React, { useState, useRef, useEffect } from 'react';

interface Country {
  code: string;
  name: string;
  callingCode: string;
}

interface CountryCodeDropdownProps {
  countries: Country[];
  value: string;
  onChange: (callingCode: string) => void;
}

export const CountryCodeDropdown: React.FC<CountryCodeDropdownProps> = ({
  countries,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Find the selected country name for display
  const selectedCountry = countries.find((c) => c.callingCode === value);
  const displayText = selectedCountry ? `${selectedCountry.name} (${selectedCountry.callingCode})` : 'Select Country';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to selected option when dropdown opens
  useEffect(() => {
    if (isOpen && listRef.current) {
      const selectedElement = listRef.current.querySelector('[data-selected="true"]');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen]);

  const handleSelect = (callingCode: string) => {
    onChange(callingCode);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-[#FFF4E64D] text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] text-left flex items-center justify-between"
      >
        <span>{displayText}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
        >
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              data-selected={country.callingCode === value}
              onClick={() => handleSelect(country.callingCode)}
              className={`w-full px-4 py-3 text-left hover:bg-[#FFF4E64D] transition-colors ${
                country.callingCode === value ? 'bg-[#C2410C] text-white font-semibold' : 'text-gray-900'
              }`}
            >
              {country.name} ({country.callingCode})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
