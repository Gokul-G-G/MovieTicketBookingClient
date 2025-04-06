import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/bg.jpg";
import api from "../api/axiosInstance";


const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate()

  const validateInput = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput(emailOrPhone)) {
      setError("Enter a valid email or phone number.");
      return;
    }
    setError("");

    try {
        // console.log("id===",emailOrPhone)
      await api.post(`/forgot-password/${role}`,{ email: emailOrPhone });
      toast.success("Password reset link sent. Check your inbox or SMS.");
      setEmailOrPhone("");
      setTimeout(() => {
        navigate("/login");
      }, 2000); 
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset link."
      );
    }
  };

  return (
    <div
      className="position-relative w-100 vh-100 bg-dark"
      style={{
        background: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
        <div
          className="bg-dark bg-opacity-75 p-4"
          style={{ maxWidth: "500px", borderRadius: "10px" }}>
          <h1 className="text-danger fw-bold">
            STAR<span className="text-light">LIGHT</span>
          </h1>
          <h3 className="text-white mt-3">Reset Your Password</h3>
          <p className="text-white-50 mb-4">
            Enter your registered email or phone number
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Email or Phone Number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="bg-dark text-white border-secondary"
              />
              {error && <p className="text-danger mt-1">{error}</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Select
                className="bg-dark text-white border-secondary"
                value={role}
                onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="theater">Theater Owner</option>
              </Form.Select>
            </Form.Group>

            <Button variant="danger" type="submit" className="w-100">
              Send Reset Link
            </Button>

            <p className="text-white mt-3">
              Remembered your password?{" "}
              <Link to="/login" className="text-danger fw-bold">
                Go back to Login
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
