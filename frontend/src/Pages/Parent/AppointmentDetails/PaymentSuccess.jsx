import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderSwitcher from '../../../Components/Header/HeadSwitcher';
import { fetchAppointmentDetails } from '../../../utils/parentFunctions';
import { toast } from 'react-toastify';

function PaymentSuccess() {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get('session_id');
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };
    
  useEffect(() => {
    const fetchData = async () => {
        if (sessionId) {
            try {
                const res = await fetchAppointmentDetails(sessionId);
                if (res.success) {
                  toast.success('Successfull!!',{
                    className : 'custom-toast',
                  })
                    setAppointmentDetails(res.data);
                }
            } catch (error) {
                console.error('Error fetching appointment details:', error);
            }
        }
    };
    fetchData();
  }, [sessionId]);

  return (
    <>
      <HeaderSwitcher/>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[#DDD0C8] p-10 rounded-lg shadow-lg text-center">
          <div className="text-green-500 text-6xl mb-4">
            <span className="material-icons">check_circle</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-xl mb-2">You have successfully booked an appointment.</p>
          
          {/* Display Appointment Details */}
          {appointmentDetails && (
            <div className="text-left mt-6 text-center">
              <h2 className="text-xl font-bold mb-2">Appointment Details:</h2>
              <p><strong>Date:</strong> {appointmentDetails.date}</p>
              <p><strong>Time:</strong> {appointmentDetails.startTime} - {appointmentDetails.endTime}</p>
              <p><strong>Doctor:</strong> Dr. {appointmentDetails.doctorName}</p>
              <p><strong>Fees:</strong> ₹{appointmentDetails.fees}</p>
              <p><strong>Child's Name:</strong> {appointmentDetails.name}</p>
            </div>
          )}

          <button
            onClick={handleBackToHome}
            className="bg-[#323232] rounded-lg p-3 mt-6 text-[#FAF5E9] hover:bg-[#555]">
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
