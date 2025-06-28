import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ImpactCalculator from './pages/ImpactCalculator';
import Profile from './pages/Profile';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import PrivateRoute from './lib/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
              <LandingPage/>
          }
        />
        <Route path='/impactcalculator' element={<ImpactCalculator/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/seller" element={<SellerDashboard/>} />
        <Route path="/buyer" element={<BuyerDashboard/>} />
      </Routes>
    </Router>
  );
};

export default App;
