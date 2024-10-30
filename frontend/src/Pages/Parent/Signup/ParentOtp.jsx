import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';
import L from '../../../Public/l.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../Services/AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setParentCredential } from '../../../Redux/Slice/authSlice';
import { toast } from 'react-toastify';

function ParentOtp() {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [timerRunning, setTimerRunning] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const parentData = useSelector((state) => state.auth.parentData);
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
      setTimer(30);
      setTimerRunning(true);
      const newEndTime = currentTime + 30 * 1000;
      localStorage.setItem('otpEndTime', newEndTime);
    }
  }, []);

  useEffect(() => {
    let interval;

    if (timerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTimer = prev - 1;
          if (newTimer <= 0) {
            clearInterval(interval);
            setTimerRunning(false);
            return 0;
          }
          return newTimer;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerRunning, timer]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (changePassword) {
        const response = await axiosInstance.post('/api/parents/verifyOtp', { otp }, { withCredentials: true });
        if (response.data.success) {
          setSuccessMessage('OTP verified successfully! You are registered!');
          toast.success('OTP verified successfully! You are registered!');
          setErrorMessage('');
          navigate('/password-reset');
        } else {
          setSuccessMessage('');
          setErrorMessage('Incorrect OTP');
        }
      } else {
        const response = await axiosInstance.post('/api/parents/verify-otp', { otp }, { withCredentials: true });
        const result = response.data;

        if (result.success) {
          setSuccessMessage('OTP verified successfully! You are registered!');
          toast.success('OTP verified successfully! You are registered!');
          setErrorMessage('');
          localStorage.setItem('parentData', JSON.stringify(result.user));
          dispatch(setParentCredential(result.user));
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setSuccessMessage('');
          setErrorMessage('Incorrect OTP');
        }
      }
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Error in verifying OTP');
    }
  };

  const handleResend = async () => {
    setLoading(true)
    try {
      if (changePassword) {
        const response = await axiosInstance.post('/api/parents/resendOtp', {}, { withCredentials: true });
        if (response.data.success) {
          setSuccessMessage('New OTP sent. Please check your email.');
          setErrorMessage('');
          resetTimer();
        } else {
          setSuccessMessage('');
          setErrorMessage(response.data.message || 'Error sending OTP');
        }
      } else {
        const response = await axiosInstance.post('/api/parents/resend-otp', {}, { withCredentials: true });
        const result = response.data;
        if (result.success) {
          setSuccessMessage('New OTP sent. Please check your email.');
          setErrorMessage('');
          resetTimer();
        } else {
          setSuccessMessage('');
          setErrorMessage(result.message || 'Error sending OTP');
        }
      }
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Error sending OTP');
    } finally{
      setLoading(false);
    }
  };

  const resetTimer = () => {
    setTimer(60);
    setTimerRunning(true);
    const newEndTime = new Date().getTime() + 60 * 1000;
    localStorage.setItem('otpEndTime', newEndTime);
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='flex flex-col md:flex-row rounded-lg' style={{ boxShadow: '4px 4px 10px grey' }}>
        <div className='flex flex-col justify-center items-center bg-white p-6 rounded-lg'>
          <h1 className="text-2xl font-bold mb-5">Submit OTP</h1>
          <img src={L} alt="CalmNest Logo" style={{ height: '100px', width: '150px' }} className="mb-5" />

          <form className="w-full px-5 sm:px-8 flex flex-col justify-center items-center" onSubmit={handleSubmit}>
            <TextField
              size="small"
              label="Enter the OTP"
              className="w-[100%]"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ marginTop: "" }}
            />

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
                disabled={timerRunning || loading}
              >
                {loading ? (
                      <CircularProgress
                        size={24}
                        style={{ color: "#FAF5E9" }}
                      />
                    ) : (
                      "Resend"
                    )}
              </Button>
            </div>

            <div className="mt-4">
              {timerRunning ? (
                <Typography variant="body2" color="textSecondary">
                  Time left: {timer} seconds
                </Typography>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Time is over. Please resend OTP.
                </Typography>
              )}
              {successMessage && <Typography variant="body2" color="green">{successMessage}</Typography>}
              {errorMessage && <Typography variant="body2" color="red">{errorMessage}</Typography>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ParentOtp;
