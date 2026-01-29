import { EventSpecParams } from "@/types/event.types";
import { useEffect, useRef, useState } from "react";

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
  
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCitySearch(city);
    setShowCityDropdown(false);
    onSearch({
        pageIndex:1,
        pageSize:100,
      city,
      timeFilter: timeFilter !== 'all' ? timeFilter : undefined,
      search:searchQuery 
    });
  };

  const handleTimeFilterChange = (filter: 'all' | 'today' | 'weekend' | 'popular') => {
    setTimeFilter(filter);
    onSearch({
        pageIndex:1,
        pageSize:100,
      city: selectedCity || undefined,
      timeFilter: filter !== 'all' ? filter : undefined
    });
  };

    const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch({
        pageIndex:1,
        pageSize:100,
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
 <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Search Input */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by event title or type"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Time Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleTimeFilterChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeFilter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => handleTimeFilterChange('today')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeFilter === 'today'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => handleTimeFilterChange('weekend')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeFilter === 'weekend'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          This Weekend
        </button>
        <button
          onClick={() => handleTimeFilterChange('popular')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeFilter === 'popular'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Most Popular
        </button>
      </div>

      {/* City Dropdown */}
      <div ref={cityDropdownRef}>
        <div className="relative">
          <input
            type="text"
            value={citySearch}
            onChange={(e) => {
              setCitySearch(e.target.value);
              setShowCityDropdown(true);
              setSelectedCity('');
            }}
            onFocus={() => setShowCityDropdown(true)}
            placeholder="Search for a city"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {showCityDropdown && filteredCities.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCities.map((city) => (
                <div
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-white transition-colors"
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}