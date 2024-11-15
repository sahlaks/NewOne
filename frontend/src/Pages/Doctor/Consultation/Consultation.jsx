
import React, { useEffect, useState } from "react";
import Footer from "../../../Components/Footer/Footer";
import DoctorHeader from "../../../Components/Header/DoctorHeader";
import Loading from "../../../Components/Loading/Loading";
import { toast } from "react-toastify";
import { changeStatus, getAppointments } from "../../../Services/API/DoctorAPI";
import CustomPopup from "../../../Components/CustomPopUp/CustomPopup";
import Pagination from "../../../Components/Pagination/Pagination";
import { FaVideo, FaTimesCircle } from "react-icons/fa";
import { useSocket } from "../../../Context/SocketContext";
import VideoCallModal from "../../../Components/Video/VideoCallModal";
import { useNavigate } from "react-router-dom";

function Consultation() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [appointmentList, setAppointmentList] = useState([]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const socket = useSocket();
  const doctorData = JSON.parse(localStorage.getItem("doctorData"));
  const senderId = doctorData?._id;

  const [modalOpen, setModalOpen] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [selected, setSelected] = useState({}); 

  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [prescription, setPrescription] = useState("")

  const navigate = useNavigate()

  const fetchAppointments = async (page = 1, limit = 6, search='', status='', prescription='') => {
    try {
      const res = await getAppointments(page, limit, search, status, prescription);
      if (res.success) {
        setAppointments(res.data);
        setAppointmentList(res.data);
        setTotalPages(res.totalPages);
        setCurrentPage(res.currentPage);
        
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchAppointments(page,6,searchQuery,status,prescription);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePrescription = (e) => {
    setPrescription(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchAppointments(currentPage,6,searchQuery,status,prescription);
  }, [currentPage,searchQuery,status,prescription]);


  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const updatedAppointments = appointmentList.map((appointment) =>
        appointment._id === appointmentId
          ? { ...appointment, appointmentStatus: newStatus }
          : appointment
      );
      setAppointmentList(updatedAppointments);
      setAppointments(updatedAppointments);
      const response = await changeStatus(appointmentId, newStatus);
      if (response.success) {
        toast.success(`Appointment status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update the appointment status");
        setAppointmentList(appointments);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Error updating appointment status");
      setAppointmentList(appointments);
    }
  };

  const handleCancel = (appointmentId) => {
    setAppointmentToCancel(appointmentId);
    setShowCancelPopup(true);
  };

  const confirmCancel = async () => {
    if (appointmentToCancel) {
      await updateAppointmentStatus(appointmentToCancel, "Cancelled");
      setAppointmentToCancel(null);
      setShowCancelPopup(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-800";
      case "Scheduled":
        return "text-blue-800";
      case "Completed":
        return "text-green-800";
      case "Cancelled":
        return "text-red-800";
      default:
        return "";
    }
  };

  const handleVideoClick = (appointment) => {
    setAppointmentId(appointment._id);
    setSelected(appointment);
    setModalOpen(true);
  };

  const renderVideoSession = (status, appointment) => {
    switch (status) {
      case "Scheduled":
        return (
          <button
            className="text-blue-800 flex items-center justify-center"
            onClick={() => handleVideoClick(appointment)}
          >
            <FaVideo size={20} />
            <span className="ml-2">On Time</span>
          </button>
        );
      case "Pending":
        return <div className="text-yellow-800 flex items-center">Waiting</div>;
      case "Cancelled":
        return (
          <div className="text-red-800 flex items-center">
            <FaTimesCircle size={20} />
          </div>
        );
      default:
        return <span>-</span>;
    }
  };

  const handleDetailsClick = (appointment) => {
    navigate(`/consultation/details`, { state: { appointment } });
  };

  useEffect(() => {
    if (!socket) {
      console.log("Socket is undefined");
      return;
    }
    if (senderId) {
      socket.emit("user_connected", senderId);
      console.log(`User connected with ID: ${senderId}`);
    }
  }, [socket]);

  return (
    <>
      <DoctorHeader />
        {loading ? (
          <Loading />
        ) : (
          <>
           <div className="flex flex-col items-center justify-center mt-20 mb-10">
            <h1 className="text-2xl font-bold mb-5 text-center">
              Appointments Details
            </h1>
            <div className="flex space-x-4 mb-5">
              <input
                type="text"
                placeholder="Search Date or Time "
                className="search-input px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring focus:border-blue-300"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                value={status}
                onChange={handleStatusChange}
              >
                <option value="">Status</option>
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                value={prescription}
                onChange={handlePrescription}
              >
                <option value="">Prescription</option>
                <option value="true">Added</option>
                <option value="false">Not Added</option>
              </select>
            </div>
            {/* Table view for large screens */}
            <div className="hidden lg:block w-full md:w-3/4 lg:w-2/3 bg-[#E3D7CD] mx-auto">
              {appointmentList.length === 0 ? (
                <p className="text-center text-xl font-bold">
                  No Appointments created yet!
                </p>
              ) : (
                <table className="table-auto border-collapse border border-black-300 w-full bg-[#DDD0C8]">
                  <thead>
                    <tr className="border-b border-black-300 bg-[#D3C5B7]">
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        No.
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Date
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Start Time
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Status
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Actions
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Video Session
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        Prescription
                      </th>
                      <th className="border-r border-black-300 px-4 py-2 text-center">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentList.map((appointment, index) => (
                      <tr key={appointment._id} className={`hover:bg-[#FAF5E9] transition-colors duration-150 ${
                        index % 2 ? 'bg-[#FAF5E9]' : 'bg-[#E3D7CD]'
                      }`}>

                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {appointment.date}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {appointment.startTime}
                        </td>
                        <td
                          className={`border-r border-black-300 px-4 py-2 text-center ${getStatusClass(
                            appointment.appointmentStatus
                          )}`}
                        >
                          {appointment.appointmentStatus}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {appointment.appointmentStatus === "Pending" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  updateAppointmentStatus(
                                    appointment._id,
                                    "Scheduled"
                                  )
                                }
                                className="bg-[#323232] hover:bg-gray-700 text-white py-1 px-4 rounded"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleCancel(appointment._id)}
                                className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded ml-2"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {appointment.appointmentStatus === "Scheduled" && (
                            <button
                              onClick={() => handleCancel(appointment._id)}
                              className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded"
                            >
                              Cancel
                            </button>
                          )}
                          {appointment.appointmentStatus === "Cancelled" && (
                            <span>No actions available</span>
                          )}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {renderVideoSession(
                            appointment.appointmentStatus,
                            appointment
                          )}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          {appointment.prescription ? (
                            <span className="text-green-800 font-semibold">
                              Added
                            </span>
                          ) : (
                            <span className="text-yellow-800 font-semibold">
                              Not Added
                            </span>
                          )}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2 text-center">
                          <button className="underline" onClick={()=>handleDetailsClick(appointment)}>

                          Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              </div>
            </div>

            {/* Card view for medium and small screens */}
            <div className="block lg:hidden w-full px-4 md:w-3/4 lg:w-2/3 mx-auto mb-10">
              {appointmentList.length === 0 ? (
                <p className="text-center text-xl font-bold">
                  No Appointments created yet!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appointmentList.map((appointment, index) => (
                    <div
                      key={appointment._id}
                      className="bg-[#DDD0C8] p-4 rounded-sm shadow-md border border-gray-300"
                    >
                      <div className="mb-4">
                        <span className="font-semibold">No: </span>
                        {index + 1}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Date: </span>
                        {appointment.date}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Start Time: </span>
                        {appointment.startTime}
                      </div>
                      <div
                        className={`mb-4 ${getStatusClass(
                          appointment.appointmentStatus
                        )}`}
                      >
                        <span className="font-semibold">Status: </span>
                        {appointment.appointmentStatus}
                      </div>
                      <div className="flex justify-between">
                        {appointment.appointmentStatus === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment._id,
                                  "Scheduled"
                                )
                              }
                              className="bg-[#323232] hover:bg-gray-700 text-white py-1 px-2 rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleCancel(appointment._id)}
                              className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.appointmentStatus === "Scheduled" && (
                          <button
                            onClick={() => handleCancel(appointment._id)}
                            className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                          >
                            Cancel
                          </button>
                        )}
                        {appointment.appointmentStatus === "Cancelled" && (
                          <span>No actions available</span>
                        )}
                      </div>
                      <div className="ml-2">
                        {renderVideoSession(
                          appointment.appointmentStatus,
                          appointment
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Prescription: </span>
                        {appointment.prescription ? (
                          <span className="text-green-800 font-semibold">
                            Added
                          </span>
                        ) : (
                          <span className="text-yellow-800 font-semibold">
                            Not Added
                          </span>
                        )}
                      </div>
                      <div className="mb-2">
                        <button>
                        <span className="font-semibold underline" onClick={() => handleDetailsClick(appointment)}>Details </span>
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <Footer />

      {/* Custom Popup for confirming cancellation */}
      {showCancelPopup && (
        <CustomPopup
          title="Confirm Cancellation"
          message="Are you sure you want to cancel this appointment?"
          onConfirm={confirmCancel}
          onCancel={() => setShowCancelPopup(false)}
        />
      )}

      <VideoCallModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={{
          role: "Doctor",
          id: appointmentId,
          isInitiator: true,
          userid: senderId,
        }}
        appointment={selected}
      />
    </>
  );
}

export default Consultation;

