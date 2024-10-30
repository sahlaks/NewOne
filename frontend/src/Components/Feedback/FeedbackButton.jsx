import React, { useState } from 'react';
import './Feedback.css';
import { toast } from 'react-toastify';
import { submitFeedback } from '../../utils/parentFunctions';

const FeedbackButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState(''); 

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFeedback(''); 
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (feedback.trim() === '') {
      toast.error('Please enter your feedback before submitting.');
      return;
    }
    
    try {
      const response = await submitFeedback(feedback);
      console.log(response);
    
      if (response.success) {
        toast.success('Feedback submitted successfully!');
      } else {
        toast.error('Something went wrong, please try again.');
      }
    
      setShowModal(false);
      setFeedback('');
    } catch (error) {
      toast.error('An error occurred while submitting feedback.');
      console.error(error);
    }
  };


  return (
    <>
      <div className="feedback-button">
        <button onClick={handleOpenModal} className="feedback-btn">
          Give Feedback
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Submit Feedback</h2>
            <form onSubmit={handleSubmitFeedback}>
              <textarea
                className="feedback-textarea"
                placeholder="Type your feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button type="submit" className="submit-feedback-btn">
                Submit
              </button>
              <button type="button" onClick={handleCloseModal} className="close-modal-btn">
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
