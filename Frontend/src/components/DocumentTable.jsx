import React from 'react';
import {
  FaUser,
  FaEnvelope,
  FaDownload,
  FaRegClock,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DocumentTable = ({ documents, onStatusChange }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

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

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-800 p-4 rounded-3xl shadow-2xl space-y-4">
      <ToastContainer position="top-right" />
      {documents.length === 0 ? (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400 text-lg">
          <p>No documents to display. Start by uploading some!</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {documents.map((doc) => (
            <motion.div
              key={doc._id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-6 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Left Section */}
              <div className="flex-1 mb-4 md:mb-0 space-y-2 md:space-y-0 md:pr-4">
                <div className="flex items-center text-lg font-bold text-gray-900 dark:text-gray-100">
                  <FaUser className="mr-2 text-blue-500" />
                  {doc.name}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  {doc.email}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                  <FaRegClock className="mr-2 text-gray-400" />
                  Submitted on: {new Date(doc.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Middle Section */}
              <div className="flex-1 mb-4 md:mb-0 md:px-4 md:border-l md:border-r border-gray-200 dark:border-gray-700">
                <div className="mb-3">
                  <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Document Types:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(doc.documents).map(
                      ([type, files]) =>
                        files.length > 0 && (
                          <span
                            key={type}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                          >
                            {type.toUpperCase()}
                          </span>
                        )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Files:
                  </h4>
                  <div className="space-y-1">
                    {Object.entries(doc.documents).map(([type, files]) =>
                      files.map((file, index) => (
                        <motion.div
                          key={`${doc._id}-${type}-${file}-${index}`}
                          className="flex items-center justify-between group cursor-pointer p-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                          whileHover={{ x: 5 }}
                        >
                          <a
                            href={`/api/documents/${doc._id}/download?type=${type}&file=${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex-grow min-w-0"
                          >
                            <FaFilePdf className="text-red-500 flex-shrink-0 text-base" />
                            <span className="truncate">
                              {type.toUpperCase()} - {file}
                            </span>
                          </a>
                          <FaDownload className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 ml-2 flex-shrink-0" />
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-col items-center md:items-end justify-center space-y-4 md:ml-4">
                <div className="text-center md:text-right">
                  <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    Status:
                  </h4>
                  <span
                    className={`px-4 py-1.5 inline-flex text-sm font-bold rounded-full shadow-sm
                      ${doc.status === 'Verified'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : doc.status === 'Rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVerify(doc._id)}
                    className="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 shadow-md"
                  >
                    <FaCheckCircle className="mr-2" /> Verify
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReject(doc._id)}
                    className="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 shadow-md"
                  >
                    <FaTimesCircle className="mr-2" /> Reject
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DocumentTable;
