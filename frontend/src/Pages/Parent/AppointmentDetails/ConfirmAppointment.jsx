import React, { useEffect, useState } from "react";
import HeaderSwitcher from "../../../Components/Header/HeadSwitcher";
import Loading from "../../../Components/Loading/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { ChildDetails, stripeCall } from "../../../utils/parentFunctions";
import { toast } from "react-toastify";
import Footer from "../../../Components/Footer/Footer";
import { axiosInstance } from "../../../Services/AxiosConfig";
import { loadStripe } from "@stripe/stripe-js";

function ConfirmAppointment() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const appointment = location.state?.appointment;
  const doctor = location.state?.details;
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [newChild, setNewChild] = useState({ name: "", age: "", gender: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        setLoading(true);
        const response = await ChildDetails();
        if (response.data.success) {
          setChildren(response.data.child);
          setSelectedChildId(
            response.data.child.length === 1 ? response.data.child[0]?._id : ""
          );
          setLoading(false);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch child details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildDetails();
  }, []);

  const selectedChild = children.find((child) => child._id === selectedChildId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChild((prevChild) => ({
      ...prevChild,
      [name]: value,
    }));
  };

  const makePayment = async () => {
    if (!selectedChild) {
      if (!newChild.name || !newChild.age || !newChild.gender) {
        toast.error("Please enter the child's name ,age and geder");
        return;
      }

      if (isNaN(newChild.age) || newChild.age <= 0) {
        toast.error("Please enter a valid age.");
        return;
      }

      const validGenders = ["Male", "Female", "Other"];
      if (!validGenders.includes(newChild.gender)) {
        toast.error("Please enter a valid gender (Male, Female, or Other).");
        return;
      }
    }
    
    const stripe = await loadStripe(
      "pk_test_51Q0LPv2NKJ47VgiTAMnrWs0aVTj0bQVTjTzmgsiX8MFEQWIOR80C1Y5lnHB9fJmMw3gSUKJoD4LsNwVpy4jw88Va00Gmhd7mO3"
    );

    const paymentData = {
      amount: doctor.fees * 100,
    };

    const parentDataString = localStorage.getItem("parentData");
    const parentData = JSON.parse(parentDataString);

    const appointmentDetails = {
      name: selectedChild?.name || newChild.name,
      age: selectedChild?.age || newChild.age,
      gender: selectedChild?.gender || newChild.gender,
      doctorId: doctor._id,
      doctorName: doctor.doctorName,
      parentName: parentData?.parentName,
      childId: selectedChild?._id || null,
      slotId: appointment._id,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      fees: doctor.fees,
    };

    try {
      const response = await stripeCall(paymentData, appointmentDetails);
      const session = response.data;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error in creating checkout session:", error);
    }
  };

  return (
    <>
      <HeaderSwitcher />
      <div className="min-h-screen flex flex-col items-center justify-center">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex flex-col md:flex-row mt-10 md:mt-10 max-w-6xl w-full justify-center">
              {/* Appointment Confirmation */}
              <div className="text-center bg-[#DDD0C8] shadow-lg rounded-lg p-5 mt-10 w-full md:w-1/2 md:mr-2">
                <h1 className="text-3xl font-bold mb-5">
                  Appointment Confirmation
                </h1>
                {appointment && doctor ? (
                  <div className="space-y-1">
                    <p className="text-xl font-bold">
                      Doctor Name:{" "}
                      <span className="font-normal">
                        Dr. {doctor.doctorName}
                      </span>
                    </p>
                    <p className="text-xl font-bold">
                      Specialization:{" "}
                      <span className="font-normal">
                        {doctor.specialization}
                      </span>
                    </p>
                    <p className="text-xl font-bold">
                      Fees: <span className="font-normal">{doctor.fees}</span>
                    </p>
                    <div className="bg-white shadow-lg rounded-lg p-4">
                      <p className="text-xl font-bold">
                        Date:{" "}
                        <span className="font-normal">{appointment.date}</span>
                      </p>
                      <p className="text-xl font-bold">
                        Time:{" "}
                        <span className="font-normal">
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p>No appointment details available.</p>
                )}
              </div>

              {/* Appointment for Child */}
              <div className="mt-10 bg-[#DDD0C8] shadow-lg rounded-lg p-6 text-left mb-5 w-full md:w-1/2 md:ml-2">
                <h2 className="text-2xl font-semibold mb-4">
                  Appointment for Child
                </h2>
                {children.length > 0 ? (
                  <div>
                    {children.length > 1 ? (
                      <div className="mb-4">
                        <label htmlFor="child" className="text-xl font-bold">
                          Select Child:
                        </label>
                        <select
                          id="child"
                          className="w-full mt-2 p-2 border rounded-md"
                          value={selectedChildId}
                          onChange={(e) => setSelectedChildId(e.target.value)}
                        >
                          <option value="" disabled>
                            Choose a child
                          </option>
                          {children.map((child) => (
                            <option key={child._id} value={child._id}>
                              {child.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <p className="text-xl font-bold mb-4">
                        Child:{" "}
                        <span className="font-normal">
                          {children[0]?.name} - Age: {children[0]?.age} -
                          Gender: {children[0]?.gender}
                        </span>
                      </p>
                    )}

                    <div className="mb-4">
                      <label htmlFor="age" className="text-xl font-bold">
                        Child's Age:
                      </label>
                      <input
                        id="age"
                        type="number"
                        value={selectedChild?.age || ""}
                        className="w-full mt-2 p-2 border rounded-md"
                        placeholder="Enter age"
                        readOnly
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="gender" className="text-xl font-bold">
                        Child's Gender:
                      </label>
                      <input
                        id="gender"
                        type="text"
                        value={selectedChild?.gender || ""}
                        className="w-full mt-2 p-2 border rounded-md"
                        placeholder="Enter gender"
                        readOnly
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-5">
                    <p>
                      No child data available. Please enter the child details
                      below:
                    </p>

                    <div className="mt-4">
                      <label htmlFor="childName" className="text-xl font-bold">
                        Child's Name:
                      </label>
                      <input
                        id="childName"
                        name="name"
                        type="text"
                        value={newChild.name}
                        onChange={handleInputChange}
                        className="w-full mt-2 p-2 border rounded-md"
                        placeholder="Enter child's name"
                      />
                    </div>

                    <div className="mt-4">
                      <label htmlFor="childAge" className="text-xl font-bold">
                        Child's Age:
                      </label>
                      <input
                        id="childAge"
                        name="age"
                        type="number"
                        value={newChild.age}
                        onChange={handleInputChange}
                        className="w-full mt-2 p-2 border rounded-md"
                        placeholder="Enter child's age"
                      />
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="childGender"
                        className="text-xl font-bold"
                      >
                        Child's Gender:
                      </label>
                      <input
                        id="childGender"
                        name="gender"
                        type="text"
                        value={newChild.gender}
                        onChange={handleInputChange}
                        className="w-full mt-2 p-2 border rounded-md"
                        placeholder="Enter child's gender"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="bg-[#323232] text-white px-6 py-3 rounded-lg mt-5 mb-5"
              onClick={makePayment}
            >
              Proceed To Payment
            </button>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ConfirmAppointment;
