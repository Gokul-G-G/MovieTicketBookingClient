import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  InputGroup,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/bg.jpg";
import api from "../api/axiosInstance";

const UserSignup = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false, // Added terms checkbox state
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // Validate form
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Invalid email format";
    if (!formData.phone.match(/^\d{10}$/))
      newErrors.phone = "Phone must be 10 digits";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must agree to the Terms of Service";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return; // Stop if validation fails

    setLoading(true);
    try {
      const response = await api.post("/user/signup", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      setMessage({
        type: "success",
        text: "Signup successful! Redirecting...",
      });

      setTimeout(() => {
        window.location.href = "/login"; // Redirect after success
      }, 2000);
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-relative w-100 vh-100"
      style={{
        background: isMobile ? "black" : `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
        <div
          className="p-4 w-100 w-md-50"
          style={{
            maxWidth: "500px", // Limits width on mobile
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            borderRadius: "10px",
          }}>
          <h1 className="text-danger fw-bold text-center">
            STAR<span className="text-light">LIGHT</span>
          </h1>
          <h3 className="text-white text-center mt-2">Create Account</h3>
          <p className="text-white-50 text-center">
            Let's get you started and create your account
          </p>

          {/* Alert Messages */}
          {message && <Alert variant={message.type}>{message.text}</Alert>}
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger">Please fix the errors below.</Alert>
          )}

          {/* Form */}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="bg-dark text-white border-secondary"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name}</small>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="bg-dark text-white border-secondary"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <small className="text-danger">{errors.email}</small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    className="bg-dark text-white border-secondary"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <small className="text-danger">{errors.phone}</small>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="bg-dark text-white border-secondary"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <Button
                      variant="outline-secondary"
                      className="text-white"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                  {errors.password && (
                    <small className="text-danger">{errors.password}</small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="bg-dark text-white border-secondary"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <Button
                  variant="outline-secondary"
                  className="text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
              {errors.confirmPassword && (
                <small className="text-danger">{errors.confirmPassword}</small>
              )}
            </Form.Group>

            {/* Terms Checkbox */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                label={
                  <span className="text-white-50">
                    I agree to the{" "}
                    <a
                      href="https://your-terms-url.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-danger">
                      Terms of Service
                    </a>
                  </span>
                }
              />
              {errors.agreeTerms && (
                <small className="text-danger">{errors.agreeTerms}</small>
              )}
            </Form.Group>

            <Button
              variant="danger"
              className="w-100"
              type="submit"
              disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
            </Button>
            <div className="text-center mt-3">
              <span className="text-white">Already have an account? </span>
              <a href="/login" className="text-danger fw-bold">
                Sign in Here
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
