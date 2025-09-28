import React, { useState } from 'react';

// Component now accepts an 'onClick' handler as a prop from HomePage.jsx
const CategoryCard = ({ title, image, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Function to handle the navigation when the user clicks the Explore button
  const handleClick = (e) => {
    // Prevent event bubbling up from the button to the parent div
    e.stopPropagation(); 
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        flex-shrink-0 relative w-44 h-44 rounded-2xl shadow-lg cursor-pointer overflow-hidden transition-transform duration-300 transform-gpu
        ${isHovered ? 'scale-105' : 'scale-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Note: We don't attach onClick here, we attach it to the button below
    >
      {/* Category Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-full rounded-2xl object-cover"
      />

      {/* Hover Overlay - Controls Explore Button */}
      {isHovered && (
        <div className="absolute inset-0 bg-indigo-600 bg-opacity-70 rounded-2xl flex flex-col items-center justify-center transition-opacity duration-300">
          <p className="text-white text-lg font-semibold mb-2">{title}</p>
          {/* This button triggers the page change (navigation) */}
          <button 
            onClick={handleClick} 
            className="text-white text-sm px-4 py-1.5 border border-white rounded-full backdrop-blur-md hover:bg-white hover:text-indigo-600 transition"
          >
            Explore
          </button>
        </div>
      )}

      {/* Title Below Card (Visible at all times) */}
      {!isHovered && (
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-sm font-semibold text-white backdrop-blur-md bg-black bg-opacity-50 inline-block px-3 py-1 rounded-full">{title}</p>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
