import React from 'react';
import { Film, ChevronLeft, CheckCircle, Calendar, Clock, MapPin, Armchair, Ticket, Download, Share2 } from 'lucide-react';

const KonfirmasiBooking = ({ setCurrentView, bookingData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center space-x-2 hover:text-red-500 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold">
                <span className="text-white">AMBA</span><span className="text-red-500">MAX</span>
              </span>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8" data-aos="zoom-in">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Booking Confirmed!</h1>
          <p className="text-gray-400 text-lg">Your ticket has been successfully booked</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-gray-800 rounded-lg p-8 mb-6" data-aos="fade-up">
          <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-gray-700">
            <img 
              src={bookingData.filmDetail.poster} 
              alt={bookingData.filmDetail.judul}
              className="w-32 h-48 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{bookingData.filmDetail.judul}</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-red-600 px-2 py-1 rounded text-xs font-semibold">
                  {bookingData.filmDetail.rating_usia}
                </span>
                <span className="text-gray-400">{bookingData.filmDetail.genre}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="text-gray-400">Date</div>
                    <div className="font-semibold">{bookingData.selectedDate.hari}, {bookingData.selectedDate.tanggal}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="text-gray-400">Time</div>
                    <div className="font-semibold">{bookingData.selectedJadwal.jam}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="text-gray-400">Studio</div>
                    <div className="font-semibold">{bookingData.selectedJadwal.studio}</div>
                    <div className="text-xs text-gray-400">{bookingData.selectedJadwal.tipe}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Armchair className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="text-gray-400">Seats</div>
                    <div className="font-semibold">{bookingData.selectedSeats.join(', ')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Code */}
          <div className="bg-gray-700 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Booking Code</div>
              <div className="font-mono font-bold text-3xl tracking-wider text-red-500 mb-2">
                {bookingData.kode_booking}
              </div>
              <p className="text-sm text-gray-400">Show this code at the cinema counter</p>
            </div>
          </div>

          {/* Total Payment */}
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-700">
            <span className="text-lg font-semibold">Total Payment</span>
            <span className="text-3xl font-bold text-red-500">
              {formatCurrency(bookingData.total_harga)}
            </span>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-300">
              <strong>Confirmation email sent to:</strong> {bookingData.user.email}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCurrentView('myticket')}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              <Ticket className="w-5 h-5" />
              View My Tickets
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition">
              <Download className="w-5 h-5" />
              Download E-Ticket
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4" data-aos="fade-up" data-aos-delay="100">
          <p className="font-semibold text-yellow-500 mb-2">Important Reminders:</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Please arrive 15 minutes before showtime</li>
            <li>• Bring your booking code for ticket collection</li>
            <li>• Valid ID may be required for age-restricted films</li>
            <li>• No refund for cancelled bookings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KonfirmasiBooking;
