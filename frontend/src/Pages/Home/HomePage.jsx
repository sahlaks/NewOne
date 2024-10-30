import React, { useEffect } from 'react';
import './HomePage.css';

import Banner from '../../Components/Banner/Banner';
import SectionOne from '../../Components/SectionOne/SectionOne';
import SectionTwo from '../../Components/SectionTwo/SectionTwo';
import SectionThree from '../../Components/SectionThree/SectionThree';
import DoctorList from '../../Components/DoctorList/DoctorList';
import Testimonials from '../../Components/Testimonials/Testimonials';
import Footer from '../../Components/Footer/Footer';
import HeaderSwitcher from '../../Components/Header/HeadSwitcher';
import MentalHealthVideo from '../../Components/MentalHealth/MentalHealthVideo';
import WhyChooseUs from '../../Components/SectionOne/Features';


const HomePage = () => {

  return (
    <>
      <HeaderSwitcher/>
      <Banner/>
      <MentalHealthVideo/>
      <SectionOne/>
      <WhyChooseUs/>
      <SectionTwo/>
      <DoctorList/>
      <SectionThree/>
      <Testimonials/>
      <Footer/>
    </>
  );
};

export default HomePage;
