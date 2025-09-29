import React from 'react';

// The BackButton needs the setCurrentPage function from App.jsx
const BackButton = ({ setCurrentPage, targetPage = 'home' }) => {

  const handleClick = () => {
    // Navigate back to the home page or a specific target page if provided
    setCurrentPage(targetPage);
    
    // Attempt to clear any pending searches or filters upon going back
    if (targetPage === 'home') {
      setCurrentPage('home', null, null); 
    }
  };

  return (
    <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
      <button
        onClick={handleClick}
        className="flex items-center space-x-2 p-2 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
      >
        {/* Left Arrow Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>BACK</span>
      </button>
    </div>
  );
};

export default BackButton;
