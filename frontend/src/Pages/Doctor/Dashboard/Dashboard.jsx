import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DoctorHeader from "../../../Components/Header/DoctorHeader";
import { fetchAllDetails } from "../../../Services/API/DoctorAPI";

const DoctorDashboard = () => {
    const doctorName = useSelector((state) => state.auth.doctorData?.doctorName);
    const [dashboardData, setDashboardData] = useState({
        count: 0,
        scheduled: 0,
        completed: 0,
        revenue: 0,
        analytics: { totalRevenue: 0, totalAppointments: 0 },
        pending: 0,
        feedback: null,
        latest: null
    });

    const fetchDetails = async () => {
        const res = await fetchAllDetails()
        if (res.success) {
            setDashboardData(res);
        }
        
    }

    useEffect(()=>{
        fetchDetails()
    },[])

    return (
        <div className="p-4">
            <DoctorHeader/>

            <div className="bg-[#FAF5E9] border rounded-lg p-8 space-y-6 shadow-md mt-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold mb-2">Welcome, Dr. {doctorName}</h1>
                    
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-gray-600">Total Patients</h2>
                        <p className="text-3xl font-semibold">{dashboardData.count}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-gray-600">Scheduled Appointments</h2>
                        <p className="text-3xl font-semibold text-yellow-500">12</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-gray-600">Completed Appointments</h2>
                        <p className="text-3xl font-semibold text-green-500">{dashboardData.scheduled}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-gray-600">Revenue</h2>
                        <p className="text-3xl font-semibold text-blue-500">{`\u20B9${dashboardData.revenue}`}</p>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
                        <h3 className="text-xl font-semibold mb-4">Appointments</h3>
                        <p>Next Appointment: {dashboardData.latest ? `Patient ${dashboardData.latest.name} at ${dashboardData.latest.startTime}` : 'No upcoming appointments'}</p>
                    </div>

                    {/* Revenue Analytics */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Revenue Analytics</h3>
                        <p>Total Revenue: {`\u20B9${dashboardData.analytics.totalRevenue}`}</p>
                        <p>Total Appointments: {dashboardData.analytics.totalAppointments}</p>
                    </div>
                </div>

                {/* Additional Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Pending Appointment</h3>
                        <p>Pending Appointments: {dashboardData.pending}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Recent Feedback</h3>
                        <p>{dashboardData.feedback ? `From ${dashboardData.feedback.parentName}: ${dashboardData.feedback.feedback}` : 'No recent feedback'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
