import React from 'react';

// ProductCard now accepts an optional onClick handler and the product's ID
const ProductCard = ({ id, name, price, image, brand, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      // Navigate to the 'detail' page and pass the product ID
      onClick(id); 
    }
  };
  
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 cursor-pointer"
      onClick={handleClick}
    >
      <img 
        src={image || 'https://placehold.co/600x400/e5e7eb/555?text=No+Image'} 
        alt={name} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-4 space-y-1">
        <h3 className="text-md font-semibold text-gray-900 line-clamp-2">{name}</h3>
        <p className="text-sm text-gray-500 font-medium">{brand || 'Generic'}</p>
        <p className="text-xl text-indigo-600 font-bold">₹{price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
