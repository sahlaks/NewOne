import React from 'react';

const CustomPopup = ({ title, message, onConfirm, onCancel }) => {
  console.log(title,message);
  return (
    
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-80 p-5 rounded-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">{title}</h2>
        <p className="mb-6 text-black">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-[#DDD0C8] text-gray-800 px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-[#323232] text-[#FAF5E9] px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPopup
