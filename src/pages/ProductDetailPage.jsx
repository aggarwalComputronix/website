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
        setError("Product ID is missing. Please select a product from the list.");
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
        setError("Failed to load product details. It may not exist or the ID is invalid.");
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

  // Helper component to display a single spec row
  const SpecRow = ({ label, value, unit = '' }) => (
    <li className="flex justify-between border-b border-gray-200 py-2">
        <span className="font-medium text-gray-700">{label}:</span>
        <span className="text-gray-800 font-semibold">{value || 'N/A'} {unit}</span>
    </li>
  );

  // --- Display logic for the full product detail ---
  return (
    <section className="relative container mx-auto px-4 py-12">
      <div className="absolute top-8 left-4 md:left-12 z-10">
        <BackButton setCurrentPage={setCurrentPage} />
      </div>
      
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-2xl mt-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
        <p className="text-lg text-indigo-600 font-semibold mb-6">₹{product.price}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1: Image & Call to Action */}
          <div className="md:col-span-1">
            <img 
              src={product.productImageUrl || 'https://placehold.co/600x400/e5e7eb/555?text=Product+Image+Missing'} 
              alt={product.name} 
              className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg mb-6 border p-2" 
            />
            
            <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-md text-lg">
              Add to Quote
            </button>
            <p className="text-sm text-center text-gray-500 mt-2">SKU: {product.sku || 'N/A'}</p>
          </div>

          {/* Column 2: Overview & Description */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Overview</h2>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {product.description || 'No detailed description available.'}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 pt-4">Key Specifications</h2>
            <ul className="text-gray-600 space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
              <SpecRow label="Brand" value={product.brand} />
              <SpecRow label="Collection" value={product.collection} />
              <SpecRow label="Product Type" value={product.fieldType} />
              <SpecRow label="Inventory Status" value={product.inventory === 99999 ? 'High/In Stock' : product.inventory || 'N/A'} />
              <SpecRow label="Weight" value={product.weight} unit="kg" />
              <SpecRow label="Visible on Site" value={product.visible ? 'Yes' : 'No'} />
            </ul>
          </div>
        </div>

        {/* Full Excel Data Grid (Additional Info Tabs) */}
        <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Product Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                
                {/* Product Options (Options 1-3) */}
                <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                    <h3 className="font-bold text-blue-800 mb-2">Product Options (SKU Variants)</h3>
                    <SpecRow label="Name 1" value={product.productOptionName1} />
                    <SpecRow label="Type 1" value={product.productOptionType1} />
                    <SpecRow label="Desc 1" value={product.productOptionDescription1} />
                    
                    <SpecRow label="Name 2" value={product.productOptionName2} />
                    <SpecRow label="Type 2" value={product.productOptionType2} />
                    <SpecRow label="Desc 2" value={product.productOptionDescription2} />
                </div>
                
                {/* Pricing & Discounts */}
                <div className="bg-green-50 p-4 rounded-lg shadow-inner">
                    <h3 className="font-bold text-green-800 mb-2">Pricing & Fulfillment</h3>
                    <SpecRow label="Cost (Internal)" value={`₹${product.cost || '0.00'}`} />
                    <SpecRow label="Surcharge" value={`₹${product.surcharge || '0.00'}`} />
                    <SpecRow label="Discount Mode" value={product.discountMode} />
                    <SpecRow label="Discount Value" value={product.discountValue} />
                </div>

                 {/* Custom Fields & Info Titles */}
                <div className="bg-yellow-50 p-4 rounded-lg shadow-inner">
                    <h3 className="font-bold text-yellow-800 mb-2">Custom & Mandatory Fields</h3>
                    <SpecRow label="Custom Field 1" value={product.customTextField1} />
                    <SpecRow label="Char Limit 1" value={product.customTextCharLimit1} />
                    <SpecRow label="Mandatory 1" value={product.customTextMandatory1 ? 'Yes' : 'No'} />
                    <SpecRow label="Custom Field 2" value={product.customTextField2} />
                    <SpecRow label="Char Limit 2" value={product.customTextCharLimit2} />
                    <SpecRow label="Mandatory 2" value={product.customTextMandatory2 ? 'Yes' : 'No'} />
                </div>
            </div>

            {/* Additional Info Block (Titles 1-3) */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Additional Information</h3>
                {(product.additionalInfoTitle1 || product.additionalInfoDescription1) && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold">{product.additionalInfoTitle1 || 'Section 1'}</h4>
                        <p className="text-gray-600 text-sm">{product.additionalInfoDescription1 || 'No description.'}</p>
                    </div>
                )}
                 {(product.additionalInfoTitle2 || product.additionalInfoDescription2) && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold">{product.additionalInfoTitle2 || 'Section 2'}</h4>
                        <p className="text-gray-600 text-sm">{product.additionalInfoDescription2 || 'No description.'}</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
