import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const steps = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
        </svg>
      ),
      title: "List Your Waste",
      description: "Upload photos and details of your organic farm waste - crop residue, spoiled produce, or cow dung",
      color: "bg-emerald-500"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
      ),
      title: "AI Matching",
      description: "Our smart system connects you with nearby composters, biogas plants, and eco-buyers",
      color: "bg-amber-600"
    },
    {
      icon: (
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
      ),
      title: "Schedule Pickup",
      description: "Coordinate convenient pickup times and locations with verified buyers",
      color: "bg-yellow-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
          <path d="M3 6h18"></path>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      ),
      title: "Get Paid",
      description: "Receive secure payments directly to your account after successful waste collection",
      color: "bg-emerald-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
          <path d="M12 2v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="M20 12h2"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
          <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path>
          <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path>
        </svg>
      ),
      title: "Track Impact",
      description: "Monitor CO₂ saved, income earned, and your contribution to sustainable farming",
      color: "bg-amber-700"
    }
  ];

  const benefits = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-white">
          <path d="M12 2v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="M20 12h2"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
          <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path>
          <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path>
        </svg>
      ),
      title: "Reduce Pollution",
      description: "Stop burning farm waste and help reduce 211M tonnes of CO₂ emissions annually",
      stats: "87M tonnes waste diverted",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-white">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
          <path d="M3 6h18"></path>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      ),
      title: "Earn Sustainable Income",
      description: "Convert your organic waste into consistent monthly income through our marketplace",
      stats: "₹50K+ monthly potential",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-white">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
        </svg>
      ),
      title: "Support Circular Economy",
      description: "Contribute to sustainable agriculture and create value from what was once waste",
      stats: "100% organic process",
      color: "from-amber-600 to-amber-700"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 group">
              <div className="p-2 bg-emerald-500 rounded-xl group-hover:bg-emerald-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
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
              <div>
                <span className="text-xl font-bold text-emerald-700">AgriLoop</span>
                <p className="text-xs text-stone-600 -mt-1">Organic Waste Marketplace</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
               onClick={() => navigate('/impactcalculator')}
              className="text-stone-700 hover:text-emerald-600 font-medium transition-colors">
                Impact Calculator
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
               onClick={() => navigate('/login')}
              className="border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-md font-medium transition-colors">
                Login
              </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Join Now
            </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`w-4 h-0.5 bg-stone-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`} />
                <span className={`w-4 h-0.5 bg-stone-600 my-0.5 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-4 h-0.5 bg-stone-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-0.5' : ''}`} />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-stone-200">
              <div className="flex flex-col space-y-4">
                <a href="#how-it-works" className="text-stone-700 hover:text-emerald-600 font-medium">
                  How It Works
                </a>
                <a href="#marketplace" className="text-stone-700 hover:text-emerald-600 font-medium">
                  Marketplace
                </a>
                <a href="#impact" className="text-stone-700 hover:text-emerald-600 font-medium">
                  Impact Calculator
                </a>
                <div className="flex flex-col space-y-3 pt-4">
                  <button 
                   onClick={() => navigate('/login')}
                  className="w-full border border-emerald-500 text-emerald-600 px-4 py-2 rounded-md font-medium">
                    Login
                  </button>
                  <button 
                   onClick={() => navigate('/signup')}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium">
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-stone-50">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20"></div>
          <div className="absolute top-60 right-20 w-32 h-32 bg-yellow-200 rounded-full opacity-15"></div>
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-stone-200 rounded-full opacity-25"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full border border-emerald-200 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-600 mr-2">
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
              <span className="text-emerald-700 text-sm font-medium">Sustainable Agriculture Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-stone-800 mb-6 leading-tight">
              AgriLoop
              <span className="block bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Organic Waste Marketplace
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-stone-600 mb-4 font-medium">
              Turning Waste into Wealth
            </p>

            <p className="text-lg text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              Connect with composters, biogas plants, and eco-buyers. Calculate your environmental impact and transform your organic farm waste into sustainable income.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
               onClick={() => navigate('/signup')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                Join the Movement
              </button>
              <button 
               onClick={() => navigate('/login')}
              className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg font-semibold rounded-xl">
                Sign In
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M8 16H3v5"></path>
                  </svg>
                </div>
                <p className="text-2xl font-bold text-stone-800 mb-2">87M+</p>
                <p className="text-stone-600">Tonnes Waste/Year</p>
              </div>
              
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-yellow-100 shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <p className="text-2xl font-bold text-stone-800 mb-2">₹50K+</p>
                <p className="text-stone-600">Monthly Income Potential</p>
              </div>
              
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-stone-500 rounded-xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
                    <path d="M12 2v2"></path>
                    <path d="m4.93 4.93 1.41 1.41"></path>
                    <path d="M20 12h2"></path>
                    <path d="m19.07 4.93-1.41 1.41"></path>
                    <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path>
                    <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path>
                  </svg>
                </div>
                <p className="text-2xl font-bold text-stone-800 mb-2">211M</p>
                <p className="text-stone-600">Tonnes CO₂ Saved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6">
              How AgriLoop Works
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
              Transform your organic waste into income in just 5 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm rounded-2xl">
                <div className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${step.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-stone-800 mb-3">
                      {step.title}
                    </h3>
                  </div>
                  
                  <p className="text-stone-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Connection Lines - Hidden on mobile */}
          <div className="hidden xl:block relative -mt-32 mb-16">
            <div className="flex justify-between items-center px-20">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex-1 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-emerald-300 to-yellow-300 rounded-full opacity-50"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6">
              Why Choose AgriLoop?
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of farmers who have already transformed their waste management approach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 overflow-hidden rounded-2xl">
                <div className={`h-2 bg-gradient-to-r ${benefit.color}`}></div>
                <div className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    {benefit.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-stone-800 mb-4">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-stone-600 leading-relaxed mb-6">
                    {benefit.description}
                  </p>

                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${benefit.color} text-white rounded-full text-sm font-semibold`}>
                    {benefit.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Impact Stats */}
          <div className="mt-20 bg-gradient-to-r from-emerald-500 to-amber-600 rounded-3xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-8">Our Collective Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <p className="text-4xl font-bold mb-2">650M+</p>
                <p className="text-emerald-100">Tonnes Waste/Year Available</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">33M</p>
                <p className="text-emerald-100">Tonnes CO₂ Saving Potential</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">5,000+</p>
                <p className="text-emerald-100">Farmers Connected</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">₹2Cr+</p>
                <p className="text-emerald-100">Income Generated</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;