import React from 'react'
import L from '../../../Public/l.png';
import { Navigate, useNavigate } from 'react-router-dom';


function Verification() {
    const navigate = useNavigate()
  return (
    <>
    <div className="flex flex-col items-center justify-center p-10 md:p-15">
    <img src={L} alt="CalmNest Logo" style={{ height: '250px', width: 'auto' }} className="mb-5" />
    <h1 className='text-2xl text-center mb-2'> Welcome to CalmNest! We are thrilled to have you as a part of our community.</h1>
    <h1 className='text-xl text-center mb-6'> Our team is currently reviewing your profile to ensure that we maintain the highest standards of trust, safety, and professionalism. This verification process helps us create a space where users can feel confident and secure while engaging with others on the platform. We appreciate your patience and will notify you once the verification is complete.
    </h1>
    <button className='bg-[#323232] hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={()=>navigate('/')}>Back to home</button>
    </div>
    </>
  )
}

export default Verification