'use client';
import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const SearchBar = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    date: '',
    travelers: '1',
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Destination
              </label>
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchData.destination}
                onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                className="w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 text-lg font-medium"
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full border-b border-gray-300"></div>
        </div>

        {/* Date */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Date
              </label>
              <input
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                className="w-full border-0 p-0 text-gray-900 focus:outline-none focus:ring-0 text-lg font-medium"
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full border-b border-gray-300"></div>
        </div>

        {/* Travelers */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Travelers
              </label>
              <select
                value={searchData.travelers}
                onChange={(e) => setSearchData({...searchData, travelers: e.target.value})}
                className="w-full border-0 p-0 text-gray-900 focus:outline-none focus:ring-0 text-lg font-medium bg-transparent"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Traveler' : 'Travelers'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full border-b border-gray-300"></div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button className="w-full bg-orange-500 text-white py-4 px-8 rounded-xl hover:bg-orange-600 smooth-transition font-semibold text-lg flex items-center justify-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;