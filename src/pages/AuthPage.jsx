import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import BackButton from '../components/BackButton'; // Import the BackButton

const AuthPage = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // State for inline messages

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    
    // Supabase sign-in call
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    setLoading(false);

    if (error) {
      setMessage({ type: 'error', text: `Login failed: ${error.message}` });
    } else {
      // SUCCESS: App.jsx's onAuthStateChange listener handles navigation automatically.
      // Show temporary success message while redirect occurs
      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      // No manual redirect needed here. App.jsx handles it via the session change.
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({ email, password });
    
    setLoading(false);
    
    if (error) {
      setMessage({ type: 'error', text: `Sign up failed: ${error.message}` });
    } else {
      // Show success message and switch to login view, prompting email confirmation
      setMessage({ type: 'success', text: 'Sign up successful! Please check your email to confirm your account.' });
      setView('login');
    }
  };

  const submitButtonText = loading 
    ? (view === 'login' ? 'Signing In...' : 'Signing Up...')
    : (view === 'login' ? 'Sign In' : 'Sign Up');

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="absolute top-8 left-8">
        <BackButton setCurrentPage={setCurrentPage} />
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          {view === 'login' ? 'Login' : 'Create Profile'}
        </h2>
        
        {/* Dynamic Message Box */}
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-center ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={view === 'login' ? handleLogin : handleSignUp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
          >
            {submitButtonText}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
            className="text-indigo-600 hover:underline text-sm"
          >
            {view === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
