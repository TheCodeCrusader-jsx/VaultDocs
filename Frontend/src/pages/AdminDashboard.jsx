import React, { useState, useEffect } from 'react';
import DocumentTable from '../components/DocumentTable';
import FilterBar from '../components/FilterBar';

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [filters, setFilters] = useState({
    docType: '',
    date: '',
  });

  const fetchDocuments = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/documents?${query}`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // 👇 THIS return must be INSIDE the component
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-10">
          🛠️ Admin Dashboard
        </h1>

        <div className="mb-6">
          <FilterBar onFilterChange={handleFilterChange} />
        </div>

        <DocumentTable documents={documents} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
};

export default AdminDashboard;
