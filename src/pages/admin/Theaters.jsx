import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import api from "../../api/axiosInstance";
import Swal from "sweetalert2";

const Theaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await api.get("/admin/theaters");
        // console.log("API Response:", response.data);

        // Extract the actual theater list
        if (response.data && Array.isArray(response.data.data)) {
          setTheaters(response.data.data); // Store only the array
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError("Failed to fetch theaters");
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  const handleDelete = async (theaterId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the theater permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await api.delete(`/admin/theaters/${theaterId}`);
        // console.log("Delete Response:", response);

        if (response.status === 200) {
          setTheaters((prevTheaters) =>
            prevTheaters.filter((theater) => theater._id !== theaterId)
          ); // Update UI without refetching

          Swal.fire("Deleted!", "The theater has been removed.", "success");
        } else {
          throw new Error("Failed to delete");
        }
      } catch (err) {
        // console.error("Error deleting theater:", err);
        Swal.fire("Error!", "Failed to delete the theater.", "error");
      }
    }
  };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Theater List</h2>
      <div className="row">
        {theaters.length > 0 ? (
          theaters.map((theater) => (
            <div key={theater._id} className="col-md-4 mb-4">
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>{theater.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {theater.location}
                  </Card.Subtitle>
                  <Card.Text>📞 {theater.phone}</Card.Text>
                  <Card.Text>{theater.email}</Card.Text>
                  <Card.Text>
                    Status:{" "}
                    {theater.isVerified ? (
                      <span className="text-success">✅ Verified</span>
                    ) : theater.isRejected ? (
                      <span className="text-danger">❌ Rejected</span>
                    ) : (
                      <span className="text-warning">⚠️ Pending</span>
                    )}
                  </Card.Text>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDelete(theater._id)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <p className="text-center">No theaters found.</p>
        )}
      </div>
    </div>
  );
};

export default Theaters;
