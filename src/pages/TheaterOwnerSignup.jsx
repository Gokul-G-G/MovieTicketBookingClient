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
    seatConfiguration: [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const seatOptions = ["Silver", "Gold", "Platinum"];
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

  // Handle Seat Configuration Change
  const handleSeatChange = (index, field, value) => {
    const updatedSeats = [...formData.seatConfiguration];
    updatedSeats[index][field] = value;
    setFormData({ ...formData, seatConfiguration: updatedSeats });
  };

  // Add a new Seat Configuration Row (Limit to 3)
  const addSeatConfig = () => {
    if (formData.seatConfiguration.length < 3) {
      setFormData({
        ...formData,
        seatConfiguration: [
          ...formData.seatConfiguration,
          { seatType: "", totalSeats: "", price: "", row: "", seat: "" },
        ],
      });
    }
  };

  // Remove a Seat Configuration Row
  const removeSeatConfig = (index) => {
    const updatedSeats = formData.seatConfiguration.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, seatConfiguration: updatedSeats });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await api.post("/theaterOwner/signup", formData);
      console.log(response.data);
      alert("Signup successful!");
         setMessage({
        type: "success",
        text: "Signup successful! Redirecting...",
      });

      setTimeout(() => {
        window.location.href = "/login"; // Redirect after success
      }, 2000);
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
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

            <h5 className="text-white">Seat Configuration</h5>
            {formData.seatConfiguration.map((seat, index) => (
              <Row key={index} className="mb-2">
                <Col xs={6} md={2}>
                  <span className="text-white pb-2">Type</span>
                  <Form.Select
                    className="bg-dark text-white border-secondary"
                    value={seat.seatType}
                    onChange={(e) =>
                      handleSeatChange(index, "seatType", e.target.value)
                    }
                    required>
                    <option value="">Select</option>
                    {seatOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                        disabled={formData.seatConfiguration.some(
                          (seat) => seat.seatType === option
                        )}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs={6} md={2}>
                  <span className="text-white pb-2">Seats</span>
                  <Form.Control
                    type="number"
                    placeholder="Total"
                    value={seat.totalSeats}
                    className="bg-dark text-white border-secondary"
                    onChange={(e) =>
                      handleSeatChange(index, "totalSeats", e.target.value)
                    }
                    required
                  />
                </Col>
                <Col xs={6} md={2}>
                  <span className="text-white pb-2">Price</span>
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    value={seat.price}
                    className="bg-dark text-white border-secondary"
                    onChange={(e) =>
                      handleSeatChange(index, "price", e.target.value)
                    }
                    required
                  />
                </Col>
                <Col xs={6} md={2}>
                  <span className="text-white pb-2">Rows</span>
                  <Form.Control
                    type="number"
                    placeholder="Rows"
                    value={seat.row}
                    className="bg-dark text-white border-secondary"
                    onChange={(e) =>
                      handleSeatChange(index, "row", e.target.value)
                    }
                    required
                  />
                </Col>
                <Col xs={6} md={2}>
                  <span className="text-white pb-2">Colums</span>
                  <Form.Control
                    type="number"
                    placeholder="colums"
                    value={seat.seat}
                    className="bg-dark text-white border-secondary"
                    onChange={(e) =>
                      handleSeatChange(index, "seat", e.target.value)
                    }
                    required
                  />
                </Col>
                <Col xs={6} md={2}>
                  <span className="text-white pb-2">Remove</span>
                  <Button
                    variant="danger"
                    onClick={() => removeSeatConfig(index)}>
                    X
                  </Button>
                </Col>
              </Row>
            ))}

            {formData.seatConfiguration.length < 3 && (
              <Button
                className="w-100 mt-2 btn-secondary"
                onClick={addSeatConfig}>
                + Add Seat Type
              </Button>
            )}

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
