
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material'
import L from '../../../Public/l.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstanceAdmin } from '../../../Services/AxiosConfig';
import { setAdminCredential } from '../../../Redux/Slice/authSlice';


function AdminSignin() {
const [userDetails, setUserDetails] = useState({ email: '', password: '' });
const [error,setError] = useState('');
const navigate = useNavigate();
const dispatch = useDispatch();
const adminData = useSelector((state)=>state.auth.adminData)


const handleSubmit = async (event) => {
  event.preventDefault();
  if(!userDetails.email || !userDetails.password){
      setError('Both fields are required')
  }else{
      setError('');

      try{
        const response = await axiosInstanceAdmin.post('/api/admin/admin-login', userDetails);
        if(response.data.success){
          dispatch(setAdminCredential(response.data.data))
          navigate('/admin/dashboard')
        }else{
          //setError(response.data.message || 'Login failed!')
        }
      } catch (err) {
        console.error('Error during login:', err);
      } 
  }
}

  return (
    <div className="flex justify-center items-center min-h-screen">
    <div className='flex flex-col md:flex-row rounded-lg'style={{boxShadow:'4px 4px 10px grey'}} >

      <div className='bg-white w-full p-8  rounded-lg' >  {/* Left Column */}
        <Box
          component="form"
          className="w-full px-5 sm:px-7 flex flex-col justify-center items-center"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold mb-5">Welcome Admin</h1>
          <img src={L} alt="CalmNest Logo" style={{ height: '100px', width: '150px' }} className='mb-5' />
          {/* Email Input */}
           {/* Error Message */}
           {error && (
                <Typography variant='body2' color={'error'} className='mb-2'>
                    {error}
                </Typography>
            )}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={userDetails.email}
            onChange={(e) =>
              setUserDetails({ ...userDetails, email: e.target.value.trim() })
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
            value={userDetails.password}
            onChange={(e) =>
              setUserDetails({ ...userDetails, password: e.target.value.trim() })
            }
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: '#323232', color: '#FAF5E9' }}
            className="mt-4"
          >
            Sign In
          </Button>
        </Box>
      </div>
    </div>


    </div>
  )
}

export default AdminSignin