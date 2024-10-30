import React, { useEffect } from 'react'
import HeaderSwitcher from '../../../Components/Header/HeadSwitcher'
import { useLocation, useNavigate } from 'react-router-dom';
import { updateFailure } from '../../../utils/parentFunctions';
import { toast } from 'react-toastify';

function PaymentFailure() {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get('session_id');
  const navigate = useNavigate()  
  const handleBackToBooking = () => {
    navigate('/find-doctor');
  };

  useEffect(()=> {
    const logFailure = async () => {
      if (sessionId) {
        try {
          const res = await updateFailure(sessionId);
          if(res.success)
            toast.error(res.message)
        } catch (error) {
          console.error('Error fetching appointment details:', error);
        }
    }
  }
  logFailure();
  },[sessionId])

  return (
    <>
    <HeaderSwitcher/>
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#DDD0C8] p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-xl mb-2">Your payment could not be processed. Please try again or contact support.</p>

        <button
          onClick={handleBackToBooking}
          className="bg-[#323232] rounded-lg p-3 mt-6 text-[#FAF5E9] hover:bg-[#555]">
          Back to Doctor Lists
        </button>
      </div>
    </div>
    </>
  )
}

export default PaymentFailure