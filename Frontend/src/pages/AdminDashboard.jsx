import React, { useState, useEffect, useCallback } from 'react';
import DocumentTable from '../components/DocumentTable';
import FilterBar from '../components/FilterBar';
// ❌ Removed UserTable import — not needed now

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [documentFilters, setDocumentFilters] = useState({ username: '' }); // 🔧 use only username now

  // ✅ Fetch all documents (no backend filtering)
  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch(`/api/documents`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }, []);

  // ✅ Fetch once when component mounts
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // ✅ Handle filter change from FilterBar
  const handleFilterChange = (name, value) => {
    setDocumentFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle verify/reject and refetch updated list
  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      fetchDocuments(); // refresh after status update
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // ✅ Frontend filter documents by username
  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(documentFilters.username?.toLowerCase() || '')
  );

  // ✅ JSX
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-10">
          🛠️ Admin Dashboard
        </h1>

        <div className="mb-6">
          <FilterBar onFilterChange={handleFilterChange} />
        </div>

        {/* ✅ Always show filtered documents now */}
        <DocumentTable
          documents={filteredDocuments}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
