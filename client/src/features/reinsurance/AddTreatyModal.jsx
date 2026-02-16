import React, { useState } from 'react';

const AddTreatyModal = ({ isOpen, onClose, onCreated, AddTreatyForm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <AddTreatyForm onCreated={onCreated} />
      </div>
    </div>
  );
};

export default AddTreatyModal;
