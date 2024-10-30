import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material'
import L from '../../../Public/l.png';
import { useNavigate, Link } from 'react-router-dom';
import Google from '../../../Public/Google.png'
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstanceDoctor } from '../../../Services/AxiosConfig';
import { setDoctorCredential } from '../../../Redux/Slice/authSlice';
import { toast } from 'react-toastify';



function DoctorSignin() {
const [doctorDetails, setDoctorDetails] = useState({ email: '', password: '' });
const [error,setError] = useState('');
const navigate = useNavigate();
const dispatch = useDispatch();
const doctorData = useSelector((state) => state.auth.doctorData)

const handleSubmit = async (event) => {
  event.preventDefault();
  if(!doctorDetails.email || !doctorDetails.password){
      setError('Both fields are required')
  }else{
      setError('');

      try{
        const response = await axiosInstanceDoctor.post('/api/doctor/login', doctorDetails,{withCredentials:true});
        if(response.data.success){
          toast.success('Login Successfull!',{
            className: 'custom-toast',
          })
          dispatch(setDoctorCredential(response.data.data))
          navigate('/'); 
        }
        else
          navigate('/verification')
      } catch (err) {
        console.error('Error during login:', err);
        toast.error(err.response?.data?.message || 'Something went wrong, please try again later.');
      } 
  }
} 




  return (
    <div className="flex justify-center items-center min-h-screen">
    <div className='flex flex-col md:flex-row rounded-lg w-[50%]' style={{boxShadow:'4px 4px 10px grey'}}>
      <div className='bg-white w-full md:w-1/2 p-8 rounded-l-lg' >  {/* Left Column */}
        <Box
          component="form"
          className="w-full px-5 sm:px-7 flex flex-col justify-center items-center"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold mb-5">Sign In</h1>
          {/* Error Message */}
          
          {error && (
                <Typography variant='body2' color={'error'} className='mb-2'>
                    {error}
                </Typography>
            )}
          {/* Email Input */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={doctorDetails.email}
            onChange={(e) =>
              setDoctorDetails({ ...doctorDetails, email: e.target.value.trim() })
            }
          />

          {/* Password Input */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={doctorDetails.password}
            onChange={(e) =>
              setDoctorDetails({ ...doctorDetails, password: e.target.value.trim() })
            }
          />
          <Link to="/doctor-forgotpassword" className="text-xl font-bold mb-3">
            Forgot Password
          </Link>

          {/* Submit Button */}
          <div className='w-full flex items-center justify-center'>
          <div>
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: '#323232', color: '#FAF5E9' }}
            className="mt-4"
          >
            Sign In
          </Button>
          {/* <h3 className='text-blue-700'> ----- OR ----- </h3>
          <Button className='ml-12' sx={{display:'flex',marginLeft:'17px',justifyContent:'center'}} onClick={handleGoogleAuth}>
          <img src={Google} alt="google" style={{ height: '20px', width: 'auto' }} />
          </Button> */}
          </div>
          </div>
        </Box>
      </div>
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-[#DDD0C8] rounded-r-lg md:rounded-none md:rounded-r-lg'>  {/* Right Column */}
        
          <h1 className="text-3xl font-bold">Welcome Doc!</h1>
          <h3 className="text-1xl font-bold mb-3">We care for You!</h3>
          <img src={L} alt="CalmNest Logo" style={{ height: '100px', width: '150px' }} className='mb-5' />
          
          <Button
            variant="contained"
            style={{ backgroundColor: '#323232', color: '#FAF5E9' }}
            className="mt-5"
            onClick={()=>navigate('/doctor-signup')}
          >
            Sign Up
          </Button>
        
      </div>
    </div>


    </div>
  )
}

export default DoctorSignin