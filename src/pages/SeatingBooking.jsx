import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useParams } from "react-router";
import {
  Container,
  Button,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";

const SeatingBooking = () => {
  const { id } = useParams();
  const [shows, setShows] = useState([]); // All shows
  const [filteredShows, setFilteredShows] = useState([]); // Filtered by date & time
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);



  useEffect(() => {
  const fetchShowDetails = async () => {
    if (!id) return; // ✅ Prevent unnecessary API calls
    try {
      const response = await api.get(`/user/book/${id}`);
      if (response.data.shows.length > 0) {
        setShows(response.data.shows);

        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format  
        setSelectedDate(today + "T00:00:00.000Z");
        console.log("Shows Fetched:", response.data.shows);
      }
    } catch (error) {
      console.error("Error fetching show details:", error);
    }
  };
  fetchShowDetails();
}, [id]);



  // Filter shows based on selectedDate & selectedTimeSlot
useEffect(() => {
  if (!selectedDate || shows.length === 0) return;
  
const filteredByDate = shows.filter((show) => {
  if (Array.isArray(show.dates) && show.dates.length > 0) {
    return show.dates.some(
      (dateObj) => dateObj.date.split("T")[0] === selectedDate.split("T")[0]
    );
  }
});

console.log("Filtered Shows:", filteredByDate);

  setFilteredShows(filteredByDate);

  if (filteredByDate.length > 0) {
    setSelectedLocation(filteredByDate[0]?.theater?.location || "");
  } else {
    setSelectedTimeSlot(null);
  }

  // Extract unique time slots for the selected date
  
  const extractedTimeSlots = [
    ...new Set(
      filteredByDate.flatMap((show) =>
        show.dates
          .filter((dateObj) => dateObj.date.split("T")[0] === selectedDate.split("T")[0])
          .flatMap((dateObj) => dateObj.timeSlots.map((slot) => slot.time))
))
  ];
  console.log("Available time slots:", extractedTimeSlots);

  if (extractedTimeSlots.length > 0) {
    setSelectedTimeSlot({time:extractedTimeSlots[0]}); // Auto-select the first time slot
  }
}, [selectedDate, shows]);





useEffect(() => {
   if (!selectedTimeSlot || !selectedTimeSlot?.time || filteredShows?.length === 0) return;

  console.log("Filtering for time slot:", selectedTimeSlot);

  const filteredByTime = filteredShows.filter((show) =>
    show.dates.some((dateObj) =>
      dateObj.timeSlots.some((slot) => slot.time === selectedTimeSlot.time)
    )
  );

  console.log("Shows for selected time slot:", filteredByTime);

  setSelectedShow(filteredByTime.length > 0 ? filteredByTime[0] : null);
  setSelectedSeats([]); // ✅ Reset selected seats when switching time slot
}, [selectedTimeSlot, filteredShows]);

const handleTimeClick = (time) => {
  setSelectedTime(time); // Update the selected time
  const matchingShow = filteredShows.find((show) =>
    show.dates.some((dateObj) =>
      dateObj.timeSlots.some((slot) => slot.time === time)
    )
  );
  console.log("Selected Show for Time Slot:", matchingShow);
  setSelectedShow(matchingShow || null);
  setSelectedSeats([]); // ✅ Reset seat selection when changing time slot
};


  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    const newShow = filteredShows.find(
      (show) => show.theater.location === event.target.value
    );
    setSelectedShow(newShow || null);
  };
  
const toggleSeatSelection = (seatId, seatLabel, seatType) => {
  console.log("Seat Id, Label, and Type:", seatId, seatLabel, seatType);

  setSelectedSeats((prevSeats) => {
    const isAlreadySelected = prevSeats.some((seat) => seat.seatId === seatId);

    if (isAlreadySelected) {
      return prevSeats.filter((seat) => seat.seatId !== seatId);
    } else {
      return [...prevSeats, { seatId, seatLabel, seatType }];
    }
  });
};



