import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material';
import './Testimonials.css';
import { fetchTestimonials } from '../../Services/API/CommonAPI';

function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    
    useEffect(() => {
      const getTestimonials = async () => {
        try {
          const res = await fetchTestimonials();
          if (res.success) setTestimonials(res.data);
        } catch (error) {
          console.error('Failed to load testimonials:', error);
        }
      };
      getTestimonials();
    }, []); 

  return (
    <div className="testimonial-section">
      <h2 className="testimonial-header">What Parents Are Saying</h2>
      <div className="testimonial-container">
        {testimonials.map((feedback) => (
          <div key={feedback._id} className="testimonial-card">
            <TextField
              value={feedback.message}
              size="small"
              fullWidth
              multiline
              className="testimonial-text"
              InputProps={{
                readOnly: true,
                style: { fontStyle: 'italic' },
              }}
            />
            <h4 className="testimonial-author">- {feedback.parentId?.parentName}</h4>
          </div>
        ))}
      </div>
    </div> 
  );
}

export default Testimonials;
