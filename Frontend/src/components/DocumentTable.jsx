import React from 'react';

const DocumentTable = ({ documents, onStatusChange }) => {
  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Uploaded Documents</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Document Type</th>
              <th className="py-3 px-6 text-left">File</th>
              <th className="py-3 px-6 text-left">Submission Date</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id} className="border-b">
                <td className="py-3 px-6">{doc.name}</td>
                <td className="py-3 px-6">{doc.email}</td>
                <td className="py-3 px-6">{doc.docType}</td>
                <td className="py-3 px-6">
                  <a href={`http://localhost:5000/api/documents/${doc._id}/download`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Download</a>
                </td>
                <td className="py-3 px-6">{new Date(doc.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-6">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {doc.status}
                    </span>
                </td>
                <td className="py-3 px-6">
                  {doc.status === 'Pending' && (
                    <button 
                      onClick={() => onStatusChange(doc._id, 'Verified')}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                    >
                      Mark as Verified
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTable;
