import React, { useEffect, useRef, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import api from "../api/axiosInstance";
import html2canvas from "html2canvas"; // Import html2canvas

const Success = () => {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const ticketRef = useRef(null); // Reference to ticket for screenshot
  const navigate = useNavigate()
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        // console.log("Response in success:", response.data);
        setBookingData(response.data.booking);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current);
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = `ticket_${bookingData._id}.png`;
      link.click();
      setTimeout(() => {
        navigate("/dashboard"); // Navigate to dashboard
      }, 2000);
    } catch (error) {
      console.error("Error generating ticket image:", error);
    }
  };

  if (!bookingData) {
    return <p className="text-white text-center">Loading...</p>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
      <Card
        className="p-3 rounded shadow-lg position-relative"
        style={{ maxWidth: "700px", width: "100%" }}>
        <Button
          variant="outline-secondary"
          size="sm"
          className="position-absolute top-0 end-0 m-2"
          onClick={() => navigate("/dashboard")}>
          Back to Home
        </Button>
        <div
          ref={ticketRef}
          className="row g-3 align-items-center bg-white p-3 rounded">
          {/* Left Side: Movie Poster */}
          <div className="col-12 col-md-5 text-center">
            <img
              src={
                bookingData?.show?.movieId?.posterImage || "/default-poster.jpg"
              }
              alt="Movie Poster"
              className="img-fluid rounded"
              style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }}
            />
          </div>

          {/* Right Side: Movie Details */}
          <div className="col-12 col-md-7">
            <h5>{bookingData?.show?.movieId?.title}</h5>
            <p className="text-muted">{bookingData?.show?.movieId?.language}</p>
            <p>
              {bookingData?.showDate || "Date not available"} &nbsp; | &nbsp;
              {bookingData?.showTime || "Time not available"}
            </p>
            <p className="fw-bold">{bookingData?.show?.theaterId?.name}</p>

            <h6>🎟 {bookingData?.seats?.length} Tickets</h6>
            <p>
              {bookingData?.seats?.length > 0
                ? `${bookingData.seats[0].seatType} - ${bookingData.seats
                    .map((seat) => seat.seatLabel)
                    .join(", ")}`
                : "No seats selected"}
            </p>

            {/* QR Code */}
            <div className="text-center">
              <img
                src={`data:image/png;base64,${bookingData?.qrCode}`}
                alt="QR Code"
                className="qr-code"
                style={{ maxWidth: "150px" }}
              />
            </div>

            <p className="fw-bold">Booking ID: {bookingData._id}</p>
            <p className="text-danger" style={{ fontSize: "12px" }}>
              Cancellation unavailable: cut-off time of 5 hrs before showtime
              has passed
            </p>
          </div>
        </div>

        {/* Download Button */}
        <Button
          variant="primary"
          className="w-100 mt-3"
          onClick={handleDownload}>
          Download Ticket
        </Button>
      </Card>
    </div>
  );
};

export default Success;
