import React from 'react';
import BannerImage from '../../Public/bg.png';

function MentalHealthVideo() {
  return (
    <div className="flex flex-col md:flex-row p-8">
      <div className="flex flex-col md:w-1/2 p-8">
        <h1 className="text-5xl font-bold">The Importance of Mental Health for Children</h1>
        <p className="text-2xl mt-4"> 
          Understanding and supporting mental health in children is essential for fostering resilience, 
          building self-esteem, and ensuring emotional well-being. 
          Early guidance on emotional regulation and self-awareness can help children develop healthy relationships, 
          cope with life’s challenges, and cultivate a positive self-image. 
          Explore how nurturing mental health can positively impact young lives with us!!
        </p>
      </div>

      
      <div className="flex flex-col md:w-1/2 mb-8 md:mb-0">
        <img 
          src={BannerImage} 
          alt="Mental Health for Children"
          style={{ width: '100%', height: 'auto', borderRadius: '15px', opacity: '0.9', }} 
        />
      </div>
    </div>
  );
}

export default MentalHealthVideo;
