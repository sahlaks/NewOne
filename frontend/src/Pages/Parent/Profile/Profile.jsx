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
    const streetError = validateStreet(street);
    const cityError = validateCity(city);
    const stateError = validateState(state);
    const countryError = validateCountry(country);

    setNameError(nameError);
    setEmailError(emailError);
    setPhoneError(phoneError);
    setNumError(numError);
    setStreetError(streetError);
    setCityError(cityError);
    setStateError(stateError);
    setCountryError(countryError);
    const kidsValid = validateKids();

    if (
      !nameError &&
      !emailError &&
      !phoneError &&
      !numError &&
      !streetError &&
      !cityError &&
      !stateError &&
      !countryError &&
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
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <HeaderSwitcher/>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen p-6 flex items-center justify-center mt-5">
          <div>
            <div>
              <div className=" rounded shadow-xl p-4 px-4 md:p-8 mb-6">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                  <div className="text-[#323232]">
                    <p className=" text-2xl font-bold">Personal Details</p>

                    <div className="flex flex-col max-w-md p-6 dark:text-gray-100">
                      <label
                        htmlFor="imageInput"
                        className="text-slate-400 cursor-pointer"
                      >
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
                            className="flex-shrink-0 object-cover h-64 rounded-sm sm:h-96 dark:bg-gray-500 aspect-square"
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
                              className="absolute top-0 right-0 p-2 bg-red-500 btn btn-primary bg-blue-500 text-white px-4 py-2 rounded-md"
                              onClick={() => setImage(null)}
                            >
                              X
                            </button>
                          )}
                        </div>
                        {imageError && (
                          <p className="text-red-500 text-xs mt-1">
                            {imageError}
                          </p>
                        )}
                      </label>
                    </div>

                    <div>
                      <p className="text-xl text-gray-600">
                        Want to change your password?{" "}
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            handleClickOpen();
                          }}
                        >
                          Click here
                        </button>
                      </p>
                      <ChangePassword open={open} onClose={handleClose} />
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label
                          className="text-[#323232]-600"
                          htmlFor="full_name"
                        >
                          Name
                        </label>
                        <input
                          style={{ fontWeight: "bold", color: "black" }}
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
                        {nameError && (
                          <p className="text-red-500 text-xs mt-1">
                            {nameError}
                          </p>
                        )}
                      </div>

                      <div style={{ position: "relative" }}>
                        <div>
                          <label htmlFor="email">Email Address</label>
                          <div style={{ position: "relative" }}>
                            <input
                              style={{ fontWeight: "bold", color: "black" }}
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
                            <button
                              onClick={handleUpdateEmailClick}
                              className="text-sm text-blue-500 mt-1 absolute right-4 top-1/2 transform -translate-y-1/2 underline"
                            >
                              Update Email
                            </button>
                          </div>
                          {emailError && (
                            <p className="text-red-500 text-xs mt-1">
                              {emailError}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-[#323232]-400" htmlFor="phone">
                          Phone Number
                        </label>
                        <input
                          style={{ fontWeight: "bold", color: "black" }}
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
                        {phoneError && (
                          <p className="text-red-500 text-xs mt-1">
                            {phoneError}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[#323232]-400" htmlFor="num">
                          Number of kids
                        </label>
                        <input
                          style={{ fontWeight: "bold", color: "black" }}
                          type="number"
                          name="num"
                          id="num"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${numError ? "border-red-500" : "bg-gray-50"}`}
                          value={num}
                          onChange={(e) => {
                            setNum(e.target.value);
                            validateNum(e.target.value);
                          }}
                        />
                        {numError && (
                          <p className="text-red-500 text-xs mt-1">
                            {numError}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col max-w-md p-6 dark:text-gray-100">
                      <label className="text-sm">Kids Details</label>
                      {kids.length > 0 ? (
                        
                      kids.map((kid, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg">
                          <div className="flex flex-col mb-2">
                            <label htmlFor={`kid_name_${index}`} className="text-sm">
                              <span className="text-red-500">*</span> Kid's Name
                            </label>
                            <input
                              style={{ fontWeight: 'bold', color: 'black' }}
                              type="text"
                              id={`kid_name_${index}`}
                              name="name"
                              value={kid.name}
                              onChange={(e) => handleInputChange(index, e)}
                              className="mt-1 border rounded-md p-2"
                            />
                            {kidsError[`name_${index}`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {kidsError[`name_${index}`]}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col mb-2">
                            <label htmlFor={`kid_age_${index}`} className="text-sm">
                              <span className="text-red-500">*</span> Age
                            </label>
                            <input
                              style={{ fontWeight: 'bold', color: 'black' }}
                              type="number"
                              id={`kid_age_${index}`}
                              name="age"
                              value={kid.age}
                              onChange={(e) => handleInputChange(index, e)}
                              className="mt-1 border rounded-md p-2"
                            />
                            {kidsError[`age_${index}`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {kidsError[`age_${index}`]}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col mb-2">
                            <label htmlFor={`kid_gender_${index}`} className="text-sm">
                              <span className="text-red-500">*</span> Gender
                            </label>
                            <select
                              id={`kid_gender_${index}`}
                              name="gender"
                              value={kid.gender}
                              onChange={(e) => handleInputChange(index, e)}
                              className="mt-1 border rounded-md p-2"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            {kidsError[`gender_${index}`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {kidsError[`gender_${index}`]}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => removeKid(kid._id,index)}
                            className="text-red-500 mt-2"
                          >
                            Remove Kid
                          </button>
                        </div>
                      ))
                    ) : (
                      <h2 className="text-xl text-red-500">No kids data available</h2>
                    )}
                      <button
                        onClick={addKid}
                        className="bg-[#323232] text-white px-4 py-2 rounded-md"
                      >
                        Add Kid
                      </button>
                    </div>

                      {/* Other Details */}

                      <div className="md:col-span-2">
                        <label className="text-[#323232]-400" htmlFor="street">
                          Street Address
                        </label>
                        <input
                          style={{ fontWeight: "bold", color: "black" }}
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
                        {streetError && (
                          <p className="text-red-500 text-xs mt-1">
                            {streetError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-[#323232]-400" htmlFor="city">
                          City
                        </label>
                        <input
                          style={{ fontWeight: "bold", color: "black" }}
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
                        {cityError && (
                          <p className="text-red-500 text-xs mt-1">
                            {cityError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-[#323232]-400" htmlFor="state">
                          State / province
                        </label>
                        <input
                          style={{ fontWeight: "bold", color: "black" }}
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
                        {stateError && (
                          <p className="text-red-500 text-xs mt-1">
                            {stateError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-[#323232]-400" htmlFor="country">
                          Country
                        </label>
                        <input
                          style={{ fontWeight: "bold", color: "black" }}
                          type="text"
                          name="country"
                          id="country"
                          className={`h-10 border mt-1 rounded-xl px-4 w-full ${countryError ? "border-red-500" : "bg-gray-50"}`}
                          value={country}
                          onChange={(e) => {
                            setCountry(e.target.value);
                            validateCountry(e.target.value);
                          }}
                        />
                        {countryError && (
                          <p className="text-red-500 text-xs mt-1">
                            {countryError}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2 text-right">
                        <div className="flex justify-end space-x-3">
                          <div>
                            <button
                              className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              type="button"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </div>
                          <div>
                            <button
                              className="bg-[#323232] hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              type="submit"
                              onClick={handleSubmit}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center text-gray-400 mt-3">
                By using this service, you agree to the terms and privacy
                policy.
              </p>
            </div>
          </div>
        </div>
      )}
      <div>
        <Footer />
      </div>
    </div>
      <FeedbackButton/>
    </>
  );
};

export default Profile
