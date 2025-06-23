import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
// Note: React Toastify CSS import is removed here as it causes compilation issues in some environments.
// For proper styling, please ensure 'react-toastify/dist/ReactToastify.css' is linked via a CDN
// or included globally in your application's main HTML file.
import { motion } from 'framer-motion';

// Importing icons from lucide-react for better compatibility
import { Paperclip, Loader2, XCircle, FileText, UploadCloud, User, Mail } from 'lucide-react';

const UploadForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  // State to hold selected files, mapping doc type to an array of File objects
  const [documents, setDocuments] = useState({
    aadhar: [],
    bank: [],
    marksheet: [],
    pan: [],
    license: [],
    passport: [],
    voterid: [],
    other: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper object for document type labels
  const docLabels = {
    aadhar: 'Aadhar Card',
    bank: 'Bank Details',
    marksheet: 'Marksheet',
    pan: 'PAN Card',
    license: 'Driving License',
    passport: 'Passport',
    voterid: 'Voter ID',
    other: 'Other Document',
  };

  // Maximum allowed file size in bytes (e.g., 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Handles changes in text input fields (name, email)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handles file selection for a specific document type
  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [];
    let isValidSelection = true; // Flag to check if all selected files are valid

    selectedFiles.forEach(file => {
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast.error(`"${file.name}" is not a PDF file. Only PDF files are allowed.`);
        isValidSelection = false; // Mark selection as invalid
        return; // Skip this file
      }
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" is too large. Max size is 5MB.`);
        isValidSelection = false; // Mark selection as invalid
        return; // Skip this file
      }
      newFiles.push(file);
    });

    if (isValidSelection) {
      // Append new valid files to existing ones for this type
      setDocuments(prevDocs => ({
        ...prevDocs,
        [type]: [...prevDocs[type], ...newFiles] // Concatenate new files
      }));
    }
    // Always clear the file input's value after processing to allow re-selection of same files
    // or to ensure the input is ready for new selection.
    e.target.value = null;
  };

  // Handles removal of a specific file from a document type
  const handleRemoveFile = (type, fileName) => {
    setDocuments(prevDocs => ({
      ...prevDocs,
      [type]: prevDocs[type].filter(file => file.name !== fileName)
    }));
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);

    let hasAtLeastOneFile = false;

    // Iterate through all document types and their selected files
    Object.entries(documents).forEach(([type, files]) => {
      files.forEach((file) => {
        hasAtLeastOneFile = true;
        // Append file with a unique key, and its type
        data.append('documents', file);
        data.append('docTypes', type);
      });
    });

    // Client-side check: ensure at least one file is uploaded
    if (!hasAtLeastOneFile) {
      toast.warn('Please select at least one document to upload.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Make the API call to upload documents
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        toast.success('Documents uploaded successfully!');
        // Reset form data and selected documents on success
        setFormData({ name: '', email: '' });
        setDocuments({
          aadhar: [], bank: [], marksheet: [], pan: [],
          license: [], passport: [], voterid: [], other: [],
        });
      } else {
        const errorData = await response.json();
        toast.error(`Upload failed: ${errorData.message || 'An unknown error occurred.'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error during upload. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-10 px-6 py-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <motion.h2 variants={itemVariants} className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-10 tracking-tight">
        <UploadCloud className="inline-block mr-4 text-blue-600 dark:text-blue-400" size={40} /> Upload Your Documents
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* User Info Section */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <User className="mr-3 text-purple-500" size={24} /> Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition duration-200"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition duration-200"
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Document Upload Section */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <FileText className="mr-3 text-blue-500" size={24} /> Required Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.keys(documents).map((docType) => (
              <motion.div key={docType} variants={itemVariants} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Paperclip className="inline-block mr-2 text-indigo-500" size={18} /> {docLabels[docType]}
                </label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition duration-200">
                  <input
                    type="file"
                    accept=".pdf" // Client-side hint for PDF only
                    multiple
                    onChange={(e) => handleFileChange(e, docType)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center h-full">
                    <UploadCloud className="text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Drag & Drop or <span className="font-semibold text-blue-600 dark:text-blue-400">Browse Files</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">(PDF files only, max 5MB)</p>
                  </div>
                </div>

                {/* Display selected files */}
                {documents[docType].length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Selected files:</p>
                    {documents[docType].map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between bg-blue-50 dark:bg-blue-900 p-3 rounded-md text-sm text-blue-800 dark:text-blue-200 shadow-sm"
                      >
                        <span className="truncate flex-1 font-medium">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(docType, file.name)}
                          className="ml-3 text-blue-600 hover:text-red-700 dark:text-blue-300 dark:hover:text-red-500 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                          aria-label={`Remove ${file.name}`}
                        >
                          <XCircle size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-2/3 lg:w-1/2 mx-auto block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg transition duration-300 ease-in-out flex items-center justify-center text-lg
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-3" size={20} /> Uploading...
            </>
          ) : (
            'Submit All Documents'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UploadForm;
