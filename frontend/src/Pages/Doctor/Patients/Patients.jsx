import React, { useEffect, useState } from "react";
import DoctorHeader from "../../../Components/Header/DoctorHeader";
import Loading from "../../../Components/Loading/Loading";
import { getPatients } from "../../../Services/API/DoctorAPI";
import Pagination from "../../../Components/Pagination/Pagination";
import Footer from "../../../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchPatients = async (page = 1, limit = 6, search = "") => {
    try {
      console.log("Search Query:", search);
      const response = await getPatients(page, limit, search);
      console.log("Fetched Patients:", response.data);
      
      setPatients(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  const handlePageChange = (page) => {
    fetchPatients(page, 6, searchQuery); 
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  useEffect(() => {
    fetchPatients(currentPage, 6, searchQuery); 
  }, [currentPage, searchQuery]);

  const viewMedicalHistory = (patient) => {
    navigate('/history', { state: { patient } });
  };

  return (
    <>
      <DoctorHeader />
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 mb-10">
          <h1 className="text-3xl font-bold mb-5">All Patients</h1>
          <div className="flex space-x-4 mb-5">
            <input
              type="text"
              placeholder="Search by day or date"
              className="search-input px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring focus:border-blue-300"
              value={searchQuery}
              onChange={handleSearchChange} 
            />
          </div>
          <div className="w-full md:w-3/4 lg:w-2/3 bg-[#E3D7CD] rounded-lg shadow-md overflow-hidden">
            {patients.length === 0 ? (
              <p className="text-center text-xl font-semibold p-8">
                No patients found!
              </p>
            ) : (
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-[#D3C5B7] text-gray-800">
                    <th className="px-4 py-2 border">Image</th>
                    <th className="px-4 py-2 border">Child Name</th>
                    <th className="px-4 py-2 border">Parent Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-[#FAF5E9] transition-colors duration-150 ${index % 2 ? 'bg-[#FAF5E9]' : 'bg-[#E3D7CD]'}`}
                    >
                      <td className="border px-4 py-2 text-center">
                        <img
                          src={patient.parentDetails.image}
                          alt="Parent"
                          className="w-8 h-8 rounded-full mx-auto"
                        />
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {patient.childInfo.name}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {patient.parentDetails.parentName}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {patient.parentDetails.email}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => viewMedicalHistory(patient)}
                          className="text-blue-500 hover:underline"
                        >
                          Medical History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <Footer />
    </>
  );
};

export default Patients;
