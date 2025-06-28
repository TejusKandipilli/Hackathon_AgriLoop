import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      
      // Store user role if provided by the API
      if (data.user && data.user.role) {
        localStorage.setItem('userRole', data.user.role);
      }

      toast.success("Welcome back! You've successfully logged in to AgriLoop.", {
        position: 'top-center',
      });

      // Navigate based on user role
      if (data.user && data.user.role === 'Seller') {
        navigate('/seller');
      } else if (data.user && data.user.role === 'Buyer') {
        navigate('/buyer');
      } else {
        // Default fallback if role is not specified or unknown
        navigate('/profile');
      }
    } else {
      toast.error(data.message || 'Invalid email or password.', {
        position: 'top-center',
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Network error. Please try again.', {
      position: 'top-center',
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-yellow-50 p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-yellow-200 rounded-full opacity-15"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-yellow-200 rounded-full opacity-25"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 group">
            <div className="p-3 bg-green-500 rounded-2xl group-hover:bg-green-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-white" viewBox="0 0 24 24">
                <path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20"></path>
                <path d="M16 18h-5"></path>
                <path d="M18 5a1 1 0 0 0-1 1v5.573"></path>
                <path d="M3 4h8.129a1 1 0 0 1 .99.863L13 11.246"></path>
                <path d="M4 11V4"></path>
                <path d="M7 15h.01"></path>
                <path d="M8 10.1V4"></path>
                <circle cx="18" cy="18" r="2"></circle>
                <circle cx="7" cy="15" r="5"></circle>
              </svg>
            </div>
            <div className="text-left">
              <span onClick={() => navigate('/')} className="text-2xl font-bold text-green-700 cursor-pointer">AgriLoop</span>
              <p className="text-sm text-yellow-600 -mt-1">Organic Waste Marketplace</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl">
          <div className="text-center pb-6 p-6">
            <h1 className="text-3xl font-bold text-yellow-800">Welcome Back</h1>
            <p className="text-yellow-600 text-base">Sign in to your AgriLoop account</p>
          </div>

          <div className="p-6 pt-0">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-yellow-700 font-medium block">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 w-full border border-yellow-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-md px-3 py-2 outline-none transition-colors"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-yellow-700 font-medium block">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 w-full border border-yellow-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-md px-3 py-2 outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <a href="#forgot-password" className="text-sm text-green-600 hover:text-green-700 hover:underline">Forgot password?</a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Redirect to Signup */}
            <div className="mt-6 text-center">
              <p className="text-yellow-600 text-sm sm:text-base">
                Don&apos;t have an account?{' '}
                <span
                  onClick={() => navigate('/signup')}
                  role="button"
                  tabIndex={0}
                  className="text-green-600 hover:text-green-700 font-semibold underline cursor-pointer"
                >
                  Join AgriLoop
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Terms Note */}
        <div className="text-center mt-6">
          <p className="text-sm text-yellow-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Login;
