import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton'; // Import the BackButton
import LoadingSpinner from '../components/LoadingSpinner'; // Import the LoadingSpinner

// Mapping table for common category variations in the database
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

const ProductsPage = ({ selectedCategory, setCurrentPage }) => {
  const [products, setProducts] = useState([]);
  const [uniqueBrands, setUniqueBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('products')
        .select('id, name, price, "productImageUrl", brand, collection');

      // --- 1. Filter by Category (Handling Mismatches) ---
      if (selectedCategory) {
        // Get the list of all possible names for this category 
        const categoryList = CATEGORY_MAPPINGS[selectedCategory] || [selectedCategory]; 
        
        // Use the .in() filter to check if the 'collection' is ANY of the names in the list
        query = query.in('collection', categoryList);
      }
      
      // --- 2. Filter by the selected Brand (optional) ---
      if (selectedBrand !== 'All') {
        query = query.eq('brand', selectedBrand);
      }

      const { data: productsData, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching products:", fetchError);
        setError("Failed to load products. Please check the database connection.");
        setProducts([]);
        setUniqueBrands([]);
      } else {
        // Map data to match ProductCard structure
        const mappedProducts = productsData.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.productImageUrl,
            brand: p.brand,
            collection: p.collection, 
        }));
        setProducts(mappedProducts);

        // Extract unique brands from the fetched data
        const brands = [...new Set(mappedProducts.map(p => p.brand).filter(b => b))];
        setUniqueBrands(brands);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand]); // Re-run fetch when category or brand changes

  const displayTitle = selectedCategory ? `${selectedCategory} Products` : "All Products";

  return (
    <section className="relative container mx-auto px-4 py-12 min-h-[60vh]">
      {/* Back Button positioned relative to this section */}
      <BackButton setCurrentPage={setCurrentPage} />
      
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4 pt-12 md:pt-0">
        {displayTitle}
      </h1>
      
      {/* Filter Bar */}
      <div className="mb-8 flex justify-center space-x-4">
        <label htmlFor="brand-filter" className="text-lg font-medium text-gray-700 self-center">Filter by Brand:</label>
        <select
          id="brand-filter"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          <option value="All">All Brands</option>
          {uniqueBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      {/* End Filter Bar */}

      {loading && (
        <LoadingSpinner text={`Loading ${selectedCategory ? selectedCategory : 'All'} products...`} />
      )}

      {error && (
        <div className="text-center py-10 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="text-center py-10 text-gray-500">
          <p>No products found matching the current filter settings.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} name={p.name} price={p.price} image={p.image} brand={p.brand} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductsPage;
