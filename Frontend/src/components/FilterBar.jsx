import React from 'react';

const FilterBar = ({ onFilterChange }) => {
  const handleFilter = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="container mx-auto mt-6 p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-1 mb-4 md:mb-0">
                <label htmlFor="documentTypeFilter" className="block text-gray-700 font-bold mb-2">Filter by Type</label>
                <select
                    id="documentTypeFilter"
                    name="docType"
                    onChange={handleFilter}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <div className="flex-1">
                <label htmlFor="dateFilter" className="block text-gray-700 font-bold mb-2">Filter by Date</label>
                <input
                    type="date"
                    id="dateFilter"
                    name="date"
                    onChange={handleFilter}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
        </div>
    </div>
  );
};

export default FilterBar;
