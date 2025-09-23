import React, { useState } from 'react';

const CategoryCard = ({ title, image }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        flex-shrink-0 relative w-44 h-44 rounded-2xl shadow-md cursor-pointer transition-transform duration-300 transform-gpu
        ${isHovered ? 'scale-105' : 'scale-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-full rounded-2xl object-cover"
      />

      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex flex-col items-center justify-center transition-opacity duration-300">
          <p className="text-white text-lg font-semibold mb-2">{title}</p>
          <button className="text-white text-sm px-4 py-1.5 border border-white rounded-full backdrop-blur-md">
            Explore
          </button>
        </div>
      )}

      {/* Title Below Card (Visible at all times) */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm font-semibold text-white backdrop-blur-md bg-black bg-opacity-70 inline-block px-3 py-1 rounded-full">{title}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
