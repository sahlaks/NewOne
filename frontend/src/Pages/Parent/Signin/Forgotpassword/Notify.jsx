import React from 'react'
import L from '../../../../Public/l.png';
import { Navigate, useNavigate } from 'react-router-dom';

function Notify() {
    const navigate = useNavigate()
  return (
    <>
    <div className="flex flex-col items-center justify-center p-10 md:p-15">
    <img src={L} alt="CalmNest Logo" style={{ height: '250px', width: 'auto' }} className="mb-5" />
    <h1 className='text-2xl text-center mb-2'> You are successfully changed password!!</h1>
    <button className='bg-[#323232] hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={()=>navigate('/')}>Back to home</button>
    </div>
    </>
  )
}

export default Notify