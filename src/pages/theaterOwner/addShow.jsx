import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import api from "../../api/axiosInstance";
import { useSelector } from "react-redux";

const AddShow = () => {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    screen: "",
    startDate: "",
    endDate: "",
    timeSlots: [],
    seatConfiguration: [],
  });
  const availableTimeSlots = [
  "10:00 AM", "12:30 PM", "3:00 PM", "5:30 PM", "8:00 PM", "10:30 PM"
];
  const seatOptions = ["Silver", "Gold", "Platinum"];
  const rowLabel =[]
  const role = useSelector((state) => state.auth.role);

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
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSeatChange = (index, field, value) => {
    setFormData((prevState) => {
      const updatedSeats = [...prevState.seatConfiguration];

      updatedSeats[index] = {
        ...updatedSeats[index],
        [field]: value,
      };

      return { ...prevState, seatConfiguration: updatedSeats };
    });
  };


  const handleTimeSlotChange = (slot) => {
    setFormData((prevState) => ({
      ...prevState,
      timeSlots: prevState.timeSlots.includes(slot)
        ? prevState.timeSlots.filter((s) => s !== slot)
        : [...prevState.timeSlots, slot],
    }));
  };

const addSeatConfig = () => {
  if (formData.seatConfiguration.length < 3) {
    setFormData((prevState) => ({
      ...prevState,
      seatConfiguration: [
        ...prevState.seatConfiguration,
        {
          seatType: "",
          totalSeats: "",
          price: "",
          rows: "",
          seats: "",
        },
      ],
    }));
  }
};

  const removeSeatConfig = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      seatConfiguration: prevState.seatConfiguration.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMovie) return;

    if (!role) {
      alert("Role not found! Please log in again.");
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (start > end) {
      alert("End date must be after start date!");
      return;
    }

 const showData = {
   movieId: selectedMovie._id,
   startDate: formData.startDate,
   endDate: formData.endDate,
   screen: formData.screen,
   timeSlots: formData.timeSlots,
   seatConfiguration: formData.seatConfiguration.map((seat) => ({
     seatType: seat.seatType,
     totalSeats: Number(seat.totalSeats), // ✅ Convert to Number
     price: Number(seat.price), // ✅ Convert to Number
     rows: Number(seat.rows), // ✅ Convert to Number
     seats: Number(seat.seats), // ✅ Convert to Number
   })),
 };

  //  console.log("Data Before Sending",showData)
    try {
      // console.log("Role====",role)
      await api.post(`/${role}/showtimes`,showData);
      alert("Show added successfully!");
      setShowModal(false);
      setFormData({
        screen: "",
        startDate: "",
        endDate: "",
        timeSlots: [],
        seatConfiguration: [],
      });
    } catch (error) {
      console.error("Error adding show", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Select a Movie to Add a Show</h2>
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
                  Add Show
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Show for {selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Screen</Form.Label>
              <Form.Control
                type="text"
                name="screen"
                value={formData.screen}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time Slots</Form.Label>
              <div>
                {availableTimeSlots.map((slot) => (
                  <Form.Check
                    key={slot}
                    type="checkbox"
                    label={slot}
                    checked={formData.timeSlots.includes(slot)}
                    onChange={() => handleTimeSlotChange(slot)}
                  />
                ))}
              </div>
            </Form.Group>

            <h5 className="text-white">Seat Configuration</h5>
            {formData.seatConfiguration.map((seat, index) => (
              <Row key={index} className="mb-2">
                <Col xs={6} md={2}>
                  <span className="text-dark pb-2">Type</span>
                  <Form.Select
                    className="bg-dark text-white border-secondary"
                    value={seat.seatType}
                    onChange={(e) =>
                      handleSeatChange(index, "seatType", e.target.value)
                    }
                    required>
                    <option value="">Select</option>
                    {seatOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                        disabled={formData.seatConfiguration.some(
                          (seat) => seat.seatType === option
                        )}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs={6} md={2}>
                  <span className="text-dark pb-2">Seats</span>
                  <Form.Control
                    type="number"
                    placeholder="Total"
                    value={seat.totalSeats}
                    className="bg-dark text-white border-secondary"
                    onChange={(e) =>
                      handleSeatChange(index, "totalSeats", e.target.value)
                    }
                    required
                  />
                </Col>
                <Col xs={6} md={2}>
                  <span className="text-dark pb-2">Price</span>
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    value={seat.price}
                    className="bg-dark text-white border-secondary"
                    onChange={(e) =>
                      handleSeatChange(index, "price", e.target.value)
                    }
                    required
                  />
                </Col>
                <Col xs={6} md={2}>
                  <span className="text-dark pb-2">Rows</span>
                  <Form.Control
                    type="number"
                    placeholder="Rows"
                    value={seat.rows}
                    className="bg-dark text-white border-secondary"
                    onChange={(e) =>
                      handleSeatChange(index, "rows", e.target.value)
                    }
                    required
                  />
                </Col>
                <Col xs={6} md={2}>
                  <span className="text-dark pb-2">Colums</span>
                  <Form.Control
                    type="number"
                    placeholder="colums"
                    value={seat.seats}
                    className="bg-light border-secondary"
                    onChange={(e) =>
                      handleSeatChange(index, "seats", e.target.value)
                    }
                    required
                  />
                </Col>
                <Col xs={6} md={2}>
                  <span className="text-dark pb-2">Remove</span>
                  <Button
                    variant="danger"
                    onClick={() => removeSeatConfig(index)}>
                    X
                  </Button>
                </Col>
              </Row>
            ))}
            {formData.seatConfiguration.length < 3 && (
              <Button
                className="w-100 mt-2 btn-secondary"
                onClick={addSeatConfig}>
                + Add Seat Type
              </Button>
            )}

            <Button
              type="submit"
              className="w-100 mt-3 btn-primary"
              onClick={handleSubmit}>
              Add Show
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AddShow;
