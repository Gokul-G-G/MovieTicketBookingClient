import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import api from "../../api/axiosInstance";

const AddMovie = () => {
  const navigate = useNavigate();
  const bannerInputRef = useRef(null);
  const posterInputRef = useRef(null);
  const [files, setFiles] = useState({ bannerImage: null, posterImage: null });
  const [movie, setMovie] = useState({
    title: "",
    genre: "",
    duration: "",
    releaseDate: "",
    rating: "",
    director: "",
    cast: "",
    bannerImage: "",
    posterImage: "",
    description: "",
    language: "",
  });
// console.log(files)
  // Handle Input Changes
  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };
const handleFileChange = (e) => {
  setFiles({ ...files, [e.target.name]: e.target.files[0] });
  //  console.log("Selected file:", files);
};
  // Handle Multi-Value Inputs (Genre, Cast, Language)
  const handleMultiValueChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value.split(",") });
  };

  // Handle Form Submission
 const handleSubmit = async (e) => {
   e.preventDefault();

   const formData = new FormData();
   formData.append("title", movie.title);
   formData.append("genre", movie.genre);
   formData.append("duration", movie.duration);
   formData.append("releaseDate", movie.releaseDate);
   formData.append("rating", movie.rating);
   formData.append("director", movie.director);
   formData.append("cast", movie.cast);
   formData.append("description", movie.description);
   formData.append("language", movie.language);

   // Append banner & poster images as files
   if (files.bannerImage) formData.append("bannerImage", files.bannerImage);
   if (files.posterImage) formData.append("posterImage", files.posterImage);
  //  console.log("FormData before sending:", [...formData.entries()]);

   try {
     await api.post("/admin/movies", formData, {
       withCredentials: true,
       headers: { "Content-Type": "multipart/form-data" }, // Important for file upload
     });
     alert("Movie added successfully!");
 
     //  Reset input fields
     setMovie({
       title: "",
       genre: "",
       duration: "",
       releaseDate: "",
       rating: "",
       director: "",
       cast: "",
       description: "",
       language: "",
     });

     //  Reset file states
     // Reset file states
     setFiles({ bannerImage: null, posterImage: null });

     // Clear file input fields
     if (bannerInputRef.current) bannerInputRef.current.value = "";
     if (posterInputRef.current) posterInputRef.current.value = "";
         navigate("/dashboard");
   } catch (error) {
    //  console.error("Error adding movie", error);
     alert("Failed to add movie!");
   }
 };


  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Add New Movie 🎬</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          {/* Title */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Movie Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={movie.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          {/* Genre */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Genre (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="genre"
                value={movie.genre}
                onChange={handleMultiValueChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Duration */}
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Duration (in minutes)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={movie.duration}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          {/* Release Date */}
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Release Date</Form.Label>
              <Form.Control
                type="date"
                name="releaseDate"
                value={movie.releaseDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          {/* Rating */}
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Rating (0-10)</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={movie.rating}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.1"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Director */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                name="director"
                value={movie.director}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          {/* Cast */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cast (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="cast"
                value={movie.cast}
                onChange={handleMultiValueChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Language */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Language (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="language"
                value={movie.language}
                onChange={handleMultiValueChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={movie.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Banner Image</Form.Label>
          <Form.Control
            type="file"
            name="bannerImage"
            accept="image/*"
            onChange={handleFileChange}
            ref={bannerInputRef}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Poster Image</Form.Label>
          <Form.Control
            type="file"
            name="posterImage"
            accept="image/*"
            ref={posterInputRef}
            onChange={handleFileChange}
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit" className="w-100">
          Add Movie
        </Button>
      </Form>
    </Container>
  );
};

export default AddMovie;
