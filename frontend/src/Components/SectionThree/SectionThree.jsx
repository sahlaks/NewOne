import React from 'react';
import ThirdSection from '../../Public/forth.png';

function SectionThree() {
  return (
    <div className='relative flex flex-col p-10 md:mb-0 justify-center items-center text-center'>
      <h2 className="text-[#323232] font-bold text-6xl">
        Our Goal
      </h2>
      <img 
        src={ThirdSection} 
        alt="Banner" 
        style={{ width: '100%', height: 'auto' }} 
      />
      <h2 className="text-2xl mt-2">
        "We promise to provide a warm, fun and nurturing atmosphere with a professional approach. 
        Our programs are designed to enhance the support and progress of your child’s treatment. 
        With a focus on holistic care, we create personalized experiences that cater to the unique needs of each child, ensuring they receive the attention and guidance necessary for their emotional and mental well-being. 
        At CalmNest, we believe in fostering resilience, encouraging growth, and empowering families to thrive together."
      </h2>
    </div>
  );
}

export default SectionThree;
