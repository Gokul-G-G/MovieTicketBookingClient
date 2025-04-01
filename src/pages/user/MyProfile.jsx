import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import api from "../../api/axiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profilePic: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        setUser(response.data.data);
        setFormData({
          name: response.data.data.name || "",
          phone: response.data.data.phone || "",
          profilePic: response.data.data.profilePic || "",
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePic: file });
  };

  const handleDeactivate = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Your profile will be deactivated!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate!",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await api.put("/user/profile-deactivate");
        if (response.status === 200) {
          Swal.fire(
            "Deactivated!",
            "Your profile has been deactivated.",
            "success"
          );
          setUser({ ...user, isActive: false });
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to deactivate profile", "error");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      if (formData.profilePic && formData.profilePic instanceof File) {
        formDataToSend.append("profilePic", formData.profilePic);
      }

      const response = await api.put("/user/profile-edit", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setUser(response.data.data);
        setShowModal(false);
        Swal.fire("Success!", "Profile updated successfully!", "success");
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to update profile", "error");
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <Card className="shadow p-4" style={{ width: "25rem" }}>
        <Card.Img
          variant="top"
          src={user?.profilePic || "/default-avatar.png"}
          className="rounded-circle mx-auto d-block"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
        <Card.Body className="text-center">
          <Card.Title>{user?.name || "User Name"}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {user?.email || "user@example.com"}
          </Card.Subtitle>
          <Card.Text>📞 {user?.phone || "+91 9876543210"}</Card.Text>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Edit Profile
          </Button>
          <Button variant="secondary" className="ms-2" onClick={handleBack}>
            Back to Home
          </Button>
        </Card.Body>
        <Button
          variant="outline-danger"
          className="mt-3 w-100"
          onClick={handleDeactivate}>
          Deactivate Profile
        </Button>
      </Card>

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Change Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Change Mobile Number</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3 text-center">
              <Form.Label>Current Profile Picture</Form.Label>
              {formData.profilePic &&
                !(formData.profilePic instanceof File) && (
                  <div>
                    <img
                      src={formData.profilePic}
                      alt="Profile"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProfile;
