import React from 'react';
import UploadForm from '../components/UploadForm';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-8">
          📁 Submit Your Document
        </h1>
        <UploadForm />
      </div>
    </div>
  );
};

export default Home;
