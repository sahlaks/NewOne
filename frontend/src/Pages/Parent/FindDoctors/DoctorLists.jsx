import React, { useState, useEffect } from "react";
import axios from "axios";
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
    <div>
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <HeaderSwitcher />
        {loading ? (
          <Loading />
        ) : (
          <div className="mt-5">
            <div className="flex justify-center space-x-4 mb-5">
              <input
                type="text"
                placeholder="Search by doctor's name"
                className="search-input px-4 py-2 border rounded-lg w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="px-4 py-2 border rounded-lg"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="">Specializations</option>
                <option value="MD">MD</option>
                <option value="School Counceling">School Counseling</option>
                <option value="Play Therapy">Play Therapy</option>
              </select>
              <select
                className="px-4 py-2 border rounded-lg"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                <option value="">Ratings</option>
                <option value="1">1+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div className="doctor-list">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="doctor-card">
                  <img
                    src={doctor.image || defaultImage}
                    alt={doctor.doctorName}
                    className="doctor-image"
                  />
                  <h3 className="text-xl font-bold">Dr. {doctor.doctorName}</h3>
                  <h3 className="text-lg">{doctor.specialization}</h3>
                  <div>{renderStars(doctor.averageRating)}</div>
                  <button
                    className="appointment-btn"
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
    </div>
  );
}

export default DoctorLists;
