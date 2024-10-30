import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isLoggin = useSelector((state) => state.auth.isLoggin);
  const role = useSelector((state) => state.auth.role);

  if (!isLoggin) {
    if (role === 'parent')
      return <Navigate to="/parent-login" replace />;
    else if (role === 'doctor')
      return <Navigate to="/doctor-login" replace />;
    else if (role === 'admin')
      return <Navigate to="/admin" replace />;

  }

 if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children;
};

export default ProtectedRoute;
