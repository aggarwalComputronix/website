export const DUMMY_SUPABASE_DATA = {
  products: [
    { id: 1, name: 'Dell XPS 13', category: 'Laptops', type: 'original', price: 89999, description: 'Sleek and powerful laptop for professionals.', image: 'https://placehold.co/400x300/e5e7eb/555?text=Dell+XPS+13' },
    { id: 2, name: 'HP Pavilion Gaming PC', category: 'Desktops', type: 'original', price: 75500, description: 'High-performance gaming desktop.', image: 'https://placehold.co/400x300/e5e7eb/555?text=HP+Gaming+PC' },
    { id: 3, name: 'Logitech Wireless Mouse', category: 'Accessories', type: 'compatible', price: 1250, description: 'Ergonomic wireless mouse.', image: 'https://placehold.co/400x300/e5e7eb/555?text=Logitech+Mouse' },
    { id: 4, name: 'Samsung 27" Monitor', category: 'Monitors', type: 'original', price: 18000, description: 'Vivid QHD display.', image: 'https://placehold.co/400x300/e5e7eb/555?text=Samsung+Monitor' },
    { id: 5, name: 'HP 510 4-Cell Battery', category: 'Batteries', type: 'compatible', price: 950, description: 'Compatible battery for HP 510.', image: 'https://placehold.co/400x300/e5e7eb/555?text=HP+Battery' },
    { id: 6, name: 'Dell Universal Dock', category: 'Accessories', type: 'original', price: 13000, description: 'A single dock for all your devices.', image: 'https://placehold.co/400x300/e5e7eb/555?text=Dell+Dock' },
    { id: 7, name: 'Apple 20W Power Adapter', category: 'Adapters', type: 'original', price: 1500, description: 'Fast charging adapter.', image: 'https://placehold.co/400x300/e5e7eb/555?text=Apple+Adapter' },
    { id: 8, name: 'Seagate 1TB External Drive', category: 'Storage', type: 'original', price: 4500, description: 'Portable and reliable storage.', image: 'https://placehold.co/400x300/e5e7eb/555?text=External+Drive' },
  ],
};

export const supabase = {
  auth: {
    signInWithPassword: () => new Promise(resolve => setTimeout(() => resolve({ user: { email: 'admin' } }), 500)),
  },
  from: (table) => ({
    select: () => new Promise(resolve => setTimeout(() => resolve({ data: DUMMY_SUPABASE_DATA[table] }), 500)),
  }),
};
