import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Calendar, UserCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';



const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

const handleLogout = () => {
  // Clear all stored data from localStorage
  localStorage.clear();

  // Redirect to login page
  navigate('/login');
};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('You must be logged in to view this page.');
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:3000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        } else {
          const err = await res.json();
          toast.error(err.message || 'Failed to fetch profile');
          navigate('/login');
        }
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="text-center text-green-600 mt-20 font-semibold text-lg">Loading profile...</div>;
  }

  if (!profileData) {
    return null; // Or a fallback
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-100 to-amber-100 px-6 py-8">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center shadow-md">
                <User className="w-12 h-12 text-green-700" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {profileData.full_name}
              </h1>
              <p className="text-green-600 font-medium">
                @{profileData.username}
              </p>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            <Detail label="Email" value={profileData.email} icon={<Mail className="w-5 h-5 text-amber-600" />} bg="bg-amber-100" />
            <Divider />
            <Detail label="Location" value={profileData.city} icon={<MapPin className="w-5 h-5 text-green-600" />} bg="bg-green-100" />
            <Divider />
            <Detail label="Date of Birth" value={formatDate(profileData.date_of_birth)} icon={<Calendar className="w-5 h-5 text-blue-600" />} bg="bg-blue-100" />
            <Divider />
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Role" value={profileData.role} icon={<UserCheck className="w-5 h-5 text-amber-600" />} bg="bg-amber-100" />
              <Detail label="Gender" value={profileData.gender} icon={<User className="w-5 h-5 text-purple-600" />} bg="bg-purple-100" />
            </div>
          </div>

          <div className="px-6 pb-6">
            <button onClick={() => {
      const role = localStorage.getItem('userRole');
      if (role === 'Seller') {
        navigate('/seller');
      } else if (role === 'Buyer') {
        navigate('/buyer');
      } else {
        toast.error('User role not found. Please login again.');
        navigate('/login');
      }
    }} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
              Go to Dashboard
            </button>
<button
  onClick={handleLogout}
  className="w-full my-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
>
  Logout
</button>

          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Keep your profile updated for better experience
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

const Detail = ({ label, value, icon, bg }) => (
  <div className="flex items-center space-x-3">
    <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-gray-800 font-medium break-words">{value}</p>
    </div>
  </div>
);

const Divider = () => <div className="border-t border-gray-100"></div>;

export default Profile;
