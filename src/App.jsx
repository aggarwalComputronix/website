import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ShopAllPage from './pages/ShopAllPage';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import LoadingSpinner from './components/LoadingSpinner'; // Import the new component
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
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
          // When logging out, we return to home.
          navigateToPage('home'); 
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
    // Show LoadingSpinner during the initial auth check
    return <LoadingSpinner text="Connecting to Secure Services..." />; 
  }

  const renderPage = () => {
    
    // --- AUTHENTICATION AND PAGE ACCESS LOGIC ---

    // Scenario 1: User is NOT logged in AND is trying to access the Admin/Auth pages
    if (!session && (currentPage === 'admin' || currentPage === 'login' || currentPage === 'createprofile')) {
      return <AuthPage setCurrentPage={navigateToPage} />;
    }
    
    // Scenario 2: User IS logged in as admin
    if (isAdmin && currentPage === 'admin') {
      return <AdminDashboard setCurrentPage={navigateToPage} />;
    }
    
    // Scenario 3: All public pages (Home, Products, ShopAll)
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={navigateToPage} />; 
      case 'products':
        return <ProductsPage selectedCategory={selectedCategory} setCurrentPage={navigateToPage} />;
      case 'shopall':
        return <ShopAllPage searchTerm={searchTerm} setCurrentPage={navigateToPage} />;
      case 'admin':
      case 'login':
      case 'createprofile':
        // If logged in but not admin, or just coming off a failed auth attempt, redirect to home.
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
