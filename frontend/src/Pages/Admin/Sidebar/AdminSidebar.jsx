// AdminSidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../../Redux/Slice/authSlice';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';
import './Sidebar.css';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const getActiveClass = (path) => {
        return location.pathname === path ? 'text-blue-400' : '';
    };

    const handleAdminLogout = async () => {
        dispatch(adminLogout());
        navigate('/admin');
    };

    return (
        <div className="bg-[#323232] text-white p-4 flex flex-col h-screen">
            <div className="mb-4 mt-16 flex flex-row justify-around">
                <div>
                    <Link to="/admin/dashboard" className={`hover:text-gray-400 ${getActiveClass('/admin/dashboard')}`}>
                        Dashboard 
                    </Link>
                </div>
                <div>
                    <Link to="/admin/dashboard" className={`hover:text-gray-400 ${getActiveClass('/admin/dashboard')}`}>
                        <DashboardIcon />
                    </Link>
                </div>
            </div >

            <div className="mb-4 flex flex-row justify-around">
                <div>
                    <Link to="/admin/parents" className={`hover:text-gray-400 ${getActiveClass('/admin/parents')}`}>
                        Parents 
                    </Link>
                </div>
                <div>
                    <Link to="/admin/parents" className={`hover:text-gray-400 ${getActiveClass('/admin/parents')}`}>
                        <PeopleIcon />
                    </Link>
                </div>
            </div>

            <div className="mb-4 flex flex-row justify-around">
                <div>
                    <Link to="/admin/doctors" className={`hover:text-gray-400 ${getActiveClass('/admin/doctors')}`}>
                        Verified Doc
                    </Link>
                </div>
                <div>
                    <Link to="/admin/doctors" className={`hover:text-gray-400 ${getActiveClass('/admin/doctors')}`}>
                        <LocalHospitalIcon />
                    </Link>
                </div>
            </div>

            <div className="mb-4 flex flex-row justify-around">
                <div>
                    <Link to="/admin/unverifieddoc" className={`hover:text-gray-400 ${getActiveClass('/admin/unverifieddoc')}`}>
                        Unverified Doc
                    </Link>
                </div>
                <div>
                    <Link to="/admin/unverifieddoc" className={`hover:text-gray-400 ${getActiveClass('/admin/unverifieddoc')}`}>
                        <LocalHospitalIcon />
                    </Link>
                </div>
            </div>

            <div className="mb-4 flex flex-row justify-around" onClick={handleAdminLogout}>
                <div>
                    <Link to="#" className="hover:text-gray-400" onClick={e => e.preventDefault()}>
                        Logout
                    </Link>
                </div>
                <div>
                    <Link to="#" className="hover:text-gray-400" onClick={e => e.preventDefault()}>
                        <LogoutIcon />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
