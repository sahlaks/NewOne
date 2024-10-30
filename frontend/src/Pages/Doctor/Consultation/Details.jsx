import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import './Details.css';
import DoctorHeader from "../../../Components/Header/DoctorHeader";
import Loading from "../../../Components/Loading/Loading";
import Footer from "../../../Components/Footer/Footer";
import PrescriptionModal from "./PrescriptionModal";
import { fetchPrescription, setPrescription } from "../../../Services/API/DoctorAPI";

const AppointmentDetails = () => {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [prescriptions, setPrescriptions] = useState([])
    const { state } = useLocation();
    const { appointment } = state || {};

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

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);


    const  handleSubmitPrescription = async (recommendations) => {
        console.log(recommendations);
        
        //setPrescriptions(recommendations);
       await  setPrescription(recommendations, appointment._id)
    }

    useEffect(()=>{
        const fetchPrescriptionData = async () => {
            if (appointment && appointment._id) {
                setLoading(true);
                try {
                    const result = await fetchPrescription(appointment._id);
                    if (result)
                        setPrescriptions(result.data.data || []);
                } catch (error) {
                    console.error("Failed to fetch prescription:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPrescriptionData();
    }, [appointment]);

    return (
        <>
            <DoctorHeader />
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="appointment-details-container">
                        <div className="header">
                            <h1 className="text-3xl font-bold text-black">Appointment Details</h1>
                            <div className="actions flex items-center space-x-4">
                                <p className={`font-semibold ${getStatusColor(appointment.appointmentStatus)}`}>
                                    {appointment.appointmentStatus}
                                </p>
                                {appointment.prescription !== true && (
                                    <button className="prescription-btn" onClick={openModal} >Prescription</button>
                                )}
                            </div>
                        </div>

                        <div className="details">
                            <div className="appointment-info">
                                <h2 className="text-xl font-bold">Appointment Details</h2>
                                <p><i className="icon-clock"></i> {appointment.date}, Starting Time: {appointment.startTime}</p>
                                <p><i className="icon-video"></i> Video Consulting</p>

                                <h2 className="text-xl font-bold mt-5">Patient Information</h2>
                                <div className="patient-details">
                                    <div>
                                        <h2>Parent Name: {appointment.parentName}</h2>
                                        <h3 className="font-bold">Child Name: {appointment.name}</h3>
                                        <p>Age: {appointment.age}</p>
                                        <p>Gender: {appointment.gender}</p>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold mt-5">Appointment Information</h2>
                                <h2>Fee: {appointment.fees}</h2>
                                <h2>Payment Status: {appointment.paymentStatus}</h2>
                            </div>
                            { appointment.prescription && 
                            <div className="prescription-info">
                            <h2 className="text-xl font-bold mb-5">Prescription</h2>
                            {prescriptions.map((rec, index) => (
                            <p key={rec.id}>{index + 1}. {rec.text}</p>
                        ))}
                            </div>
                            }
                        </div>
                    </div>

                    <PrescriptionModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        appointment={appointment}
                        onSubmitPrescription={handleSubmitPrescription}
                    />

                </>
            )}
            <Footer/>
        </>
        
    );
};

export default AppointmentDetails;
