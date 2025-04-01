import { useEffect, useState } from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import api from "../api/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import backgroundImage from "../assets/bg.jpg";

const TheaterOwnerSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle Password Visibility
  const togglePassword = () => setShowPassword(!showPassword);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await api.post("/theaterOwner/signup", formData);
      // console.log(response.data);
      alert("Signup successful!");
      setMessage({
        type: "success",
        text: "Signup successful! Redirecting...",
      });

      setTimeout(() => {
        window.location.href = "/login"; // Redirect after success
      }, 2000);
    } catch (error) {
      // console.error("Signup Error:", error.response?.data || error.message);
      setMessage("Signup failed. Please fill all the fields");
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
          <h3 className="text-white text-center">Create Account</h3>
          {message && (
            <div className="alert alert-danger text-center">{message}</div>
          )}
          <p className="text-center text-light">
            Partner with Us & Grow Your Theater Business!
          </p>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Theater Name"
                    className="bg-dark text-white border-secondary"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
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
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    className="bg-dark text-white border-secondary"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Location"
                    className="bg-dark text-white border-secondary"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="bg-dark text-white border-secondary"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Button variant="secondary" onClick={togglePassword}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" className="w-100 mt-3 btn-danger">
              Register
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

export default TheaterOwnerSignup;
