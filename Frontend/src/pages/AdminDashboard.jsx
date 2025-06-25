import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import DocumentTable from '../components/DocumentTable';
import FilterBar from '../components/FilterBar';
// ❌ Removed UserTable import — not needed now

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003';

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [documentFilters, setDocumentFilters] = useState({ 
    username: '',
    docType: '' 
  });

  // ✅ Fetch all documents with proper API configuration
  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents. Please try again.');
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

  // ✅ Handle verify/reject with proper API configuration
  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('Status updated successfully');
      fetchDocuments(); // refresh after status update
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status. Please try again.');
    }
  };

  // ✅ Frontend filter documents by username and document type
  const filteredDocuments = documents.filter((doc) => {
    // Filter by username (if provided)
    const searchQuery = documentFilters.username?.toLowerCase() || '';
    const matchesUsername = doc.name.toLowerCase().includes(searchQuery) ||
                         doc.email.toLowerCase().includes(searchQuery);
    
    // If no document type is selected, only filter by username/email
    if (!documentFilters.docType) return matchesUsername;
    
    // Check if the document has a document of the selected type
    const hasDocType = doc.documents && 
                      doc.documents[documentFilters.docType] && 
                      doc.documents[documentFilters.docType].length > 0;
    
    // If searching with a query, also check if the filename matches
    if (searchQuery && hasDocType) {
      const files = doc.documents[documentFilters.docType];
      const hasMatchingFile = files.some(file => 
        file.toLowerCase().includes(searchQuery)
      );
      return hasMatchingFile;
    }
    
    return matchesUsername && hasDocType;
  });

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
          handleDownload={(doc) => {
            // This handler is just a placeholder since download is handled directly in DocumentTable
            console.log('Download requested for:', doc);
          }} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
