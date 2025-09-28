import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from './HomePage'; // Import the category list

const ShopAllPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All'); // State for category filter

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('products')
        .select('id, name, price, "productImageUrl", brand');

      // Apply category filter if one is selected (not 'All')
      if (selectedFilter !== 'All') {
        // Filter by the 'collection' column in the database
        query = query.eq('collection', selectedFilter); 
      }
      
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching all products:", error);
        setError("Failed to load all products. Please check the database connection.");
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
  }, [selectedFilter]); // Re-run the fetch whenever the filter changes

  return (
    <section className="container mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">
        Shop All Products
      </h1>

      {/* Filter Bar */}
      <div className="mb-8 flex justify-center space-x-4">
        <label htmlFor="category-filter" className="text-lg font-medium text-gray-700 self-center">Filter by Category:</label>
        <select
          id="category-filter"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.title} value={cat.collection}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>
      {/* End Filter Bar */}

      {loading && (
        <div className="text-center py-10">
          <p className="text-indigo-600 font-semibold">Loading all inventory...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="text-center py-10 text-gray-500">
          <p>No products available matching the current filter.</p>
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
