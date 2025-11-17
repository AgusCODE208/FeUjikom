import React, { useState, useEffect } from 'react';
import { Film, ChevronLeft, Ticket, Calendar, Clock, MapPin, Armchair, QrCode, Download, Share2, AlertCircle, CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';
import { getMyTickets, checkMidtransStatus } from '../../services/endpoints/transaksi';
import TicketDetail from './TicketDetail';

const MyTicket = ({ setCurrentView }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [activeTab]);

  // Handle payment success redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      // Remove payment param from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh tickets to get updated status
      fetchTickets();
      // Show success message
      setTimeout(() => {
        alert('Payment successful! Your ticket has been confirmed.');
      }, 500);
    }
  }, []);

  // Auto refresh every 30 seconds to update status
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTickets();
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getMyTickets(activeTab);
      setTickets(response.data.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { 
        text: 'Paid', 
        icon: <CheckCircle className="w-4 h-4" />,
        className: 'bg-green-900/30 text-green-500 border border-green-500/50'
      },
      pending: { 
        text: 'Pending Payment', 
        icon: <Clock className="w-4 h-4" />,
        className: 'bg-yellow-900/30 text-yellow-500 border border-yellow-500/50'
      }
    };
    return statusConfig[status] || statusConfig.paid;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      qris: 'QRIS',
      transfer: 'Bank Transfer',
      ewallet: 'E-Wallet'
    };
    return methods[method] || method;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tickets...</p>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    fetchTickets();
  };

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
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <Film className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              <span className="text-lg sm:text-xl font-bold hidden xs:inline">
                <span className="text-white">AMBA</span><span className="text-red-500">MAX</span>
              </span>
            </div>
            <div className="w-16 sm:w-32"></div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-red-900 to-pink-900 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Ticket className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">My Tickets</h1>
          </div>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg">View and manage your movie bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

        {/* Tabs and Refresh */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex space-x-4 sm:space-x-8 border-b border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 sm:px-4 py-3 sm:py-4 border-b-2 transition font-medium whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'all'
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              All Tickets
            </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 sm:px-4 py-3 sm:py-4 border-b-2 transition font-medium whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'upcoming'
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-3 sm:px-4 py-3 sm:py-4 border-b-2 transition font-medium whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'past'
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Past
            </button>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg transition text-sm font-medium"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Tickets List */}
        {tickets.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <Ticket className="w-16 h-16 sm:w-20 sm:h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">No tickets found</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">You haven't made any bookings yet</p>
            <button
              onClick={() => setCurrentView('home')}
              className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {tickets.map((ticket) => {
              const statusBadge = getStatusBadge(ticket.status);
              
              return (
                <div 
                  key={`ticket-${ticket.id}`}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-3 sm:p-6">
                    {/* Mobile Compact Layout */}
                    <div className="block sm:hidden">
                      <div className="flex gap-3 mb-3">
                        <img 
                          src={ticket.filmDetail.poster}
                          alt={ticket.filmDetail.judul}
                          className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold mb-1 line-clamp-2">{ticket.filmDetail.judul}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-red-600 px-2 py-0.5 rounded text-white text-xs">
                              {ticket.filmDetail.rating_usia}
                            </span>
                            <span className="text-xs text-gray-400 truncate">{ticket.filmDetail.genre}</span>
                          </div>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${statusBadge.className}`}>
                            {statusBadge.icon}
                            <span className="font-semibold text-xs">{statusBadge.text}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div className="bg-gray-700 rounded p-2">
                          <div className="text-gray-400 mb-1">Date & Time</div>
                          <div className="font-semibold">{ticket.jadwal.tanggal}</div>
                          <div className="text-red-500 font-bold">{ticket.jadwal.jam}</div>
                        </div>
                        <div className="bg-gray-700 rounded p-2">
                          <div className="text-gray-400 mb-1">Studio & Seats</div>
                          <div className="font-semibold">{ticket.jadwal.studio}</div>
                          <div className="text-red-500 font-bold">{ticket.seats.join(', ')}</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-700 rounded p-2 mb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-xs text-gray-400">Booking Code</div>
                            <div className="font-mono font-bold text-sm">{ticket.kode_booking}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-400">Total</div>
                            <div className="text-lg font-bold text-red-500">{formatCurrency(ticket.total_harga)}</div>
                          </div>
                        </div>
                      </div>
                      
                      {ticket.status === 'paid' ? (
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-lg font-semibold transition text-sm"
                        >
                          <QrCode className="w-4 h-4" />
                          View E-Ticket
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            try {
                              await checkMidtransStatus(ticket.id);
                              fetchTickets();
                              alert('Status updated!');
                            } catch (error) {
                              alert('Failed to update status');
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg font-semibold transition text-sm"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Check Payment Status
                        </button>
                      )}
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex gap-6">
                      {/* Poster */}
                      <div className="flex-shrink-0">
                        <img 
                          src={ticket.filmDetail.poster}
                          alt={ticket.filmDetail.judul}
                          className="w-28 h-42 lg:w-32 lg:h-48 object-cover rounded-lg"
                        />
                      </div>

                      {/* Ticket Info */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl lg:text-2xl font-bold mb-2">{ticket.filmDetail.judul}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span className="bg-red-600 px-2 py-1 rounded text-white text-xs">
                                {ticket.filmDetail.rating_usia}
                              </span>
                              <span>{ticket.filmDetail.genre}</span>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusBadge.className}`}>
                            {statusBadge.icon}
                            <span className="font-semibold text-sm">{statusBadge.text}</span>
                          </div>
                        </div>

                        {/* Booking Details Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t border-b border-gray-700">
                          <div className="flex items-start gap-2">
                            <Calendar className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs text-gray-400">Date</div>
                              <div className="font-semibold text-base">{ticket.jadwal.hari}</div>
                              <div className="text-xs text-gray-400">{ticket.jadwal.tanggal}</div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs text-gray-400">Time</div>
                              <div className="font-semibold text-base lg:text-lg">{ticket.jadwal.jam}</div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs text-gray-400">Studio</div>
                              <div className="font-semibold text-base">{ticket.jadwal.studio}</div>
                              <div className="text-xs text-gray-400">{ticket.jadwal.tipe}</div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Armchair className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs text-gray-400">Seats</div>
                              <div className="font-semibold text-base">{ticket.seats.join(', ')}</div>
                              <div className="text-xs text-gray-400">{ticket.seats.length} seat(s)</div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Booking Code</div>
                            <div className="font-mono font-bold text-lg tracking-wider">{ticket.kode_booking}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              Booked on {formatDate(ticket.tanggal_transaksi)}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-gray-400 mb-1">Total Payment</div>
                            <div className="text-2xl font-bold text-red-500">
                              {formatCurrency(ticket.total_harga)}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              via {getPaymentMethodText(ticket.metode_pembayaran)}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                          {ticket.status === 'paid' ? (
                            <button
                              onClick={() => setSelectedTicket(ticket)}
                              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition text-base"
                            >
                              <QrCode className="w-4 h-4" />
                              View E-Ticket
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                try {
                                  await checkMidtransStatus(ticket.id);
                                  fetchTickets();
                                  alert('Status updated!');
                                } catch (error) {
                                  alert('Failed to update status');
                                }
                              }}
                              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition text-sm"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Check Payment Status
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TicketDetail ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </div>
  );
};

export default MyTicket;
