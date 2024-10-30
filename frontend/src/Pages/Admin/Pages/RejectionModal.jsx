import React, { useState } from "react";

const RejectionModal = ({ onClose, onReject }) => {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if (reason) {
            onReject(reason);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-80 p-5 rounded-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Rejection Reason</h2>
                <textarea
                    className="w-full h-20 border border-gray-300 rounded p-2"
                    placeholder="Enter rejection reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    <button
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectionModal;
