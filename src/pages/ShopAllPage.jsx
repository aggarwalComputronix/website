import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { CATEGORIES } from './HomePage';

// Helper function for deep data cleaning and normalization (MUST match the SQL function)
const normalizeInput = (str) => {
    if (!str) return '';
    // Removes spaces, hyphens, slashes, commas, and converts to lowercase
    return String(str).toLowerCase().replace(/[\s\-\/\,]/g, '');
};

// This component now receives the search term and navigation function from App.jsx
const ShopAllPage = ({ searchTerm, setCurrentPage }) => {
  // We fetch a raw product list and keep the search query local
  const [rawProducts, setRawProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All'); 
  const [currentQuery, setCurrentQuery] = useState(searchTerm || '');

  useEffect(() => {
    if (searchTerm) {
        setCurrentQuery(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      
      // 1. Fetch only by Category (Database side - reliable)
      let query = supabase
        .from('products')
        .select(`
            id, name, price, "productImageUrl", brand, 
            -- Fetch all columns needed for the client-side search logic
            sku, description, "productOptionDescription1", "normalized_search"
        `);

      if (selectedFilter !== 'All') {
        query = query.eq('collection', selectedFilter); 
      }
      
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching all products:", error);
        setError("Failed to load products. Please check the database connection.");
        setRawProducts([]);
      } else {
        // Store all fetched data locally
        setRawProducts(data);
      }
      setLoading(false);
    };

    // Re-fetch from DB only when the category filter changes
    fetchAllProducts();
  }, [selectedFilter]); 


  // *** FINAL: CLIENT-SIDE SEARCH FILTERING (Order- and Case-Agnostic) ***
  const finalFilteredProducts = rawProducts.filter(product => {
    if (!currentQuery) {
        return true; // If no search term, show everything fetched.
    }
    
    // 1. Normalize the user's search query (e.g., "65W Dell" -> "65wdell")
    const normalizedQuery = normalizeInput(currentQuery);
    
    // 2. Use the database's pre-cleaned column (normalized_search) for matching.
    // This column is guaranteed to contain "65wdell" if both words are present.
    const normalizedProductData = product.normalized_search;

    // Check if the product's cleaned data string CONTAINS the entire normalized query string.
    return normalizedProductData && normalizedProductData.includes(normalizedQuery);
  });


  const displayTitle = currentQuery 
    ? `Search Results for "${currentQuery}"` 
    : "Shop All Products";

  return (
    <section className="relative container mx-auto px-4 py-12 min-h-[60vh]">
      {/* Back Button positioned relative to this section */}
      <BackButton setCurrentPage={setCurrentPage} /> 
      
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4 pt-12 md:pt-0">
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
        <LoadingSpinner text="Searching Inventory..." />
      )}

      {error && (
        <div className="text-center py-10 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {!loading && finalFilteredProducts.length === 0 && !error && (
        <div className="text-center py-10 text-gray-500">
          <p>No products available matching the current search and category filters.</p>
        </div>
      )}

      {!loading && finalFilteredProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {finalFilteredProducts.map(p => (
              <ProductCard key={p.id} name={p.name} price={p.price} image={p.productImageUrl} brand={p.brand} />
            ))}
        </div>
      )}
    </section>
  );
};

export default ShopAllPage;