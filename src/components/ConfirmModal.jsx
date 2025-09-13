import React from 'react';

const ConfirmModal = ({ open, onConfirm, onCancel, message }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl">
                <p className="text-lg font-semibold mb-4">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Չեղարկել
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Այո, ապաակտիվացնել
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
