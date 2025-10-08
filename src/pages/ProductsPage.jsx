import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';

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
  const [localSearchTerm, setLocalSearchTerm] = useState(''); // NEW: Local search term state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('products')
        .select('id, name, price, "productImageUrl", brand, collection, sku');

      // 1. Filter by the initial Category (required)
      if (selectedCategory) {
        const categoryList = CATEGORY_MAPPINGS[selectedCategory] || [selectedCategory]; 
        query = query.in('collection', categoryList);
      }
      
      // 2. Filter by the selected Brand (optional - DB side)
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
        const mappedProducts = productsData.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.productImageUrl,
            brand: p.brand,
            collection: p.collection, 
            sku: p.sku, // Keep SKU for local filtering
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

  // --- CLIENT-SIDE SEARCH LOGIC ---
  const filteredAndSearchedProducts = products.filter(product => {
    if (!localSearchTerm) {
      return true; // Show all if no local search term is present
    }
    const searchLower = localSearchTerm.toLowerCase();
    
    // Search the name, SKU, and brand of the currently displayed products
    return product.name.toLowerCase().includes(searchLower) ||
           product.sku?.toLowerCase().includes(searchLower) ||
           product.brand?.toLowerCase().includes(searchLower);
  });

  const displayTitle = selectedCategory ? `${selectedCategory} Products` : "All Products";

  return (
    <section className="relative container mx-auto px-4 py-12 min-h-[60vh]">
      <BackButton setCurrentPage={setCurrentPage} />
      
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4 pt-12 md:pt-0">
        {displayTitle}
      </h1>
      
      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
        
        {/* Brand Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <label htmlFor="brand-filter" className="text-lg font-medium text-gray-700">Filter by Brand:</label>
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

        {/* Local Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder={`Search within ${selectedCategory || 'products'}...`}
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      {/* End Filter and Search Bar */}

      {loading && (
        <LoadingSpinner text={`Loading ${selectedCategory || 'products'}...`} />
      )}

      {error && (
        <div className="text-center py-10 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {!loading && filteredAndSearchedProducts.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>No products found matching the current search and filter settings.</p>
        </div>
      )}

      {!loading && filteredAndSearchedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredAndSearchedProducts.map(p => (
            <ProductCard key={p.id} name={p.name} price={p.price} image={p.image} brand={p.brand} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductsPage;