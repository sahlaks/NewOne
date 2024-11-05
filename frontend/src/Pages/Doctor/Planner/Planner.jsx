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
        toast.success(`Slot ${newStatus ? "made available" : "made unavailable"} successfully!`);
      } catch (error) {
        toast.error("Error updating slot availability");
        console.error("Error updating slot availability:", error);
      }
    }
    setShowPopup(false);
  };

  return (
    <>
      <DoctorHeader />
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col items-center justify-center mt-20 mb-10">
            <h1 className="text-3xl font-bold mb-5">Selected Time Slots</h1>

            {slots.length === 0 ? (
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-600">No slots created yet!</p>
                <button
                  className="mt-4 bg-[#323232] text-white px-6 py-2 rounded-lg shadow-lg hover:bg-[#4A4A4A]"
                  onClick={handleCreateSlots}
                >
                  Create New Slots
                </button>
              </div>
            ) : (
              <div className="w-full md:w-3/4 lg:w-2/3 bg-[#E3D7CD] rounded-lg shadow-md overflow-hidden">
                <table className="table-auto border-collapse w-full">
                  <thead>
                    <tr className="bg-[#D3C5B7] text-gray-800">
                      <th className="px-4 py-2">No.</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Start Time</th>
                      <th className="px-4 py-2">End Time</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot, index) => (
                      <tr key={slot._id} className={`hover:bg-[#FAF5E9] transition-colors duration-150 ${index % 2 ? 'bg-[#FAF5E9]' : 'bg-[#E3D7CD]'}`}>
                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                        <td className="border px-4 py-2 text-center">{slot.date}</td>
                        <td className="border px-4 py-2 text-center">{slot.startTime}</td>
                        <td className="border px-4 py-2 text-center">{slot.endTime}</td>
                        <td className="border px-4 py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded ${
                              slot.isAvailable ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}
                          >
                            {slot.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => handleAvailability(slot)}
                            className="text-blue-500 hover:underline"
                          >
                            {slot.isAvailable ? "Make Unavailable" : "Make Available"}
                          </button>
                          <button
                            className="ml-2 text-red-500 hover:underline"
                            onClick={() => handleDelete(slot)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Create More Slots button */}
              </div>
            )}
          </div>
                <div className="mt-6 text-center">
                  <button
                    className="bg-[#323232] text-white px-6 py-2 rounded-lg shadow-lg hover:bg-[#4A4A4A]"
                    onClick={handleCreateSlots}
                  >
                    Create More Slots
                  </button>
                </div>

          {/* Custom Popup for Delete or Availability Toggle */}
          {showPopup && (
            <CustomPopup
              title={actionType.charAt(0).toUpperCase() + actionType.slice(1) + " Slot"}
              message={`Are you sure you want to ${actionType} this slot?`}
              onConfirm={handleConfirm}
              onCancel={() => setShowPopup(false)}
            />
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <Footer />
        </>
      )}
    </>
  );
}

export default Planner;
