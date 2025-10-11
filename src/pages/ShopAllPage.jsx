import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { CATEGORIES } from './HomePage';

// We REMOVE the normalizeInput helper function entirely, relying solely on SQL ILIKE.

// Mapping table for common category variations (Same as ProductsPage)
const CATEGORY_MAPPINGS = {
  'Batteries': ['Batteries', 'Laptop Battery', 'Battery'],
  'Adapters': ['Adapters', 'Laptop Adapter', 'Adapter'],
  'Docking Station': ['Docking Station', 'DockingStation'],
  'Locks': ['Locks', 'Cable Lock'],
  'Headphones': ['Headphones', 'Headset'],
  'Mouse': ['Mouse', 'Computer Mouse'],
  'Screens': ['Screens', 'All In One Screens', 'Laptop Screen'],
  'Privacy Filters': ['Privacy Filters', 'Privacy Filter'],
  'Stands': ['Stands', 'Laptop Stand'],
  'Bags': ['Bags', 'Laptop Bag'],
  'Webcams': ['Webcams', 'Webcam'],
  'Cables': ['Cables', 'Cable'],
};


const ShopAllPage = ({ searchTerm, setCurrentPage }) => {
  // We fetch a raw product list and keep the search query local
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
      
      // Select ALL necessary fields, minimizing data transfer from the server
      let query = supabase
        .from('products')
        .select(`
            id, name, price, "productImageUrl", brand, 
            sku, description, "productOptionDescription1"
        `);

      // 1. Apply CATEGORY filter using the OR/IN logic for data robustness
      if (selectedFilter !== 'All') {
        const categoryList = CATEGORY_MAPPINGS[selectedFilter] || [selectedFilter];
        query = query.in('collection', categoryList);
      }
      
      // 2. Apply FINAL SERVER-SIDE ORDER/CASE-AGNOSTIC SEARCH
      if (currentQuery) {
        // Split the user's query into individual, space-separated search terms
        const searchTerms = currentQuery.trim().toLowerCase().split(/\s+/).filter(t => t.length > 0);
        
        // --- KEY FIX: Construct a separate ILIKE filter for *EACH* term ---
        if (searchTerms.length > 0) {
            // Start with an empty filter array
            let finalAndFilters = [];

            searchTerms.forEach(term => {
                // For each term (e.g., "65w"), we create a query string that checks if that term 
                // is present in ANY of the critical columns.
                const termFilter = 
                    `name.ilike.%${term}%,` +
                    `brand.ilike.%${term}%,` +
                    `sku.ilike.%${term}%,` +
                    `description.ilike.%${term}%`;
                
                // We add this OR filter to our array. 
                // The final query uses .and() to ensure ALL terms are found.
                finalAndFilters.push(termFilter);
            });

            // The .and() wrapper guarantees that results must match Term1 OR Term2 OR...
            // Note: The structure needs to be `and(or(term1 checks), or(term2 checks))`
            
            // To simplify and ensure the query runs: we'll run a base filter on the OR-ed string.
            // THIS IS THE FINAL BRUTE-FORCE ILIKE IMPLEMENTATION.
            const queryParts = searchTerms.map(term => {
                return `name.ilike.%${term}% | brand.ilike.%${term}% | sku.ilike.%${term}% | description.ilike.%${term}%`;
            }).join(' & '); // Join with AND (&) operator

            if (queryParts) {
                 query = query.filter(queryParts);
            }
        }
      }
      
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching all products:", error);
        setError("Failed to load products. Please check the database connection.");
        setProducts([]);
      } else {
        // Store all fetched data locally
        const mappedData = data.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.productImageUrl,
            brand: p.brand,
            sku: p.sku, 
            description: p.description,
            optionDesc1: p.productOptionDescription1,
        }));
        setProducts(mappedData);
      }
      setLoading(false);
    };

    // Re-fetch from DB only when the category filter changes
    fetchAllProducts();
  }, [selectedFilter, currentQuery]); 


  // *** CLIENT-SIDE POST-FILTERING (Final Guarantee) ***
  // Perform a final, strict client-side check to guarantee all terms are present
  const finalFilteredProducts = products.filter(product => {
    if (!currentQuery) return true;

    // Split the user's query into individual words for matching
    const searchTerms = currentQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    
    // Create one searchable string from the product data
    const productDataString = [
        product.name, 
        product.brand, 
        product.sku, 
        product.description,
    ].join(' ').toLowerCase();
    
    // This returns TRUE only if EVERY single search term is found in the combined product string.
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