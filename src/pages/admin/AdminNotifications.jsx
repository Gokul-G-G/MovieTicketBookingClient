import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/admin/notifications"); // Fetch unread notifications
        const notificationsData = response.data.data.map((notif) => ({
          ...notif,
          ownerId: notif.ownerId || {}, 
        }));
        setNotifications(response.data.data);
      } catch (error) {
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleAction = async (ownerId, notificationId, action) => {
    try {
      // console.log("Handle Action ==",action)
      const token = localStorage.getItem("token");
       await api.put(
        `admin/notifications/${notificationId}`,
        { [action]: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId
            ? { ...notif, ownerId: { ...notif.ownerId, [action]: true } }
            : notif
        )
      );

      setSuccessMessage("Theater Verified or Rejected successfully!");
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (error) {
      setError("Error verifying theater.");
    }
  };
  return (
    <Container className="mt-4">
      <h2>Admin Notifications</h2>
      <Button variant="primary" className="mb-3" onClick={() => navigate("/dashboard")}>
        🔙 Back to Home
      </Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : notifications.length === 0 ? (
        <Alert variant="info">No new notifications.</Alert>
      ) : (
        <Row className="g-4">
          {notifications.map((notif) => {
            if (!notif.ownerId) return null; // ✅ Skip if ownerId is missing

            return (
              <Col key={notif._id} xs={12} sm={6} md={4}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>New Signup Request</Card.Title>
                    <Card.Text>
                      {/* {console.log("=====", notif.ownerId?.name)} */}
                      <strong>Name:</strong> {notif.ownerId?.name || "Unknown"}{" "}
                      <br />
                      <strong>Email:</strong> {notif.ownerId?.email || "N/A"}{" "}
                      <br />
                      <strong>Phone:</strong> {notif.ownerId?.phone || "N/A"}{" "}
                      <br />
                      <strong>Location:</strong>{" "}
                      {notif.ownerId?.location || "N/A"}
                    </Card.Text>
                    {notif.ownerId?.isVerified ? (
                      <Alert variant="success">✅ Verified</Alert>
                    ) : notif.ownerId?.isRejected ? (
                      <Alert variant="danger">❌ Rejected</Alert> 
                    ) : (
                      <Button
                        variant="success"
                        style={{marginTop:"10px"}}
                        onClick={() =>
                          handleAction(
                            notif.ownerId._id,
                            notif._id,
                            "isVerified"
                          )
                        }>
                        Verify Theater
                      </Button>
                    )}
                    <Button
                      variant="warning"
                      style={{ color: "white", marginTop: "10px", marginLeft:"10px" }}
                      onClick={() =>
                        handleAction(notif.ownerId._id, notif._id, "isRejected")
                      }>
                      Reject
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default AdminNotifications;
