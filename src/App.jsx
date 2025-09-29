import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ShopAllPage from './pages/ShopAllPage';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null); // NEW: State to store global search term
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Custom navigation function: navigateToPage(page, categoryName, searchTerm)
  const navigateToPage = (page, categoryName = null, query = null) => {
    // 1. Reset category and search term on any navigation unless explicitly set
    setSelectedCategory(categoryName); 
    setSearchTerm(query); 
    
    // 2. Set the current page
    setCurrentPage(page);
  };

  // Function to fetch user's role from the profiles table
  const checkAdminStatus = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching admin status:', error);
      setIsAdmin(false);
    }
    
    if (data && data.role === 'admin') {
      setIsAdmin(true);
      if (currentPage === 'admin') navigateToPage('admin');
    } else {
      setIsAdmin(false);
      if (currentPage === 'admin') navigateToPage('home');
    }
  };
  
  useEffect(() => {
    // 1. Initial check on app load
    const initialLoad = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await checkAdminStatus(session.user.id);
      }
      setLoading(false);
    };

    // 2. Listener for auth state changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
          navigateToPage('home'); // Redirect to home on logout
        }
      }
    );

    initialLoad();
    
    // Cleanup the listener when the component unmounts
    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigateToPage('home');
    } else {
      alert('Logout failed: ' + error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-4xl font-extrabold text-indigo-600">Loading Application...</div>;
  }

  const renderPage = () => {
    if (!session) {
      return <AuthPage />;
    }
    if (isAdmin && currentPage === 'admin') {
      return <AdminDashboard />;
    }
    
    switch (currentPage) {
      case 'home':
        // Pass the new navigation function to HomePage
        return <HomePage setCurrentPage={navigateToPage} />; 
      case 'products':
        // Pass the selectedCategory to the ProductsPage for filtering
        return <ProductsPage selectedCategory={selectedCategory} />;
      case 'shopall':
        // Pass the search term to the ShopAllPage for search filtering
        return <ShopAllPage searchTerm={searchTerm} />;
      case 'admin':
        // Non-admin user trying to view admin page is redirected (via checkAdminStatus)
        return <HomePage setCurrentPage={navigateToPage} />;
      default:
        return <HomePage setCurrentPage={navigateToPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        setCurrentPage={navigateToPage}
        isLoggedIn={!!session}
        isAdmin={isAdmin}
        handleLogout={handleLogout}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
