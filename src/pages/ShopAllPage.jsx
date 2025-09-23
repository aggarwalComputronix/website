import React from 'react';
import { DUMMY_SUPABASE_DATA } from '../mockSupabase';
import ProductCard from '../components/ProductCard';

const ShopAllPage = () => {
  const products = DUMMY_SUPABASE_DATA.products;
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">Shop All Products</h1>
      <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto mb-12">
        A complete catalog of all our available products.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} name={p.name} price={p.price} image={p.image} />
        ))}
      </div>
    </section>
  );
};

export default ShopAllPage;
