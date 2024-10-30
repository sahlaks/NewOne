// components/DoctorPatients.js
import React, { useEffect, useState } from "react";
import DoctorHeader from "../../../Components/Header/DoctorHeader";
import Loading from "../../../Components/Loading/Loading";
import { getPatients } from "../../../Services/API/DoctorAPI";
import Pagination from "../../../Components/Pagination/Pagination";
import Footer from "../../../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate()

  const fetchPatients = async (page = 1, limit = 6) => {
    try {
      setLoading(true);
      const response = await getPatients(page, limit);
      setPatients(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  const handlePageChange = (page) => {
    fetchPatients(page);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const viewMedicalHistory = (patient) => {
  navigate('/history', { state: { patient } })
  }

  return (
    <>
      <DoctorHeader />
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-5 text-center mt-20">
            All Patients
          </h1>

          {/* Centered table container */}
          <div className="flex justify-center items-center">
            <div className="w-full lg:w-2/3 mx-auto">
              {patients.length === 0 ? (
                <p className="text-center text-xl font-bold">
                  No patients found!
                </p>
              ) : (
                <table className="table-auto border-collapse border border-gray-300 w-full bg-[#DDD0C8]">
                  <thead>
                    <tr className="border-b border-gray-300 bg-white">
                      <th className="border-r border-gray-300 px-4 py-2 text-center">
                        Image
                      </th>
                      <th className="border-r border-gray-300 px-4 py-2 text-center">
                        Child Name
                      </th>
                      <th className="border-r border-gray-300 px-4 py-2 text-center">
                        Parent Name
                      </th>
                      <th className="border-r border-gray-300 px-4 py-2 text-center">
                        Email
                      </th>

                      <th className="border-r border-gray-300 px-4 py-2 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient, index) => (
                      <tr
                        key={index}
                        className="border-b border-black-300 text-center"
                      >
                        <td className="border-r border-black-300 px-4 py-2">
                          <img
                            src={patient.parentDetails.image}
                            alt="Parent"
                            className="w-8 h-8 rounded-full mx-auto"
                          />
                        </td>
                        <td className="border-r border-black-300 px-4 py-2">
                          {patient.childInfo.name}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2">
                          {patient.parentDetails.parentName}
                        </td>
                        <td className="border-r border-black-300 px-4 py-2">
                          {patient.parentDetails.email}
                        </td>

                        <td className="border-r border-black-300 px-4 py-2 text-green-600 underline">
                          <button
                            onClick={() =>
                              viewMedicalHistory(patient)
                            }
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
