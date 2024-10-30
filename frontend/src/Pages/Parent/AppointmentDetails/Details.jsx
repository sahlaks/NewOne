import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../Doctor/Consultation/Details.css";
import ParentHeader from "../../../Components/Header/ParentHeader";
import Loading from "../../../Components/Loading/Loading";
import Footer from "../../../Components/Footer/Footer";
import { fetchPrescription } from "../../../utils/parentFunctions";
import jsPDF from "jspdf";

const ParentAppointmentDetails = () => {
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const { state } = useLocation();
  const { appointment } = state || {};

  console.log(appointment);

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
    const fetchPrescriptionData = async () => {
      if (appointment && appointment._id) {
        setLoading(true);
        try {
          const result = await fetchPrescription(appointment._id);
          if (result) setPrescriptions(result.data.data || []);
        } catch (error) {
          console.error("Failed to fetch prescription:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPrescriptionData();
  }, [appointment]);

    // Function to download the prescription as PDF
  const downloadPrescription = () => {
    const doc = new jsPDF();
    let lineY = 20;

    // Title Section
    doc.setFontSize(18);
    doc.setTextColor(33, 150, 243);
    doc.text("CalmNest Medical Prescription", 20, lineY);
    lineY += 10;

    // Divider line
    doc.setDrawColor(100, 149, 237);
    doc.line(20, lineY += 10, 190, lineY);

    // Doctor and Patient Information in the Same Row
    lineY += 10;
    doc.setFontSize(14);
    doc.setTextColor(76, 175, 80);
    doc.text("DOCTOR INFORMATION", 20, lineY);
    doc.text("PATIENT INFORMATION", 120, lineY);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    lineY += 8;
    doc.text(`Name: Dr. ${appointment.doctorName}`, 20, lineY);
    doc.text(`Parent Name: ${appointment.parentName}`, 120, lineY);
    lineY += 6;
    doc.text(`Date: ${appointment.date}`, 20, lineY);
    doc.text(`Child Name: ${appointment.name}`, 120, lineY);
    lineY += 6;
    doc.text(`Age: ${appointment.age}`, 120, lineY);
    doc.text(`Gender: ${appointment.gender}`, 120, lineY+5);

    // Prescription Information Section
    lineY += 20;
    doc.setFontSize(14);
    doc.setTextColor(156, 39, 176);
    doc.text("PRESCRIPTION INFORMATION", 20, lineY);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    lineY += 8;
    doc.text(`Prescription ID: ${appointment._id}`, 20, lineY);

    // Medications Section
    lineY += 20;
    doc.setFontSize(14);
    doc.setTextColor(244, 67, 54);
    doc.text("Medications:", 20, lineY);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    prescriptions.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec.text}`, 20, lineY += 10);
    });

    // Final Divider line and Save
    doc.setDrawColor(100, 149, 237);
    doc.line(20, lineY += 15, 190, lineY);

    lineY += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Contact Information", 20, lineY);
    doc.setTextColor(105, 105, 105);
    doc.text("Email: info@calmnest.com", 20, lineY += 6);
    doc.text("Phone: +1 234 567 890", 20, lineY += 6);
    doc.text("Address: 123 Calm Street, Trithala, Palakkad, Kerala 679534", 20, lineY += 6);
    doc.save("Prescription.pdf");
  };


  return (
    <>
      <ParentHeader />
      {loading ? (
        <Loading />
      ) : (
        <div className="appointment-details-container">
          <div className="header">
            <h1 className="text-3xl font-bold text-black">
              Appointment Details
            </h1>
          </div>

          <div className="details">
            <div className="appointment-info">
              <h2 className="text-xl font-bold">Appointment Details</h2>
              <p>
                {appointment.date}, Starting Time: {appointment.startTime}
              </p>
              <p>Video Consulting</p>
              <div className="actions flex items-center space-x-4">
                <p
                  className={`font-semibold ${getStatusColor(appointment.appointmentStatus)}`}
                >
                  {appointment.appointmentStatus}
                </p>
              </div>
              <h2 className="text-xl font-bold mt-5">Patient Information</h2>
              <div className="doctor-details">
                <p>Parent Name: {appointment.parentName}</p>
                <p>Child Name: {appointment.name}</p>
                <p>Age: {appointment.age}</p>
                <p>Gender: {appointment.gender}</p>
              </div>
              <h2 className="text-xl font-bold mt-5">Doctor Information</h2>
              <div className="doctor-details">
                <p>Doctor Name: {appointment.doctorName}</p>
              </div>

              <h2 className="text-xl font-bold mt-5">
                Appointment Information
              </h2>
              <p>Fee: {appointment.fees}</p>
              <p>Payment Status: {appointment.paymentStatus}</p>
            </div>

            {appointment.prescription && prescriptions.length > 0 ? (
              <div className="prescription-info">
                <h2 className="text-xl font-bold mb-5">Prescription</h2>
                {prescriptions.map((rec, index) => (
                  <p key={rec.id}>
                    {index + 1}. {rec.text}
                  </p>
                ))}
                 <button onClick={downloadPrescription} className="download-button-calm mt-10">
                  Download Prescription
                </button>
              </div>
            ) : (
              <p className="text-black no-prescription text-xl">No prescription available</p>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ParentAppointmentDetails;
