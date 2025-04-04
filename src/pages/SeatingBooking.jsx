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
  Spinner,
} from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

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
  const [price, setPrice] = useState([]);
  const [isBooking, setIsBooking] = useState(false);

  const navigate= useNavigate()

  useEffect(() => {
    const fetchShowDetails = async () => {
      if (!id) return; // ✅ Prevent unnecessary API calls
      try {
        const response = await api.get(`/user/book/${id}`);
        if (response.data.shows.length > 0) {
          setShows(response.data.shows);

          const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
          setSelectedDate(today + "T00:00:00.000Z");
          // console.log("Shows Fetched:", response.data.shows);
          // console.log("Selected Date:", selectedDate);
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
    // console.log("Date===", shows[0].dates);
    const filteredByDate = shows.filter((show) => {
      if (Array.isArray(show.dates) && show.dates.length > 0) {
        return show.dates.some((dateObj) => dateObj.date === selectedDate);
      }
    });

    // console.log("Filtered Date:", filteredByDate);

    setFilteredShows(filteredByDate);
    setPrice([]);

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
            .filter(
              (dateObj) =>
                dateObj.date.split("T")[0] === selectedDate.split("T")[0]
            )
            .flatMap((dateObj) => dateObj.timeSlots.map((slot) => slot.time))
        )
      ),
    ];
    // console.log("Available time slots:", extractedTimeSlots);

    if (extractedTimeSlots.length > 0) {
      setSelectedTimeSlot({ time: extractedTimeSlots[0] }); // Auto-select the first time slot
    }
  }, [selectedDate, shows]);

  useEffect(() => {
    if (
      !selectedTimeSlot ||
      !selectedTimeSlot?.time ||
      filteredShows?.length === 0
    )
      return;

    // console.log("Filtering for time slot:", selectedTimeSlot);

    const filteredByTime = filteredShows.filter((show) =>
      show.dates.some((dateObj) =>
        dateObj.timeSlots.some((slot) => slot.time === selectedTimeSlot.time)
      )
    );

    // console.log("Shows for selected time slot:", filteredByTime);

    setSelectedShow(filteredByTime.length > 0 ? filteredByTime[0] : null);
    setSelectedSeats([]); // ✅ Reset selected seats when switching time slot
  }, [selectedTimeSlot, filteredShows]);

  const handleTimeClick = (time) => {
    setSelectedTime(time); // Update the selected time
    setSelectedTimeSlot({ time }); // ✅ Update `selectedTimeSlot`
    const matchingShow = filteredShows.find((show) =>
      show.dates.some((dateObj) =>
        dateObj.timeSlots.some((slot) => slot.time === time)
      )
    );
    // console.log("Selected Show for Time Slot:", matchingShow);
    setSelectedShow(matchingShow || null);
    setPrice([]);
    setSelectedSeats([]); // ✅ Reset seat selection when changing time slot
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    const newShow = filteredShows.find(
      (show) => show.theater.location === event.target.value
    );
    setSelectedShow(newShow || null);
  };

  const toggleSeatSelection = (
    seatId,
    seatLabel,
    seatType,
    selectedTime,
    price
  ) => {
    // console.log(
    //   "Seat Id, Label, and Type:",
    //   seatId,
    //   seatLabel,
    //   seatType,
    //   selectedTime,
    //   price
    // );

    setSelectedTime(selectedTime);

    setSelectedSeats((prevSeats) => {
      const isAlreadySelected = prevSeats.some(
        (seat) => seat.seatId === seatId
      );

      if (isAlreadySelected) {
        // Remove the seat and its price
        setPrice((prevPrices) =>
          prevPrices.filter(
            (p, index) =>
              index !== prevSeats.findIndex((s) => s.seatId === seatId)
          )
        );
        return prevSeats.filter((seat) => seat.seatId !== seatId);
      } else {
        // Add the seat and price
        setPrice((prevPrices) => [...prevPrices, price]);
        return [...prevSeats, { seatId, seatLabel, seatType }];
      }
    });
  };

  const handleBooking = async () => {
    if (
      !selectedShow ||
      !selectedShow.theaterId ||
      selectedSeats.length === 0
    ) {
      toast.error("Please select seats before booking.");
      return;
    }

    // ✅ Extract only the date in YYYY-MM-DD format
    const formattedDate = selectedDate;

    // ✅ Extract only the time slot value
    if (!selectedTimeSlot || !selectedTimeSlot.time) {
      toast.error("Please select a valid time slot.");
      return;
    }

    // ✅ Include seatId along with seatLabel
    const seatDetails = selectedSeats.map((seat) => ({
      seatId: seat.seatId,
      seatLabel: seat.seatLabel,
    }));

    // ✅ Ensure all selected seats have the same seatType
    const uniqueSeatTypes = [
      ...new Set(selectedSeats.map((seat) => seat?.seatType)),
    ];
    if (uniqueSeatTypes.length > 1) {
      toast.error("Please select seats of the same type.");
      return;
    }
    const seatType = uniqueSeatTypes[0];
    setIsBooking(true);
    // console.log("selected time==", selectedTime);
    try {
      const response = await api.post("/user/booked", {
        showId: selectedShow._id,
        theaterId: selectedShow.theaterId,
        selectedSeats: seatDetails, // ✅ Send only valid seat labels
        seatType, // ✅ Send seat type as a string
        date: formattedDate, // ✅ Sending correctly formatted date
        timeSlot: selectedTime, // ✅ Sending only time value
      });

      // console.log("Response==", response.data);
      if (response.data) {
        toast.success("Re Directed to the payment page...");
        setIsBooking(false);
        // ✅ Update seat state to disable booked seats
        setSelectedShow((prevShow) => ({
          ...prevShow,
          dates: prevShow.dates.map((date) =>
            date.date === selectedDate
              ? {
                  ...date,
                  timeSlots: date.timeSlots.map((slot) =>
                    slot.time === selectedTime
                      ? {
                          ...slot,
                          seatTypes: slot.seatTypes.map((seatTypeObj) => ({
                            ...seatTypeObj,
                            rows: seatTypeObj.rows.map((row) => ({
                              ...row,
                              seats: row.seats.map((seat) =>
                                seatDetails.some(
                                  (s) => s.seatId === seat.seatId
                                )
                                  ? { ...seat, isBooked: true } // ✅ Disable booked seats
                                  : seat
                              ),
                            })),
                          })),
                        }
                      : slot
                  ),
                }
              : date
          ),
        }));
         const bookingId = response.data.booking._id;
        //  console.log("Booking Id ==",bookingId)
        setSelectedSeats([]); // ✅ Clear selection after booking
        setTimeout(() => {
           navigate(`/payment/${bookingId}`);
        }, 2000);
      } else {
        alert("Booking failed. Try again.");
        setIsBooking(false);
      }
    } catch (error) {
      // console.error("Error booking seats:", error.response?.data || error);
      alert(error.response?.data?.message || "Error booking seats.");
      setIsBooking(false); 
    }
  };
  const totalPrice = price.reduce((sum, p) => sum + p, 0);
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
                      ? "warning"
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
                variant={selectedTime === time ? "warning" : "outline-warning"}
                onClick={() => handleTimeClick(time)}>
                {time}
              </Button>
            ))}
        </div>

        {selectedShow && selectedTimeSlot && (
          <>
            <div className="movie-banner">
              <div className="overlay">
                <h2 className="movie-title">{selectedShow.movie.title}</h2>
                <h4 className="text-light">
                  {selectedShow.theater.name} - {selectedShow.theater.location}
                </h4>
              </div>
            </div>
            <div className="seat-color-icons text-white d-flex justify-content-around align-items-center">
              <p className="d-flex align-items-center">
                <span
                  className="bg-warning d-inline-block me-2"
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "3px",
                  }}></span>
                Selected
              </p>
              <p className="d-flex align-items-center">
                <span
                  className="bg-success d-inline-block me-2"
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "3px",
                  }}></span>
                Available
              </p>
              <p className="d-flex align-items-center">
                <span
                  className="bg-secondary d-inline-block me-2"
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "3px",
                  }}></span>
                Booked
              </p>
            </div>

            {selectedShow && selectedTime && (
              <div className="seat-layout">
                {selectedShow.dates
                  .filter(
                    (date) =>
                      date.date.split("T")[0] === selectedDate.split("T")[0]
                  ) // Match selected date
                  .flatMap(
                    (date) =>
                      date.timeSlots
                        .filter((slot) => slot.time === selectedTime) // Match selected time slot
                        .flatMap((slot) => slot.seatTypes) // Extract seat types
                  )
                  .map((seatType, seatTypeIndex) => (
                    <div key={seatTypeIndex} className="seat-category">
                      <h4>{seatType.seatType} - ₹</h4>
                      {seatType.rows.map((row, rowIndex) => (
                        <Row
                          key={rowIndex}
                          className="justify-content-center align-items-center">
                          <Col xs="auto">
                            <strong className="row-label">
                              {row.rowLabel}
                            </strong>
                          </Col>
                          {row.seats.map((seat) => (
                            <Col key={seat.seatId} xs="auto">
                              <Button
                                className={`seat-button ${
                                  selectedSeats.some(
                                    (s) => s.seatId === seat.seatId
                                  )
                                    ? "btn-warning"
                                    : "btn-success "
                                }`}
                                disabled={seat.isBooked}
                                onClick={() =>
                                  toggleSeatSelection(
                                    seat.seatId,
                                    seat.seatLabel,
                                    seatType.seatType,
                                    selectedTime,
                                    seat.price
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
            )}
          </>
        )}
      </Container>
      {/* <div className="d-flex justify-content-around align-items-center text-light">
           <p className="d-flex align-items-center"></p>
        </div>// For Pricing Display */}

      {/* {console.log("Price===", price)} */}
      <div
        className="d-flex justify-content-around align-items-center  mt-5"
        style={{ backgroundColor: "rgba(254, 197, 26, 0.96)" }}>
        <div>
          <h4 className="text-dark mt-3 p-3 bg-light rounded">
            Total Amount =
            <span className="text-success" style={{ fontSize: "45px" }}>
              {" "}
              {totalPrice}{" "}
            </span>{" "}
          </h4>
        </div>
        <div>
          {" "}
          <Button
            variant="success"
            disabled={isBooking || selectedSeats.length === 0}
            onClick={handleBooking}
            className="mt-4">
            {isBooking ? (
              <>
                <Spinner animation="border" size="sm" /> Booking...
              </>
            ) : (
              `Book ${selectedSeats.length} Seats - ₹${totalPrice}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatingBooking;
