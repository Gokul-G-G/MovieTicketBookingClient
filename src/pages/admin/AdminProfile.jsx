import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import api from "../../api/axiosInstance";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await api.get("/admin/profile");
        // console.log("Admin Profile:", response.data);
        setAdmin(response.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <Card className="shadow p-4" style={{ width: "25rem" }}>
        <Card.Img
          variant="top"
          src={admin?.profilePic}
          className="rounded-circle mx-auto d-block"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
        <Card.Body className="text-center">
          <Card.Title>{admin?.name || "Admin Name"}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {admin?.email || "admin@example.com"}
          </Card.Subtitle>
          <Card.Text>📞 {admin?.phone || "+91 9876543210"}</Card.Text>
          <Button variant="primary">Edit Profile</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminProfile;
