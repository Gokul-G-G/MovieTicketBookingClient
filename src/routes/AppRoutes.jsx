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
import ProtectedRoute from './ProtectedRoute';
import AddMovie from '../pages/admin/AddMovie';
import AddShow from '../pages/theaterOwner/addShow';
import UpdateMovie from '../pages/admin/UpdateMovie';
import DeleteMovie from '../pages/admin/DeleteMovie';
import AdminNotifications from '../pages/admin/AdminNotifications';
import Theaters from '../pages/admin/Theaters';
import Users from '../pages/admin/Users';
import AdminProfile from '../pages/admin/AdminProfile';
import TheaterOwnerProfile from '../pages/theaterOwner/TheaterOwnerProfile';
import ChangePassword from '../pages/theaterOwner/ChangePassword';
import Success from '../pages/Success';
import Payment from '../pages/Payment';
import MyProfile from '../pages/user/MyProfile';
import MyBookings from '../pages/user/MyBookings';
import EditShow from '../pages/theaterOwner/EditShow';
import DeleteShow from '../pages/theaterOwner/DeleteShow';
const AppRoutes = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/option" element={<Option />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route
            path="/theater-owner-signup"
            element={<TheaterOwnerSignup />}
          />

          {/* Protected Routes for Authenticated Users */}

          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/movie-details/:id"
            element={<ProtectedRoute element={<MovieDetails />} />}
          />
          <Route
            path="/booking/:id"
            element={<ProtectedRoute element={<SeatingBooking />} />}
          />
          <Route
            path="/manage-movies/add"
            element={<ProtectedRoute element={<AddMovie />} />}
          />
          <Route
            path="/manage-shows/add"
            element={<ProtectedRoute element={<AddShow />} />}
          />
          <Route
            path="/manage-movies/edit"
            element={<ProtectedRoute element={<UpdateMovie />} />}
          />
          <Route
            path="/manage-movies/delete"
            element={<ProtectedRoute element={<DeleteMovie />} />}
          />
          <Route
            path="/manage-theaters/verify"
            element={<ProtectedRoute element={<AdminNotifications />} />}
          />
          <Route
            path="/manage-theaters/view"
            element={<ProtectedRoute element={<Theaters />} />}
          />
          <Route
            path="/manage-users/view"
            element={<ProtectedRoute element={<Users />} />}
          />
          <Route
            path="/admin-profile"
            element={<ProtectedRoute element={<AdminProfile />} />}
          />
          <Route
            path="/profile/edit"
            element={<ProtectedRoute element={<TheaterOwnerProfile />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<MyProfile />} />}
          />
          <Route
            path="/profile/password-change"
            element={<ProtectedRoute element={<ChangePassword />} />}
          />
          <Route
            path="/payment/:id"
            element={<ProtectedRoute element={<Payment />} />}
          />
          <Route
            path="/success/:id"
            element={<ProtectedRoute element={<Success />} />}
          />
          <Route
            path="/bookings"
            element={<ProtectedRoute element={<MyBookings />} />}
          />
          <Route
            path="/manage-shows/edit"
            element={<ProtectedRoute element={<EditShow />} />}
          />
          <Route
            path="/manage-shows/delete"
            element={<ProtectedRoute element={<DeleteShow />} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default AppRoutes
