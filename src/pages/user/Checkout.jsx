import React, { useState, useEffect } from 'react';
import { Film, ChevronLeft, CreditCard, Wallet, Building2, CheckCircle, Clock, MapPin, Calendar, Armchair, User, Mail, Phone, AlertCircle } from 'lucide-react';
import SuccessModal from '../../components/SuccessModal';
import useTransaksiStore from '../../stores/useTransaksiStore';
import useAuthStore from '../../stores/useAuthStore';
import { createSnapToken, checkPaymentStatus, checkMidtransStatus } from '../../services/endpoints/transaksi';

const Checkout = ({ setCurrentView, checkoutData, setBookedSeats, setUserTickets }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [transaksiId, setTransaksiId] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const { createTransaksi } = useTransaksiStore();
  const { user } = useAuthStore();

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerEmail(user.email || '');
      setCustomerPhone(user.phone || '');
    }
  }, [user]);

  // Load Midtrans script
  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    // Check if script already loaded
    if (document.querySelector(`script[src="${midtransScriptUrl}"]`)) {
      console.log('Midtrans script already loaded');
      return;
    }

    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute('data-client-key', myMidtransClientKey);
    
    scriptTag.onload = () => {
      console.log('Midtrans script loaded successfully');
    };
    
    scriptTag.onerror = () => {
      console.error('Failed to load Midtrans script - Check AdBlock or network');
      alert('Failed to load payment system. Please disable AdBlock and try again.');
    };

    document.body.appendChild(scriptTag);

    return () => {
      if (document.body.contains(scriptTag)) {
        document.body.removeChild(scriptTag);
      }
    };
  }, []);

  if (!checkoutData || !checkoutData.filmDetail || !checkoutData.selectedJadwal) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Data checkout tidak lengkap</p>
          <button
            onClick={() => setCurrentView('home')}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalHarga = checkoutData.selectedSeats.length * (checkoutData.selectedJadwal.harga?.harga || 0);
  const adminFee = 2500;
  const grandTotal = totalHarga + adminFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!customerName.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!customerEmail.trim()) {
      alert('Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsProcessing(true);

    try {
      // 1. Create transaksi first
      const transaksiData = {
        jadwal_id: checkoutData.selectedJadwal.id,
        kursi_ids: checkoutData.selectedSeats,
      };

      const transaksiResult = await createTransaksi(transaksiData);
      setBookingCode(transaksiResult.kode_booking);
      setTransaksiId(transaksiResult.id);

      // 2. Get Midtrans snap token
      const snapResponse = await createSnapToken(transaksiResult.id);
      const { snap_token } = snapResponse.data;

      // 3. Check if Midtrans snap is loaded
      if (!window.snap) {
        throw new Error('Midtrans Snap not loaded. Please disable AdBlock and refresh the page.');
      }

      // 4. Trigger Midtrans Snap popup
      window.snap.pay(snap_token, {
        onSuccess: async function(result) {
          console.log('Payment success:', result);
          
          // Show loading state
          setIsProcessing(true);
          
          // Poll status multiple times dengan delay
          const maxAttempts = 5;
          let attempt = 0;
          let statusUpdated = false;
          
          while (attempt < maxAttempts && !statusUpdated) {
            try {
              await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
              
              const statusResponse = await checkMidtransStatus(transaksiResult.id);
              console.log(`Status check attempt ${attempt + 1}:`, statusResponse.data);
              
              if (statusResponse.data.data.status === 'paid') {
                statusUpdated = true;
                alert('Payment confirmed! Redirecting to your tickets...');
                setTimeout(() => {
                  setCurrentView('myticket');
                }, 1000);
              }
              
              attempt++;
            } catch (error) {
              console.error('Error checking status:', error);
              attempt++;
            }
          }
          
          if (!statusUpdated) {
            alert('Payment received but status update is delayed. Please check My Tickets in a moment.');
            setTimeout(() => {
              setCurrentView('myticket');
            }, 1000);
          }
          
          setIsProcessing(false);
        },
        
        onPending: function(result) {
          console.log('Payment pending:', result);
          alert('Payment is pending. Please complete your payment.');
          setTimeout(() => {
            setCurrentView('myticket');
          }, 1000);
        },
        
        onError: function(result) {
          console.log('Payment error:', result);
          alert('Payment failed. Please try again.');
          setIsProcessing(false);
        },
        
        onClose: function() {
          console.log('Customer closed the popup');
          setIsProcessing(true);
          
          // Check status after close with delay
          setTimeout(async () => {
            try {
              const statusResponse = await checkMidtransStatus(transaksiResult.id);
              console.log('Status after close:', statusResponse.data);
              
              if (statusResponse.data.data.status === 'paid') {
                alert('Payment confirmed!');
              } else {
                alert('Payment status: ' + statusResponse.data.data.status);
              }
              
              setCurrentView('myticket');
            } catch (error) {
              console.log('Status check error:', error);
              setCurrentView('myticket');
            }
            setIsProcessing(false);
          }, 2000);
        }
      });
    } catch (error) {
      console.error('Error in checkout process:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to process checkout. Please try again.';
      alert(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'qris',
      name: 'QRIS',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Scan QR code untuk pembayaran'
    },
    {
      id: 'transfer',
      name: 'Bank Transfer',
      icon: <Building2 className="w-6 h-6" />,
      description: 'Transfer ke rekening bank'
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      icon: <Wallet className="w-6 h-6" />,
      description: 'GoPay, OVO, Dana, ShopeePay'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => setCurrentView('pilihkursi')}
              className="flex items-center space-x-2 hover:text-red-500 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Seat Selection</span>
            </button>
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold">
                <span className="text-white">AMBA</span><span className="text-red-500">MAX</span>
              </span>
            </div>
            <div className="w-40"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-gray-400">Review your order and proceed to payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6" data-aos="fade-right">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-red-500" />
                Customer Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-red-500 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-red-500 focus:outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-red-500 focus:outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6" data-aos="fade-right" data-aos-delay="100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-500" />
                Payment Method
              </h2>
              
              <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="font-semibold text-blue-400">Midtrans Payment Gateway</div>
                    <div className="text-sm text-gray-400">Secure payment with multiple options</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  Available methods: Credit Card, Bank Transfer, E-Wallet (GoPay, OVO, Dana), QRIS, and more
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-500 mb-1">Important Notice:</p>
                <ul className="text-gray-300 space-y-1">
                  <li>• Please arrive 15 minutes before showtime</li>
                  <li>• Bring your booking code for ticket collection</li>
                  <li>• Booking will expire in 15 minutes if not paid</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1" data-aos="fade-left">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-700">
                <img 
                  src={checkoutData.filmDetail.poster_url} 
                  alt={checkoutData.filmDetail.judul}
                  className="w-20 h-28 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">{checkoutData.filmDetail.judul}</h3>
                  <div className="space-y-1 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-600 px-2 py-0.5 rounded text-xs">
                        {checkoutData.filmDetail.rating_usia}
                      </span>
                      <Clock className="w-3 h-3" />
                      <span>{checkoutData.filmDetail.durasi} min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-700 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-400">Date & Time</div>
                    <div className="font-semibold">
                      {checkoutData.selectedDate.hari}, {checkoutData.selectedDate.tanggal}
                    </div>
                    <div className="font-semibold">{checkoutData.selectedJadwal.jam_mulai || 'N/A'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-400">Studio</div>
                    <div className="font-semibold">
                      {checkoutData.selectedJadwal.studio?.nama_studio || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {checkoutData.selectedJadwal.studio?.tipe || 'Regular'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Armchair className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-gray-400">Seats</div>
                    <div className="font-semibold">
                      {checkoutData.selectedSeatCodes?.join(', ') || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {checkoutData.selectedSeats.length} seat(s)
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Ticket ({checkoutData.selectedSeats.length}x)
                  </span>
                  <span className="font-semibold">{formatCurrency(totalHarga)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Admin Fee</span>
                  <span className="font-semibold">{formatCurrency(adminFee)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Grand Total</span>
                <span className="text-2xl font-bold text-red-500">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  isProcessing
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Confirm & Pay'
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                By continuing, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setCurrentView('home');
        }}
        bookingCode={bookingCode}
        totalPrice={formatCurrency(grandTotal)}
        userEmail={user?.email}
        onViewTicket={() => {
          setShowSuccessModal(false);
          setCurrentView('myticket');
        }}
      />
    </div>
  );
};

export default Checkout;
