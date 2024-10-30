import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography} from '@mui/material'
import L from '../../../Public/l.png';
import { useLocation, useNavigate } from 'react-router-dom';
import {axiosInstanceDoctor} from '../../../Services/AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setDoctorCredential} from '../../../Redux/Slice/authSlice';
import { toast } from 'react-toastify';


function DoctorOtp() {
  const [otp,setOtp] = useState('')
  const [timer, setTimer] = useState(30);
  const [timerRunning, setTimerRunning] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctorData = useSelector((state) => state.auth.doctorData);
  const location = useLocation();
  const changePassword = location.state?.changePassword || false;



  useEffect(() => {
    const storedEndTime = localStorage.getItem('otpEndTime');
    const currentTime = new Date().getTime();

    if (storedEndTime) {
      const timeDiff = Math.floor((storedEndTime - currentTime) / 1000);
      if (timeDiff > 0) {
        setTimer(timeDiff);
        setTimerRunning(true);
      } else {
        setTimer(0);
        setTimerRunning(false);
        localStorage.removeItem('otpEndTime');
      }
    } else {
      const newEndTime = currentTime + timer * 1000;
      localStorage.setItem('otpEndTime', newEndTime);
    }
  }, [timer]);

  useEffect(() => {
    if (timerRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          const newTimer = prev - 1;
          if (newTimer <= 0) {
            clearInterval(interval);
            setTimerRunning(false);
            return 0;
          }
          return newTimer;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerRunning, timer]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      if(changePassword){
        const response = await axiosInstanceDoctor.post('/api/doctor/verifyOtp',{otp},{withCredentials:true});
        console.log(response);
        if(response.data.success){
        setSuccessMessage('OTP verified successfully! You are registered!')
        setErrorMessage('')
        const doctor = true;
        console.log(response);
        
        navigate('/password-reset',{state: {doctor}});
        } else {
          setSuccessMessage('')
          setErrorMessage('Incorrect OTP')
        }
      } else {
      const response = await axiosInstanceDoctor.post('/api/doctor/verify-otp', {otp},{ withCredentials:true });
      console.log('otp',response);
      
      const result = response.data;
      console.log(result);
      
      if(result.success){
        toast.success('OTP verified successfully! You are registered!',)
        setTimeout(() => {
          navigate('/verification');
        },2000);

      } else {
        setSuccessMessage('')
        setErrorMessage('Incorrect OTP')
      }
    }
    } catch(error){
      setSuccessMessage('')
      setErrorMessage('Error in verifying OTP')
    }
  }

  //resend logic
  const handleResend = async () => {
    try {
      let response;
      if (changePassword) {
        response = await axiosInstanceDoctor.post('/api/doctor/resendOtp', {}, { withCredentials: true });
      } else {
        response = await axiosInstanceDoctor.post('/api/doctor/resend-otp', {}, { withCredentials: true });
      }

      if (response.data.success) {
        setSuccessMessage('New OTP sent. Please check your email.');
        setErrorMessage('');
        const newEndTime = new Date().getTime() + 60 * 1000;
        localStorage.setItem('otpEndTime', newEndTime);
        setTimer(60);
        setTimerRunning(true);
      } else {
        setSuccessMessage('');
        setErrorMessage(response.data.message || 'Error sending OTP');
      }
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Error sending OTP');
    }
  };
  return (
      <div className='flex justify-center items-center min-h-screen'>{/*doctor*/}
        <div className='flex flex-col md:flex-row rounded-lg' style={{boxShadow:'4px 4px 10px grey'}} >
        <div className='flex flex-col justify-center items-center bg-white p-6 rounded-lg' > {/*left*/}
            <h1 className="text-2xl font-bold mb-5">Submit OTP</h1>
            <img src={L} alt="CalmNest Logo" style={{ height: '100px', width: '150px' }} className="mb-5" />

            <form className="w-full px-5 sm:px-8 flex flex-col justify-center items-center" onSubmit={handleSubmit}>
            <TextField size="small" 
            label="Enter the otp" 
            className="w-[100%]" 
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            sx={{ marginTop: "" }} />

            <span style={{display:'inline-block',width:"200px"}}></span>

            <div className='flex justify-evenly w-full mt-3'>
            <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: '#323232', color: '#FAF5E9' }}
            className="mt-4"
            disabled={!timerRunning}
            >
                Submit
            </Button>
            <Button
            type='button'
            variant="contained"
            style={{ backgroundColor: '#323232', color: '#FAF5E9' }}
            className="mt-4" 
            onClick={handleResend}
            disabled={timerRunning}
            >
                Resend
            </Button>
            </div>
            <div className="mt-4">
              {timerRunning ? (
                <Typography variant="body2" color="textSecondary">Time left: {timer} seconds</Typography>
              ) : (
                <Typography variant="body2" color="textSecondary">Time is over. Please resend OTP.</Typography>
              )}
              {successMessage && <Typography variant="body2" color="green">{successMessage}</Typography>}
              {errorMessage && <Typography variant="body2" color="red">{errorMessage}</Typography>}
            </div>
            </form>
        </div>
        
    </div>
    </div>
  )
}

export default DoctorOtp