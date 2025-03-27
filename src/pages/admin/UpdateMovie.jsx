import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import api from "../../api/axiosInstance";

const UpdateMovie = () => {
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
        console.error("Error fetching movies", error);
      }
    };
    fetchMovies();
  }, []);

  const handleShowModal = (movie) => {
   setSelectedMovie({
     ...movie,
     releaseDate: movie.releaseDate ? movie.releaseDate.split("T")[0] : "", // Ensure proper format
   });
    setShowModal(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
    setError(null);
    setSuccessMessage(null);
  };

  const handleChange = (e) => {
    setSelectedMovie({ ...selectedMovie, [e.target.name]: e.target.value });
  };

const handleMovieUpdate = async (e) => {
  e.preventDefault();
  if (!selectedMovie) return;

  try {
    const token = localStorage.getItem("token");

    // Filter out only the updated fields
    const updatedFields = {};
    Object.keys(selectedMovie).forEach((key) => {
      if (
        selectedMovie[key] !==
        movies.find((movie) => movie._id === selectedMovie._id)[key]
      ) {
        updatedFields[key] = selectedMovie[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      setError("No changes detected.");
      return;
    }

    const response = await api.put(
      `/admin/movies/${selectedMovie._id}`,
      updatedFields,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie._id === selectedMovie._id ? { ...movie, ...updatedFields } : movie
      )
    );

    setSuccessMessage("Movie updated successfully!");
    setTimeout(() => handleCloseModal(), 2000);
  } catch (error) {
    setError(error.response?.data?.message || "Error updating movie.");
  }
};


  return (
    <Container className="mt-4">
      <h2>Update Movie</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Row className="g-4">
        {movies.map((movie) => (
          <Col key={movie._id} xs={12} sm={6} md={4} lg={3}>
            <Card
              className="h-100 shadow-sm"
              onClick={() => handleShowModal(movie)}>
              <Card.Img
                variant="top"
                src={movie.posterImage}
                alt={movie.title}
                className="img-fluid"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-center">{movie.title}</Card.Title>
                <Button variant="primary" className="mt-auto">
                  Edit Movie
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Editing Movie */}
      {selectedMovie && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Movie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}

            <Form onSubmit={handleMovieUpdate}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Movie Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={selectedMovie.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={selectedMovie.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="releaseDate">
                <Form.Label>Release Date</Form.Label>
                <Form.Control
                  type="date"
                  name="releaseDate"
                  value={selectedMovie.releaseDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="genre">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                  type="text"
                  name="genre"
                  value={selectedMovie.genre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  type="number"
                  name="rating"
                  value={selectedMovie.rating}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="director">
                <Form.Label>Director</Form.Label>
                <Form.Control
                  type="text"
                  name="director"
                  value={selectedMovie.director}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="cast">
                <Form.Label>Cast</Form.Label>
                <Form.Control
                  type="text"
                  name="cast"
                  value={selectedMovie.cast}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="posterImage">
                <Form.Label>Poster Image URL</Form.Label>
                <Form.Control
                  type="text"
                  name="posterImage"
                  value={selectedMovie.posterImage}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Update Movie
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default UpdateMovie;
