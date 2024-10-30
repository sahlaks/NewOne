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
  const socket = useSocket()
  const parentData = JSON.parse(localStorage.getItem("parentData"));
  const senderId = parentData?._id;

  const [modalOpen, setModalOpen] = useState(false); 
  const [appointmentId, setAppointmentId] = useState(null)
  const [selected,setSelected] = useState({})
  
  const navigate = useNavigate()

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
    setAppointmentId(appointment._id)
    setSelected(appointment)
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
        return (
          <div className="text-yellow-800 flex items-center">
             Waiting
          </div>
        );
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
    navigate(`/appointments/details`, { state: { appointment } });
  }

  useEffect(() => {
    if (!socket) {
      console.log("Socket is undefined");
      return;
    }
    if (senderId) {
      const role = 'Parent';
      socket.emit("user_connected", senderId);
      socket.emit('join',{senderId,role});
      console.log(`User connected with ID: ${senderId}`);
    }
  },[socket])


  return (
    <>
      <ParentHeader />
      <div className="min-h-screen flex flex-col">
        {loading ? (
          <Loading />
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-5 text-center mt-20">
              Appointments Details
            </h1>

            {/* Table layout for large screens */}
            <div className="hidden md:flex flex-col items-center justify-center mt-2 mb-10">
              {appointments.length === 0 ? (
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-700">
                    No Appointments created yet!
                  </p>
                </div>
              ) : (
                <div className="w-full md:w-3/4 lg:w-2/3">
                  <table className="table-auto border-collapse border border-black-300 w-full bg-[#DDD0C8]">
                    <thead>
                      <tr className="border-b border-black-300 bg-[white]">
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
                          Doctor
                        </th>
                       
                        <th className="border-r border-black-300 px-4 py-2 text-center">
                          Status
                        </th>
                        <th className="border-r border-black-300 px-4 py-2 text-center">
                          Video Session
                        </th>
                        <th className="border-r border-black-300 px-4 py-2 text-center">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment, index) => (
                        <tr key={appointment._id}>
                          <td className="border-r border-black-300 px-4 py-2 text-center">
                            {index + 1}
                          </td>
                          <td className="border-r border-black-300 px-4 py-2 text-center">
                            {appointment.date}
                          </td>
                          <td className="border-r border-black-300 px-4 py-2 text-center">
                            {appointment.startTime}
                          </td>
                
                          <td className="border-r border-black-300 px-4 py-2 text-center">
                            {appointment.doctorName}
                          </td>
                          
                          <td
                            className={`border-r border-black-300 px-4 py-2 text-center ${getStatusClass(appointment.appointmentStatus)}`}
                          >
                            {appointment.appointmentStatus}
                          </td>
                          <td
                            className={`border-r border-black-300 px-4 py-2 items-center justify-center`}
                          >
                             {renderVideoSession(appointment.appointmentStatus,appointment)}
                          </td>
                          <td
                            className={`border-r border-black-300 px-4 py-2 items-center justify-center`}
                          > <button className="underline" onClick={() => handleDetailsClick(appointment)}>
                             Details
                          </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Card layout for small and medium screens */}
            <div className="md:hidden p-4">
              {appointments.length === 0 ? (
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-700">
                    No Appointments created yet!
                  </p>
                </div>
              ) : (
                appointments.map((appointment, index) => (
                  <div
                    key={appointment._id}
                    className="border border-[#FAF5E9]-500 shadow-lg p-4 mb-4 bg-[#DDD0C8]"
                  >
                    <p>
                      <strong>No:</strong> {index + 1}
                    </p>
                    <p>
                      <strong>Date:</strong> {appointment.date}
                    </p>
                    <p>
                      <strong>Start Time:</strong> {appointment.startTime}
                    </p>
                   
                    <p>
                      <strong>Doctor:</strong> {appointment.doctorName}
                    </p>
                    <p
                      className={getStatusClass(appointment.appointmentStatus)}
                    >
                      <strong>Status:</strong> {appointment.appointmentStatus}
                    </p>
                    <p>
                      <strong>Video Session:</strong>
                      {renderVideoSession(
                        appointment.appointmentStatus,
                        appointment
                      )}
                    </p>
                    <p>
                    <button>
                        <span className="font-semibold underline" onClick={() => handleDetailsClick(appointment)}>Details </span>
                        </button>
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
        <FeedbackButton/>
        <Footer />
      </div>

      <VideoCallModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)} 
        user={{ role: "Parent", id:appointmentId, userid: senderId}}
        appointment={selected}
      />
    </>
  );
}

export default ShowAppointments;
