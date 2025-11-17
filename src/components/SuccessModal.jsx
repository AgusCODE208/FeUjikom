import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, bookingCode, totalPrice, onViewTicket, userEmail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-3">Booking Successful!</h2>
        <p className="text-gray-400 mb-6">Your ticket has been booked successfully</p>

        {/* Booking Details */}
        <div className="bg-gray-700 rounded-lg p-6 mb-6 text-left">
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400 mb-1">Booking Code</div>
              <div className="font-mono font-bold text-xl tracking-wider text-red-500">
                {bookingCode}
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-3">
              <div className="text-sm text-gray-400 mb-1">Total Payment</div>
              <div className="text-2xl font-bold text-white">
                {totalPrice}
              </div>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-6 text-sm text-left">
          <p className="text-blue-300">
            A confirmation email has been sent to <span className="font-semibold">{userEmail}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onViewTicket}
            className="flex-1 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            View My Tickets
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
