// ParentFeedbackModal.jsx
import React, { useState } from 'react';

const ParentFeedbackModal = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(5); // Default rating
    const [review, setReview] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit({ rating, review });
        onClose();
        setReview('')
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-white p-5 rounded shadow-lg text-left w-96">
                <h2 className="text-xl mb-4 text-black">Rate Your Experience</h2>
                <div className="mb-4">
                    <label className="mr-2 text-black">Rating:</label>
                    <select value={rating} onChange={(e) => setRating(e.target.value)} className="border rounded p-2 text-black">
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                </div>
                <textarea
                    placeholder="Leave a review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="border rounded p-2 w-full mb-4 text-black"
                />
                <div className="flex justify-center space-x-4">
                    <button className="bg-[#323232] text-white py-2 px-4 rounded" onClick={handleSubmit}>
                        Submit
                    </button>
                    <button className="bg-[#DDD0C8] text-white py-2 px-4 rounded" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParentFeedbackModal;
