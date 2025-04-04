import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { Offcanvas, Button, Collapse } from "react-bootstrap"; // Import Collapse for dropdowns
import api from "../../api/axiosInstance";

const Header = ({ role }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({}); // Store dropdown states
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };


  // Logout Function
  const handleLogout = async () => {
    try {
      await api.post(`/${role}/logout`, { withCredentials: true });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Toggle dropdown menu for submenu items
  const toggleDropdown = (menuName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  // Define menu options
  const getMenuOptions = () => {
    switch (role) {
      case "user":
        return [
          { path: "/profile", name: "My Profile" },
          { path: "/bookings", name: "My Bookings" },
        ];
      case "theaterOwner":
        return [
          {
            name: "Profile Management",
            icon: ' ',
            subMenu: [
              { name: "Edit Profile", path: "/profile/edit" },
              { name: "Change Password", path: "/profile/password-change" },
            ],
          },
          {
            name: "Show Management",
            icon: "",
            subMenu: [
              { name: "Add Show", path: "/manage-shows/add" },
              { name: "Edit Show", path: "/manage-shows/edit" },
              { name: "Delete Show", path: "/manage-shows/delete" },
            ],
          },
        ];
      case "admin":
        return [
          {
            name: "My Profile",
            path: "/admin-profile",
            icon: "",
          },
          {
            name: "Movies Management",
            icon: "",
            subMenu: [
              { name: "Add Movie", path: "/manage-movies/add" },
              { name: "Edit Movie", path: "/manage-movies/edit" },
              { name: "Delete Movie", path: "/manage-movies/delete" },
            ],
          },
          {
            name: "Theater Management",
            icon: " ",
            subMenu: [
              { name: "View Theaters", path: "/manage-theaters/view" },
              { name: "Verify Theaters", path: "/manage-theaters/verify" },
            ],
          },
          {
            name: "User Management",
            icon: "",
            subMenu: [
              { name: "View Users", path: "/manage-users/view" },
            ],
          },
          {
            name: "Bookings & Revenue Reports",
            icon: "",
            subMenu: [
              { name: "View Bookings", path: "/bookings-reports/bookings" },
              { name: "Revenue Insights", path: "/bookings-reports/revenue" },
            ],
          },
          { name: "Notifications", icon: " ", path: "/notifications" },
        ];
      default:
        return [];
    }
  };

  return (
    <>
      {/* Header */}
      <header
        className={`p-3 d-flex justify-content-between align-items-center ${
          theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
        }`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          height: "80px",
        }}>
        <h1
          className={`fw-bold m-0 ${
            theme === "dark" ? "text-danger" : "text-dark"
          }`}>
          STAR
          <span className={theme === "dark" ? "text-light" : "text-danger"}>
            LIGHT
          </span>
        </h1>

        <nav>
          <ul className="d-flex gap-3 list-unstyled m-0 align-items-center">
            <li>
              <Button
                variant="link"
                className={
                  theme === "dark" ? "text-white p-0" : "text-dark p-0"
                }
                onClick={toggleTheme}
                title="Toggle Theme">
                {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
              </Button>
            </li>

            {/* Home Link */}
            <li>
              <NavLink
                to="/dashboard"
                className={theme === "dark" ? "text-white" : "text-dark"}>
                <FaHome size={20} />
              </NavLink>
            </li>
            {/* Profile (Opens Sidebar) */}
            <li>
              <Button
                variant="link"
                className={
                  theme === "dark" ? "text-white p-0" : "text-dark p-0"
                }
                onClick={() => setShowSidebar(true)}>
                <FaUser size={20} />
              </Button>
            </li>
            {/* Logout Button */}
            <li>
              <Button
                variant="link"
                className={
                  theme === "dark" ? "text-white p-0" : "text-dark p-0"
                }
                onClick={handleLogout}>
                <FaSignOutAlt size={20} />
              </Button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Sidebar Offcanvas */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="end"
        className={
          theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
        }>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ textTransform: "uppercase" }}>
            {role} Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="list-unstyled">
            {getMenuOptions().map((item, index) => (
              <li key={index} className="mb-3">
                {/* If the item has a submenu, add a collapsible section */}
                {item.subMenu ? (
                  <>
                    <Button
                      variant="link"
                      className={`text-decoration-none w-100 text-start d-flex justify-content-between ${
                        theme === "dark" ? "text-danger" : "text-dark"
                      }`}
                      style={{ fontWeight: "bold" }}
                      onClick={() => toggleDropdown(item.name)}>
                      <span>{item.name}</span>
                      {openDropdowns[item.name] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </Button>

                    <Collapse in={openDropdowns[item.name]}>
                      <ul className="list-unstyled ps-3">
                        {item.subMenu.map((subItem, subIndex) => (
                          <li key={subIndex} className="mb-2">
                            <NavLink
                              to={subItem.path}
                              className="text-white text-decoration-none"
                              onClick={() => setShowSidebar(false)}>
                              {subItem.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className="d-flex align-items-center gap-2 px-3 py-2 w-100 text-danger text-decoration-none "
                    style={{ fontWeight: "bold" }}
                    onClick={() => setShowSidebar(false)}>
                    {item.icon} {item.name}
                  </NavLink>
                )}
              </li>
            ))}
            {/* Logout Button */}
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
