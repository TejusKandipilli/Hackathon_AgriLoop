import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
