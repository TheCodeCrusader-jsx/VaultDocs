import React, { useState } from 'react';

const UploadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    documentType: 'resume',
    files: [], // Changed to handle multiple files
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: [...e.target.files], // Store all selected files
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    if (formData.files.length === 0) {
      setMessage('Please select at least one file to upload.');
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('docType', formData.documentType);

    // Append all files to the FormData object
    for (let i = 0; i < formData.files.length; i++) {
      data.append('documents', formData.files[i]);
    }

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setMessage(`✅ ${formData.files.length} document(s) uploaded successfully!`);
        setFormData({
          name: '',
          email: '',
          documentType: 'resume',
          files: [],
        });
        e.target.reset();
      } else {
        const errorData = await response.json();
        setMessage(`❌ Upload failed: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('⚠️ An error occurred during upload.');
      console.error('Upload error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 px-6 py-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md">
      <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">📤 Admin: Upload Documents</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">👤 Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">📧 Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="documentType" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">📂 Document Type</label>
          <select
            id="documentType"
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
          >
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
        <div>
          <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">📎 Upload Files (PDF only)</label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
            required
            multiple // Allow multiple file selection
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Uploading...' : 'Submit'}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
};

export default UploadForm;
