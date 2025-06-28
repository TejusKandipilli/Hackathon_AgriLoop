import React, { useState } from 'react';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    city: "",
    role: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const indianCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad",
    "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
    "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
    "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.username || !formData.fullName || !formData.email || !formData.gender || 
        !formData.dateOfBirth || !formData.city || !formData.role) {
      alert("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    // Simulate registration process
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userRole", formData.role);
      localStorage.setItem("userName", formData.fullName);
      alert("Welcome to AgriLoop! Your account has been created successfully.");
      // navigate to dashboard
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
              <span className="text-2xl font-bold text-green-700">AgriLoop</span>
              <p className="text-sm text-yellow-600 -mt-1">Organic Waste Marketplace</p>
            </div>
          </div>
        </div>

        <div className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl">
          {/* Header */}
          <div className="text-center pb-6 p-6">
            <h1 className="text-3xl font-bold text-yellow-800">Join AgriLoop</h1>
            <p className="text-yellow-600 text-base">Create your account and start turning waste into wealth</p>
          </div>
          
          {/* Form */}
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
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
            </form>

            <div className="mt-6 text-center">
              <p className="text-yellow-600">
                Already have an account?{" "}
                <a 
                  href="#login" 
                  className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                >
                  Sign In
                </a>
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
};

export default Register;