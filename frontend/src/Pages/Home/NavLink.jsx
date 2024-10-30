import React from 'react';
import { Link } from 'react-router-dom';

const NavLink = ({ to, children, style }) => {
  return (
    <Link to={to} style={style}>
      {children}
    </Link>
  );
};

export default NavLink;
