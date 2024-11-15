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

  console.log('details', appointment);
  
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
      if (appointment && appointment?._id) {
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

  const downloadPrescription = () => {
    const doc = new jsPDF();
    let lineY = 20;

    doc.setFontSize(18);
    doc.setTextColor(33, 150, 243);
    doc.text("CalmNest Medical Prescription", 20, lineY);
    lineY += 10;
    doc.setDrawColor(100, 149, 237);
    doc.line(20, lineY += 10, 190, lineY);

    lineY += 10;
    doc.setFontSize(14);
    doc.setTextColor(76, 175, 80);
    doc.text("DOCTOR INFORMATION", 20, lineY);
    doc.text("PATIENT INFORMATION", 120, lineY);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    lineY += 8;
    doc.text(`Name: Dr. ${appointment?.doctorName}`, 20, lineY);
    doc.text(`Parent Name: ${appointment?.parentName}`, 120, lineY);
    lineY += 6;
    doc.text(`Date: ${appointment?.date}`, 20, lineY);
    doc.text(`Child Name: ${appointment?.name}`, 120, lineY);
    lineY += 6;
    doc.text(`Age: ${appointment?.age}`, 120, lineY);
    doc.text(`Gender: ${appointment?.gender}`, 120, lineY + 5);

    lineY += 20;
    doc.setFontSize(14);
    doc.setTextColor(156, 39, 176);
    doc.text("PRESCRIPTION INFORMATION", 20, lineY);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    lineY += 8;
    doc.text(`Prescription ID: ${appointment?._id}`, 20, lineY);

    lineY += 20;
    doc.setFontSize(14);
    doc.setTextColor(244, 67, 54);
    doc.text("Medications:", 20, lineY);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    prescriptions.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec.text}`, 20, lineY += 10);
    });

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
        <div className="bg-[#FAF5E9] min-h-screen flex flex-col items-center pt-16 px-4">
          <h1 className="text-3xl font-semibold text-center mb-8">Appointment Details</h1>

          <div className="w-full md:w-3/4 lg:w-2/3 bg-[#E3D7CD] rounded-lg shadow-md p-6 mb-10">
            <h2 className="text-2xl font-semibold text-[#323232] mb-4">Appointment Overview</h2>
            <div className="flex justify-between mb-4">
              <p>Date: {appointment?.date}  </p>
              <p>Start Time: {appointment?.startTime}</p>
              <p className={`${getStatusColor(appointment?.appointmentStatus)} font-semibold`}>
                Status: {appointment?.appointmentStatus}
              </p>
            </div>
            <h2 className="text-xl font-semibold text-[#323232] mt-6">Patient Information</h2>
            <p>Parent Name: {appointment?.parentName}</p>
            <p>Child Name: {appointment?.name}</p>
            <p>Age: {appointment?.age}</p>
            <p>Gender: {appointment?.gender}</p>
            <h2 className="text-xl font-semibold text-[#323232] mt-6">Doctor Information</h2>
            <p>Doctor Name: {appointment?.doctorName}</p>
            <h2 className="text-xl font-semibold text-[#323232] mt-6">Appointment Information</h2>
            <p>Fee: {appointment?.fees}</p>
            <p>Payment Status: {appointment?.paymentStatus}</p>
          </div>

          {appointment?.prescription && prescriptions.length > 0 ? (
            <div className="w-full md:w-3/4 lg:w-2/3 bg-[#E3D7CD] rounded-lg shadow-md p-6 mb-10">
              <h2 className="text-xl font-semibold text-[#323232] mb-4">Prescription</h2>
              {prescriptions.map((rec, index) => (
                <p key={rec.id}>{index + 1}. {rec.text}</p>
              ))}
              <button
                onClick={downloadPrescription}
                className="mt-6 px-4 py-2 bg-[#323232] text-white font-semibold rounded shadow hover:bg-black transition-all"
              >
                Download Prescription
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500">No prescription available</p>
          )}
        </div>
      )}
      <Footer />
    </>
  );
};

export default ParentAppointmentDetails;
