import React, { useEffect, useState } from "react";
import Loading from "../../../Components/Loading/Loading";
import { getAppointments } from "../../../utils/parentFunctions";
import ParentHeader from "../../../Components/Header/ParentHeader";
import Footer from "../../../Components/Footer/Footer";
import Pagination from "../../../Components/Pagination/Pagination";
import FeedbackButton from "../../../Components/Feedback/FeedbackButton";
import { FaVideo, FaTimesCircle } from "react-icons/fa";
import { useSocket } from "../../../Context/SocketContext";
import VideoCallModal from "../../../Components/Video/VideoCallModal";
import { useNavigate } from "react-router-dom";

function ShowAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const socket = useSocket();
  const parentData = JSON.parse(localStorage.getItem("parentData"));
  const senderId = parentData?._id;

  const [modalOpen, setModalOpen] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [selected, setSelected] = useState({});

  const navigate = useNavigate();

  const fetchAppointments = async (page = 1, limit = 6) => {
    try {
      const response = await getAppointments(page, limit);
      if (response.success) {
        setAppointments(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments: ", error);
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

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600";
      case "Scheduled":
        return "text-blue-600";
      case "Completed":
        return "text-green-600";
      case "Cancelled":
        return "text-red-600";
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
            className="flex items-center text-blue-500 hover:text-blue-700 transition-all duration-150"
            onClick={() => handleVideoClick(appointment)}
          >
            <FaVideo size={20} />
            <span className="ml-2">Join Session</span>
          </button>
        );
      case "Pending":
        return <div className="text-yellow-500">Waiting</div>;
      case "Cancelled":
        return <div className="text-red-500 flex items-center"><FaTimesCircle size={20} /></div>;
      default:
        return <span>-</span>;
    }
  };

  const handleDetailsClick = (appointment) => {
    navigate(`/appointments/details`, { state: { appointment } });
  };

  useEffect(() => {
    if (!socket) {
      console.log("Socket is undefined");
      return;
    }
    if (senderId) {
      const role = 'Parent';
      socket.emit("user_connected", senderId);
      socket.emit('join', { senderId, role });
      console.log(`User connected with ID: ${senderId}`);
    }
  }, [socket]);

  return (
    <>
      <ParentHeader />
      <div className="min-h-screen flex flex-col">
        {loading ? (
          <Loading />
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-center mt-16 mb-10">
              Appointments Overview
            </h1>

            <div className="hidden md:flex flex-col items-center justify-center mt-2 mb-10">
              {appointments.length === 0 ? (
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-700">
                    No Appointments available!
                  </p>
                </div>
              ) : (
                <div className="w-full md:w-3/4 lg:w-2/3 bg-[#E3D7CD] rounded-lg shadow-md overflow-hidden">
                  <table className="table-auto border-collapse w-full">
                    <thead>
                      <tr className="bg-[#D3C5B7] text-gray-800">
                        <th className="px-4 py-3 text-left">No.</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Start Time</th>
                        <th className="px-4 py-3 text-left">Doctor</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Video Session</th>
                        <th className="px-4 py-3 text-left">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment, index) => (
                        <tr key={appointment._id} className={`hover:bg-[#FAF5E9] transition-colors duration-150 ${index % 2 ? 'bg-[#FAF5E9]' : 'bg-[#E3D7CD]'}`}>
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3">{appointment.date}</td>
                          <td className="px-4 py-3">{appointment.startTime}</td>
                          <td className="px-4 py-3">{appointment.doctorName}</td>
                          <td className={`px-4 py-3 ${getStatusClass(appointment.appointmentStatus)}`}>
                            {appointment.appointmentStatus}
                          </td>
                          <td className="px-4 py-3">{renderVideoSession(appointment.appointmentStatus, appointment)}</td>
                          <td className="px-4 py-3">
                            <button className="text-blue-600 underline" onClick={() => handleDetailsClick(appointment)}>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* Mobile view for appointments */}
            <div className="md:hidden p-4">
              {appointments.length === 0 ? (
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-700">
                    No Appointments available!
                  </p>
                </div>
              ) : (
                appointments.map((appointment, index) => (
                  <div key={appointment._id} className="border p-4 mb-4 bg-white shadow-md rounded-lg">
                    <p><strong>No:</strong> {index + 1}</p>
                    <p><strong>Date:</strong> {appointment.date}</p>
                    <p><strong>Start Time:</strong> {appointment.startTime}</p>
                    <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                    <p className={getStatusClass(appointment.appointmentStatus)}>
                      <strong>Status:</strong> {appointment.appointmentStatus}
                    </p>
                    <p><strong>Video Session:</strong> {renderVideoSession(appointment.appointmentStatus, appointment)}</p>
                    <p>
                      <button className="underline text-blue-600" onClick={() => handleDetailsClick(appointment)}>
                        Details
                      </button>
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        <FeedbackButton />
        <Footer />
      </div>

      <VideoCallModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={{ role: "Parent", id: appointmentId, userid: senderId }}
        appointment={selected}
      />
    </>
  );
}

export default ShowAppointments;
