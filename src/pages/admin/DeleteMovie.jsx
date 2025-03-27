import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import api from "../../api/axiosInstance";

const DeleteMovie = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/movies");
        setMovies(response.data.movies);
      } catch (error) {
        setError("Error fetching movies.");
      }
    };
    fetchMovies();
  }, []);

  const handleShowModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  const handleDeleteMovie = async () => {
    if (!selectedMovie) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/movies/${selectedMovie._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie._id !== selectedMovie._id)
      );

      setSuccessMessage("Movie deleted successfully!");
      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage(null);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting movie.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Delete Movie</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Row className="g-4">
        {movies.map((movie) => (
          <Col key={movie._id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={movie.posterImage}
                alt={movie.title}
                className="img-fluid"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-center">{movie.title}</Card.Title>
                <Button
                  variant="danger"
                  className="mt-auto"
                  onClick={() => handleShowModal(movie)}>
                  Delete Movie
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Confirm Delete Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedMovie?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteMovie}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeleteMovie;
