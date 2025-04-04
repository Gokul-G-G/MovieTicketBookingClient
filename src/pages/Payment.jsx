import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useParams } from "react-router";
import { Card, Button } from "react-bootstrap"; // Import Bootstrap Components
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        // console.log("Response in payment ==", response.data);
        setBooking(response.data.booking);
      } catch (error) {
        // console.error("Error fetching booking details:", error);
        alert("Failed to fetch booking details!");
      }
    };

    fetchBookingDetails();
  }, [id]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Function to create an order
  const createOrder = async () => {
    if (!booking) {
      alert("Booking details not found!");
      return;
    }

    try {
      setLoading(true);
      const bookingId = booking._id;
      const amount = booking.totalAmount;
      // console.log("Booking Id==",bookingId)
      // console.log("Amount==",amount)

      const { data } = await api.post("/payment/create-order", {
        amount,
        bookingId,
      });

      //  console.log("Payment Data", data);
      if (data.success) {
        handlePayment(data.order, bookingId);
      } else {
        alert("Order creation failed!");
      }

      setLoading(false);
    } catch (error) {
    //   console.error("Error creating order:", error);
      alert("Something went wrong!");
      setLoading(false);
    }
  };

  // Function to handle payment
  const handlePayment = (order, bookingId) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh and try again.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use Key ID instead of Secret
      amount: order.amount,
      currency: order.currency,
      name: "Movie Ticket Booking",
      description: "Payment for movie tickets",
      order_id: order.id,
      handler: async (response) => {
        try {
          setLoading(true);
          const verifyResponse = await api.post("/payment/verify-payment", {
            ...response,
            bookingId,
          });

          if (
            verifyResponse.data.message === "Payment verified successfully!"
          ) {
            alert("Payment Successful!");
             navigate(`/success/${bookingId}`);
          } else {
            alert("Payment verification failed!");
          }

          setLoading(false);
        } catch (error) {
        //   console.error("Payment verification failed:", error);
          alert("Payment verification failed!");
          setLoading(false);
        }
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#F37254",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // ✅ Simulated Payment Success
  // const simulatePaymentSuccess = async () => {
  //   try {
  //     setLoading(true);
  //     const mockResponse = {
  //       razorpay_order_id: "order_demo_123",
  //       razorpay_payment_id: "payment_demo_123",
  //       razorpay_signature: "signature_demo_123",
  //     };
  //   //    console.log("Booking Id==", booking._id);
  //     const verifyResponse = await api.post("/payment/verify-payment", {
  //       ...mockResponse,
  //       bookingId: booking._id,
  //     });
  //   //   console.log("Message",verifyResponse)
  //     if (
  //       verifyResponse.data.message === "Demo Payment verified successfully!"
  //     ) {
  //       alert("✅ Demo Payment Successful!");
  //       navigate(`/success/${booking._id}`);
  //     } else {
  //       alert("Demo Payment verification failed!");
  //     }

  //     setLoading(false);
  //   } catch (error) {
  //   //   console.error("Demo Payment verification failed:", error);
  //     alert("Demo Payment verification failed!");
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <Card
        className="p-4 rounded shadow-lg"
        style={{ maxWidth: "500px", width: "100%" }}>
        <Card.Body>
          <h2 className="text-center mb-4">💳 Payment Page</h2>

          {/* ✅ Success Message Card */}
          <Card className="text-center p-3 mb-4 shadow-sm border-success">
            <Card.Body>
              <h5 className="text-success fw-bold">
                🎉 Your seat selection was successful!
              </h5>
              <p className="mb-0">
                Please confirm your booking by proceeding to the payment page.
              </p>
            </Card.Body>
          </Card>

          {/* Payment Buttons */}
          <div className="text-center">
            <Button
              onClick={createOrder}
              disabled={loading}
              variant="success"
              size="lg"
              className="w-100">
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>

            {/* ✅ Demo Payment Button */}
            {/* <Button
              onClick={simulatePaymentSuccess}
              disabled={loading}
              variant="outline-primary"
              size="lg"
              className="w-100 mt-3">
              {loading ? "Processing..." : "Demo Payment Success"}
            </Button> */}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Payment;
