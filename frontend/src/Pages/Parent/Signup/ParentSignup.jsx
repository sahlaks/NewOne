import React, { useEffect, useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import L from "../../../Public/l.png";
import Google from "../../../Public/Google.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../../Services/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {auth} from '../../../Firebase/firebase'
import { setParentCredential } from "../../../Redux/Slice/authSlice";

function ParentSignup() {
  const [loading, setLoading] = useState(false);

  const [userDetails, setUserDetails] = useState({
    parentName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setErrors] = useState({});
  const navigate = useNavigate();
  const parentData = useSelector((state) => state.auth.parentData);
  const dispatch = useDispatch();

  const validate = () => {
    const newErrors = {};
    // Name validation
    if (!userDetails.parentName) {
      newErrors.parentName = "Name is required";
    } else if (userDetails.parentName.length < 2) {
      newErrors.parentName = "Name must be at least 2 characters";
    } else if (/^\s/.test(userDetails.parentName)) {
      newErrors.parentName = "Name cannot start with a space";
    } else if (/^\s*$/.test(userDetails.parentName)) {
      newErrors.parentName = "Name cannot be only spaces";
    }
    // Email validation
    if (!userDetails.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
      newErrors.email = "Invalid email format";
    }
    // Phone number validation
    if (!userDetails.mobileNumber) {
      newErrors.mobileNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(userDetails.mobileNumber)) {
      newErrors.mobileNumber = "Phone number must be 10 digits";
    } else if (/^0{10}$/.test(userDetails.mobileNumber)) {
      newErrors.mobileNumber = "Phone number cannot be all zeros";
    }
    // Password validation
    if (!userDetails.password) {
      newErrors.password = "Password is required";
    } else if (userDetails.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (userDetails.password.length > 10) {
      newErrors.password = "Password cannot be longer than 10 characters";
    } else if (!/[A-Z]/.test(userDetails.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/\d/.test(userDetails.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*]/.test(userDetails.password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }
    // Confirm password validation
    if (userDetails.password !== userDetails.confirmPassword) {
      newErrors.confirmPassword = "Passwords must match";
    } else if (!userDetails.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
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
      const response =  await axiosInstance.post('/api/parents/google/auth',user,{withCredentials:true});
      console.log(response);
      
      if (response.data.success) {
        toast.success('Successfully Athenticated!')
        dispatch(setParentCredential(response.data.data));
        navigate('/');
       } else {
         console.error('Unexpected response:', response);
      }

    } catch (error) {
        console.log(error)
         toast.error("Google Authentication failed")
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const response = await axiosInstance.post(
          "/api/parents/signup",
          userDetails,
          { withCredentials: true }
        );
        if (response.data.success) {
          setUserDetails({
            parentName: "",
            email: "",
            mobileNumber: "",
            password: "",
            confirmPassword: "",
          });
          toast.success("Please enter the OTP");
          navigate("/otp");
        } else {
          setErrors({ ...error, email: response.data.message });
        }
      } catch (error) {
        console.error("Error sending data to backend:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  


  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <div className="flex md:w-2/3 ">
        <div
          className="flex flex-col md:flex-row rounded-lg"
          style={{ boxShadow: "4px 4px 10px grey" }}
        >
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-[#DDD0C8] rounded-l-lg">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold">Hello Parent!</h1>
              <h3 className="text-1xl font-bold">
                Register with your personal
              </h3>
              <h3 className="text-1xl font-bold">details</h3>
            </div>
            <img
              src={L}
              alt="CalmNest Logo"
              style={{ height: "150px", width: "250px" }}
              className="mb-5 hidden md:flex"
            />
            <Button
              variant="text"
              style={{ backgroundColor: "#323232", color: "#FAF5E9" }}
              className="mt-4"
              onClick={() => navigate("/parent-login")}
            >
              Sign In
            </Button>
          </div>

          <form
            className=" w-full md:w-1/2 flex flex-col  justify-center items-center p-2 bg-white rounded-r-lg"
            onSubmit={handleSubmit}
          >
            <h1 className="text-2xl font-bold mt-2">Create Account</h1>

            <div className="pl-5 pr-5 ">
              <TextField
                size="small"
                label="Name"
                name="parentName"
                value={userDetails.parentName}
                onChange={handleChange}
                className="w-[100%]"
                error={Boolean(error.parentName)}
                helperText={error.parentName}
                sx={{ marginTop: "" }}
              />
              <span style={{ display: "inline-block", width: "200px" }}></span>
              <TextField
                size="small"
                label="Email"
                name="email"
                value={userDetails.email}
                onChange={handleChange}
                className="w-[100%]"
                error={Boolean(error.email)}
                helperText={error.email}
                sx={{ marginTop: "" }}
              />
              <span style={{ display: "inline-block", width: "200px" }}></span>
              <TextField
                size="small"
                label="Phonenumber"
                name="mobileNumber"
                value={userDetails.mobileNumber}
                onChange={handleChange}
                className="w-[100%]"
                error={Boolean(error.mobileNumber)}
                helperText={error.mobileNumber}
                sx={{ marginTop: "" }}
              />
              <span style={{ display: "inline-block", width: "200px" }}></span>
              <TextField
                size="small"
                label="Password"
                name="password"
                value={userDetails.password}
                onChange={handleChange}
                type="password"
                className="w-[100%]"
                error={Boolean(error.password)}
                helperText={error.password}
                sx={{ marginTop: "" }}
              />
              <span style={{ display: "inline-block", width: "200px" }}></span>
              <TextField
                size="small"
                label="ConfirmPassword"
                name="confirmPassword"
                value={userDetails.confirmPassword}
                onChange={handleChange}
                type="password"
                className="w-[100%]"
                error={Boolean(error.confirmPassword)}
                helperText={error.confirmPassword}
                sx={{ marginTop: "" }}
              />
              <span style={{ display: "inline-block", width: "200px" }}></span>

              {/* Submit Button */}

              <div className="w-full flex items-center justify-center">
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: "#323232", color: "#FAF5E9" }}
                    className="mt-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        style={{ color: "#FAF5E9" }}
                      />
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                  <h3 className="text-blue-700 mt-2"> ----- OR ----- </h3>
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ParentSignup;
