// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

// Simple token check (adjust logic as needed)
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  // Example: check if token exists and is not expired
  return !!token; // You can add real JWT verification here
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
