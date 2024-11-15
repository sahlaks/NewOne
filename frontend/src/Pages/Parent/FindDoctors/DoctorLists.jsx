import React, { useState, useEffect } from "react";
import Loading from "../../../Components/Loading/Loading";
import HeaderSwitcher from "../../../Components/Header/HeadSwitcher";
import "./DoctorLists.css";
import Footer from "../../../Components/Footer/Footer";
import Pagination from "../../../Components/Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllDoctors } from "../../../utils/parentFunctions";
import defaultImage from "../../../assets/images/image.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

function DoctorLists() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [minRating, setMinRating] = useState("");
  const navigate = useNavigate();

  const fetchDoctors = async (page = 1, search = "", specialization = '', minRating = '') => {
    try {
      const response = await fetchAllDoctors(page, search, specialization, minRating);

      if (response.success) {
        setDoctors(response.data.doctors);
        setPagination(response.data.pagination);
      } else if (response.message === 'No doctors found for the specified criteria') {
        setDoctors([]);
        setPagination({ totalPages: 0, currentPage: page, totalDoctors: 0, perPage: 6 });
        toast.info("No doctors found matching your criteria");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(currentPage, searchQuery, specialization, minRating);
  }, [currentPage, searchQuery, specialization, minRating]);

  const handleViewProfile = (doctorId) => {
    navigate(`/doctor-details/${doctorId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDoctors(page);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSpecializationChange = (e) => {
    setSpecialization(e.target.value);
    setCurrentPage(1);
  };
  
  const handleMinRatingChange = (e) => {
    setMinRating(e.target.value);
    setCurrentPage(1);
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
    <div className="min-h-screen p-6 flex flex-col items-center">
      <HeaderSwitcher />
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-5 w-full max-w-4xl">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold">Doctor Listings</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search by doctor's name"
                className="search-input px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring focus:border-blue-300"
                value={searchQuery}
                onChange={handleSearch}
              />
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                value={specialization}
                onChange={handleSpecializationChange}
              >
                <option value="">Specializations</option>
                <option value="MD">MD</option>
                <option value="School Counseling">School Counseling</option>
                <option value="Play Therapy">Play Therapy</option>
              </select>
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                value={minRating}
                onChange={handleMinRatingChange}
              >
                <option value="">Ratings</option>
                <option value="1">1+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card border rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 bg-white">
                <img
                  src={doctor.image || defaultImage}
                  alt={doctor.doctorName}
                  className="doctor-image w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="text-xl font-bold">Dr. {doctor.doctorName}</h3>
                <h4 className="text-lg text-gray-600">{doctor.specialization}</h4>
                <div className="flex my-1">{renderStars(doctor.averageRating)}</div>
                <button
                  className="appointment-btn bg-[#323232] text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={() => handleViewProfile(doctor._id)}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
      <Footer />
      </>
  );
}

export default DoctorLists;
