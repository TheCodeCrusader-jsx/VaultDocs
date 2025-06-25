import React, { useState } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaDownload,
  FaRegClock,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const docTypeStyles = {
  aadhar: { icon: FaFilePdf, color: 'text-red-500' },
  pan: { icon: FaFilePdf, color: 'text-blue-500' },
  marksheet: { icon: FaFilePdf, color: 'text-green-500' },
  bank: { icon: FaFilePdf, color: 'text-yellow-500' },
  default: { icon: FaFilePdf, color: 'text-gray-500' },
};

const DocumentTable = ({ documents, onStatusChange, handleDownload }) => {
  const [expandedDocs, setExpandedDocs] = useState({});

  const handleVerify = (id) => {
    onStatusChange(id, 'Verified');
    toast.success('Document marked as Verified');
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this document?')) {
      onStatusChange(id, 'Rejected');
      toast.error('Document marked as Rejected');
    }
  };

  const toggleExpanded = (id) => {
    setExpandedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const displayedFiles = (doc) => {
    const files = [];
    for (const [type, fileArray] of Object.entries(doc.documents)) {
      if (Array.isArray(fileArray)) {
        fileArray.forEach((file) => files.push({ type, file }));
      }
    }
    return files;
  };

  const allFiles = (doc) => {
    const files = [];
    for (const [type, fileArray] of Object.entries(doc.documents)) {
      if (Array.isArray(fileArray)) {
        fileArray.forEach((file) => files.push({ type, file }));
      }
    }
    return files;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ToastContainer position="bottom-right" theme="colored" />
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <FaFilePdf size={48} className="mb-4" />
          <h2 className="text-2xl font-semibold">No Documents Found</h2>
          <p className="mt-2 text-sm">When documents are uploaded, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {documents.map((doc) => (
            <motion.div
              key={doc._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* User Info */}
                <div className="md:col-span-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <FaUser className="text-blue-500 dark:text-blue-400 text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">{doc.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{doc.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 pt-2">
                    <FaRegClock />
                    <span>{new Date(doc.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Documents List */}
                <div className="md:col-span-6">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">SUBMITTED DOCUMENTS</h3>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {displayedFiles(doc)
                        .slice(0, expandedDocs[doc._id] ? undefined : 2)
                        .map(({ type, file }, index) => {
                          const style = docTypeStyles[type] || docTypeStyles.default;
                          return (
                            <motion.div
                              key={`${type}-${index}`}
                              layout
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                            >
                              <div className="flex items-center gap-3">
                                <style.icon className={`${style.color} text-xl`} />
                                <div>
                                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{type.toUpperCase()}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{file}</p>
                                </div>
                              </div>
                              <button
                                onClick={async (e) => {
                                  e.preventDefault();
                                  try {
                                    // Get the document reference
                                    const docRef = doc;
                                    if (!docRef || !docRef._id) {
                                      throw new Error('Invalid document reference');
                                    }

                                    const cleanName = docRef.name.trim().toLowerCase().replace(/\s+/g, '_');
                                    const ext = '.pdf';
                                    const serverFilename = `${type}-${cleanName}${ext}`;

                                    const backendUrl = `http://localhost:5000/api/documents/${docRef._id}/download?type=${encodeURIComponent(type)}&file=${encodeURIComponent(serverFilename)}`;
                                    console.log('Downloading:', serverFilename);

                                    const form = document.createElement('form');
                                    form.method = 'GET';
                                    form.action = backendUrl;
                                    form.target = '_blank';

                                    const typeInput = document.createElement('input');
                                    typeInput.type = 'hidden';
                                    typeInput.name = 'type';
                                    typeInput.value = type;
                                    form.appendChild(typeInput);

                                    const fileInput = document.createElement('input');
                                    fileInput.type = 'hidden';
                                    fileInput.name = 'file';
                                    fileInput.value = serverFilename;
                                    form.appendChild(fileInput);

                                    document.body.appendChild(form);
                                    form.submit();
                                    document.body.removeChild(form);
                                  } catch (error) {
                                    console.error('Download error:', error);
                                    toast.error(`Failed to download: ${error.message}`);
                                  }
                                }}
                                className="p-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-white transition-colors"
                                title="Download file"
                              >
                                <FaDownload />
                              </button>
                            </motion.div>
                          );
                        })}
                    </AnimatePresence>
                  </div>
                  {allFiles(doc).length > 2 && (
                    <button
                      onClick={() => toggleExpanded(doc._id)}
                      className="mt-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      {expandedDocs[doc._id] ? 'Show Less' : `Show ${allFiles(doc).length - 2} More`}
                      {expandedDocs[doc._id] ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="md:col-span-3 flex flex-col items-end justify-between h-full space-y-4">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">STATUS</p>
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${getStatusBadge(
                        doc.status
                      )}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(doc._id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
                    >
                      <FaTimesCircle />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVerify(doc._id)}
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                    >
                      <FaCheckCircle />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentTable;
