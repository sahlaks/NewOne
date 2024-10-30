import React, { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import AdminLayout from "../Layout/AdminLayout";
import {
  fetchAppointmentsPerMonth,
  fetchPatientGenderDistribution,
  fetchAppointmentStatusDistribution,
  fetchUserGrowth,
  fetchSlotUsageStatistics,
} from "../../../Services/API/AdminAPI";
import "./Dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

function ParentsManagement() {
  const [appointmentData, setAppointmentData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [count, setCountData] = useState({ scheduled: 0, canceled: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const [appointments, genders, statuses, users, counts] = await Promise.all(
        [
          fetchAppointmentsPerMonth(),
          fetchPatientGenderDistribution(),
          fetchAppointmentStatusDistribution(),
          fetchUserGrowth(),
          fetchSlotUsageStatistics(),
        ]
      );

      setAppointmentData(appointments?.data || []);
      setGenderData(genders?.data || []);
      setStatusData(statuses?.data || []);
      setUserGrowthData(users?.data || []);
      setCountData(counts?.data || { scheduled: 0, canceled: 0 });
    };
    fetchData();
  }, []);

  // Appointment Data
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const mappingData = appointmentData.map((appointment) => ({
    month: monthNames[appointment._id.month - 1] + " " + appointment._id.year,
    count: appointment.count,
  }));

  const appointmentChartData = {
    labels: mappingData.map((appointment) => appointment.month),
    datasets: [
      {
        label: "Appointments",
        data: mappingData.map((appointment) => appointment.count),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
    ],
  };

  // Patient Gender Distribution
  const genderCounts = {
    Male: 0,
    Female: 0,
    Other: 0,
  };

  genderData.forEach((gender) => {
    if (gender._id in genderCounts) {
      genderCounts[gender._id] = gender.count;
    }
  });

  const genderChartData = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        data: [genderCounts.Male, genderCounts.Female, genderCounts.Other],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  // Appointment Status Distribution
  const statusChartData = {
    labels: ["Pending", "Scheduled", "Canceled", "Completed"],
    datasets: [
      {
        label: "Appointments",
        data: statusData?.map((status) => status.count) || [],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0"],
        borderColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0"],
        borderWidth: 1,
      },
    ],
  };

  // User Growth (Bar Chart)
  const allMonths = Array.from(
    new Set([
      ...(userGrowthData?.doctors?.map(
        (doctor) => `${doctor.year}-${doctor.month}`
      ) || []),
      ...(userGrowthData?.parents?.map(
        (parent) => `${parent.year}-${parent.month}`
      ) || []),
    ])
  );

  const doctorCounts = allMonths.map((month) => {
    const doctorData = userGrowthData?.doctors?.find(
      (doctor) => `${doctor.year}-${doctor.month}` === month
    );
    return doctorData ? doctorData.count : 0;
  });

  const parentCounts = allMonths.map((month) => {
    const parentData = userGrowthData?.parents?.find(
      (parent) => `${parent.year}-${parent.month}` === month
    );
    return parentData ? parentData.count : 0;
  });

  const userGrowthChartData = {
    labels: allMonths,
    datasets: [
      {
        label: "Doctors",
        data: doctorCounts,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
      {
        label: "Parents",
        data: parentCounts,
        backgroundColor: "rgba(255,159,64,0.6)",
        borderColor: "rgba(255,159,64,1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
  };

  console.log(count);
  
  const totalAppointments = count.totalScheduled + count.totalCanceled;
const canceledPercentage = totalAppointments
  ? (count.totalCanceled / totalAppointments) * 100
  : 0;
const scheduledPercentage = totalAppointments
  ? (count.totalScheduled / totalAppointments) * 100
  : 0;

  // Set up chart data for cancellation statistics
  const cancellationRateChartData = {
    labels: ["Canceled", "Scheduled"],
    datasets: [
      {
        data: [canceledPercentage, scheduledPercentage],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>

        {/* Appointments Per Month Graph */}
        <div className="rounded-lg bg-card text-card-foreground shadow-sm w-full">
          <div className=" p-4 h-[250px] sm:h-[400px] md:h-[500px] ">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold tracking-tight text-lg sm:text-xl">
                Appointments Per Month
              </h3>
            </div>
            <div className="flex aspect-video justify-center text-xs">
              <Line data={appointmentChartData} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mt-20">
            {/* Gender Distribution */}
            <div className="border border-gray-300 shadow rounded-lg p-4 h-[300px]">
              <h3 className="font-semibold tracking-tight text-lg">
                Patient Gender Distribution
              </h3>
              <div className="flex h-full justify-center">
                <Pie data={genderChartData} />
              </div>
            </div>

            {/* Appointment Status Distribution */}
            <div className="border border-gray-300 shadow rounded-lg p-4 h-[300px]">
              <h3 className="font-semibold tracking-tight text-lg">
                Appointment Status Distribution
              </h3>
              <div className="flex h-full justify-center">
                <Bar
                  data={statusChartData}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* User Growth */}
            <div className="border border-gray-300 shadow rounded-lg p-4 h-[300px]">
              <h3 className="font-semibold tracking-tight text-lg">
                User Growth
              </h3>
              <div className="flex h-full justify-center">
                <Bar data={userGrowthChartData} options={options} />
              </div>
            </div>
          </div>

         {/* Scheduled to Cancellation Statistics */}
        <div className="border border-gray-300 shadow rounded-lg p-4 h-[300px]">
          <h3 className="font-semibold tracking-tight text-lg">
            Scheduled to Cancellation Statistics
          </h3>
          <div className="flex h-full justify-center">
            <Pie data={cancellationRateChartData} />
          </div>
        </div>
      
        </div>
      </div>
    </AdminLayout>
  );
}

export default ParentsManagement;
