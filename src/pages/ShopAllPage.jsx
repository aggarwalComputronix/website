import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { CATEGORIES } from './HomePage';

// This component now receives the search term and navigation function from App.jsx
const ShopAllPage = ({ searchTerm, setCurrentPage }) => {
  const [products, setProducts] = useState([]); 
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
      
      let query = supabase
        .from('products')
        .select('id, name, price, "productImageUrl", brand, sku, description, "productOptionDescription1"');

      // 1. Apply CATEGORY filter if one is selected (from the dropdown)
      if (selectedFilter !== 'All') {
        query = query.eq('collection', selectedFilter); 
      }
      
      // 2. Apply Full Compatibility Search (Final Brute-Force ILIKE)
      if (currentQuery) {
        const searchString = currentQuery.trim().toLowerCase();
        
        // Split terms and join with '%' wildcard for maximum fragmentation matching
        // Example: "65w dell" becomes "%65w%dell%"
        const fragmentedQuery = `%${searchString.replace(/\s+/g, '%')}%`;
        
        // Construct the full ILIKE OR filter string
        const combinedIlikeQuery = `
          name.ilike.${fragmentedQuery} | 
          brand.ilike.${fragmentedQuery} | 
          sku.ilike.${fragmentedQuery} | 
          description.ilike.${fragmentedQuery} | 
          "productOptionDescription1".ilike.${fragmentedQuery} 
        `;
        
        // Use the .or() method to ensure we find a match in ANY of the fields.
        query = query.or(combinedIlikeQuery);
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
            sku: p.sku, // Keep relevant fields
            description: p.description,
            optionDesc1: p.productOptionDescription1,
        }));
        setProducts(mappedData);
      }
      setLoading(false);
    };

    fetchAllProducts();
  }, [selectedFilter, currentQuery]); // Re-run the fetch whenever either filter changes


  // --- CLIENT-SIDE FILTERING (Fallback: Remove products that were not matched by the search criteria) ---
  const finalFilteredProducts = products.filter(product => {
      if (!currentQuery) return true;
      
      // 1. Check if the product's primary data contains ALL search terms
      const searchTerms = currentQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0);
      const productDataString = [
          product.name, 
          product.brand, 
          product.sku, 
          product.description,
          product.optionDesc1,
      ].join(' ').toLowerCase();

      return searchTerms.every(term => productDataString.includes(term));
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