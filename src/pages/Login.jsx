import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle } from "react-icons/fa";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Link,useNavigate } from "react-router-dom";
import backgroundImage from "../assets/bg.jpg";
import api from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";


const Login = () => {
  // State variables for user input and UI behavior
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
    const navigate = useNavigate();
  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Regular Validation for Email or Phone Number
  const validateInput = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/; // (10-digit)
    if (!emailRegex.test(value) && !phoneRegex.test(value)) {
      setError("Enter a valid Email or Phone Number");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    validateInput(value);
  };

 const handleLogin = async () => {
   if (!validateInput(inputValue)) return;
   if (password.length < 6) {
     setLoginError("Password must be at least 6 characters long.");
     return;
   }

   setLoading(true);
   try {
     const response = await api.post(
       "/auth/login",
       { email: inputValue, password: password },
       { withCredentials: true }
     );
     const { user, role , token } = response.data;
    localStorage.setItem("token", token);
     dispatch(loginSuccess({ user, role })); // Store user & role in Redux

     setLoginError(""); // Clear errors
     navigate("/dashboard");
   } catch (error) {
     setLoginError(error.response?.data?.message || "Login failed. Try again.");
   } finally {
     setLoading(false);
   }
 };

  return (
    <div
      className="position-relative w-100 vh-100 bg-dark "
      style={{
        background: isMobile ? "black" : `url(${backgroundImage})`,
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
          <h3 className="text-white mt-3">Welcome Back!</h3>
          <p className="text-white-50">
            Please sign in to your account to continue
          </p>

          {/* Form */}
          <Form className="w-100">
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Email / Phone Number"
                value={inputValue}
                onChange={handleChange}
                className="bg-dark text-white border-secondary"
                style={{
                  outline: "none",
                  boxShadow: "none",
                  border: "1px solid #6c757d", // Subtle border
                }}
              />
              {error && <p className="text-danger mt-1">{error}</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-dark text-white border-secondary"
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    borderColor: "transparent",
                  }}
                />
                <Button
                  variant="outline-secondary"
                  className="text-white"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            {loginError && <p className="text-danger">{loginError}</p>}

            <Button
              variant="danger"
              className="w-100"
              onClick={handleLogin}
              disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            {/* Social Login */}
            <p className="text-white-50 mt-3">Or sign in with</p>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="outline-light">
                <FaFacebook size={20} />
              </Button>
              <Button variant="outline-light">
                <FaGoogle size={20} />
              </Button>
            </div>

            {/* Signup Redirect */}
            <p className="text-white mt-3">
              Not registered yet?{" "}
              <Link to="/option" className="text-danger fw-bold">
                Sign Up Here
              </Link>
            </p>
            {loginError && (
              <p className="text-white">
                Forgot your password?{" "}
                <Link to="/forgot-password" className="text-danger fw-bold">
                  Reset it here
                </Link>
              </p>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
