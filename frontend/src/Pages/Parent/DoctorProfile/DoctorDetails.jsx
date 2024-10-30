import React, { useEffect, useState } from "react";
import Footer from "../../../Components/Footer/Footer";
import HeaderSwitcher from "../../../Components/Header/HeadSwitcher";
import Loading from "../../../Components/Loading/Loading";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  bookAppointment,
  doctorDetails,
  fetchDoctorFeedback,
} from "../../../utils/parentFunctions";
import { toast } from "react-toastify";
import defaultImage from "../../../assets/images/image.jpg";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

function DoctorDetails() {
  const { doctorId } = useParams();
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [doctorAvailableDates, setDoctorAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const response = await doctorDetails(doctorId);
        const feedbackResponse = await fetchDoctorFeedback(doctorId);
        if (response.data.success) {
          setDoctor(response.data.doctor);
          setSlots(response.data.slots);
          const availableDates = response.data.slots.map(
            (slot) => new Date(slot.date)
          );
          setDoctorAvailableDates(availableDates);
          if (feedbackResponse.success) {
            setFeedbacks(feedbackResponse.data);
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch doctor details:", error);
        toast.error("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const getSlotTime = (slot) => {
    const [hour, minute] = slot.startTime.split(":");
    const slotDate = new Date(slot.date);
    slotDate.setHours(hour, minute, 0, 0);
    return slotDate;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const now = new Date();

    // const selectedSlots = slots.filter(
    //   (slot) => new Date(slot.date).toDateString() === date.toDateString()
    // );

    const newselectedSlots = slots.filter((slot) => {
      const slotDate = new Date(slot.date);
      const resetTime = (date) => new Date(date.setHours(0, 0, 0, 0));
      const isSameDay =
        resetTime(slotDate).toDateString() === resetTime(date).toDateString();

      if (isSameDay) {
        const slotTime = getSlotTime(slot);
        return slotTime >= now;
      }
      return false;
    });

    setAvailableSlots(newselectedSlots);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot((prevSelectedSlot) =>
      prevSelectedSlot?._id === slot._id ? null : slot
    );
  };

  const handleAppointment = () => {
    if (selectedSlot && doctor) {
      toast.success(
        `Appointment selected for ${selectedSlot.date} at ${selectedSlot.startTime}`,
        {
          className: "custom-toast",
        }
      );
      navigate("/confirm-appointment", {
        state: { appointment: selectedSlot, details: doctor },
      });
    } else {
      toast.error("Please select a slot before booking.");
    }
  };

  const renderStars = (average) => {
    const fullStars = Math.floor(average);
    const hasHalfStar = average - fullStars >= 0.5;
    let stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} style={{ color: "yellow" }} />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half-star"
          icon={faStarHalfAlt}
          style={{ color: "yellow" }}
        />
      );
    }
    while (stars.length < 5) {
      stars.push(
        <FontAwesomeIcon
          key={stars.length}
          icon={faStar}
          style={{ color: "lightgray" }}
        />
      );
    }
    return stars;
  };

  return (
    <>
      <HeaderSwitcher />

      <div className="flex justify-center items-center min-h-screen mt-5 md:mt-10">
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col md:flex-row max-w-6xl w-full items-center justify-center">
            {/* Doctor Details */}
            <div className=" flex flex-col bg-[#DDD0C8] shadow-lg rounded-lg items-center m-5 w-full md:w-1/2 ml-5 md:ml-5 mr-5 md:mr-5 min-w-[300px] p-2">
              <h2 className="text-2xl font-semibold text-center">
                Details of Selected Doctor
              </h2>
              <img
                className="w-64 h-64 object-cover rounded-lg mt-4"
                src={doctor?.image || defaultImage}
                alt={doctor?.doctorName || ""}
              />

              {/* Doctor details centered */}
              <div className="text-center">
                <h2 className="text-3xl font-bold">Dr. {doctor?.doctorName}</h2>
                <p className="text-xl text-gray-600 mt-2">
                  {doctor?.specialization}
                </p>
                <p className="mt-4">{doctor?.bio}</p>
              </div>
            </div>

            {/* Right side: Available Slots */}
            <div className="flex flex-col p-6 items-center w-full md:w-1/2 min-w-[300px] justify-space md:mt-10">
              {doctorAvailableDates.length > 0 ? (
                <>
                  <h2 className="text-2xl font-semibold text-center">
                    Choose an Appointment Date from the highlighted ones!
                  </h2>
                  <div className="calendar-container">
                    <ReactDatePicker
                      selected={selectedDate}
                      onChange={handleDateSelect}
                      highlightDates={doctorAvailableDates}
                      inline
                    />
                  </div>

                  <div className="mt-5 p-4  h-[250px] overflow-y-auto">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <label
                          key={slot._id}
                          className="flex bg-[#DDD0C8] items-center p-4 rounded-lg shadow-md cursor-pointer mb-5"
                          onClick={() => handleSlotSelect(slot)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSlot?._id === slot._id}
                            readOnly
                            className="form-checkbox text-blue-500"
                          />
                          <div className="ml-4 flex flex-row justify-between w-full">
                            <div className="font-bold text-[#323232]">
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </div>
                        </label>
                      ))
                    ) : (
                      <p className="text-center text-xl text-red-500">
                        Doctor on leave
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xl text-red-500">No available dates</p>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedSlot && (
        <div className="mb-5 text-center">
          <button
            className="bg-[#323232] text-white px-6 py-3 rounded-lg hover:bg-[#323232]-800"
            onClick={handleAppointment}
          >
            Book Appointment
          </button>
        </div>
      )}

      <Link to="/find-doctor" className="text-center">
        <p className="text-xl text-blue-500 hover:underline">Back to results</p>
      </Link>

      <div className="w-full bg-[#DDD0C8] py-4">
        <h3 className="text-2xl font-semibold text-center">
          Feedback from Parents
        </h3>
        <div className="flex flex-col items-center max-w-7xl mx-auto px-4">
          {feedbacks.length > 0 ? (
            feedbacks.map((review) => (
              <div
                key={review._id}
                className="bg-white shadow-md p-4 rounded-lg mb-4 w-full max-w-4xl"
              >
                <p className="text-gray-700">{review.feedback}</p>
                <h3 className="text-black font-bold">{review.parentName}</h3>
                <div className="mt-2 flex items-center">
                  {renderStars(review.reviewRating)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No feedback available for this doctor.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default DoctorDetails;
