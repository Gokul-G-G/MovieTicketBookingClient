import React, { useState } from "react";
import { Card, Button, Form, Alert, Spinner,CloseButton } from "react-bootstrap";
import api from "../../api/axiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New Password and Confirm Password must match!");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put("/theaterOwner/password-change", formData);

      if (response.status === 200) {
        Swal.fire("Success!", "Password changed successfully!", "success");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
      }
    } catch (error) {
      setError("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <Card className="shadow-lg p-4" style={{ width: "25rem" }}>
        <CloseButton
          className="position-absolute top-0 end-0 m-2"
          onClick={() => navigate("/dashboard")}
        />
        <Card.Body>
          <Card.Title className="text-center mb-3">Change Password</Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Change Password"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePassword;
