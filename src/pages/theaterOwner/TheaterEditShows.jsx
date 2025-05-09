import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import api from "../../api/axiosInstance";


const formatTimeToHHMM = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    // If it's in HH:mm:ss, convert to HH:mm
    if (value.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return value.slice(0, 5); // "14:30:00" -> "14:30"
    }

    // If already correct
    if (value.match(/^\d{2}:\d{2}$/)) {
      return value;
    }
  }

  if (value instanceof Date) {
    const hours = value.getHours().toString().padStart(2, "0");
    const minutes = value.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  return "";
};


const TheaterEditShows = () => {
  const [groupedShows, setGroupedShows] = useState({});
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [selectedOldTimeSlot, setSelectedOldTimeSlot] = useState("");


  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const res = await api.get("/theaterOwner/showtimes");
      const shows = res.data.data;
  {  console.log("Response==", shows);}

      // Group shows by movieId
      const grouped = {};
      shows.forEach((show) => {
        const movieId = show.movieId._id || show.movieId; // In case it's populated or not
        if (!grouped[movieId]) {
          grouped[movieId] = {
            movie: show.movieId,
            showList: [],
          };
        }
        grouped[movieId].showList.push(show);
      });

      setGroupedShows(grouped);
    } catch (err) {
      console.error(err);
    }
  };

 const handleEditClick = (movie, showList) => {
   // Flatten all dates from showList
   const dates = [];

   showList.forEach((show) => {
     show.dates.forEach((d) => {
       dates.push({
         showId: show._id, // keep track of the parent show
         date: d.date,
         timeSlots: d.timeSlots,
       });
     });
   });

   setSelectedShow({ movie, showList, dates });
   setSelectedDate(""); // reset selection
   setNewTime("");
 };


  const handleUpdate = async () => {
    const showToEdit = selectedShow?.showList.find(
      (s) => s.date === selectedDate
    );
    if (!showToEdit) return alert("Please select a valid date");

    try {
      await api.put(`/theaterOwner/showstimes/${showToEdit._id}`, {
        date: selectedDate,
        oldTime: selectedOldTimeSlot,
        newTime,
      });
      setSelectedShow(null);
      fetchShows();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteByDate = async () => {
    const showToDelete = selectedShow?.showList.find(
      (s) => s.date === selectedDate
    );
    if (!showToDelete) return alert("Please select a valid date");

    try {
      await api.delete(`/theaterOwner/shows/${showToDelete._id}`, {
        data: { date: selectedDate },
      });
      setSelectedShow(null);
      fetchShows();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h3 className="my-3">Manage Shows</h3>
      <div className="row">
        {Object.values(groupedShows).map(({ movie, showList }) => (
          <div className="col-md-4 mb-3" key={movie._id}>
            <div
              className="card h-100"
              onClick={() => handleEditClick(movie, showList)}
              style={{ cursor: "pointer", width: "100%" }}>
              <div
                style={{
                  height: "300px",
                  backgroundColor: "#f8f9fa", // light gray bg to frame the image
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                }}>
                <img
                  src={movie.poster || movie.posterImage}
                  className="img-fluid"
                  alt="Poster"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title text-center">{movie.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={!!selectedShow} onHide={() => setSelectedShow(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Show</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-control mb-2"
            value={selectedDate}
            onChange={(e) => {
              const selected = selectedShow.dates.find(
                (d) => d.date === e.target.value
              );
              setSelectedDate(e.target.value);

              if (selected && selected.timeSlots.length > 0) {
                const formattedTime = formatTimeToHHMM(selected.timeSlots[0]);
                setSelectedOldTimeSlot(formattedTime); // default to first time slot
                setNewTime(formattedTime); // set same as default
              } else {
                setSelectedOldTimeSlot("");
                setNewTime("");
              }
            }}>
            <option value="">-- Select Date --</option>
            {selectedShow?.dates?.map((d, idx) => (
              <option key={idx} value={d.date}>
                {new Date(d.date).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </option>
            ))}
          </select>

          {selectedDate && (
            <div className="mb-3">
              <label>Time Slots:</label>
              <select
                className="form-control mb-2"
                value={selectedOldTimeSlot}
                onChange={(e) => {
                  setSelectedOldTimeSlot(e.target.value);
                  setNewTime(e.target.value); // optional: sync with input
                }}>
                <option value="">-- Select Time Slot to Edit --</option>
                {selectedShow.dates
                  .find((d) => d.date === selectedDate)
                  ?.timeSlots.map((slot, idx) => (
                    <option key={idx} value={formatTimeToHHMM(slot)}>
                      {formatTimeToHHMM(slot)}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <label>New Time:</label>
          <input
            type="time"
            className="form-control mb-2"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteByDate}>
            Delete Show By Date
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update Time
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TheaterEditShows;
