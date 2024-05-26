import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import "../../index.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";

const Signup = () => {
  const videoRef = useRef(null);

  const [signup, setSignup] = useState({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    videoRef.current.click();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        signup
      );
      if (response.status === 201) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        setTimeout(() => {
          setSignup({});
          window.location.href = "/login";
        }, 1000);
      } else {
        toast.error(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else if (error.response.status === 500) {
        toast.error("Email already Exits", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error("Something went wrong please try after sometime", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
      setLoad(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignup({ ...signup, [name]: value });
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="./loginpagevideo.mp4" type="video/mp4" />
      </video>
      <div className="login-con">
        <div>
          <form className="form-css" onSubmit={handleSubmit}>
            <p>Sign Up</p>
            <label htmlFor="username">User Name</label>
            <input
              name="username"
              id="username"
              type="text"
              placeholder="Enter user name"
              onChange={handleInputChange}
            />
            <label htmlFor="email">Email </label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="Enter email address"
              onChange={handleInputChange}
            />
            <label htmlFor="password">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Enter password"
              onChange={handleInputChange}
            />
            {load ? (
              <button
                type="button"
                className="flex justify-center items-center"
              >
                <ThreeDots color="#9794ff" height={20} width={50} />
              </button>
            ) : (
              <button type="submit">Sign Up</button>
            )}
          </form>
          <p>
            Already had an account ?{" "}
            <span
              onClick={() => {
                window.location.href = "/login";
              }}
              style={{ cursor: "pointer" }}
            >
              Log In
            </span>
          </p>
        </div>
        <div className="imagelogin">
          <img src="./logo.webp" alt="Logo" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
