import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import "../../index.css";

import { ThreeDots } from "react-loader-spinner";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const Login = () => {
  const videoRef = useRef(null);

  const [login, setLogin] = useState({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    videoRef.current.click();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        login
      );
      if (response.status === 200) {
        toast.success("Login Successful", {
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
        Cookies.set("userIdgroove", response.data.user._id, { expires: 7 });
        Cookies.set("usertokengroove", response.data.token, { expires: 7 });
        Cookies.set("username", response.data.user.username, { expires: 7 });
        window.location.href = "/";
      }
    } catch (error) {
      toast.error(error.response.data.message, {
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
      setLoad(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
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
            <p>Log In</p>
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
              <button type="submit">Login</button>
            )}
          </form>
          <p>
            Don't have an account ?{" "}
            <span
              onClick={() => {
                window.location.href = "/signup";
              }}
              style={{ cursor: "pointer" }}
            >
              Sign Up
            </span>
          </p>
        </div>
        <div className="imagelogin">
          <img src="./logo.webp" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
