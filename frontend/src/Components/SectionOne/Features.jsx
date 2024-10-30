// src/components/WhyChooseUs.js
import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const features = [
  {
    icon: <LockIcon style={{ fontSize: 50, color: '#4CAF50' }} />, 
    title: '100% Confidential',
    description: 'All advice & consultations are completely confidential.',
  },
  {
    icon: <VerifiedIcon style={{ fontSize: 50, color: '#4CAF50' }} />,
    title: 'Certified Doctors',
    description: 'We offer quality healthcare through our network of certified and experienced doctors.',
  },
  {
    icon: <PhoneAndroidIcon style={{ fontSize: 50, color: '#4CAF50' }} />,
    title: 'Convenience',
    description: "Say goodbye to long wait times. Get professional advice whenever and wherever you need it.",
  },
  {
    icon: <SupportAgentIcon style={{ fontSize: 50, color: '#4CAF50' }} />,
    title: '24/7 Support',
    description: 'Our support team is available around the clock to assist you with any queries or issues.',
  },
];

function WhyChooseUs() {
  return (
    <Container maxWidth="lg" style={{ padding: '40px 0', textAlign: 'center', backgroundColor: '#FAF5E9' }}>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box textAlign="center">
              <div>{feature.icon}</div>
              <Typography variant="h6" style={{ marginTop: '15px', color: '#323232' }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" style={{ color: '#323232', marginTop: '10px' }}>
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default WhyChooseUs;
