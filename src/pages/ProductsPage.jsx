import React from 'react';
import { DUMMY_SUPABASE_DATA } from '../mockSupabase';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const originalProducts = DUMMY_SUPABASE_DATA.products.filter(p => p.type === 'original');
  const compatibleProducts = DUMMY_SUPABASE_DATA.products.filter(p => p.type === 'compatible');

  return (
    <section className="container mx-auto px-4 py-16 space-y-16">
      <div>
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">Original Products</h1>
        <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Browse our collection of authentic products directly from the brand.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {originalProducts.map((product) => (
            <ProductCard key={product.id} name={product.name} price={product.price} image={product.image} />
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">Compatible Products</h1>
        <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto mb-12">
          High-quality, reliable, and cost-effective alternatives.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {compatibleProducts.map((product) => (
            <ProductCard key={product.id} name={product.name} price={product.price} image={product.image} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
