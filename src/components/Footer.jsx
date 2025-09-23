import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-24">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Company Info */}
        <div>
          <h4 className="text-xl font-bold mb-4">Aggarwal Computronix</h4>
          <p className="text-gray-400">
            A trusted wholesaler and retailer of computer hardware and accessories since 2009.
          </p>
        </div>
        {/* Contact Info */}
        <div>
          <h4 className="text-xl font-bold mb-4">Contact Info</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Email: anil@aggarwalcomputronix.com</li>
            <li>Phone: +91-9811051515</li>
            <li>Address: 305-A, 3rd Floor, Skylark Building, Nehru Place, New Delhi - 110019, India</li>
          </ul>
        </div>
        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><button onClick={() => window.location.hash = 'home'} className="hover:text-white transition-colors">Home</button></li>
            <li><button onClick={() => window.location.hash = 'products'} className="hover:text-white transition-colors">Products</button></li>
            <li><button onClick={() => window.location.hash = 'shopall'} className="hover:text-white transition-colors">Shop All</button></li>
            <li><button onClick={() => window.location.hash = 'contact'} className="hover:text-white transition-colors">Contact</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Aggarwal Computronix. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
