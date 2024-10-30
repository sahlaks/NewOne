import React, { useEffect, useState } from "react";
import { fetchHistory } from "../../../Services/API/DoctorAPI";
import { useLocation } from "react-router-dom";
import DoctorHeader from "../../../Components/Header/DoctorHeader";
import Loading from "../../../Components/Loading/Loading";
import "./MedicalHistory.css";
import Footer from "../../../Components/Footer/Footer";

const MedicalHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useLocation();
  const { patient } = state || {};

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-500";
      case "Cancelled":
        return "text-red-500";
      case "Pending":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchHistory(
          patient.childInfo.childId,
          patient.childInfo.name
        );
        if (result && result.data) {
          setAppointments(result.data);
        } else {
          setAppointments([]); 
        }
      } catch (error) {
        console.error("Failed to fetch appointment history:", error);
        setError("Failed to load appointment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentHistory();
  }, [patient]);

  console.log(appointments);

  return (
    <>
      <DoctorHeader />
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="appointment-details-container">
            <div className="appointment-detail">
              <div className="header">
                <h1 className="text-3xl font-bold text-black">
                  Medical History
                </h1>
              </div>
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <div className="details">
                    <div className="appointment-info">
                      <h2 className="text-xl font-bold">Appointment Details</h2>
                      <p>
                        <i className="icon-clock"></i> {appointment.date},
                        Starting Time: {appointment.startTime}
                      </p>
                      <p>
                        <i className="icon-video"></i> Video Consulting
                      </p>

                      <p
                        className={`font-semibold ${getStatusColor(appointment.appointmentStatus)}`}
                      >
                        {appointment.appointmentStatus}
                      </p>

                      <h2 className="text-xl font-bold mt-5">
                        Patient Information
                      </h2>
                      <div className="patient-details">
                        <div>
                          <h2>
                            Parent Name: {patient.parentDetails.parentName}
                          </h2>
                          <h3 className="font-bold">
                            Child Name: {patient.childInfo.name}
                          </h3>
                          <p>Age: {appointment.age}</p>
                          <p>Gender: {appointment.gender}</p>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold mt-5">
                        Appointment Information
                      </h2>
                      <h2>Fee: {appointment.fees}</h2>
                      <h2>Payment Status: {appointment.paymentStatus}</h2>
                    </div>

                    {appointment.prescription && appointment.prescriptionDetails.data.length > 0 ? (
                      <div className="prescription-info">
                        <h2 className="text-xl font-bold mb-5">Prescription</h2>
                        {appointment.prescription &&
                          appointment.prescriptionDetails.data.map(
                            (rec, idx) => (
                              <p key={rec.id}>
                                {idx + 1}. {rec.text}
                              </p>
                            )
                          )}
                    </div>
                    ) : (
                        <div className="no-prescription">
                        <p className="text-black">No prescriptions there.</p>
                        </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No appointment history found for this patient.</p>
              )}
            </div>
          </div>
        </>
      )}
      <Footer/>
      </>
  );
};

export default MedicalHistory;
