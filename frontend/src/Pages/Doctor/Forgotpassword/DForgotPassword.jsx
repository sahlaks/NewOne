import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import L from '../../../Public/l.png';
import { axiosInstanceDoctor } from '../../../Services/AxiosConfig';
import { useNavigate } from 'react-router-dom';

function DForgotPassword() {
  const [email, setEmail] = useState('');
  const [error,setErrors] = useState('');
  const navigate = useNavigate();


  const validate = () =>{
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(validate()){
      try {
        const response = await axiosInstanceDoctor.post('/api/doctor/forgot-pwd',{ email },{ withCredentials:true });
        console.log('doctor response',response);
          if(response.data.success){
            const changePassword = response.data.changePassword
            setEmail('');
            navigate('/d-otp', {state: {changePassword}});
          } else{
            setErrors({ ...error, email: response.data.message });
          }
       }catch(error){

      }
    }
  }
    
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col md:flex-row rounded-lg" style={{ boxShadow: '4px 4px 10px grey' }}>
        <div className="bg-white w-full p-6 rounded-lg">
          <form className="w-full px-5 sm:px-8 flex flex-col justify-center items-center" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
            <img src={L} alt="CalmNest Logo" style={{ height: '100px', width: '150px' }} className="mb-5" />
            
            {/* Email Input */}
            <TextField
                size='small'
              label="Enter your email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              name='email'
              onChange={(e) => setEmail(e.target.value.trim())}
              sx={{width:'300px'}} 
              error={Boolean(error.email)} 
              helperText={error.email} 
            />
            <span style={{display:'inline-block',width:"200px"}}></span>
            
            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: '#323232', color: '#FAF5E9' }}
              className="mt-4"
            >
              Verify
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DForgotPassword;
