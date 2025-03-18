import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Option from '../pages/Option';
import UserSignup from '../pages/UserSignup';
import TheaterOwnerSignup from '../pages/TheaterOwnerSignup';
import MovieDetails from '../pages/MovieDetails';
import SeatingBooking from '../pages/SeatingBooking';
const AppRoutes = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/option" element={<Option />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/theater-owner-signup" element={<TheaterOwnerSignup />} />
          <Route path="/movie-details/:id" element={<MovieDetails />} />
          <Route path="/booking" element={<SeatingBooking />} />
        </Routes>
      </Router>
    </div>
  );
}

export default AppRoutes