const handleBooking = async () => {
  if (!selectedShow || !selectedShow.theaterId || selectedSeats.length === 0) {
    alert("Please select seats before booking.");
    return;
  }

  // ✅ Extract only the date in YYYY-MM-DD format
  const formattedDate = selectedDate.split("T")[0];

  // ✅ Extract only the time slot value
  if (!selectedTimeSlot || !selectedTimeSlot.time) {
    alert("Please select a valid time slot.");
    return;
  }
  const selectedTime = selectedTimeSlot.time;

  // ✅ Ensure valid seat selection
  const seatLabels = selectedSeats
    .map((seat) => seat?.seatLabel)
    .filter(Boolean);
  if (seatLabels.length === 0) {
    alert("Invalid seat selection. Please try again.");
    return;
  }

  // ✅ Ensure all selected seats have the same seatType
  const uniqueSeatTypes = [
    ...new Set(selectedSeats.map((seat) => seat?.seatType)),
  ];
  if (uniqueSeatTypes.length > 1) {
    alert("Please select seats of the same type.");
    return;
  }
  const seatType = uniqueSeatTypes[0];

  try {
    const response = await api.post("/user/booked", {
      showId: selectedShow._id,
      theaterId: selectedShow.theaterId,
      selectedSeats: seatLabels, // ✅ Send only valid seat labels
      seatType, // ✅ Send seat type as a string
      date: formattedDate, // ✅ Sending correctly formatted date
      timeSlot: selectedTime, // ✅ Sending only time value
    });

    console.log(response);
    if (response.data.success) {
      alert("Booking successful!");
      setSelectedSeats([]); // ✅ Clear selection after booking
    } else {
      alert("Booking failed. Try again.");
    }
  } catch (error) {
    console.error("Error booking seats:", error.response?.data || error);
    alert(error.response?.data?.message || "Error booking seats.");
  }
};

  return (
    <div className="position-relative w-100 h-100 bg-dark">
      <Container className="seating-booking-container">
        {filteredShows.length > 1 && (
          <FormGroup className="mb-3">
            <FormLabel className="text-light mt-5">Select Location</FormLabel>
            <FormControl
              as="select"
              value={selectedLocation}
              onChange={handleLocationChange}>
              <option value="">Select Location</option>
              {[
                ...new Set(filteredShows.map((show) => show.theater.location)),
              ].map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </FormControl>
          </FormGroup>
        )}

        <Swiper
          slidesPerView={4}
          spaceBetween={2}
          freeMode={true}
          modules={[FreeMode]}
          className="date-swiper half-width">
          {[...Array(7)].map((_, index) => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + index);
            const formattedDate = currentDate.toISOString().split("T")[0];

            return (
              <SwiperSlide key={index}>
                <Button
                  variant={
                    selectedDate === formattedDate + "T00:00:00.000Z"
                      ? "danger"
                      : "outline-light"
                  }
                  onClick={() =>
                    setSelectedDate(formattedDate + "T00:00:00.000Z")
                  }
                  className="no-scale-btn">
                  <strong>
                    {currentDate.toLocaleString("en-US", { weekday: "short" })}
                  </strong>
                  <br />
                  {currentDate.toLocaleString("en-US", { month: "short" })}{" "}
                  {currentDate.getDate()}
                </Button>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="time-slots">
          {filteredShows?.length > 0 &&
            [
              ...new Set(
                filteredShows?.flatMap((show) =>
                  show.dates
                    ?.filter(
                      (dateObj) =>
                        dateObj.date.split("T")[0] ===
                        selectedDate.split("T")[0]
                    )
                    .flatMap(
                      (dateObj) =>
                        dateObj.timeSlots?.map((slot) => slot.time) || []
                    )
                )
              ),
            ].map((time, index) => (
              <Button
                key={index}
                className={`time-button ${
                  selectedTimeSlot?.time === time ? "active" : ""
                }`}
                onClick={() =>
                  handleTimeClick(time)
                }>
                {time}
              </Button>
            ))}
        </div>

        {selectedShow && (
          <>
            <div className="movie-banner">
              <div className="overlay">
                <h2 className="movie-title">{selectedShow.movie.title}</h2>
                <h4 className="text-light">
                  {selectedShow.theater.name} - {selectedShow.theater.location}
                </h4>
              </div>
            </div>

            <div className="seat-layout">
              {selectedShow?.dates.map((date, dateIndex) => (
                <div key={dateIndex} className="date-section">
                  <h3>{date.date}</h3>

                  {date.timeSlots.map((timeSlot, timeIndex) => (
                    <div key={timeIndex} className="time-slot-section">
                      <h4>Time: {timeSlot.time}</h4>
                      {timeSlot.seatTypes.map((seatType, seatTypeIndex) => (
                        <div key={seatTypeIndex} className="seat-category">
                          <h4>
                            {seatType.seatType} - ₹{seatType.price}
                          </h4>
                          {seatType.rows.map((row, rowIndex) => (
                            <Row
                              key={rowIndex}
                              className="justify-content-center align-items-center">
                              <Col xs="auto">
                                <strong className="row-label">
                                  {row.rowLabel}
                                </strong>
                              </Col>
                              {/* {console.log("seating==",row.seats[0].seatId)} */}
                              {row.seats.map((seat) => (
                                <Col key={seat.seatId} xs="auto">
                                  <Button
                                    className={`seat-button ${
                                      selectedSeats.some(
                                        (s) => s.seatId === seat.seatId
                                      )
                                        ? "btn-warning"
                                        : "btn-success"
                                    }`}
                                    disabled={seat.isBooked}
                                    onClick={() =>
                                      toggleSeatSelection(
                                        seat.seatId,
                                        seat.seatLabel,
                                        seatType.seatType
                                      )
                                    }>
                                    {seat.seatLabel}
                                  </Button>
                                </Col>
                              ))}
                            </Row>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </Container>
      <Button
        variant="danger"
        disabled={selectedSeats.length === 0}
        onClick={handleBooking}>
        Book Now
      </Button>
    </div>
  );
};

export default SeatingBooking
