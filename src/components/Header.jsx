import React, { useState } from 'react';

// The component receives the unified navigation function: setCurrentPage
const Header = ({ setCurrentPage, isLoggedIn, isAdmin, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Note: navigateToPage is alias for setCurrentPage
  const navigateToPage = (page) => {
    // setCurrentPage is the function passed from App.jsx's navigateToPage
    setCurrentPage(page); 
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', page: 'home' },
    { name: 'Products', page: 'shopall' }, // Navigate to shopall for general product view
    { name: 'Shop All', page: 'shopall' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg backdrop-blur-sm bg-opacity-80 rounded-full">
      <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
        
        {/* Logo and Branding */}
        <div className="flex items-center space-x-6">
          <button onClick={() => navigateToPage('home')} className="flex items-center space-x-2">
            {/* Using image tag for logo */}
            <img src="/icons/logo.png" alt="Aggarwal Computronix Logo" className="h-8 w-8" />
            <span className="hidden sm:block text-2xl font-bold text-gray-900">Aggarwal Computronix</span>
            <span className="sm:hidden text-2xl font-bold text-gray-900">A. Computronix</span>
          </button>
          
          {/* Worldwide Delivery Icon and Text */}
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            {/* Using image tag for delivery icon */}
            <img src="/icons/deliver-truck.png" alt="Worldwide Delivery" className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Get</p>
              <p className="text-xs text-gray-600">Worldwide Delivery</p>
            </div>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="hidden md:flex flex-1 justify-end mr-8 space-x-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigateToPage(item.page)}
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 font-medium"
            >
              {item.name}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => navigateToPage('admin')}
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 font-medium"
            >
              Admin Dashboard
            </button>
          )}
        </nav>

        {/* Login/Profile Buttons (Out of Nav) */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              {/* FIXED: Added onClick handler to navigate to the 'login' page */}
              <button
                onClick={() => navigateToPage('login')} 
                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
              {/* FIXED: Added onClick handler to navigate to the 'createprofile' page */}
              <button 
                onClick={() => navigateToPage('createprofile')} 
                className="hidden md:block bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md hover:bg-gray-300 transition-colors"
              >
                Create Profile
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-indigo-600 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-inner pt-2 pb-4">
          <nav className="flex flex-col space-y-2 px-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigateToPage(item.page)}
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-left"
              >
                {item.name}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => navigateToPage('admin')}
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-left"
              >
                Admin Dashboard
              </button>
            )}
            {!isLoggedIn && (
              <>
                {/* FIXED: Added onClick handlers to mobile menu buttons */}
                <button
                  onClick={() => navigateToPage('login')}
                  className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => navigateToPage('createprofile')}
                  className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-left"
                >
                  Create Profile
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
