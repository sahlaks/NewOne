import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import schoolCounselingImage from "../../Public/two.jpg";
import playTherapyImage from "../../Public/four.webp";
import pcitImage from "../../Public/banner.webp";

function DoctorList() {
  const navigate = useNavigate();
  const services = [
    {
      title: "School Counseling",
      description: "Helping students navigate school challenges and improve mental health.",
      image: schoolCounselingImage,
    },
    {
      title: "Play Therapy",
      description: "Engaging children in play to help them express emotions and resolve issues.",
      image: playTherapyImage,
    },
    {
      title: "Parent-Child Interaction Therapy (PCIT)",
      description: "Improving communication and relationship quality between parents and children.",
      image: pcitImage,
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center text-center p-8">
      <h2 className="text-6xl font-bold mb-8">Our Services</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="max-w-xs rounded-lg shadow-lg overflow-hidden bg-white transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
            </div>
            <Button
              className="hover:bg-gray-200 px-4 py-2 rounded-lg shadow-md"
              onClick={() => navigate(`/services`)}
              size="small"
              style={{ color: '#FAF5E9', backgroundColor: '#323232', marginBottom: '15px' }}
            >
              Learn More
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorList;
