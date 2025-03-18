import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../components/Header/Header";
import starIcon from "../../src/assets/star.png";
import api from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

const MovieDetails = () => {
 const [movie,setMovie] = useState({})
 const {id} = useParams()
 const role = useSelector((state) => state.auth.role);
 const navigate = useNavigate();
 console.log("My id",id)
  // Fetch movie details from DB
  useEffect(()=>{
    const fetchMovie = async() =>{
      try {
         const response = await api.get(`/movies/${id}`);
         console.log("My Response ",response.data.movie)
         setMovie(response.data.movie)
      } catch (error) {
        
      }
    }
    fetchMovie()
  },[id])

  const handleClick = async() => {
    try {
      navigate('/booking')
    } catch (error) {
      
    }
  }
  return (
    <div className="bg-dark vh-100 w-100" style={{ paddingTop: "60px" }}>
      <div className="w-100">
        <Header role={role} />
        <div className="w-100 h-100 mb-60">
          <section
            className="w-100 h-25 "
            style={{ backgroundColor: "rgb(26,26,26)" }}>
            <Container
              className="d-flex align-items-center mx-auto position-relative"
              style={{
                backgroundImage: `linear-gradient(90deg, #1A1A1A 24.97%, #1A1A1A 38.3%, rgba(26, 26, 26, 0.04) 97.47%, #1A1A1A 100%), 
                      url(https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/officer-on-duty-et00431676-1738321341.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "right center",
                backgroundRepeat: "no-repeat",
                minHeight: "649px",
                maxWidth: "1440px",
              }}>
              <Row
                className="w-100 d-flex align-items-center mx-auto position-relative"
                style={{ flexGrow: "1", maxWidth: "1240px" }}>
                <Col
                  lg={4}
                  md={3}
                  className="d-flex justify-content-center align-items-center overflow-hidden"
                  style={{
                    width: "261px",
                    height: "392px",
                    flexShrink: "0",
                    border: "2px solid white",
                  }}>
                  <div
                    style={{
                      maxHeight: "392px",
                      minHeight: "392px",
                      minWidth: "auto",
                      objectFit: "cover",
                    }}>
                    <img
                      src="https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/officer-on-duty-et00431676-1738321341.jpg"
                      alt="Movie Poster"
                      style={{
                        height: "392px",
                        objectFit: "cover",
                        width: "auto",
                      }}
                    />
                  </div>
                </Col>
                <Col lg={4} md={6} className="ps-4">
                  <h1 className="text-white text-uppercase">{movie.title}</h1>

                  {/* Rating */}
                  <div className="d-flex align-items-center mt-3 p-2 bg-danger rounded">
                    <img
                      src={starIcon}
                      alt="Star Icon"
                      width="24"
                      height="24"
                    />
                    <h5 className="text-white ms-2 mb-0">
                      <span>{movie.rating}</span>/10
                    </h5>
                    <button className="btn btn-light ms-auto">Rate Now</button>
                  </div>

                  {/* Movie Format & Language */}
                  <div className="d-flex flex-wrap mt-2">
                    <span className="badge bg-light text-danger fw-bold me-2">
                      2D
                    </span>
                    <span className="badge bg-light text-danger fw-bold">
                      {movie.language}
                    </span>
                  </div>

                  {/* Duration, Genre & Release Date */}
                  <div className="d-flex flex-wrap text-white fw-bold mt-2">
                    <span>"{movie.duration}"</span>
                    <span className="mx-2">|</span>
                    {movie.genre && movie.genre.length > 0 ? (
                      movie.genre.map((item, index) => (
                        <span key={index}>
                          {item} {index !== movie.genre.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : (
                      <span>No Genre Available</span> // Add fallback content
                    )}
                    {console.log(movie.genre)}
                    <span className="mx-2">|</span>
                    <span>
                      "
                      {new Date(movie.releaseDate)
                        .toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, "-")}
                      "
                    </span>
                  </div>

                  {/* About the Movie */}
                  <div className="mt-3 text-white">
                    <h4>
                      <u>About the Movie</u>
                    </h4>
                    <p className="fw-light">{movie.description}</p>
                    <Button variant="outline-light" size="sm">
                      Read More
                    </Button>
                  </div>
                </Col>
                <Col lg={4} md={4} className="ps-4 text-light">
                  <h4 className="mt-2">
                    <u>More Details</u>
                  </h4>
                  <div className=" w-100 d-flex  flex-column flex-wrap ">
                    <p>
                      Director : <span>{movie.director}</span>
                    </p>
                    <p>
                      Cast :{" "}
                      {movie.cast && movie.cast.length > 0 ? (
                        movie.cast.map((item, index) => (
                          <span key={index}>
                            {item} {index !== movie.cast.length - 1 ? ", " : ""}
                          </span>
                        ))
                      ) : (
                        <span>No Cast Available</span> // Add a fallback
                      )}
                    </p>
                    <button className="btn btn-danger mb-5" onClick={handleClick}>Book Now</button>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
