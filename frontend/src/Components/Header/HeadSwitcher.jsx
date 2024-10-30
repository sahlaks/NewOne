import React from 'react';
import { useSelector } from 'react-redux';
import ParentHeader from './ParentHeader';
import DoctorHeader from './DoctorHeader';
import Header from './Header'; 

const HeaderSwitcher = () => {
  const role = useSelector(state => state.auth.role);
  const isLoggin = useSelector(state => state.auth.isLoggin);

  const renderHeader = () => {
    if (isLoggin) {
      switch (role) {
        case 'parent':
          return <ParentHeader />;
        case 'doctor':
          return <DoctorHeader />;
        
        default:
          return <Header />;
      }
    }
    return <Header />;
  };

  return renderHeader();
};

export default HeaderSwitcher;
