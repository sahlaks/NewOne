import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import L from "../../../Public/l.png";
import Google from "../../../Public/Google.png";
import { useNavigate } from "react-router-dom";
import { axiosInstanceDoctor } from "../../../Services/AxiosConfig";
import { toast } from "react-toastify";

function DoctorSignup() {
  const [loading, setLoading] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState({
    doctorName: "",
    email: "",
    mobileNumber: "",
    licenseGrade: "",
    password: "",
    confirmPassword: "",
  });
  const [document, setDocument] = useState(null);

  const [error, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    // Name validation
    if (!doctorDetails.doctorName) {
      newErrors.doctorName = "Name is required";
    } else if (doctorDetails.doctorName.length < 2) {
      newErrors.doctorName = "Name must be at least 2 characters";
    } else if (/^\s/.test(doctorDetails.doctorName)) {
      newErrors.doctorName = "Name cannot start with a space";
    } else if (/^\s*$/.test(doctorDetails.doctorName)) {
      newErrors.doctorName = "Name cannot be only spaces";
    }
    // Email validation
    if (!doctorDetails.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(doctorDetails.email)) {
      newErrors.email = "Invalid email format";
    }
    // Phone number validation
    if (!doctorDetails.mobileNumber) {
      newErrors.mobileNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(doctorDetails.mobileNumber)) {
      newErrors.mobileNumber = "Phone number must be 10 digits";
    } else if (/^0{10}$/.test(doctorDetails.mobileNumber)) {
      newErrors.mobileNumber = "Phone number cannot be all zeros";
    }

    // // License-grade validation
    // if (!doctorDetails.licenseGrade) {
    //   newErrors.licenseGrade = "License Grade is required!!!";
    // }

    // Password validation
    if (!doctorDetails.password) {
      newErrors.password = "Password is required";
    } else if (doctorDetails.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (doctorDetails.password.length > 10) {
      newErrors.password = "Password cannot be longer than 10 characters";
    } else if (!/[A-Z]/.test(doctorDetails.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/\d/.test(doctorDetails.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*]/.test(doctorDetails.password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }

    // Confirm password validation
    if (doctorDetails.password !== doctorDetails.confirmPassword) {
      newErrors.confirmPassword = "Passwords must match";
    } else if (!doctorDetails.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    }

    if (!document) {
      newErrors.document = "Document is required";
    } else if (document.type !== "application/pdf") {
      newErrors.document = "Document must be a PDF";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorDetails({
      ...doctorDetails,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocument(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(validate());
    
    if (validate()) {
      setLoading(true);
      console.log("Form submitted with data:", doctorDetails);
      try {
        const formData = new FormData();
        formData.append("doctorName", doctorDetails.doctorName);
        formData.append("email", doctorDetails.email);
        formData.append("mobileNumber", doctorDetails.mobileNumber);
        formData.append("licenseGrade", doctorDetails.licenseGrade);
        formData.append("password", doctorDetails.password);
        formData.append("confirmPassword", doctorDetails.confirmPassword);
        if (document) {
          formData.append("document", document);
        }

        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]); 
        }
        const response = await axiosInstanceDoctor.post(
          "/api/doctor/signup",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true
          },
        );
        console.log("response", response);

        if (response.data.success) {
          setDoctorDetails({
            doctorName: "",
            email: "",
            mobileNumber: "",
            licenseGrade: "",
            password: "",
            confirmPassword: "",
          });
          setDocument(null);
          toast.success("Please enter the OTP");
          navigate('/d-otp');
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
              <h1 className="text-3xl font-bold">Hello Doctor!</h1>
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
              variant="contained"
              style={{ backgroundColor: "#323232", color: "#FAF5E9" }}
              className="mt-4"
              onClick={() => navigate("/doctor-login")}
            >
              Sign In
            </Button>
          </div>

          <form
            action=""
            className="w-full md:w-1/2 flex flex-col  justify-center items-center p-2 bg-white rounded-r-lg"
            onSubmit={handleSubmit}
          >
            <h1 className="text-2xl font-bold mt-2">Create Account</h1>

            <div className="pl-5 pr-5 ">
              <TextField
                size="small"
                label="Name"
                name="doctorName"
                value={doctorDetails.doctorName}
                className="w-[100%]"
                sx={{ marginTop: "" }}
                onChange={handleChange}
                error={Boolean(error.doctorName)}
                helperText={error.doctorName}
              />
              <span style={{ display: "inline-block", width: "200px" }}></span>
              <TextField
                size="small"
                label="Email"
                name="email"
                value={doctorDetails.email}
                className="w-[100%]"
                sx={{ marginTop: "" }}
                onChange={handleChange}
                error={Boolean(error.email)}
                helperText={error.email}
              />
              <span style={{ display: "inline-block", width: "200px" }}></span>
              <TextField
                size="small"
                label="Phonenumber"
                name="mobileNumber"
                value={doctorDetails.mobileNumber}
                className="w-[100%]"
                sx={{ marginTop: "" }}
                onChange={handleChange}
                error={Boolean(error.mobileNumber)}
                helperText={error.mobileNumber}
              />
              <span style={{ display: "inline-block", width: "200px" }}></span>
              {/* <TextField
                size="small"
                label="License Grade"
                name="licenseGrade"
                value={doctorDetails.licenseGrade}
                className="w-[100%]"
                sx={{ marginTop: "" }}
                onChange={handleChange}
                error={Boolean(error.licenseGrade)}
                helperText={error.licenseGrade}
              />
              <span style={{ display: "inline-block", width: "200px" }}></span> */}
              <TextField
                size="small"
                label="Password"
                name="password"
                type="password"
                value={doctorDetails.password}
                className="w-[100%]"
                sx={{ marginTop: "" }}
                onChange={handleChange}
                error={Boolean(error.password)}
                helperText={error.password}
              />
              <span style={{ display: "inline-block", width: "200px" }}></span>
              <TextField
                size="small"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={doctorDetails.confirmPassword}
                className="w-[100%]"
                sx={{ marginTop: "" }}
                onChange={handleChange}
                error={Boolean(error.confirmPassword)}
                helperText={error.confirmPassword}
              />
              <span style={{ display: "inline-block", width: "200px" }}></span>

              <h1 htmlFor="document" className="text-xl">
                Upload License Document (PDF only)
              </h1>
              <input
                type="file"
                id="document"
                name="document"
                accept=".pdf"
                className="w-full mt-2"
                onChange={handleFileChange}
              />
              {error.document && (
                <div className="text-red-600">{error.document}</div>
              )}
              {/* Submit Button */}

              <div className="w-full flex items-center justify-center">
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: "#323232", color: "#FAF5E9" }}
                    className=""
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
                  {/* <h3 className='text-blue-700 mt-2'> ----- OR ----- </h3>
                  <Button className='ml-12' sx={{ display: 'flex', marginLeft: '17px', justifyContent: 'center', borderRadius: 10 }}  >
                    <img src={Google} alt="" style={{ height: '20px', width: 'auto' }} />
                  </Button> */}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorSignup;
