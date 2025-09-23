import React from 'react';

const TestimonialCard = ({ quote, author, company }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 border border-gray-200">
    <p className="text-gray-700 italic mb-4">"{quote}"</p>
    <div className="text-right">
      <p className="font-semibold text-gray-800">- {author}</p>
      <p className="text-sm text-gray-500">{company}</p>
    </div>
  </div>
);

export default TestimonialCard;
