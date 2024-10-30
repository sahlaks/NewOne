import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import L from '../../../Public/l.png';
import { axiosInstanceDoctor } from '../../../Services/AxiosConfig';
import { validatePassword } from '../../../utils/profileValidation';
import { toast } from 'react-toastify';

function DoctorChangePassword({ open, onClose }) {
  const [userDetails, setUserDetails] = useState({ oldPassword: '', password: '', confirmPassword: '' });
  const [error,setError] = useState({});

  const handleValidation = () => {
    const newErrors = validatePassword(userDetails);
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setError({});
    setUserDetails({
        oldPassword: '', password: '', confirmPassword: ''
      })
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     const isValid = handleValidation();
     if (isValid) {
        try{
        const response = await axiosInstanceDoctor.post(`/api/doctor/change-password`, userDetails, { withCredentials: true })
        if(response.data.success){
            toast.success('Successfully Updated!',{
                className: 'custom-toast',
              })
              setUserDetails({
                oldPassword: '', password: '', confirmPassword: ''
              })
        onClose();
            }
     }catch(error){
        console.error('Error in handleSubmit:', error);
     }
  };
}

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <div className="flex flex-col justify-center items-center">
            <img src={L} alt="CalmNest Logo" style={{ height: '100px', width: '150px' }} className="mb-5" />
            <TextField
              size="small"
              label="Enter old password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              type="password"
              value={userDetails.oldPassword}
              onChange={(e) => setUserDetails({ ...userDetails, oldPassword: e.target.value })}
              error={Boolean(error.oldPassword)}
                helperText={error.oldPassword} />
              <span style={{ display: 'inline-block', width: "200px" }}></span>
            
            <TextField
              size="small"
              label="Enter new password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              type="password"
              value={userDetails.password}
              onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
              error={Boolean(error.password)}
                helperText={error.password} />
              <span style={{ display: 'inline-block', width: "200px" }}></span>
            
            <TextField
              size="small"
              label="Confirm password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              type="password"
              value={userDetails.confirmPassword}
              onChange={(e) => setUserDetails({ ...userDetails, confirmPassword: e.target.value })}
              error={Boolean(error.confirmPassword)}
                helperText={error.confirmPassword} />
              <span style={{ display: 'inline-block', width: "200px" }}></span>
            
          </div>
        </form>
      </DialogContent>
      <DialogActions>
      <div className="md:col-span-2 text-right">
                        <div className="flex justify-end space-x-3">
                          <div>
                            <button
                              className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              type="button"
                              onClick={handleClose}
                            >
                              Cancel
                            </button>
                          </div>
                          <div>
                            <button
                              className="bg-[#323232] hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              type="submit"
                              onClick={handleSubmit}
                            >
                              Update Password
                            </button>
                          </div>
                        </div>
                      </div>
      </DialogActions>
    </Dialog>
  );
}

export default DoctorChangePassword;
