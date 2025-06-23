import React from 'react';

const FilterBar = ({ onFilterChange }) => {
  const handleFilter = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <div className="rounded-3xl bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] p-6 transition-all duration-300 hover:shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 📂 Document Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              📂 Document Type
            </label>
            <select
              name="docType"
              onChange={handleFilter}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 shadow-sm hover:border-blue-400"
            >
              <option value="">All Documents</option>
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

          {/* 📅 Submission Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              📅 Submission Date
            </label>
            <input
              type="date"
              name="date"
              onChange={handleFilter}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 shadow-sm hover:border-blue-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
