import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import TestimonialCard from '../components/TestimonialCard';
import ContactForm from '../components/ContactForm';

// Import all local images
import batteryImage from '/images/batteries.jpg';
import adaptersImage from '/images/Adapters1.webp';
import dockingImage from '/images/DockingStation.webp';
import locksImage from '/images/Locks.webp';
import headPhonesImage from '/images/headPhones.jpg';
import mouseImage from '/images/mouse1.webp';
import screenImage from '/images/screen.jpg';
import privacyImage from '/images/privacy.webp';
import standImage from '/images/stand.webp';
import bagImage from '/images/bag1.avif';
import webcamImage from '/images/webcam.avif';
import cableImage from '/images/cable.jpg';

// Define and EXPORT the categories array so ShopAllPage can import it
export const CATEGORIES = [
    { title: 'Batteries', image: batteryImage, collection: 'Batteries' },
    { title: 'Adapters', image: adaptersImage, collection: 'Adapters' },
    { title: 'Docking Station', image: dockingImage, collection: 'Docking Station' },
    { title: 'Locks', image: locksImage, collection: 'Locks' },
    { title: 'Headphones', image: headPhonesImage, collection: 'Headphones' },
    { title: 'Mouse', image: mouseImage, collection: 'Mouse' },
    { title: 'Screens', image: screenImage, collection: 'Screens' },
    { title: 'Privacy Filters', image: privacyImage, collection: 'Privacy Filters' },
    { title: 'Stands', image: standImage, collection: 'Stands' },
    { title: 'Bags', image: bagImage, collection: 'Bags' },
    { title: 'Webcams', image: webcamImage, collection: 'Webcams' },
    { title: 'Cables', image: cableImage, collection: 'Cables' },
];

// This component accepts setCurrentPage (renamed to navigate) from App.jsx
const HomePage = ({ setCurrentPage: navigate }) => { 
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef(null);

  // --- FETCHING REAL PRODUCTS FOR BEST SELLERS ---
  useEffect(() => {
    const fetchBestSellers = async () => {
        // Fetch top 4 products of ANY collection for 'Best Sellers' section
        const { data, error } = await supabase
            .from('products')
            .select('id, name, price, "productImageUrl", brand')
            .limit(4); 

        if (error) {
            console.error("Error fetching products:", error);
        } else {
            const mappedData = data.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                image: p.productImageUrl,
                brand: p.brand,
            }));
            setProducts(mappedData);
        }
    };
    fetchBestSellers();
  }, []);

  const handleSearch = () => {
    // --- SEARCH LOGIC ---
    setIsSearching(true);
    console.log(`Searching for: ${query}`);
    
    setTimeout(() => {
      setIsSearching(false);
      // Dummy search results message 
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl border border-gray-200 text-center';
      messageBox.innerHTML = `
        <h2 class="text-2xl font-bold mb-2 text-indigo-600">Search Results</h2>
        <p class="text-gray-700">Searching for products containing "${query}"...</p>
        <button onclick="this.parentNode.remove()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">OK</button>
      `;
      document.body.appendChild(messageBox);
    }, 1000);
  };

  const testimonials = [
    { quote: "The products are high quality and the prices are unbeatable. We're a customer for life!", author: "Suresh Gupta", company: "Tech Solutions Pvt. Ltd." },
    { quote: "Their team is incredibly responsive and helpful. It's a great experience buying from Aggarwal Computronix.", author: "Preeti Singh", company: "Digital Innovations" },
    { quote: "The wide selection of original and compatible parts makes them our first choice for all our hardware needs.", author: "Rajesh Kumar", company: "Local IT Repair Shop" },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section with Search and Categories */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-100 py-20 md:py-32 rounded-b-3xl">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Computer Hardware Solutions
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            The largest collection of original and compatible parts for your business needs.
          </p>
          <div className="relative max-w-3xl mx-auto flex items-center bg-white rounded-full shadow-lg p-2 mb-12">
            <input
              type="text"
              placeholder="Search for products, brands, or parts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3 pl-6 rounded-full focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-700 transition"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {/* Product Categories Section (Horizontal Scroll) */}
          <div className="mt-8 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}>
            <style>
              {`
                @keyframes scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }

                .animate-scroll {
                  animation: scroll 40s linear infinite;
                }
              `}
            </style>
            <div className="overflow-x-hidden whitespace-nowrap scrollbar-hide">
              <div
                className={`inline-flex space-x-6 pb-4 animate-scroll`}
                ref={scrollContainerRef}
                style={{ animationPlayState: isPaused ? 'paused' : 'running' }}>
                {/* We double the categories array to create a seamless loop */}
                {CATEGORIES.concat(CATEGORIES).map((cat, index) => (
                  <CategoryCard 
                    key={index} 
                    title={cat.title} 
                    image={cat.image} 
                    // Pass navigation logic to CategoryCard
                    onClick={() => navigate('products', cat.collection)} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Best Sellers</h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-500">Loading top products or no products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} name={p.name} price={p.price} image={p.image} brand={p.brand} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
            <img src="https://placehold.co/600x400/e5e7eb/555?text=Our+Warehouse" alt="Our Warehouse" className="w-full h-auto object-cover" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">About Aggarwal Computronix</h2>
            <p className="text-lg text-gray-600 mb-6">
              Founded in 2009, Aggarwal Computronix has established itself as a trusted name in the computer hardware industry. We are a leading authorized distributor and wholesaler of a wide range of authentic products, specializing in laptops, desktops, and essential computer components.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              With our headquarters in Nehru Place, Delhi, we have built a reputation for providing high-quality goods, competitive pricing, and reliable service. Our mission is to meet the demands of our clients, ensuring a positive experience and building long-term relationships based on trust and quality assurance.
            </p>
          </div>
        </div>
      </section>

      {/* What Clients Say Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <TestimonialCard key={index} quote={t.quote} author={t.author} company={t.company} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-center text-gray-600 mb-8">
            For any inquiries, wholesale orders, or product requests, please feel free to contact us.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
