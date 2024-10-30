import React, { useEffect, useState } from "react";
import HeaderSwitcher from "../../../Components/Header/HeadSwitcher";
import Loading from "../../../Components/Loading/Loading";
import { deleteSlot, fetchSlotsFromDB, updateSlotAvailability } from "../../../Services/API/DoctorAPI";
import { useNavigate } from "react-router-dom";
import Footer from "../../../Components/Footer/Footer";
import { toast } from "react-toastify";
import CustomPopup from "../../../Components/CustomPopUp/CustomPopup";
import DoctorHeader from "../../../Components/Header/DoctorHeader";
import Pagination from "../../../Components/Pagination/Pagination";


function Planner() {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [actionType, setActionType] = useState(""); 
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const fetchSlots = async (page = 1, limit = 6) => {
    setLoading(true);
    try {
      const response = await fetchSlotsFromDB(page, limit);
      setSlots(response.slots);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      toast.error("Error fetching slots");
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchSlots(page);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleCreateSlots = () => {
    navigate("/timeslotform");
  };

  const handleAvailability = (slot) => {
    setSelectedSlot(slot);
    setActionType("toggle availability");
    setShowPopup(true);
  };

  const handleDelete = (slot) => {
    setSelectedSlot(slot);
    setActionType("delete");
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    if (actionType === "delete") {
      try {
        const update = await deleteSlot(selectedSlot._id);
        if (update.data.success) {
          toast.success(update.data.message);
          fetchSlots();
        } else {
          toast.error("Error deleting slot");
        }
      } catch (error) {
        toast.error("Error deleting slot");
        console.error("Error deleting slot:", error);
      }
    } else if (actionType === "toggle availability") {
      try {
        const newStatus = !selectedSlot.isAvailable;
        await updateSlotAvailability(selectedSlot._id, newStatus);
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot._id === selectedSlot._id ? { ...slot, isAvailable: newStatus } : slot
          )
        );
        toast.success(
          `Slot ${newStatus ? "made available" : "made unavailable"} successfully!`
        );
      } catch (error) {
        toast.error("Error updating slot availability");
        console.error("Error updating slot availability:", error);
      }
    }

    // Close popup after action
    setShowPopup(false);
  };

  return (
    <>
      <DoctorHeader />
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Table layout for large screens */}
          <div className="hidden md:flex flex-col items-center justify-center mt-20 mb-10">
            <h1 className="text-2xl font-bold mb-5">Selected Time Slots</h1>

            {slots.length === 0 ? (
              <div className="text-center">
                <p className="text-xl font-bold text-gray-700">No slots created yet!</p>
                <button
                  className="mt-4 bg-[#323232] text-white px-4 py-2 rounded"
                  onClick={handleCreateSlots}
                >
                  Create New Slots
                </button>
              </div>
            ) : (
              <div className="w-full md:w-3/4 lg:w-2/3">
                <table className="table-auto border-collapse border border-black-100 w-full bg-[#DDD0C8]">
                  <thead>
                    <tr className="bg-white border-b border-black-300">
                      <th className="border-r border-black-300 px-4 py-2 text-center">No.</th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">Date</th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">Start Time</th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">End Time</th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">Status</th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot, index) => (
                      <tr key={slot._id}>
                        <td className="border-r border-black-300 px-4 py-2 text-center">{index + 1}</td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">{slot.date}</td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">{slot.startTime}</td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">{slot.endTime}</td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded ${
                              slot.isAvailable
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {slot.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="border-r border-gray-300 px-4 py-2 text-center">
                          <button
                            onClick={() => handleAvailability(slot)}
                            className={`px-1 py-1 rounded text-blue-500 text-underline`}
                          >
                            {slot.isAvailable ? "Make Unavailable" : "Make Available"}
                          </button>
                          <button
                            className="ml-2 text-red-500"
                            onClick={() => handleDelete(slot)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-8 text-center">
                  <button
                    className="bg-[#323232] text-white px-4 py-2 rounded"
                    onClick={handleCreateSlots}
                  >
                    Create More Slots
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card layout for small and medium screens */}
          <div className="md:hidden p-4 mt-20">
            <h1 className="text-xl font-bold mb-5 text-center">Selected Time Slots</h1>
            
            {slots.length === 0 ? (
              <div className="text-center">
                <p className="text-xl font-bold text-gray-700">No Slots created yet!</p>
              </div>
            ) : (
              slots.map((slot, index) => (
                <div
                  key={slot._id}
                  className="border border-[#FAF5E9]-500 shadow-lg p-4 mb-4 bg-[#DDD0C8]"
                >
                  <p>
                    <strong>No:</strong> {index + 1}
                  </p>
                  <p>
                    <strong>Date:</strong> {slot.date}
                  </p>
                  <p>
                    <strong>Start Time:</strong> {slot.startTime}
                  </p>
                  <p>
                    <strong>End Time:</strong> {slot.endTime}
                  </p>
                  <p>
                    <strong>
                      <span
                        className={`px-2 py-1 rounded ${
                          slot.isAvailable
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {slot.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </strong>
                  </p>
                  <p>
                    <button
                      onClick={() => handleAvailability(slot)}
                      className={`px-1 py-1 rounded text-blue-500 text-underline`}
                    >
                      {slot.isAvailable ? "Make Unavailable" : "Make Available"}
                    </button>
                    <button
                      className="ml-2 text-red-500"
                      onClick={() => handleDelete(slot)}
                    >
                      Delete
                    </button>
                  </p>
                </div>
              ))
            )}
            <div className="mt-8 text-center">
              <button
                className="bg-[#323232] text-white px-4 py-2 rounded"
                onClick={handleCreateSlots}
              >
                Create More Slots
              </button>
            </div>
          </div>

          {/* Custom Popup for Delete or Availability Toggle */}
          {showPopup && (
            <CustomPopup
              title={
                actionType.charAt(0).toUpperCase() + actionType.slice(1) + " Slot"
              }
              message={`Are you sure you want to ${actionType} this slot?`}
              onConfirm={handleConfirm}
              onCancel={() => setShowPopup(false)}
            />
          )}
        </>
      )}
      <Pagination
         currentPage={currentPage}
         totalPages={totalPages}
         onPageChange={handlePageChange}
      />
      <Footer />
    </>
  );
}

export default Planner;
