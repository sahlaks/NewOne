import React, { useEffect, useState } from 'react'
import { TextField, Button} from '@mui/material';
import L from '../../../../Public/l.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { axiosInstance, axiosInstanceDoctor } from '../../../../Services/AxiosConfig';

function PasswordReset() {
    const [userDetails, setUserDetails] = useState({ password: '', confirmPassword:''});
    const [error,setErrors] = useState({});
    const navigate = useNavigate();
    const parentData = useSelector((state) => state.auth.parentData);
    const location = useLocation();
    const doctor = location.state?.doctor || false;

    // useEffect(() => {
    //   if (parentData) {
    //     navigate('/');
    //   }
    // },[parentData]);

    const validate = () => {
        const newErrors = {}
         // Password validation
      if (!userDetails.password) {
        newErrors.password = 'Password is required';
      } else if (userDetails.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (userDetails.password.length > 10) {
        newErrors.password = 'Password cannot be longer than 10 characters';
      } else if (!/[A-Z]/.test(userDetails.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/\d/.test(userDetails.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*]/.test(userDetails.password)) {
        newErrors.password = 'Password must contain at least one special character';
      }
      // Confirm password validation
      if (userDetails.password !== userDetails.confirmPassword) {
        newErrors.confirmPassword = 'Passwords must match';
      } else if(!userDetails.confirmPassword){
        newErrors.confirmPassword = 'Confirm password is required'
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
    event.preventDefault();
    if(validate()){
      console.log('Form submitted with data:', userDetails);
      try{
      if(doctor){
        const response = await axiosInstanceDoctor.post('/api/doctor/new-password', userDetails,{ withCredentials:true });
        console.log('response',response);
        
        if(response.data.success){
            setUserDetails({
                password: '',
                confirmPassword: ''
            });
        navigate('/notify')
        } else {
            setErrors({ ...error, email: response.data.message });
        }
        }
      else{
        const response = await axiosInstance.post('/api/parents/new-password', userDetails,{ withCredentials:true });
        console.log('response',response);
        
        if(response.data.success){
        setUserDetails({
          password: '',
          confirmPassword: ''
        });
        navigate('/notify')
        }else{
            setErrors({ ...error, email: response.data.message });
        }
        }
        } catch (error) {
        console.error('Error sending data to backend:', error)
        }
    }
    }

  return (
    <div className="flex justify-center items-center min-h-screen">
    <div className="flex flex-col md:flex-row rounded-lg" style={{ boxShadow: '4px 4px 10px grey' }}>
      <div className="bg-white w-full p-6 rounded-lg"> {/* Left Column */}
        <form className="w-full px-5 sm:px-8 flex flex-col justify-center items-center" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4">Change Password</h1>
          <img src={L} alt="CalmNest Logo" style={{ height: '100px', width: '150px' }} className="mb-5" />
          
          {/* Email Input */}
          <TextField
            size='small'
            label="Enter new password"
            variant="outlined"
            fullWidth
            type='password'
            margin="normal"
            value={userDetails.password}
            onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value.trim() })}
            sx={{width:'300px'}}
            error={!!error.password}
            helperText={error.password}
          />
          <span style={{display:'inline-block',width:"200px"}}></span>
          <TextField
            size='small'
            label="Confirm password"
            variant="outlined"
            fullWidth
            type='password'
            margin="normal"
            value={userDetails.confirmPassword}
            onChange={(e) => setUserDetails({ ...userDetails, confirmPassword: e.target.value.trim() })}
            sx={{width:'300px'}}
            error={!!error.confirmPassword}
            helperText={error.confirmPassword}
          />
          <span style={{display:'inline-block',width:"200px"}}></span>
          
          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: '#323232', color: '#FAF5E9' }}
            className="mt-4"
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  </div>

  )
}

export default PasswordReset