import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../../assets/images/image.jpg";
import Footer from "../../../Components/Footer/Footer";
import { axiosInstance } from "../../../Services/AxiosConfig";
import Loading from "../../../Components/Loading/Loading";
import HeaderSwitcher from "../../../Components/Header/HeadSwitcher";
import { toast } from "react-toastify";

import {
  validateName,
  validateEmail,
  validatePhone,
  validateNum,
  validateStreet,
  validateCity,
  validateState,
  validateCountry,
} from "../../../utils/profileValidation";
import ImageCropperModal from "../../../Services/imageCroper";
import ChangePassword from "../Changepassword/ChangePassword";
import { removeKidWithId } from "../../../utils/parentFunctions";
import FeedbackButton from "../../../Components/Feedback/FeedbackButton";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [street, setStreet] = useState("");
  const [streetError, setStreetError] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [state, setState] = useState("");
  const [stateError, setStateError] = useState("");
  const [num, setNum] = useState("");
  const [numError, setNumError] = useState("");
  const [kids, setKids] = useState([])
  const [kidsError, setKidsError] = useState({});
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/parents/parentprofile", {
        withCredentials: true,
      });
      const data = response.data.data;
      console.log(response.data.child);
      
      setName(data.parentName || "");
      setEmail(data.email || "");
      setPhone(data.mobileNumber || "");
      setStreet(data.street || "");
      setCity(data.city || "");
      setState(data.state || "");
      setCountry(data.country || "");
      setNum(data.numberOfKids || "");
      setKids(response.data.child || []);
      setImage(data.image || "");
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

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

  /*........................crop image.................................*/
  const handleCropperClose = () => {
    setIsCropperOpen(false);
  };

  const handleCropSubmit = (croppedImage) => {
    console.log("Cropped Image URL:", croppedImage);
    setImage(URL.createObjectURL(croppedImage))
    setSelectedImage(croppedImage); 
    setIsCropperOpen(false);
  };

  /*...........................handling kids...........................*/
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    setKids(prevKids => {
      const updatedKids = [...prevKids];
      updatedKids[index] = { ...updatedKids[index], [name]: value };
      return updatedKids;
    });
  };

  const addKid = () => {
    setKids(prevKids => [
      ...prevKids,
      { _id: '', name: '', age: '', gender: ''} 
    ]);
  };

  const removeKid = async (kidId, index) => {
    try{
      if (kidId) {
        const result = await removeKidWithId(kidId)
        if(result.data.success){
          setKids(prevKids => prevKids.filter((_, i) => i !== index));
          toast.success(result.data.message)
        }
      }else{
         setKids(prevKids => prevKids.filter((_, i) => i !== index));
      }

  }catch(error){
    toast.error('Error removing kid');
  }
  };

  // Validate kids
  const validateKids = () => {
    let kidsErrors = {};
    kids.forEach((kid, index) => {
      if (!kid.name) kidsErrors[`name_${index}`] = "Name is required";
      if (!kid.age) {
        kidsErrors[`age_${index}`] = "Age is required";
      } else if (isNaN(kid.age) || parseInt(kid.age) <= 0) {
        kidsErrors[`age_${index}`] = "Age must be a number";
      }
      if (!kid.gender) kidsErrors[`gender_${index}`] = "Gender is required";
      
    });
    setKidsError(kidsErrors);
    console.log("validate", kidsErrors);

    return Object.keys(kidsErrors).length === 0;
  };

  
  
  const handleUpdateEmailClick = () => {
    
  };

  /*..............................password change............................*/
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  /*....................................handle cancel..........................................*/
  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const numError = validateNum(num);
    // const streetError = validateStreet(street);
    // const cityError = validateCity(city);
    // const stateError = validateState(state);
    // const countryError = validateCountry(country);

    setNameError(nameError);
    setEmailError(emailError);
    setPhoneError(phoneError);
    setNumError(numError);
    // setStreetError(streetError);
    // setCityError(cityError);
    // setStateError(stateError);
    // setCountryError(countryError);
    const kidsValid = validateKids();

    if (
      !nameError &&
      !emailError &&
      !phoneError &&
      !numError &&
      // !streetError &&
      // !cityError &&
      // !stateError &&
      // !countryError &&
      kidsValid
    ) {
      try {
        setLoading(true)

          const formData = new FormData();

          formData.append('name', name);
          formData.append('email', email);
          formData.append('phone', phone);
          formData.append('num', num);
          formData.append('street', street);
          formData.append('city', city);
          formData.append('state', state);
          formData.append('country', country);
          formData.append('kids', JSON.stringify(kids));

          if (image) {
            formData.append('image', selectedImage);
          }

        const response = await axiosInstance.post(
          "/api/parents/updateParentProfile",
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        console.log(response.data);
        const res = response.data
        if(res.success){
        setKids(res.parent.child || []);
        
        setLoading(false);
        toast.success("Profile updated successfully!",{
          className: 'custom-toast',
        });
      }else{
        toast.error(res.message)
      }
      fetchUserData();
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again",{
          className: 'custom-toast',
        });
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
  <HeaderSwitcher />
  {loading ? (
    <Loading />
  ) : (
    <div className="w-full max-w-4xl mx-auto mt-5">
      <div className="bg-white rounded shadow-xl p-6 mb-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Picture & Basic Actions */}
          <div className="text-[#323232]">
            <h2 className="text-2xl font-bold mb-4">Personal Details</h2>

            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <label htmlFor="imageInput" className="cursor-pointer">
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
                    alt="Profile"
                    className="h-48 w-48 object-cover rounded-full shadow-md"
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
                      className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full"
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

            {/* Password Update */}
            <p className="text-lg text-gray-600 mb-4">
              Want to change your password?{" "}
              <button
                className="text-blue-500 hover:underline"
                onClick={handleClickOpen}
              >
                Click here
              </button>
            </p>
            <ChangePassword open={open} onClose={handleClose} />
          </div>

          {/* Middle Column - Personal & Contact Info */}
          <div className="lg:col-span-2">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {/* Name */}
              <div className="md:col-span-2">
                <label htmlFor="full_name" className="font-semibold">Name</label>
                <input
                  type="text"
                  id="full_name"
                  className="h-10 border mt-1 rounded-xl px-4 w-full bg-gray-50 font-bold text-black"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    validateName(e.target.value);
                  }}
                />
                {nameError && (
                  <p className="text-red-500 text-xs mt-1">{nameError}</p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <label htmlFor="email" className="font-semibold">Email Address</label>
                <input
                  type="text"
                  id="email"
                  className="h-10 border mt-1 rounded-xl px-4 w-full bg-gray-50 font-bold text-black"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                />
                {/* <button
                  onClick={handleUpdateEmailClick}
                  className="text-sm text-blue-500 mt-1 absolute right-4 top-1/2 transform -translate-y-1/2 underline"
                >
                  Update Email
                </button> */}
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="font-semibold">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  className="h-10 border mt-1 rounded-xl px-4 w-full bg-gray-50 font-bold text-black"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    validatePhone(e.target.value);
                  }}
                />
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                )}
              </div>

              {/* Number of Kids */}
              <div>
                <label htmlFor="num" className="font-semibold">Number of Kids</label>
                <input
                  type="number"
                  id="num"
                  className="h-10 border mt-1 rounded-xl px-4 w-full bg-gray-50 font-bold text-black"
                  value={num}
                  onChange={(e) => {
                    setNum(e.target.value);
                    validateNum(e.target.value);
                  }}
                />
                {numError && (
                  <p className="text-red-500 text-xs mt-1">{numError}</p>
                )}
              </div>
            </div>

            {/* Kid Details */}
            <div className="mt-6">
              <label className="text-sm font-semibold">Kids Details</label>
              {kids.length > 0 ? (
                kids.map((kid, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Kid's Name */}
                      <div>
                        <label htmlFor={`kid_name_${index}`} className="text-sm">Kid's Name</label>
                        <input
                          type="text"
                          id={`kid_name_${index}`}
                          name="name"
                          value={kid.name}
                          onChange={(e) => handleInputChange(index, e)}
                          className="mt-1 border rounded-md p-2 font-bold text-black w-full"
                        />
                         {kidsError[`name_${index}`] && (
              <p className="text-red-500 text-xs mt-1">{kidsError[`name_${index}`]}</p>
            )}
                      </div>
                      {/* Kid's Age */}
                      <div>
                        <label htmlFor={`kid_age_${index}`} className="text-sm">Age</label>
                        <input
                          type="number"
                          id={`kid_age_${index}`}
                          name="age"
                          value={kid.age}
                          onChange={(e) => handleInputChange(index, e)}
                          className="mt-1 border rounded-md p-2 font-bold text-black w-full"
                        />
                         {kidsError[`age_${index}`] && (
              <p className="text-red-500 text-xs mt-1">{kidsError[`age_${index}`]}</p>
            )}
                      </div>
                      {/* Kid's Gender */}
                      <div>
                        <label htmlFor={`kid_gender_${index}`} className="text-sm">Gender</label>
                        <select
                          id={`kid_gender_${index}`}
                          name="gender"
                          value={kid.gender}
                          onChange={(e) => handleInputChange(index, e)}
                          className="mt-1 border rounded-md p-2 font-bold text-black w-full"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                    {kidsError[`gender_${index}`] && (
              <p className="text-red-500 text-xs mt-1">{kidsError[`gender_${index}`]}</p>
            )}
                      </div>
                    </div>
                    <button onClick={() => removeKid(kid._id, index)} className="text-red-500 mt-2">Remove Kid</button>
                  </div>
                ))
              ) : (
                <p className="text-xl text-red-500">No kids data available</p>
              )}
              <button onClick={addKid} className="bg-[#323232] text-white px-4 py-2 rounded-md mt-3">Add Kid</button>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-[#323232] text-white px-6 py-2 rounded-lg text-lg font-semibold"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  )}
  <FeedbackButton />
</div>
  <Footer />

    </>
  );
  
};

export default Profile
