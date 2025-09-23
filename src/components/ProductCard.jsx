import React from 'react';

const ProductCard = ({ name, price, image }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
    <img src={image} alt={name} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-lg text-indigo-600 font-bold">₹{price}</p>
    </div>
  </div>
);

export default ProductCard;
