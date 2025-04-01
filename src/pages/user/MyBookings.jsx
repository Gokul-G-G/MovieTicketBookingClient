import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/user/bookings");
        // console.log("Bookings",response)
        setBookings(response.data.data);
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleViewTicket = (bookingId) => {
    navigate(`/success/${bookingId}`);
  };
    const handleBackToDashboard = () => {
      navigate("/dashboard");
    };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (bookings.length === 0)
    return <Alert variant="info">No bookings found.</Alert>;

  return (
    <div className="container mt-4">
  {/* Back to Dashboard Button & Heading */}
  <div className="d-flex justify-content-between align-items-center mb-3">
    <Button variant="secondary" onClick={handleBackToDashboard}>
      Back to Dashboard
    </Button>
    <h2 className="text-center flex-grow-1 mb-0">My Bookings</h2>
  </div>



      <Table striped bordered hover responsive>
        <thead className="bg-dark text-light">
          <tr>
            <th>#</th>
            <th>Movie</th>
            <th>Theater</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking._id}>
              <td>{index + 1}</td>
              <td>{booking.movieName}</td>
              <td>{booking.theaterName}</td>
              <td>{new Date(booking.showDate).toLocaleDateString()}</td>
              <td>{booking.showTime}</td>
              <td>
                <span
                  className={`badge bg-${
                    booking.paymentStatus.toLowerCase() === "paid"
                      ? "success"
                      : "danger"
                  }`}>
                  {booking.paymentStatus}
                </span>
              </td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleViewTicket(booking._id)}>
                  View Ticket
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MyBookings;
