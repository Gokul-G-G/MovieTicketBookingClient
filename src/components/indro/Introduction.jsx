import React from 'react'
import backgroundImage from '../../assets/bg.jpg'
import Logo from '../../assets/logo.png'
import { useNavigate } from "react-router-dom";
import '../../styles/button.css'
const Introduction = () => {
  const navigate = useNavigate()

  const handleClick = () =>{
    navigate("/login")
  }
  return (
    <div
      className="position-relative w-100 vh-100 bg-dark"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-75 d-flex flex-column align-items-center justify-content-center text-center p-4">
        <img src={Logo} width="300px" alt="Logo" />
        <p className="text-white fs-4">Your number one movie destination.</p>
        <button
          className="btn btn-danger  mt-4"
          onClick={handleClick}>
          Watch Movies
        </button>
      </div>
    </div>
  );
}

export default Introduction
