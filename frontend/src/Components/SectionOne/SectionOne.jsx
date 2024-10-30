import React from 'react'
import secondImage from '../../Public/feature.jpg'

function SectionOne() {
  return (
    <>
        <div className="flex flex-col md:flex-row p-8">
        <div className="flex flex-col md:w-1/2 mb-8 md:mb-0">
            <img 
            src={secondImage} 
            alt="SectionOne" 
            style={{ width: '100%', height: 'auto', borderRadius: '15px', opacity: '0.9' }} 
            />
        </div>

        <div className="flex flex-col md:w-1/2 p-8">
            <h1 className="text-6xl font-bold">Why Choose CalmNest?</h1>
            <h2 className="text-2xl mt-1">
            CalmNest’s mission is to rebuild lives, restore families, and improve communities. 
            Learn through engaging and interactive content designed to promote mental well-being.
            </h2>
            <h2 className="text-2xl mt-2">
            Join us in creating a healthier, happier future for families by fostering understanding, growth, and positive connections.
            </h2>
        </div>
        </div>

    </>
  )
}

export default SectionOne