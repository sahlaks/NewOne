import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BannerImage from '../../Public/kid.jpg';

function Banner() {
  const navigate = useNavigate();
  
  return (
    <div style={{ marginTop: '70px', position: 'relative' }}>
      <Container 
        maxWidth="lg" 
        style={{ 
          padding: '0', 
          position: 'relative', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '70vh', 
          overflow: 'hidden',
          borderRadius: '20px' 
        }}
      >
        {/* Background Image */}
        <img
          src={BannerImage}
          alt="Banner"
          style={{
            opacity: 0.85,
            filter: 'brightness(70%)',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '20px',
          }}
        />
        
        {/* Text and Button Container */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#FAF5E9',
            textAlign: 'center',
            width: '80%',
          }}
        >
          <Typography variant="h2" style={{ fontWeight: 600, marginBottom: '10px', fontSize: '2.5rem' }}>
            "Nurturing a Calmer, Happier Family Life"
          </Typography>
          <Typography variant="h5" style={{ fontWeight: 300, marginBottom: '20px', fontSize: '1.2rem' }}>
            Expert counseling and educational resources for children and parents
          </Typography>
          
          {/* Call to Action Button */}
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#323232',
              color: '#FAF5E9',
              padding: '10px 30px',
              fontSize: '1rem',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.2s, background-color 0.3s',
              '&:hover': {
                backgroundColor: '#4A4A4A',
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => navigate('/about')}
          >
            More About Us
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Banner
