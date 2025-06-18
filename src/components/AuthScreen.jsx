import React, { useState } from 'react';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

const AuthScreen = ({ onUserLogin }) => {
  const [authMode, setAuthMode] = useState('login'); 
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        const response = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authData)
        });

        if (response.ok) {
          const userData = await response.json();
          onUserLogin(userData);
          setAuthData({ email: '', password: '', first_name: '', last_name: '' });
        } else {
          const error = await response.json();
          setAuthError(error.error || 'Registration failed');
        }
      } else {
        const response = await fetch(`${API_BASE}/users`);
        const users = await response.json();
        
        const user = users.find(u => 
          u.email === authData.email && u.password === authData.password
        );

        if (user) {
          onUserLogin(user);
          setAuthData({ email: '', password: '', first_name: '', last_name: '' });
        } else {
          setAuthError('Invalid email or password');
        }
      }
    } catch (error) {
      setAuthError('Network error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Logo + Heading */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Reviews & Rating</h1>
            <p className="text-sm text-gray-600 mt-2">
              {authMode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4 text-sm">
            <input
              type="email"
              placeholder="Email"
              value={authData.email}
              onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={authData.password}
                onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {authMode === 'signup' && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  value={authData.first_name}
                  onChange={(e) => setAuthData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={authData.last_name}
                  onChange={(e) => setAuthData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-lg bg-blue-600 text-grey-100 font-medium hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {authLoading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                setAuthError('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {authMode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
