import React from 'react';

const DocumentTable = ({ documents, onStatusChange }) => {
  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">📄 Uploaded Documents</h2>
      
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-full bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300">
            <tr>
              <th className="py-4 px-6 text-left">👤 Name</th>
              <th className="py-4 px-6 text-left">📧 Email</th>
              <th className="py-4 px-6 text-left">📂 Type</th>
              <th className="py-4 px-6 text-left">📎 File</th>
              <th className="py-4 px-6 text-left">🗓️ Date</th>
              <th className="py-4 px-6 text-left">✅ Status</th>
              <th className="py-4 px-6 text-left">⚙️ Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((doc) => (
              <tr key={doc._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="py-4 px-6">{doc.name}</td>
                <td className="py-4 px-6">{doc.email}</td>
                <td className="py-4 px-6 capitalize">{doc.docType}</td>
                <td className="py-4 px-6">
                  <a
                    href={`http://localhost:5000/api/documents/${doc._id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Download
                  </a>
                </td>
                <td className="py-4 px-6">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      doc.status === 'Verified'
                        ? 'bg-green-100 text-green-700 dark:bg-green-200/10 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-200/10 dark:text-yellow-300'
                    }`}
                  >
                    {doc.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {doc.status === 'Pending' && (
                    <button
                      onClick={() => onStatusChange(doc._id, 'Verified')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded transition-all shadow-sm"
                    >
                      Verify
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
