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
  const navigate = useNavigate();

  const fetchAppointments = async (page = 1, limit = 6) => {
    try {
      const res = await getAppointments(page, limit);
      if (res.success) {
        setAppointments(res.data);
        setAppointmentList(res.data);
        setTotalPages(res.totalPages);
        setCurrentPage(res.currentPage);
        toast.success(res.message, { className: "custom-toast" });
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchAppointments(page);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
      <div className="min-h-screen flex flex-col">
        {loading ? (
          <Loading />
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-5 text-center mt-20">
              Appointments Details
            </h1>

            <div className="flex flex-col items-center justify-center">
              <div className="w-full md:w-3/4 lg:w-2/3 bg-[#E3D7CD] rounded-lg shadow-md overflow-hidden">
                {appointmentList.length === 0 ? (
                  <p className="text-center text-xl font-semibold p-8">
                    No Appointments created yet!
                  </p>
                ) : (
                  <table className="table-auto border-collapse w-full">
                    <thead>
                      <tr className="bg-[#D3C5B7] text-gray-800">
                        <th className="px-4 py-2 border">No.</th>
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Start Time</th>
                        <th className="px-4 py-2 border">Status</th>
                        <th className="px-4 py-2 border">Actions</th>
                        <th className="px-4 py-2 border">Video Session</th>
                        <th className="px-4 py-2 border">Prescription</th>
                        <th className="px-4 py-2 border">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointmentList.map((appointment, index) => (
                        <tr
                          key={appointment._id}
                          className={`hover:bg-[#FAF5E9] transition-colors duration-150 ${
                            index % 2 ? 'bg-[#FAF5E9]' : 'bg-[#E3D7CD]'
                          }`}
                        >
                          <td className="border px-4 py-2 text-center">
                            {index + 1}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {appointment.date}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {appointment.startTime}
                          </td>
                          <td className={`border px-4 py-2 text-center ${getStatusClass(appointment.appointmentStatus)}`}>
                            {appointment.appointmentStatus}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {appointment.appointmentStatus === "Pending" && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => updateAppointmentStatus(appointment._id, "Scheduled")}
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
                              </div>
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
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {renderVideoSession(appointment.appointmentStatus, appointment)}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {appointment.prescription ? (
                              <span className="text-green-800 font-semibold">Added</span>
                            ) : (
                              <span className="text-yellow-800 font-semibold">Not Added</span>
                            )}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            <button
                              onClick={() => handleDetailsClick(appointment)}
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                </div>
                </div>
                
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    />
                    </>
                
        )}
        {showCancelPopup && (
          <CustomPopup
            onCancel={() => setShowCancelPopup(false)}
            onConfirm={confirmCancel}
            message="Are you sure you want to cancel this appointment?"
          />
        )}
        {modalOpen && (
          <VideoCallModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            appointmentId={appointmentId}
            appointmentDetails={selected}
          />
        )}
      <Footer />
      </div>
    </>
  );
}

export default Consultation;
