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
      const response = await fetch(`http://localhost:5000/api/documents?${query}`);
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
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/documents/${id}`, {
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

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
      <FilterBar onFilterChange={handleFilterChange} />
      <DocumentTable documents={documents} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default AdminDashboard;
