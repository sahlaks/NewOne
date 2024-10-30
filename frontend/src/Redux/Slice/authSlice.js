import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parentData: JSON.parse(localStorage.getItem('parentData')) || {},
  doctorData: JSON.parse(localStorage.getItem('doctorData')) || {},
  adminData: JSON.parse(localStorage.getItem('adminData')) || {},
  isLoggin: JSON.parse(localStorage.getItem('isLoggin')) || false,
  role: localStorage.getItem('role') || null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setParentCredential: (state, action) => {
        state.parentData = action.payload;
        state.isLoggin = true;
        state.role ='parent';
        localStorage.setItem('parentData', JSON.stringify(action.payload));
        localStorage.setItem('isLoggin', JSON.stringify(true));
        localStorage.setItem('role', 'parent'); 
      },
      setDoctorCredential: (state, action) => {
        state.doctorData = action.payload;
        state.isLoggin = true;
        state.role = 'doctor';
        localStorage.setItem('doctorData', JSON.stringify(action.payload));
        localStorage.setItem('isLoggin', JSON.stringify(true));
        localStorage.setItem('role', 'doctor');
      },
      setAdminCredential: (state, action) => {
        state.adminData = action.payload;
        state.isLoggin = true;
        state.role='admin';
        localStorage.setItem('adminData', JSON.stringify(action.payload));
        localStorage.setItem('isLoggin', JSON.stringify(true));
        localStorage.setItem('role', 'admin');
      },
      parentLogout: (state) => {
        state.parentData = {};
        state.isLoggin = false;
        state.role = null;
        localStorage.removeItem('parentData');
        localStorage.removeItem('isLoggin');
        localStorage.removeItem('role');
      },
      doctorLogout: (state) => {
        state.doctorData = {};
        state.isLoggin = false;
        state.role = null;
        localStorage.removeItem('doctorData');
        localStorage.removeItem('isLoggin');
        localStorage.removeItem('role');
      },
      adminLogout: (state) => {
        state.adminData = {};
        state.isLoggin = false;
        state.role = null;
        localStorage.removeItem('adminData');
        localStorage.removeItem('isLoggin');
        localStorage.removeItem('role');
      },
    },
  });
  
  export const {
    setParentCredential,
    setDoctorCredential,
    setAdminCredential,
    parentLogout,
    doctorLogout,
    adminLogout,
  } = authSlice.actions;
  
  export const authReducer = authSlice.reducer;