import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import {
  blockDoctor,
  deleteDoctor,
  fetchDoctors,
  rejectDoctor,
  verifyDoctor,
} from "../../../Services/API/AdminAPI";
import { toast } from "react-toastify";
import Loading from "../../../Components/Loading/Loading";
import {
  TrashIcon,
  BanIcon,
  CheckCircleIcon,
  XCircleIcon,
  CheckIcon,
  XIcon,
} from "@heroicons/react/solid";
import CustomPopup from "../../../Components/CustomPopUp/CustomPopup";
import DoctorProfileModal from "./DoctorProfileModal";
import Pagination from "../../../Components/Pagination/Pagination";
import Footer from "../../../Components/Footer/Footer";

function UnverifiedManagement() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchDoctorData = async (query = "", page = 1, limit = 6) => {
    setLoading(true);
    try {
      const isVerified = false
      const response = await fetchDoctors(query, page, limit, isVerified);
      if (response.data.success) {
        setDoctors(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } else {
        toast.error("Failed to fetch doctors");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    fetchDoctorData(searchQuery, 1);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    fetchDoctorData("");
  };

  const handlePageChange = (page) => {
    fetchDoctorData(searchQuery, page);
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  
  const handleConfirm = async () => {
    if (!selectedDoctor) return;

    try {
      if (actionType === "block" || actionType === "unblock") {
        const res = await blockDoctor(selectedDoctor._id);
        if (res.success) {
          toast.success(
            selectedDoctor.isBlocked ? "Doctor unblocked" : "Doctor blocked"
          );
          setDoctors((prevDoctors) =>
            prevDoctors.map((doctor) =>
              doctor._id === selectedDoctor._id
                ? { ...doctor, isBlocked: !selectedDoctor.isBlocked }
                : doctor
            )
          );
        }
      } else if (actionType === "delete") {
        const res = await deleteDoctor(selectedDoctor._id);
        if (res.success) {
          toast.success("Doctor deleted successfully");
          fetchDoctorData();
        } else {
          toast.error("Failed to delete doctor");
        }
      }
    } catch (err) {
      console.error(`Error ${actionType} doctor:`, err);
      toast.error(`Error ${actionType} doctor`);
    } finally {
      setShowPopup(false);
    }
  };

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowProfileModal(true);
  };

  const handleVerify = async () => {
    if (!selectedDoctor) return;

    try {
      const res = await verifyDoctor(selectedDoctor._id);
      if (res.success) {
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor._id === selectedDoctor._id
              ? { ...doctor, isVerified: !selectedDoctor.isVerified }
              : doctor
          )
        );
      } else {
        toast.error("Failed to verify doctor");
      }
    } catch (err) {
      console.error("Error verifying doctor:", err);
      toast.error("Error verifying doctor");
    } finally {
      setShowPopup(false);
    }
  };

  const handleReject = async (reason) => {
    if (!selectedDoctor) return;

    try {
      console.log("Rejection Reason:", reason)
      const res = await rejectDoctor(selectedDoctor._id, reason);
      if (res.success) {
        toast.success("Doctor rejected successfully");
        fetchDoctorData();
      } else {
        toast.error("Failed to reject doctor");
      }
    } catch (err) {
      console.error("Error rejecting doctor:", err);
      toast.error("Error rejecting doctor");
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div>
      <AdminLayout>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center mb-4">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-2 md:mb-0">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-4 py-2 w-full focus:outline-none"
                  query=""
                  onChange={handleSearchInput}
                />
                <button
                  className="bg-[#323232] text-white px-4 py-2 hover:bg-[#323232]"
                  onClick={handleSearch}
                >
                  Search
                </button>
                {searchQuery && (
                  <button
                    className="ml-2 bg-red-500 text-white px-4 py-2 hover:bg-red-600"
                    onClick={handleResetSearch}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            {doctors.length === 0 ? (
               <p className="text-center text-[#323232] text-2xl">No doctors available</p>
            ) : (
               <div>
              <table className="table-auto border-collapse border border-gray-300 w-full hidden md:table bg-[#DDD0C8]">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-300 bg-white">
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      No.
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Image
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Name
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Email Id
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      Verified
                    </th>
                    <th className="border-r border-gray-300 px-4 py-2 text-center">
                      View Profile
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {doctors.map((doctor, index) => (
                    <tr key={doctor._id}>
                      <td className="border-r border-gray px-4 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border-r border-gray px-4 py-2 text-center">
                        <img
                          src={doctor.image}
                          alt={doctor.doctorName}
                          className="w-16 h-16 object-cover rounded-full"
                          />
                      </td>
                      <td className="border-r border-gray px-4 py-2 text-center">
                        {doctor.doctorName}
                      </td>
                      <td className="border-r border-gray px-4 py-2 text-center">
                        {doctor.email}
                      </td>
                      <td className="border-r border-gray px-4 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded ${
                            doctor.isVerified
                            ? "bg-blue-100 text-blue-600"
                            : "bg-red-100 text-red-600"
                            }`}
                            >
                          {doctor.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      
                      <td className="border-r border-gray px-4 py-2 text-center">
                        <button
                          className="text-blue-600 hover:text-red-800 m-4"
                          onClick={() => handleViewProfile(doctor)}
                          >
                          Click here
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="md:hidden">
                {doctors.map((doctor) => (
                  <div
                  key={doctor._id}
                  className="border border-[#FAF5E9]-500 shadow-lg p-4 mb-4"
                  >
                    
                    <p>
                      <strong>Name:</strong> {doctor.doctorName}
                    </p>
                    <p>
                      <strong>Email:</strong> {doctor.email}
                    </p>
                    <p>
                      <strong>Verified:</strong>{" "}
                      {doctor.isVerified ? "Yes" : "No"}
                    </p>

                    <button
                      className="bg-[#323232] text-white px-2 py-1 rounded ml-2"
                      onClick={(e) => handleViewProfile(doctor)}
                      >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
            )}
          </>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </AdminLayout>
      

      {showPopup && (
        <CustomPopup
          title={
            actionType.charAt(0).toUpperCase() + actionType.slice(1) + " Doctor"
          }
          message={`Are you sure you want to ${actionType} this doctor?`}
          onConfirm={handleConfirm}
          onCancel={() => setShowPopup(false)}
        />
      )}

      {showProfileModal && (
        <DoctorProfileModal
          doctor={selectedDoctor}
          onClose={() => setShowProfileModal(false)}
          onVerify={() => {
            setActionType("verify");
            handleVerify();
          }}
          onReject={handleReject}
        />
      )}
    </div>
  );
}


export default UnverifiedManagement