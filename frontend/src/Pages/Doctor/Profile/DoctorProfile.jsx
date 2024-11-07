import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../../assets/images/image.jpg";
import Footer from "../../../Components/Footer/Footer";
import { axiosInstanceDoctor } from "../../../Services/AxiosConfig";
import Loading from "../../../Components/Loading/Loading";
import { toast } from "react-toastify";
import {
  Slider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

import {
  validateName,
  validateEmail,
  validatePhone,
  validateStreet,
  validateCity,
  validateState,
  validateCountry,
  validateAge,
  validateGender,
  validateDegree,
  validateFees,
} from "../../../utils/profileValidation";
import ImageCropperModal from "../../../Services/imageCroper";
import DoctorChangePassword from "../ChnangePassword/ChangePassword";
import DoctorHeader from "../../../Components/Header/DoctorHeader";

const DoctorProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState("");
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState("");
  const [degree, setDegree] = useState("");
  const [degreeError, setDegreeError] = useState("");
  const [fees, setFees] = useState("");
  const [feesError, setFeesError] = useState("");
  const [street, setStreet] = useState("");
  const [streetError, setStreetError] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [state, setState] = useState("");
  const [stateError, setStateError] = useState("");
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState('');
  const [bioError, setBioError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstanceDoctor.get(
          '/api/doctor/doctor-profile',
          {
            withCredentials: true,
          }
        );
        const data = response.data.data;
        setName(data.doctorName || "");
        setEmail(data.email || "");
        setPhone(data.mobileNumber || "");
        setAge(data.age || "");
        setGender(data.gender || "");
        setDegree(data.specialization || "");
        setFees(data.fees || "");
        setStreet(data.street || "");
        setCity(data.city || "");
        setState(data.state || "");
        setCountry(data.country || "");
        setImage(data.image || "")
        setBio(data.bio || "")
      } catch (err) {
        setError("Failed to load doctor data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    const maxSizeInBytes = 15 * 1024 * 1024;
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png"];
      if (!validImageTypes.includes(file.type)) {
        setImageError("Please select a valid image file");
        setImage(null);
      } else if (file.size > maxSizeInBytes) {
        setImageError("Image must be less than 15 MB");
        setImage(null);
      } else {
        // setImage(URL.createObjectURL(file));
        //setImage(file);
        //setIsCropperOpen(true);
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImage(reader.result); 
          setIsCropperOpen(true);
        };
        reader.readAsDataURL(file);
        setImageError("");
      }
    }
  };

  /*...............cropping............................*/
  const handleCropperClose = () => {
    setIsCropperOpen(false);
  };

  const handleCropSubmit = (croppedImage) => {
    console.log("Cropped Image URL:", croppedImage);
   setImage(URL.createObjectURL(croppedImage));
    setSelectedImage(croppedImage)
    setIsCropperOpen(false);
  };

  
  /*.......password change.........*/
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  /*.................handle cancel button.................*/
  const handleCancel = () => {
    navigate("/");
  };

  const validateBio = (value) => {
    if (!value.trim()) {
      return 'Bio should not be empty'
    } else {
      return '';
    }
  };

  const handleSubmit = async () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const ageError = validateAge(age);
    const genderError = validateGender(gender);
    const degreeError = validateDegree(degree);
    const feesError = validateFees(fees);
    const streetError = validateStreet(street);
    const cityError = validateCity(city);
    const stateError = validateState(state);
    const countryError = validateCountry(country);
    const bioError = validateBio(bio);

    setNameError(nameError);
    setEmailError(emailError);
    setPhoneError(phoneError);
    setAgeError(ageError);
    setGenderError(genderError);
    setDegreeError(degreeError);
    setFeesError(feesError);
    setStreetError(streetError);
    setCityError(cityError);
    setStateError(stateError);
    setCountryError(countryError);
    setBioError(bioError);

    if (
      !nameError &&
      !emailError &&
      !phoneError &&
      !ageError &&
      !genderError &&
      !degreeError &&
      !feesError &&
      !streetError &&
      !cityError &&
      !stateError &&
      !countryError &&
      !bioError
    ) {
      try {
        setLoading(true);
        const formData = new FormData();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("age", age);
        formData.append("gender", gender);
        formData.append("degree", degree);
        formData.append("fees", fees);
        formData.append("street", street);
        formData.append("city", city);
        formData.append("state", state);
        formData.append("country", country);
        formData.append("bio", bio); 

        if (image) {
          formData.append("image", selectedImage);
        }

        const response = await axiosInstanceDoctor.post(
          "/api/doctor/updateprofile",
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        setLoading(false);
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

    return (
      <>
      <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-[#FAF5E9]">
        <DoctorHeader />
        {loading ? (
          <Loading />
        ) : (
          <div className="min-h-screen p-6 flex items-center justify-center mt-5">
            <div className="w-full max-w-3xl">
              <div className="rounded shadow-lg p-4 md:p-8 mb-6 bg-white">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                  <div className="text-[#323232]">
                    <p className="text-2xl font-bold">Personal Details</p>
    
                    <div className="flex flex-col max-w-md p-6">
                    <label htmlFor="imageInput" className="text-slate-400 cursor-pointer">
    <input
      type="file"
      id="imageInput"
      className="hidden"
      accept="image/*"
      onChange={handleImageChange}
    />
    <div className="relative">
      <img
        src={image || defaultImage}
        alt="Doctor Profile"
        className="flex-shrink-0 object-cover h-64 w-64 rounded-full dark:bg-gray-500"
      />
      {selectedImage && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={handleCropperClose}
          imageSrc={selectedImage}
          onCropSubmit={handleCropSubmit}
        />
      )}
      {image && (
        <button
          className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-md"
          onClick={() => setImage(null)}
        >
          X
        </button>
      )}
    </div>
    {imageError && (
      <p className="text-red-500 text-xs mt-1">{imageError}</p>
    )}
  </label>
  
                    </div>
    
                    <div>
                      <p className="text-xl text-gray-600">
                        Want to change your password?{" "}
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={handleClickOpen}
                        >
                          Click here
                        </button>
                      </p>
                      <DoctorChangePassword open={open} onClose={handleClose} />
                    </div>
                  </div>
    
                  <div className="lg:col-span-2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="text-[#323232]-600 font-bold" htmlFor="full_name">Name</label>
                        <input
                          type="text"
                          name="full_name"
                          id="full_name"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${nameError ? "border-red-500" : "bg-gray-50"}`}
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            validateName(e.target.value);
                          }}
                        />
                        {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                      </div>
    
                      <div className="md:col-span-2">
                        <label className="text-[#323232]-400 font-bold" htmlFor="bio">Bio</label>
                        <textarea
                          name="bio"
                          id="bio"
                          className={`h-32 border mt-1 rounded-xl px-4 w-full ${bioError ? "border-red-500" : "bg-gray-50"}`}
                          value={bio}
                          onChange={(e) => {
                            setBio(e.target.value);
                            validateBio(e.target.value);
                          }}
                        />
                        {bioError && <p className="text-red-500 text-xs mt-1">{bioError}</p>}
                      </div>
    
                      <div>
                        <label htmlFor="email" className="font-bold">Email Address</label>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${emailError ? "border-red-500" : "bg-gray-50"}`}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            validateEmail(e.target.value);
                          }}
                        />
                        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                      </div>
    
                      <div>
                        <label className="text-[#323232]-400 font-bold" htmlFor="phone">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${phoneError ? "border-red-500" : "bg-gray-50"}`}
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            validatePhone(e.target.value);
                          }}
                        />
                        {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                      </div>
    
                      <div>
                        <label className="text-[#323232]-400 font-bold" htmlFor="age">Age</label>
                        <input
                          type="number"
                          name="age"
                          id="age"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${ageError ? "border-red-500" : "bg-gray-50"}`}
                          value={age}
                          onChange={(e) => {
                            setAge(e.target.value);
                            validateAge(e.target.value);
                          }}
                        />
                        {ageError && <p className="text-red-500 text-xs mt-1">{ageError}</p>}
                      </div>
    
                      <div>
                        <label className="text-[#323232]-400 font-bold" htmlFor="gender">Gender</label>
                        <select
                          name="gender"
                          id="gender"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${genderError ? "border-red-500" : "bg-gray-50"}`}
                          value={gender}
                          onChange={(e) => {
                            setGender(e.target.value);
                            validateGender(e.target.value);
                          }}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {genderError && <p className="text-red-500 text-xs mt-1">{genderError}</p>}
                      </div>
    
                      <div>
                        <label className="text-[#323232]-400 font-bold" htmlFor="degree">Specialization</label>
                        <input
                          type="text"
                          name="degree"
                          id="degree"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${degreeError ? "border-red-500" : "bg-gray-50"}`}
                          value={degree}
                          onChange={(e) => {
                            setDegree(e.target.value);
                            validateDegree(e.target.value);
                          }}
                        />
                        {degreeError && <p className="text-red-500 text-xs mt-1">{degreeError}</p>}
                      </div>
    
                      <div>
                        <label className="text-[#323232]-400 font-bold" htmlFor="fees">Fees</label>
                        <input
                          type="number"
                          name="fees"
                          id="fees"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${feesError ? "border-red-500" : "bg-gray-50"}`}
                          value={fees}
                          onChange={(e) => {
                            setFees(e.target.value);
                            validateFees(e.target.value);
                          }}
                        />
                        {feesError && <p className="text-red-500 text-xs mt-1">{feesError}</p>}
                      </div>
    
                      {/* Address Fields */}
                      <div className="md:col-span-2">
                        <label className="text-[#323232]-400 font-bold" htmlFor="street">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          id="street"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${streetError ? "border-red-500" : "bg-gray-50"}`}
                          value={street}
                          onChange={(e) => {
                            setStreet(e.target.value);
                            validateStreet(e.target.value);
                          }}
                        />
                        {streetError && <p className="text-red-500 text-xs mt-1">{streetError}</p>}
                      </div>
    
                      <div>
                        <label className="text-[#323232]-400 font-bold" htmlFor="city">City</label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${cityError ? "border-red-500" : "bg-gray-50"}`}
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            validateCity(e.target.value);
                          }}
                        />
                        {cityError && <p className="text-red-500 text-xs mt-1">{cityError}</p>}
                      </div>
    
                      <div>
                        <label className="text-[#323232]-400 font-bold" htmlFor="state">State</label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${stateError ? "border-red-500" : "bg-gray-50"}`}
                          value={state}
                          onChange={(e) => {
                            setState(e.target.value);
                            validateState(e.target.value);
                          }}
                        />
                        {stateError && <p className="text-red-500 text-xs mt-1">{stateError}</p>}
                      </div>
    
                      {/* <div>
                        <label className="text-[#323232]-400" htmlFor="zipcode">Zip Code</label>
                        <input
                          type="text"
                          name="zipcode"
                          id="zipcode"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${zipcodeError ? "border-red-500" : "bg-gray-50"}`}
                          value={zipcode}
                          onChange={(e) => {
                            setZipcode(e.target.value);
                            validateZipcode(e.target.value);
                          }}
                        />
                        {zipcodeError && <p className="text-red-500 text-xs mt-1">{zipcodeError}</p>}
                      </div> */}
                    </div>
                    <button
                      type="button"
                      className="mt-6 mb-4 w-full py-2 text-white bg-[#323232] rounded-md"
                      onClick={handleSubmit}
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
      </>
      
    );
  
};

export default DoctorProfile;
