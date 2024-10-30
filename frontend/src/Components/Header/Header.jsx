import React, { useState } from 'react';
import Logo from '../../Public/calmnestcrop.png';
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom'; // Updated import for NavLink

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const linkStyle = { color: '#323232', textDecoration: 'none' };

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    { text: 'Find Doctor', path: '/find-doctor' },
    { text: 'Parent Login', path: '/parent-login' },
    { text: 'Doctor Login', path: '/doctor-login' },
  ];

  return (
    <div>
      <AppBar position="fixed" style={{ backgroundColor: '#FAF5E9', borderRadius: '5px' }}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          {/* Logo Section */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt="CalmNest Logo" style={{ height: '60px', width: 'auto', marginRight: '16px' }} />
          </div>

          {/* Navigation Links for Medium and Larger Screens */}
          <div className='hidden md:flex space-x-4'>
            {navItems.map((item) => (
              <NavLink key={item.text} to={item.path} style={linkStyle}>
                {item.text}
              </NavLink>
            ))}
          </div>

          {/* Menu Icon for Smaller Screens */}
          <div className="md:hidden">
            <IconButton onClick={handleMenuOpen} style={{ color: '#323232' }}>
              <MenuIcon />
            </IconButton>
          </div>

          {/* Dropdown Menu for Smaller Screens */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                backgroundColor: '#FAF5E9', 
                color: '#323232', 
                borderRadius: '5px', 
              },
            }}
          >
            {navItems.map((item) => (
              <MenuItem key={item.text} onClick={handleMenuClose}>
                <NavLink to={item.path} style={linkStyle}>
                  {item.text}
                </NavLink>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
