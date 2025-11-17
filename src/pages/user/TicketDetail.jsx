import React, { useEffect, useState } from 'react';
import { X, QrCode, Download, Calendar, Clock, MapPin, Armchair, Film } from 'lucide-react';
import { getTicketDetail } from '../../services/endpoints/transaksi';

const TicketDetail = ({ ticket: initialTicket, onClose }) => {
  const [ticket, setTicket] = useState(initialTicket);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTicket?.id) {
      fetchTicketDetail();
    }
  }, [initialTicket?.id]);

  const fetchTicketDetail = async () => {
    try {
      setLoading(true);
      const response = await getTicketDetail(initialTicket.id);
      setTicket(response.data.data);
    } catch (error) {
      console.error('Error fetching ticket detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!initialTicket) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold">E-Ticket</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* QR Code */}
          <div className="bg-white rounded-lg p-4 sm:p-8 flex flex-col items-center">
            <div className="w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-lg flex items-center justify-center mb-4">
              {ticket?.kode_booking && (
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${ticket.kode_booking}`}
                  alt="QR Code"
                  className="w-full h-full"
                />
              )}
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Booking Code</p>
              <p className="font-mono font-bold text-lg sm:text-2xl text-gray-900 tracking-wider">
                {ticket?.kode_booking}
              </p>
            </div>
          </div>

          {/* Movie Info */}
          <div className="bg-gray-700 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="mx-auto sm:mx-0">
                <img 
                  src={ticket?.filmDetail?.poster} 
                  alt={ticket?.filmDetail?.judul}
                  className="w-20 h-30 sm:w-24 sm:h-36 object-cover rounded"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold mb-2">{ticket?.filmDetail?.judul}</h3>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-400">
                  <span className="bg-red-600 px-2 py-1 rounded text-white text-xs">
                    {ticket?.filmDetail?.rating_usia}
                  </span>
                  <span>{ticket?.filmDetail?.genre}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-600">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">Date</div>
                  <div className="font-semibold text-sm sm:text-base">{ticket?.jadwal?.hari}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{ticket?.jadwal?.tanggal}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">Time</div>
                  <div className="font-semibold text-base sm:text-lg">{ticket?.jadwal?.jam}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">Studio</div>
                  <div className="font-semibold text-sm sm:text-base">{ticket?.jadwal?.studio}</div>
                  <div className="text-xs text-gray-400">{ticket?.jadwal?.tipe}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Armchair className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400">Seats</div>
                  <div className="font-semibold text-sm sm:text-base">{ticket?.seats?.join(', ')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-700 rounded-lg p-4 sm:p-6">
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Payment Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Payment</span>
                <span className="font-bold text-red-500">{formatCurrency(ticket?.total_harga)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Payment Method</span>
                <span className="font-semibold capitalize">{ticket?.metode_pembayaran}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  ticket?.status === 'paid' ? 'bg-green-600' : 'bg-yellow-600'
                }`}>
                  {ticket?.status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-3 sm:p-4">
            <h4 className="font-bold text-yellow-500 mb-2 text-sm sm:text-base">Important Notes:</h4>
            <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
              <li>• Please arrive 15 minutes before showtime</li>
              <li>• Show this QR code at the entrance</li>
              <li>• This ticket is non-refundable</li>
              <li>• Keep this ticket until the end of the show</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Download Ticket
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
