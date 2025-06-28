import React, { useState } from 'react';

// Improved signup function with better error handling
const signupUser = async (formData) => {
  try {
    const payload = {
      username: formData.username,
      full_name: formData.fullName,
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
      date_of_birth: formData.dateOfBirth,
      city: formData.city,
      role: formData.role
    };

    console.log('Signup payload:', payload);
    
    const response = await fetch('https://hackathon-agriloop.onrender.com/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    // Get response text first to see what's actually returned
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error('Server returned invalid JSON response');
    }

    if (!response.ok) {
      console.error('Server error response:', data);
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    console.log('Success response:', data);

    return {
      success: true,
      data: data,
      message: data.message || 'Account created successfully!'
    };

  } catch (error) {
    console.error('Signup error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    let errorMsg = error.message || 'An error occurred during signup. Please try again.';

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMsg = 'Network error. Please check your internet connection and try again.';
    } else if (error.message.includes('CORS')) {
      errorMsg = 'CORS error. Please contact support.';
    }

    return {
      success: false,
      error: errorMsg
    };
  }
};

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    city: "",
    role: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const indianCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad",
    "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
    "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
    "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setDebugInfo('Starting signup process...');
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.username || !formData.fullName || !formData.email || !formData.password || 
        !formData.confirmPassword || !formData.gender || !formData.dateOfBirth || 
        !formData.city || !formData.role) {
      const missingFields = [];
      if (!formData.username) missingFields.push('username');
      if (!formData.fullName) missingFields.push('fullName');
      if (!formData.email) missingFields.push('email');
      if (!formData.password) missingFields.push('password');
      if (!formData.confirmPassword) missingFields.push('confirmPassword');
      if (!formData.gender) missingFields.push('gender');
      if (!formData.dateOfBirth) missingFields.push('dateOfBirth');
      if (!formData.city) missingFields.push('city');
      if (!formData.role) missingFields.push('role');
      
      const errorMsg = `Please fill in all required fields. Missing: ${missingFields.join(', ')}`;
      setError(errorMsg);
      setDebugInfo(errorMsg);
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      const errorMsg = "Invalid email format";
      setError(errorMsg);
      setDebugInfo(errorMsg);
      setIsLoading(false);
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      const errorMsg = "Password must be at least 6 characters long";
      setError(errorMsg);
      setDebugInfo(errorMsg);
      setIsLoading(false);
      return;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Passwords don't match";
      setError(errorMsg);
      setDebugInfo(errorMsg);
      setIsLoading(false);
      return;
    }

    // Age validation
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (age < 13 || (age === 13 && monthDiff < 0)) {
      const errorMsg = "You must be at least 13 years old to register";
      setError(errorMsg);
      setDebugInfo(errorMsg);
      setIsLoading(false);
      return;
    }

    setDebugInfo('Validation passed, calling API...');

    try {
      const result = await signupUser(formData);
      
      if (result.success) {
        setSuccess(result.message);
        setDebugInfo('Signup successful! Check console for details.');
        
        // Reset form on success
        setFormData({
          username: "",
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          gender: "",
          dateOfBirth: "",
          city: "",
          role: ""
        });
        
      } else {
        setError(result.error);
        setDebugInfo(`Signup failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = `Unexpected error: ${error.message}`;
      setError(errorMsg);
      setDebugInfo(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-yellow-50 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-yellow-200 rounded-full opacity-15"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-yellow-200 rounded-full opacity-25"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 group">
            <div className="p-3 bg-green-500 rounded-2xl group-hover:bg-green-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
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
              <span className="text-2xl font-bold text-green-700 cursor-pointer">AgriLoop</span>
              <p className="text-sm text-yellow-600 -mt-1">Organic Waste Marketplace</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800"><strong>Success:</strong> {success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800"><strong>Error:</strong> {error}</p>
          </div>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800"><strong>Debug:</strong> {debugInfo}</p>
          </div>
        )}

        <div className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl">
          {/* Header */}
          <div className="text-center pb-6 p-6">
            <h1 className="text-3xl font-bold text-yellow-800">Join AgriLoop</h1>
            <p className="text-yellow-600 text-base">Create your account and start turning waste into wealth</p>
          </div>
          
          {/* Form */}
          <div className="p-6 pt-0">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-yellow-700 font-medium block">Username</label>
                  <input
                    id="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="h-12 w-full border border-yellow-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-md px-3 py-2 outline-none transition-colors"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-yellow-700 font-medium block">Full Name</label>
                  <input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="h-12 w-full border border-yellow-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-md px-3 py-2 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-yellow-700 font-medium block">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-12 w-full border border-yellow-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-md px-3 py-2 outline-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-yellow-700 font-medium block">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-12 w-full border border-yellow-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-md px-3 py-2 outline-none transition-colors"
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-yellow-700 font-medium block">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="h-12 w-full border border-yellow-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-md px-3 py-2 outline-none transition-colors"
                    required
                    minLength="6"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-yellow-700 font-medium block">Gender</label>
                  <div className="relative">
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="h-12 w-full border border-yellow-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-md px-3 py-2 outline-none transition-colors appearance-none bg-white"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-yellow-700 font-medium block">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="h-12 w-full border border-yellow-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-md px-3 py-2 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-yellow-700 font-medium block">City</label>
                <div className="relative">
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="h-12 w-full border border-yellow-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 rounded-md px-3 py-2 outline-none transition-colors appearance-none bg-white"
                    required
                  >
                    <option value="">Select your city</option>
                    {indianCities.map((city) => (
                      <option key={city} value={city.toLowerCase()}>{city}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-yellow-700 font-medium block">I am a</label>
                <div className="flex space-x-8">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="seller"
                      name="role"
                      value="seller"
                      checked={formData.role === 'seller'}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-4 h-4 text-green-500 border-green-500 focus:ring-green-500"
                    />
                    <label htmlFor="seller" className="text-yellow-700 cursor-pointer">
                      Seller (Farmer)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="buyer"
                      name="role"
                      value="buyer"
                      checked={formData.role === 'buyer'}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-4 h-4 text-green-500 border-green-500 focus:ring-green-500"
                    />
                    <label htmlFor="buyer" className="text-yellow-700 cursor-pointer">
                      Buyer (Compost/Biogas Plant)
                    </label>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </div>
            
          <div className="px-6 pb-6">
            <div className="text-center">
              <p className="text-yellow-600 text-sm sm:text-base">
                Already have an account?{" "}
                <span
                  role="link"
                  tabIndex={0}
                  className="text-green-600 hover:text-green-700 font-semibold underline cursor-pointer transition-colors"
                >
                  Sign In
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-yellow-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}