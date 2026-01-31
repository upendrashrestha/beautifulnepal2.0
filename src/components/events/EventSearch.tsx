import { EventSpecParams } from "@/types/event.types";
import { useEffect, useRef, useState } from "react";
import { FaSearch, FaTimes, FaMapMarkerAlt } from "react-icons/fa";

interface EventSearchProps {
  cities: string[];
  onSearch: (params: EventSpecParams) => void;
}

export default function EventSearch({ cities, onSearch }: EventSearchProps) {
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'weekend' | 'popular'>('all');
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCitySearch(city);
    setShowCityDropdown(false);
    onSearch({
      pageIndex: 1,
      pageSize: 100,
      city,
      timeFilter: timeFilter !== 'all' ? timeFilter : undefined,
      search: searchQuery 
    });
  };

  const handleClearCity = () => {
    setSelectedCity('');
    setCitySearch('');
    onSearch({
      pageIndex: 1,
      pageSize: 100,
      city: undefined,
      timeFilter: timeFilter !== 'all' ? timeFilter : undefined,
      search: searchQuery || undefined
    });
  };

  const handleTimeFilterChange = (filter: 'all' | 'today' | 'weekend' | 'popular') => {
    setTimeFilter(filter);
    onSearch({
      pageIndex: 1,
      pageSize: 100,
      city: selectedCity || undefined,
      timeFilter: filter !== 'all' ? filter : undefined,
      search: searchQuery || undefined
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch({
      pageIndex: 1,
      pageSize: 100,
      city: selectedCity || undefined,
      timeFilter: timeFilter !== 'all' ? timeFilter : undefined,
      search: value || undefined
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-4">
      {/* Search Bar with City Filter Inside */}
      <div
        className={`
          rounded-2xl bg-white transition shadow-lg dark:bg-gray-900
          ${isFocused ? "shadow-[0_0_0_3px_rgba(99,102,241,0.35)]" : "shadow-lg"}
        `}
      >
        <div className="flex items-center gap-3 px-4 py-4">
          <FaSearch className="text-gray-400 shrink-0" />
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search events..."
            className="w-full flex-1 bg-transparent text-base focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />

          {/* City Filter Dropdown Button */}
          <div ref={cityDropdownRef} className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <FaMapMarkerAlt className="shrink-0" />
              <span>{selectedCity || 'All Cities'}</span>
            </button>

            {showCityDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-20">
                {/* Search within dropdown */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Search cities..."
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* Cities List */}
                <div className="max-h-60 overflow-y-auto">
                  {selectedCity && (
                    <div
                      onClick={handleClearCity}
                      className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FaTimes className="text-xs" />
                        <span className="text-sm font-medium">Clear filter</span>
                      </div>
                    </div>
                  )}
                  {filteredCities.map((city) => (
                    <div
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                        selectedCity === city
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {city}
                    </div>
                  ))}
                  {filteredCities.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                      No cities found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Time Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {([
          { value: 'all' as const, label: 'All' },
          { value: 'today' as const, label: 'Today' },
          { value: 'weekend' as const, label: 'Weekend' },
          { value: 'popular' as const, label: 'Popular' }
        ] as const).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleTimeFilterChange(value)}
            className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              timeFilter === value
                ? 'bg-gray-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}