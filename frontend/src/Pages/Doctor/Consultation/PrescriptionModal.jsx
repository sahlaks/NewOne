import React, { useState } from "react";
import './Prescription.css';

const PrescriptionModal = ({ isOpen, onClose, appointment, onSubmitPrescription }) => {
  const [recommendations, setRecommendations] = useState([{ id: Date.now(), text: '' }]);

  const handleInputChange = (index, event) => {
    const newRecommendations = [...recommendations];
    newRecommendations[index].text = event.target.value;
    setRecommendations(newRecommendations);
  };

  const handleAddRecommendation = () => {
    setRecommendations([...recommendations, { id: Date.now(), text: '' }]);
  };

  const handleRemoveRecommendation = (id) => {
    setRecommendations(recommendations.filter(rec => rec.id !== id));
  };

  const handleSubmit = () => {
    onSubmitPrescription(recommendations);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title text-2xl font-bold underline">Add Prescription</h2>
        <div className="modal-body">
          <h3 className="text-xl"><strong>Patient Name: </strong>{appointment.name}</h3>
          <p className="text-xl"><strong>Appointment Date: </strong>{appointment.date}</p>
          <p className="text-xl"><strong>Consulting Type:</strong> Video Consulting</p>

         {/* Dynamic Recommendation Input Fields */}
         <h3 className="text-xl font-bold mt-5">Enter Recommendations:</h3>
          {recommendations.map((rec, index) => (
            <div key={rec.id} className="recommendation-field text-xl">
              <input
                type="text"
                value={rec.text}
                onChange={(e) => handleInputChange(index, e)}
                placeholder={`Recommendation ${index + 1}`}
                className="prescription-input"
              />
              <button 
                onClick={() => handleRemoveRecommendation(rec.id)} 
                className="remove-recommendation-btn"
              >
                X
              </button>
            </div>

          ))}
          <button onClick={handleAddRecommendation} className="add-recommendation-btn">
            + Add Recommendation
          </button>
        </div>


        <div className="modal-footer space-x-4">
          <button onClick={handleSubmit} className="modal-save-btn">Save Prescription</button>
          <button onClick={onClose} className="modal-close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
