import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ShopAllPage from './pages/ShopAllPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginComponent from './pages/LoginComponent';
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (email) => {
    if (email === 'admin@aggarwal.com') {
      setIsAdmin(true);
      setCurrentPage('admin');
    } else {
      setIsAdmin(false);
      setCurrentPage('home');
    }
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (isAdmin && currentPage === 'admin') {
      return <AdminDashboard />;
    }
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'shopall':
        return <ShopAllPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginComponent onLogin={handleLogin} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-gray-50 font-sans antialiased text-gray-800">
      <Header
        setCurrentPage={setCurrentPage}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        handleLogout={handleLogout}
        showLogin={showLogin}
        setShowLogin={setShowLogin}
      />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
