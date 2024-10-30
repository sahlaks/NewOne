import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <h2 style={styles.message}>Page Not Found</h2>
      <p style={styles.description}>
        The page you are looking for does not exist. It might have been moved or deleted.
      </p>
     <button style={styles.button}> <Link to="/" style={styles.link}>
        Go back to Home
      </Link>
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '50px',
  },
  errorCode: {
    fontSize: '96px',
    fontWeight: 'bold',
    color: '#ff6347',
  },
  message: {
    fontSize: '36px',
    color: '#333',
  },
  description: {
    fontSize: '18px',
    color: '#666',
  },
  link: {
    marginTop: '20px',
    fontSize: '18px',
    color: 'white',
    textDecoration: 'none',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#323232',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default NotFoundPage;
