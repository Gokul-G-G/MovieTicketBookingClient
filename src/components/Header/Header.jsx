import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Offcanvas, Button } from "react-bootstrap"; // Bootstrap components
import axios from "axios"; // For API request

const Header = ({ role }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate(); // Redirect function

  // Logout Function
  const handleLogout = async () => {
    try {
      await axios.get(`/api/${role}/logout`, { withCredentials: true }); // Logout API call
      localStorage.removeItem("token"); // Remove token (if stored in localStorage)
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Menu options based on role
  const getMenuOptions = () => {
    switch (role) {
      case "user":
        return [
          { path: "/profile", name: "My Profile" },
          { path: "/bookings", name: "My Bookings" },
        ];
      case "theaterOwner":
        return [
          { path: "/profile", name: "My Profile" },
          { path: "/manage-theaters", name: "Manage Theaters" },
          { path: "/manage-shows", name: "Manage Shows" },
        ];
      case "admin":
        return [
          { path: "/profile", name: "Admin Panel" },
          { path: "/manage-users", name: "Manage Users" },
          { path: "/manage-theaters", name: "Manage Theaters" },
        ];
      default:
        return [];
    }
  };

  return (
    <>
      {/* Header */}
      <header
        className="bg-dark text-white p-3 d-flex justify-content-between align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          height: "80px", 
        }}>
        <h1 className="fw-bold m-0 text-danger">
          STAR<span className="text-light">LIGHT</span>
        </h1>
        <nav>
          <ul className="d-flex gap-3 list-unstyled m-0 align-items-center">
            {/* Home Link */}
            <li>
              <NavLink to="/dashboard" className="text-white">
                <FaHome size={20} />
              </NavLink>
            </li>
            {/* Profile (Opens Sidebar) */}
            <li>
              <Button
                variant="link"
                className="text-white p-0"
                onClick={() => setShowSidebar(true)}>
                <FaUser size={20} />
              </Button>
            </li>
            {/* Logout Button */}
            <li>
              <Button
                variant="link"
                className="text-white p-0"
                onClick={handleLogout}>
                <FaSignOutAlt size={20} />
              </Button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Bootstrap Offcanvas Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="end"
        className="bg-dark text-white">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{role} Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="list-unstyled">
            {getMenuOptions().map((item, index) => (
              <li key={index} className="mb-3">
                <NavLink
                  to={item.path}
                  className="text-white text-decoration-none"
                  onClick={() => setShowSidebar(false)}>
                  {item.name}
                </NavLink>
              </li>
            ))}
            {/* Logout in Sidebar */}
            <li className="mt-4">
              <Button variant="danger" className="w-100" onClick={handleLogout}>
                Logout
              </Button>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
