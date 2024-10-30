import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import L from "../../../Public/l.png";
import Google from "../../../Public/Google.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../../Services/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setParentCredential } from "../../../Redux/Slice/authSlice";
import { Link } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../Firebase/firebase";

function ParentSignin() {
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const parentData = useSelector((state) => state.auth.parentData);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userDetails.email || !userDetails.password) {
      toast.error("Both fields are required");
    } else {
      setError("");
      try {
        const response = await axiosInstance.post(
          "/api/parents/login",
          userDetails,
          { withCredentials: true }
        );
        if (response.data.success) {
          toast.success("Login Successfull!");
          dispatch(setParentCredential(response.data.data));
          navigate("/");
        } else {
          toast.error(response.data.message || "Login failed!");
        }
      } catch (err) {
        console.error("Error during login:", err);
        setError(
          err.response?.data?.message ||
            "Something went wrong, please try again later."
        );
      }
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const user = {
        parentName: result.user.displayName,
        email: result.user.email,
        image: result.user.photoURL,
      };
      const response = await axiosInstance.post(
        "/api/parents/google/auth",
        user,
        { withCredentials: true }
      );
      console.log(response);

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setParentCredential(response.data.data));
        navigate("/");
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.log(error);
      toast.error("Google Authentication failed");
    }
  };

  const handleSignupRedirect = () => {
    navigate("/parent-signup");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="flex flex-col md:flex-row rounded-lg w-[50%]"
        style={{ boxShadow: "4px 4px 10px grey" }}
      >
        <div className="bg-white w-full md:w-1/2 p-8 rounded-l-lg">
          {" "}
          {/* Left Column */}
          <Box
            component="form"
            className="w-full px-5 sm:px-7 flex flex-col justify-center items-center"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <h1 className="text-3xl font-bold mb-5">Sign In</h1>

            {/* Error Message */}
            {error && (
              <Typography variant="body2" color={"error"} className="mb-2">
                {error}
              </Typography>
            )}
            {/* Email Input */}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value.trim() })
              }
            />

            {/* Password Input */}
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={userDetails.password}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  password: e.target.value.trim(),
                })
              }
            />
            <Link to="/forgot-password" className="text-xl font-bold mb-3">
              Forgot Password
            </Link>

            {/* Submit Button */}
            <div className="w-full flex items-center justify-center">
              <div>
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "#323232", color: "#FAF5E9" }}
                  className="mt-4"
                >
                  Sign In
                </Button>
                <h3 className="text-blue-700"> ----- OR ----- </h3>
                <Button
                  className="ml-12"
                  sx={{
                    display: "flex",
                    marginLeft: "17px",
                    justifyContent: "center",
                  }}
                  onClick={handleGoogleAuth}
                >
                  <img
                    src={Google}
                    alt="google"
                    style={{ height: "20px", width: "auto" }}
                  />
                </Button>
              </div>
            </div>
          </Box>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-[#DDD0C8] rounded-r-lg">
          {" "}
          {/* Right Column */}
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <h3 className="text-1xl font-bold mb-3">We care for You!  </h3>
          <img
            src={L}
            alt="CalmNest Logo"
            style={{ height: "100px", width: "150px" }}
            className="mb-5 hidden md:flex"
          />
          <Button
            variant="text"
            style={{ backgroundColor: "#323232", color: "#FAF5E9" }}
            className="mt-5"
            onClick={handleSignupRedirect}
          >
            Sign Up
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ParentSignin;
