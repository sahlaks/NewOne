import React from 'react';
import Logo from '../../Public/calmnestcrop.png';
import { AppBar, Toolbar, IconButton} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import NavLink from '../../Pages/Home/NavLink';

function AdminHeader() {
  const linkStyle = { color: '#323232', textDecoration: 'none'}

  return (
  <div>
    <AppBar position="fixed" style={{ backgroundColor: '#FAF5E9',borderRadius:'5px' }}>
      <Toolbar style={{ justifyContent: 'space-between' }}>
        {/* Logo Section */}
        <div style={{display:'flex', alignItems:'center'}}>
          <img src={Logo} alt="CalmNest Logo" style={{ height: '60px', width: 'auto', marginRight: '16px' }} />
        </div>

        {/* Navigation Links */}
        <div className=' md:flex space-x-4'>
        <h1 className="text-2xl font-bold text-[#323232]">Admin Dashboard</h1>
        </div>
        
        

      </Toolbar>
    </AppBar>
    </div>
  )
}

export default AdminHeader