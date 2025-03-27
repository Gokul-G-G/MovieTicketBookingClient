import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import api from "../api/axiosInstance";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {  useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const navigate = useNavigate();
   const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get(`/${role}/movies`);
        setMovies(response.data.movies);
      } catch (err) {
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const isClicked = (id) => {
    // Navigate to the movie details page or open a modal
    navigate(`/movie-details/${id}`)
    
  };

  return (
    <div className="bg-black text-white min-h-screen p-4" style={{paddingTop:"60px"}}>
      {/* Header */}
      <Header role={role} />

      {/* Bootstrap Carousel (Featured Movies) */}
      <div className="mb-5">
        {loading ? (
          <p className="text-center text-gray-400">
            Loading Featured Movies...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : movies.length > 0 ? (
          <div
            id="carouselExampleCaptions"
            className="carousel slide"
            data-bs-ride="carousel">
            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {movies.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                  aria-current={index === 0 ? "true" : "false"}
                  aria-label={`Slide ${index + 1}`}></button>
              ))}
            </div>

            {/* Carousel Items */}
            <div className="carousel-inner">
              {movies.map((movie, index) => (
                <div
                  key={movie._id}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  onClick={(e) => {
                    if (window.innerWidth < 768) {
                      isClicked(movie._id);
                    }
                  }} // Make it visually clickable
                >
                  <img
                    src={movie.bannerImage}
                    className="d-block w-100 rounded"
                    alt={movie.title}
                    style={{ height: "500px", objectFit: "cover" }}
                  />
                  <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded">
                    <h2 className="text-xl font-bold">{movie.title}</h2>
                    <p className="text-sm">
                      {movie.duration} | {movie.genre.join(", ")}
                    </p>
                    <p className="text-yellow-400">⭐ {movie.rating}</p>
                    <button
                      className="btn btn-danger mt-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the div click
                        isClicked(movie._id);
                      }}>
                      Watch Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev">
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next">
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-400">No movies available.</p>
        )}
      </div>

      {/* Now Playing Section with Swiper */}
      <div className="mt-6">
        <h2 className="home-title text-lg font-semibold">Now Playing</h2>
        <p className="home-sub-title text-gray-400 text-sm">
          Playing in theaters now
        </p>

        {loading ? (
          <p className="text-center text-gray-400">Loading movies...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : movies.length > 0 ? (
          <Swiper
            spaceBetween={20}
            slidesPerView={2}
            navigation
            breakpoints={{
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
            }}
            modules={[Navigation]}
            className="movie-carousel mt-4">
            {movies.map((movie) => (
              <SwiperSlide key={movie._id}>
                <div
                  className="card movie-card mt-5"
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => isClicked(movie._id)}>
                  <img
                    src={movie.posterImage}
                    className="card-img-top rounded"
                    alt={movie.title}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center p-2">
                    <h6 className="card-title text-dark text-sm">
                      {movie.title}
                    </h6>
                    <p className="text-yellow-400 text-xs">⭐ {movie.rating}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-400">No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
