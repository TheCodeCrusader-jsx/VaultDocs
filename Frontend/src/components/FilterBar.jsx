import React from 'react';

const FilterBar = ({ onFilterChange }) => {
  const handleFilter = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <div className="bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0">
          
          {/* Document Type Filter */}
          <div className="w-full md:w-1/2">
            <label
              htmlFor="documentTypeFilter"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              📂 Filter by Document Type
            </label>
            <select
              id="documentTypeFilter"
              name="docType"
              onChange={handleFilter}
              className="block w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="resume">Resume</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="pan">PAN Card</option>
              <option value="passport">Passport</option>
              <option value="license">Driving License</option>
              <option value="voterid">Voter ID</option>
              <option value="marksheet">Marksheet</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="w-full md:w-1/2">
            <label
              htmlFor="dateFilter"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              📅 Filter by Submission Date
            </label>
            <input
              type="date"
              id="dateFilter"
              name="date"
              onChange={handleFilter}
              className="block w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
