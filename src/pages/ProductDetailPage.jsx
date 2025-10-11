import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetailPage = ({ productId, setCurrentPage }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setLoading(false);
        setError("Product ID is missing.");
        return;
      }
      
      // Fetch ALL fields for a single product based on its ID
      const { data, error } = await supabase
        .from('products')
        .select('*') // Select all columns to show full detail
        .eq('id', productId)
        .single(); // Expecting only one row

      if (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details. It may not exist.");
        setProduct(null);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProductDetails();
  }, [productId]); // Re-run fetch if the product ID changes

  if (loading) {
    return (
      <section className="relative container mx-auto px-4 py-16 min-h-[60vh]">
        <BackButton setCurrentPage={setCurrentPage} />
        <LoadingSpinner text="Fetching product details..." />
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="relative container mx-auto px-4 py-16 min-h-[60vh] text-center">
        <BackButton setCurrentPage={setCurrentPage} />
        <h1 className="text-4xl font-extrabold text-red-600 pt-12">Error</h1>
        <p className="text-xl text-gray-700">{error || "Product not found."}</p>
      </section>
    );
  }
  
  // --- Data Extraction and Cleanup for Display ---
  
  // Combine Part Numbers, Model Compatibility, and Technical Specs for display
  const compatibilityList = [
    { title: 'SKU (Product ID)', value: product.sku },
    { title: 'Ribbon', value: product.ribbon },
    { title: 'Option Name 1', value: product.productOptionName1 },
    { title: 'Option Description 1', value: product.productOptionDescription1 },
    { title: 'Option Name 2', value: product.productOptionName2 },
    { title: 'Option Description 2', value: product.productOptionDescription2 },
    { title: 'Additional Info 1', value: product.additionalInfoDescription1 },
  ].filter(item => item.value); // Only show rows with actual data

  // --- Display logic for the full product detail ---
  return (
    <section className="relative container mx-auto px-4 py-12">
      <BackButton setCurrentPage={setCurrentPage} />
      
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-xl mt-12 md:mt-0">
        
        {/* Product Title and Basic Info */}
        <div className="text-center mb-8 border-b pb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-indigo-500 rounded-full mb-2">
                {product.collection || 'Product'}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Brand: {product.brand || 'N/A'} | Field Type: {product.fieldType || 'N/A'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Image and Price/CTA */}
          <div className="lg:col-span-1 border-r pr-6">
            <img 
              src={product.productImageUrl || 'https://placehold.co/600x400/e5e7eb/555?text=Image+Missing'} 
              alt={product.name} 
              className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg mb-6 border" 
            />
            <div className="text-4xl font-bold text-indigo-600">
              ₹{product.price}
            </div>
            <p className="text-sm text-gray-500 mt-1">Surcharge: ₹{product.surcharge || '0.00'}</p>
            
            <button className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-md">
              Add to Quote
            </button>
            <p className="text-xs text-gray-400 mt-2">Inventory Status: {product.inventory === 99999 ? 'In Stock' : `${product.inventory} Units`}</p>
          </div>

          {/* RIGHT COLUMN: Description and Specs */}
          <div className="lg:col-span-2 pl-4 space-y-8">
            
            {/* Description Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Product Overview</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{product.description || 'No detailed description available.'}</p>
            </div>

            {/* Compatibility and Part Numbers Section */}
            {compatibilityList.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Compatibility & Specifications</h2>
                    <dl className="space-y-3">
                        {compatibilityList.map((item, index) => (
                             <div key={index} className="flex justify-between items-start text-sm border-b pb-1">
                                <dt className="font-semibold text-gray-700 w-1/3">{item.title}</dt>
                                <dd className="text-gray-600 w-2/3 text-right whitespace-pre-wrap">
                                    {item.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}
            
            {/* Additional Technical Details */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Technical Details</h2>
                <div className="grid grid-cols-2 text-sm gap-x-6 gap-y-3">
                    <div className="font-semibold text-gray-700">Cost:</div>
                    <div className="text-gray-600">₹{product.cost || 'N/A'}</div>
                    <div className="font-semibold text-gray-700">Weight:</div>
                    <div className="text-gray-600">{product.weight || 'N/A'} kg</div>
                    <div className="font-semibold text-gray-700">Visible on Site:</div>
                    <div className="text-gray-600">{product.visible ? 'Yes' : 'No'}</div>
                    <div className="font-semibold text-gray-700">Ribbon Type:</div>
                    <div className="text-gray-600">{product.ribbon || 'N/A'}</div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
