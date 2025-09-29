import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from './HomePage'; // Import the category list

// This component now receives the search term from App.jsx
const ShopAllPage = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Initialize category filter based on whether a search term is present
  const [selectedFilter, setSelectedFilter] = useState('All'); 
  const [currentQuery, setCurrentQuery] = useState(searchTerm || '');

  useEffect(() => {
    // If a search term is passed from the homepage, use it as the current query
    if (searchTerm) {
        setCurrentQuery(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('products')
        .select('id, name, price, "productImageUrl", brand');

      // 1. Apply CATEGORY filter if one is selected (from the dropdown)
      if (selectedFilter !== 'All') {
        query = query.eq('collection', selectedFilter); 
      }
      
      // 2. Apply SEARCH TERM filter if present (from the homepage search bar)
      if (currentQuery) {
        // Use an OR condition to search both name and brand columns
        query = query.or(`name.ilike.%${currentQuery}%,brand.ilike.%${currentQuery}%`);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching all products:", error);
        setError("Failed to load products. Please check the database connection.");
        setProducts([]);
      } else {
        // Map data to match ProductCard structure
        const mappedData = data.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.productImageUrl,
            brand: p.brand,
        }));
        setProducts(mappedData);
      }
      setLoading(false);
    };

    fetchAllProducts();
  }, [selectedFilter, currentQuery]); // Re-run the fetch whenever either filter changes

  const displayTitle = currentQuery 
    ? `Search Results for "${currentQuery}"` 
    : "Shop All Products";

  return (
    <section className="container mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">
        {displayTitle}
      </h1>
      
      {/* Filter Bar */}
      <div className="mb-8 flex justify-center items-center space-x-4 flex-wrap">
        {/* Category Filter Dropdown */}
        <div className="flex items-center space-x-2 my-2">
            <label htmlFor="category-filter" className="text-lg font-medium text-gray-700">Filter by Category:</label>
            <select
                id="category-filter"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                    // We use the collection name as the value for filtering
                    <option key={cat.title} value={cat.collection}>
                        {cat.title}
                    </option>
                ))}
            </select>
        </div>

        {/* Dynamic Search Input (allows user to change the query) */}
        <div className="flex items-center space-x-2 my-2 w-full max-w-sm">
            <input
                type="text"
                placeholder="Refine search..."
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
      </div>
      {/* End Filter Bar */}

      {loading && (
        <div className="text-center py-10">
          <p className="text-indigo-600 font-semibold">Loading results...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="text-center py-10 text-gray-500">
          <p>No products available matching the current search and category filters.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} name={p.name} price={p.price} image={p.image} brand={p.brand} />
        ))}
      </div>
    </section>
  );
};

export default ShopAllPage;
