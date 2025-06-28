import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, Package, Truck, Leaf, AlertTriangle, TrendingUp, 
  BarChart3, PieChart, Settings, HelpCircle, Menu, X, Search,
  Filter, Plus, CheckCircle, XCircle, Clock, Calendar, MapPin,
  Users, ArrowUpRight, ArrowDownRight, Eye, Edit, Recycle,
  TreePine, Sprout, Wheat, LogOut
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// AgriLoop Logo Component
const AgriLoopLogo = () => (
  <div className="flex items-center space-x-3">
    <div className="p-2 bg-green-100 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
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
      <h1 className="text-xl font-bold text-gray-800">AgriLoop</h1>
      <p className="text-xs text-gray-500">Farm Waste Management</p>
    </div>
  </div>
);

// Reusable Components
const DashboardCard = ({ title, value, change, changeType, icon: Icon, className = "", subtitle = "" }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-xl" style={{ backgroundColor: '#D0F0C0' }}>
          <Icon className="w-6 h-6 text-green-700" />
        </div>
        <div>
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {change && (
        <div className={`flex items-center space-x-1 ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span className="text-sm font-medium">{change}</span>
        </div>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const WasteListingRow = ({ listing, onAcceptMatch, onDeclineMatch }) => {
  const getWasteIcon = (wasteType) => {
    switch(wasteType.toLowerCase()) {
      case 'crop residue': return <Wheat className="w-7 h-7 text-green-700" />;
      case 'organic manure': return <Sprout className="w-7 h-7 text-green-700" />;
      case 'kitchen waste': return <Leaf className="w-7 h-7 text-green-700" />;
      case 'garden waste': return <TreePine className="w-7 h-7 text-green-700" />;
      default: return <Package className="w-7 h-7 text-green-700" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#D0F0C0' }}>
              {getWasteIcon(listing.waste_type)}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">{listing.waste_type}</h4>
            <p className="text-gray-500">{listing.quantity} kg • {listing.location}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
            listing.status === 'listed' ? 'text-blue-800' : 
            listing.status === 'matched' ? 'text-yellow-800' :
            listing.status === 'picked_up' ? 'text-green-800' :
            'text-gray-800'
          }`} style={{ 
            backgroundColor: listing.status === 'listed' ? '#C5E6F9' : 
            listing.status === 'matched' ? '#FEF3C7' :
            listing.status === 'picked_up' ? '#D0F0C0' :
            '#F3F4F6'
          }}>
            {listing.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="font-medium">Expected: ₹{listing.expected_price}</span>
          <span>•</span>
          <span>{formatDate(listing.created_at)}</span>
        </div>
        <div className="flex space-x-3">
          {listing.status === 'matched' && (
            <>
              <button 
                onClick={() => onAcceptMatch(listing.id)}
                className="px-5 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                Accept Match
              </button>
              <button 
                onClick={() => onDeclineMatch(listing.id)}
                className="px-5 py-2 bg-gray-600 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors font-medium"
              >
                Decline
              </button>
            </>
          )}
          {listing.status === 'listed' && (
            <button className="px-5 py-2 text-blue-700 text-sm rounded-xl hover:bg-blue-100 transition-colors font-medium border border-blue-200" style={{ backgroundColor: '#C5E6F9' }}>
              View Details
            </button>
          )}
          {listing.status === 'picked_up' && (
            <button className="px-5 py-2 text-green-700 text-sm rounded-xl cursor-default font-medium" style={{ backgroundColor: '#D0F0C0' }}>
              ✓ Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ImpactCard = ({ title, value, unit, icon: Icon, description }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-3 rounded-xl" style={{ backgroundColor: '#D0F0C0' }}>
        <Icon className="w-6 h-6 text-green-700" />
      </div>
      <div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
    <div className="flex items-baseline space-x-2">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="text-sm text-gray-500">{unit}</span>
    </div>
  </div>
);

const AddListingModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    waste_type: '',
    quantity: '',
    location: '',
    expected_price: '',
    description: ''
  });

  const wasteTypes = [
    'Crop Residue',
    'Organic Manure', 
    'Kitchen Waste',
    'Garden Waste',
    'Rice Husk',
    'Wheat Straw',
    'Corn Stalks',
    'Sugarcane Bagasse'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      waste_type: '',
      quantity: '',
      location: '',
      expected_price: '',
      description: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Listing</h3>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waste Type</label>
            <select
              value={formData.waste_type}
              onChange={(e) => setFormData({...formData, waste_type: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select waste type</option>
              {wasteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (kg)</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Price (₹)</label>
            <input
              type="number"
              value={formData.expected_price}
              onChange={(e) => setFormData({...formData, expected_price: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows="3"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [wasteListings, setWasteListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'waste', label: 'Waste Listings', icon: Package },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'impact', label: 'Environmental Impact', icon: Leaf },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support', icon: HelpCircle }
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchWasteListings();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://hackathon-agriloop.onrender.com/api/seller/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        toast.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchWasteListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://hackathon-agriloop.onrender.com/api/seller/listings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWasteListings(data.listings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const handleAddListing = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://hackathon-agriloop.onrender.com/api/seller/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Listing added successfully!');
        setShowAddModal(false);
        fetchWasteListings();
        fetchDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add listing');
      }
    } catch (error) {
      console.error('Error adding listing:', error);
      toast.error('Network error');
    }
  };

  const handleAcceptMatch = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://hackathon-agriloop.onrender.com/api/seller/listings/${listingId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Match accepted successfully!');
        fetchWasteListings();
        fetchDashboardData();
      } else {
        toast.error('Failed to accept match');
      }
    } catch (error) {
      console.error('Error accepting match:', error);
      toast.error('Network error');
    }
  };

  const handleDeclineMatch = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://hackathon-agriloop.onrender.com/api/seller/listings/${listingId}/decline`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Match declined');
        fetchWasteListings();
      } else {
        toast.error('Failed to decline match');
      }
    } catch (error) {
      console.error('Error declining match:', error);
      toast.error('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const revenueData = dashboardData ? [
    { 
      title: "Today's Revenue", 
      value: `₹${dashboardData.todayRevenue || 0}`, 
      change: dashboardData.todayChange || "+0%", 
      changeType: "up", 
      icon: DollarSign, 
      subtitle: `From ${dashboardData.todayPickups || 0} pickups` 
    },
    { 
      title: "Weekly Revenue", 
      value: `₹${dashboardData.weeklyRevenue || 0}`, 
      change: dashboardData.weeklyChange || "+0%", 
      changeType: "up", 
      icon: TrendingUp, 
      subtitle: "Last 7 days" 
    },
    { 
      title: "Monthly Revenue", 
      value: `₹${dashboardData.monthlyRevenue || 0}`, 
      change: dashboardData.monthlyChange || "+0%", 
      changeType: "up", 
      icon: BarChart3, 
      subtitle: "This month" 
    },
    { 
      title: "Total Pickups", 
      value: `${dashboardData.totalPickups || 0}`, 
      change: `+${dashboardData.newPickups || 0}`, 
      changeType: "up", 
      icon: Truck, 
      subtitle: "This month" 
    }
  ] : [];

  const impactData = dashboardData ? [
    { title: "CO₂ Saved", value: dashboardData.co2Saved || "0", unit: "tons", icon: Leaf, description: "This month" },
    { title: "Waste Processed", value: dashboardData.wasteProcessed || "0", unit: "kg", icon: Recycle, description: "Total volume" },
    { title: "Trees Equivalent", value: dashboardData.treesEquivalent || "0", unit: "trees", icon: TreePine, description: "CO₂ impact" }
  ] : [];

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {revenueData.map((item, index) => (
                <DashboardCard key={index} {...item} />
              ))}
            </div>

            {/* Alert Banner */}
            {wasteListings.filter(l => l.status === 'listed').length < 3 && (
              <div className="rounded-2xl p-6 border border-yellow-200" style={{ backgroundColor: '#FEF3C7' }}>
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Low Waste Alert</h4>
                    <p className="text-sm text-yellow-700">You have only {wasteListings.filter(l => l.status === 'listed').length} active listings. Consider adding more waste to increase revenue.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="ml-auto px-4 py-2 bg-yellow-600 text-white text-sm rounded-xl hover:bg-yellow-700 transition-colors"
                  >
                    Add Listing
                  </button>
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Listings */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">Recent Waste Listings</h3>
                      <button 
                        onClick={() => setActiveTab('waste')}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {wasteListings.slice(0, 3).map((listing, index) => (
                      <WasteListingRow 
                        key={index} 
                        listing={listing} 
                        onAcceptMatch={handleAcceptMatch}
                        onDeclineMatch={handleDeclineMatch}
                      />
                    ))}
                    {wasteListings.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No listings yet. Add your first listing to get started!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Environmental Impact */}
              <div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900">Environmental Impact</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {impactData.map((impact, index) => (
                      <ImpactCard key={index} {...impact} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'waste':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Waste Listings</h2>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Listing</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {wasteListings.map((listing, index) => (
                <WasteListingRow 
                  key={index} 
                  listing={listing} 
                  onAcceptMatch={handleAcceptMatch}
                  onDeclineMatch={handleDeclineMatch}
                />
              ))}
              {wasteListings.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                  <p className="mb-4">Start by adding your first waste listing</p>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Add Your First Listing
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Revenue chart visualization</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste Volume by Type</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Waste distribution chart</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'impact':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Environmental Impact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {impactData.map((impact, index) => (
                <ImpactCard key={index} {...impact} />
              ))}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly CO₂ Savings</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Leaf className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>CO₂ savings chart visualization</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Content for {activeTab} coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <AgriLoopLogo />
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            <nav className="p-6 space-y-3">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === item.id 
                      ? 'text-green-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{ 
                    backgroundColor: activeTab === item.id ? '#D0F0C0' : 'transparent'
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex-1 flex flex-col min-h-0 bg-white shadow-sm border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <AgriLoopLogo />
          </div>
          <nav className="flex-1 p-6 space-y-3">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === item.id 
                    ? 'text-green-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{ 
                  backgroundColor: activeTab === item.id ? '#D0F0C0' : 'transparent'
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeTab === 'overview' ? 'Dashboard' : activeTab.replace('_', ' ')}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search listings..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                  />
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">S</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Add Listing Modal */}
      <AddListingModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddListing}
      />
    </div>
  );
};

export default SellerDashboard;