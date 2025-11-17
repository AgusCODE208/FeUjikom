import React, { useState, useEffect } from 'react';
import { ChevronLeft, CreditCard, Wallet, Banknote, CheckCircle, Printer, Clock } from 'lucide-react';
import useKasirTransaksiStore from '../../stores/useKasirTransaksiStore';
import api from '../../services/api';

const KonfirmasiPembayaran = ({ customerInfo, filmDetail, selectedJadwal, selectedDate, selectedSeats, onComplete, onBack }) => {
  const { createTransaksi, loading } = useKasirTransaksiStore();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [isProcessingMidtrans, setIsProcessingMidtrans] = useState(false);

  const totalPrice = selectedSeats.length * (selectedJadwal?.harga?.harga || 0);
  const change = paymentAmount ? parseInt(paymentAmount) - totalPrice : 0;

  const paymentMethods = [
    { id: 'cash', name: 'Tunai', icon: Banknote },
    { id: 'midtrans', name: 'Midtrans (QRIS/Transfer/E-Wallet/Kartu)', icon: CreditCard }
  ];

  // Load Midtrans script
  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    if (document.querySelector(`script[src="${midtransScriptUrl}"]`)) {
      return;
    }

    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute('data-client-key', myMidtransClientKey);
    
    scriptTag.onload = () => console.log('Midtrans loaded');
    scriptTag.onerror = () => alert('Failed to load payment system. Please disable AdBlock.');

    document.body.appendChild(scriptTag);

    return () => {
      if (document.body.contains(scriptTag)) {
        document.body.removeChild(scriptTag);
      }
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Pilih metode pembayaran');
      return;
    }

    if (paymentMethod === 'cash') {
      if (!paymentAmount || parseInt(paymentAmount) < totalPrice) {
        alert('Jumlah pembayaran tidak cukup');
        return;
      }

      // Confirmation dialog
      const confirmed = window.confirm(
        `Konfirmasi Pembayaran Tunai\n\n` +
        `Total: ${formatCurrency(totalPrice)}\n` +
        `Diterima: ${formatCurrency(parseInt(paymentAmount))}\n` +
        `Kembalian: ${formatCurrency(change)}\n\n` +
        `Apakah customer sudah membayar?`
      );

      if (!confirmed) {
        return;
      }

      try {
        const response = await createTransaksi({
          customer_nama: customerInfo.nama,
          customer_email: customerInfo.email,
          customer_telepon: customerInfo.telepon,
          jadwal_id: selectedJadwal.id,
          kursi_ids: selectedSeats,
          metode_pembayaran: 'cash',
          jumlah_bayar: parseFloat(paymentAmount),
        });

        setTransactionData(response.data);
        setShowSuccess(true);
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal membuat transaksi');
      }
    } else if (paymentMethod === 'midtrans') {
      setIsProcessingMidtrans(true);
      
      try {
        // Create transaksi first
        const response = await createTransaksi({
          customer_nama: customerInfo.nama,
          customer_email: customerInfo.email,
          customer_telepon: customerInfo.telepon,
          jadwal_id: selectedJadwal.id,
          kursi_ids: selectedSeats,
          metode_pembayaran: 'midtrans',
          jumlah_bayar: null,
        });

        const transaksiId = response.data.id;
        setTransactionData(response.data);

        // Get snap token from kasir endpoint
        const snapResponse = await api.post(`/kasir/payment/${transaksiId}/snap-token`);
        const { snap_token } = snapResponse.data;

        if (!window.snap) {
          throw new Error('Midtrans not loaded. Please disable AdBlock.');
        }

        // Open Midtrans popup
        window.snap.pay(snap_token, {
          onSuccess: async function(result) {
            console.log('Payment success:', result);
            setIsProcessingMidtrans(true);
            
            // Poll status
            const maxAttempts = 5;
            let attempt = 0;
            let statusUpdated = false;
            
            while (attempt < maxAttempts && !statusUpdated) {
              try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                const statusResponse = await api.get(`/kasir/payment/${transaksiId}/check-status`);
                
                if (statusResponse.data.data.status === 'paid') {
                  statusUpdated = true;
                  // Update transaction data with latest from server
                  setTransactionData(statusResponse.data.data);
                  setShowSuccess(true);
                }
                attempt++;
              } catch (error) {
                console.error('Status check error:', error);
                attempt++;
              }
            }
            
            if (!statusUpdated) {
              // Still show success but with pending status
              setShowSuccess(true);
            }
            
            setIsProcessingMidtrans(false);
          },
          
          onPending: function(result) {
            console.log('Payment pending:', result);
            alert('Payment is pending. Please complete your payment.');
            setIsProcessingMidtrans(false);
          },
          
          onError: function(result) {
            console.log('Payment error:', result);
            alert('Payment failed. Please try again.');
            setIsProcessingMidtrans(false);
          },
          
          onClose: function() {
            console.log('Customer closed the popup');
            setIsProcessingMidtrans(false);
          }
        });
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal membuat transaksi');
        setIsProcessingMidtrans(false);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (showSuccess) {
    return (
      <div className="bg-gray-800 rounded-lg p-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Pembayaran Berhasil!</h2>
          <p className="text-gray-400">Transaksi telah berhasil diproses</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-400 mb-1">Kode Booking</div>
            <div className="text-3xl font-bold text-red-500">{transactionData.kode_booking}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Customer</div>
              <div className="font-semibold">{transactionData.customer_nama}</div>
            </div>
            <div>
              <div className="text-gray-400">Telepon</div>
              <div className="font-semibold">{transactionData.customer_telepon}</div>
            </div>
            <div>
              <div className="text-gray-400">Film</div>
              <div className="font-semibold">{transactionData.jadwal?.film?.judul || filmDetail.judul}</div>
            </div>
            <div>
              <div className="text-gray-400">Tanggal</div>
              <div className="font-semibold">{selectedDate.hari}, {selectedDate.display}</div>
            </div>
            <div>
              <div className="text-gray-400">Jam</div>
              <div className="font-semibold">{transactionData.jadwal?.jam_mulai || selectedJadwal.jam_mulai}</div>
            </div>
            <div>
              <div className="text-gray-400">Studio</div>
              <div className="font-semibold">{transactionData.jadwal?.studio?.nama_studio || selectedJadwal.studio?.nama_studio}</div>
            </div>
            <div>
              <div className="text-gray-400">Kursi</div>
              <div className="font-semibold">{transactionData.detail_transaksis?.map(d => d.kursi?.kode_kursi).join(', ') || selectedSeats.join(', ')}</div>
            </div>
            <div>
              <div className="text-gray-400">Total</div>
              <div className="font-semibold text-red-500">{formatCurrency(transactionData.total_harga)}</div>
            </div>
            {transactionData.kembalian > 0 && (
              <div className="col-span-2">
                <div className="text-gray-400">Kembalian</div>
                <div className="font-semibold text-green-500">{formatCurrency(transactionData.kembalian)}</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            <Printer className="w-5 h-5" />
            Cetak Tiket
          </button>
          <button
            onClick={() => {
              setShowSuccess(false);
              setTransactionData(null);
              setPaymentMethod('');
              setPaymentAmount('');
              onComplete();
            }}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
          >
            Transaksi Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ringkasan Pesanan */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Customer</div>
              <div className="font-semibold">{customerInfo.nama}</div>
              <div className="text-sm text-gray-400">{customerInfo.email}</div>
              <div className="text-sm text-gray-400">{customerInfo.telepon}</div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="text-sm text-gray-400 mb-1">Film</div>
              <div className="font-semibold">{filmDetail.judul}</div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Jadwal</div>
              <div className="font-semibold">{selectedDate.hari}, {selectedDate.display}</div>
              <div className="text-sm">{selectedJadwal.jam_mulai} - Studio {selectedJadwal.studio?.nama_studio}</div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Kursi</div>
              <div className="font-semibold">{selectedSeats.join(', ')}</div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Harga Tiket</span>
                <span>{formatCurrency(selectedJadwal.harga?.harga)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Jumlah Tiket</span>
                <span>{selectedSeats.length} tiket</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-700">
                <span>Total</span>
                <span className="text-red-500">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metode Pembayaran */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Metode Pembayaran</h2>
          
          <div className="space-y-3 mb-6">
            {paymentMethods.map(method => {
              const Icon = method.icon;
              return (
                <button
                  key={`payment-${method.id}`}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg transition ${
                    paymentMethod === method.id ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-semibold">{method.name}</span>
                </button>
              );
            })}
          </div>

          {paymentMethod === 'cash' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Jumlah Uang Diterima</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-lg"
                  placeholder="0"
                />
              </div>
              {paymentAmount && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Total Bayar</span>
                    <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Uang Diterima</span>
                    <span className="font-semibold">{formatCurrency(parseInt(paymentAmount))}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-600">
                    <span>Kembalian</span>
                    <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {formatCurrency(change)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={!paymentMethod || (paymentMethod === 'cash' && change < 0) || loading || isProcessingMidtrans}
            className={`w-full py-4 rounded-lg font-bold text-lg mt-6 transition ${
              !paymentMethod || (paymentMethod === 'cash' && change < 0) || loading || isProcessingMidtrans
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading || isProcessingMidtrans ? (
              <span className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 animate-spin" />
                Memproses...
              </span>
            ) : (
              'Proses Pembayaran'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KonfirmasiPembayaran;
