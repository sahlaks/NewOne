import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RedirectIfLoggedIn = ({ children }) => {
  const isLoggin = useSelector((state) => state.auth.isLoggin);
  const role = useSelector((state) => state.auth.role);

  if (isLoggin) {
    switch (role) {
      case 'parent':
        return <Navigate to="/" replace />;
      case 'doctor':
        return <Navigate to="/" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }


  return children;
};

export default RedirectIfLoggedIn;
