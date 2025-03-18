import React from "react";
import "../styles/option.css";
import { useNavigate } from "react-router";




const Option = () => {

    const navigate= useNavigate()

    const handleViewerSignup = async () =>{
        navigate('/user-signup')
    }

    const handleTheaterSignup = async () =>{
        navigate('/theater-owner-signup')
    }
  return (
    <div className="selection-container">
      <h1 className="text-danger fw-bold mb-3">
        STAR<span className="text-light">LIGHT</span>
      </h1>

      <div className="selection-wrapper">
        {/* Viewer Section */}
        <div className="selection-box viewer">
          <h2>For Viewers</h2>
          <p>Join Now & Never Miss a Show!</p>
          <button
            className="btn btn-danger btn-lg"
            onClick={handleViewerSignup}>
            Join as a viewer
          </button>
        </div>

        {/* Theater Section */}
        <div className="selection-box theater">
          <h2>For Theaters</h2>
          <p>Turn Your Screens into a Blockbuster Destination</p>
          <button
            className="btn btn-light btn-lg"
            onClick={handleTheaterSignup}>
            Register Theater
          </button>
        </div>
      </div>
    </div>
  );
};

export default Option;
