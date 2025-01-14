import React from 'react';
import '../styles/playground.css';

const CSSPlayground = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">CSS Playground</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Hover Effect */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover-card">
          <h2 className="text-xl font-semibold mb-4">Hover Effect</h2>
          <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
        </div>

        {/* Animation */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Pulse Animation</h2>
          <div className="h-40 bg-blue-500 animate-pulse rounded-lg"></div>
        </div>

        {/* Transform */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Transform</h2>
          <div className="h-40 bg-green-500 rounded-lg transform-card"></div>
        </div>

      </div>
      <div className="container">
        <div className="mobile-layout">
          <div className="book-cover">
            <img 
              src="https://via.placeholder.com/170x200" 
              alt="Book Cover" 
              className="book-top" 
            />
          </div>
          <div className="preface">
            <h1 className="title">Book Title</h1>
            <p className="author">By Author Name</p>
            <div className="body">
              <p>Book description goes here...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSSPlayground;