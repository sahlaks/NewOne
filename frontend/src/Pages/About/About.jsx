import React from 'react'
import image from '../../Public/about.png'
import HeaderSwitcher from '../../Components/Header/HeadSwitcher'
import Footer from '../../Components/Footer/Footer'

function About() {
  return (
    <>
    <HeaderSwitcher/>
    <div className='flex flex-col md:flex-col mt-20'>
  <div>
    <h1 className="text-4xl font-bold text-center">Our Mission</h1>
  </div>
  <div className='flex flex-col md:flex-row'>
    <div className="md:w-1/2">
      <img 
        src={image} 
        alt="about" 
        style={{ width: '100%', height: 'auto', opacity: '0.9' }} 
      />
    </div>
    <div className="ml-5 md:w-1/2 mt-10 ">
      <h2 className="text-2xl mt-1">
        “At CalmNest, we believe in creating a nurturing environment where children and parents can thrive. Our mission is to provide expert counseling services and educational resources that promote mental well-being and foster a calm, happy family life."
      </h2>
      <h2 className="text-2xl mt-5">
        “We are committed to empowering families with the tools and guidance they need to navigate life’s challenges, fostering a calm, happy, and harmonious family life where every member feels valued, understood, and supported."
      </h2>
      <h2 className="text-2xl mt-5">
        "Founded by a team of mental health professionals and educators, CalmNest is dedicated to making high-quality counseling accessible and engaging for families everywhere."
      </h2>
    </div>
  </div>
</div>

    <Footer/>
    </>
  )
}

export default About