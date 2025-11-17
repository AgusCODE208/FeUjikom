import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, Calendar, MapPin, Armchair, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getAdminTransaksiById } from '../../../services/endpoints/transaksi';
import { getStorageUrl } from '../../../utils/helpers';

const TransaksiDetail = ({ onNavigate, selectedData }) => {
  const [transaksi, setTransaksi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedData?.id) {
      loadTransaksi();
    }
  }, [selectedData]);

  const loadTransaksi = async () => {
    try {
      const response = await getAdminTransaksiById(selectedData.id);
      setTransaksi(response.data.data);
    } catch (error) {
      console.error('Error loading transaksi:', error);
      alert('Gagal memuat detail transaksi');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'expired': return 'bg-gray-600';
      case 'cancelled': return 'bg-red-600';
      case 'used': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'paid': 'Paid',
      'pending': 'Pending',
      'expired': 'Expired',
      'cancelled': 'Cancelled',
      'used': 'Used'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!transaksi) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Transaksi tidak ditemukan</p>
        <button
          onClick={() => onNavigate('transaksi-list')}
          className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('transaksi-list')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(transaksi.status)}`}>
          {getStatusLabel(transaksi.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Informasi Booking</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Kode Booking</label>
                <div className="font-mono font-bold text-2xl text-red-500">{transaksi.kode_booking}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Tanggal Booking</label>
                  <div className="font-semibold">{formatDateTime(transaksi.created_at)}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Expired At</label>
                  <div className="font-semibold">{formatDateTime(transaksi.expired_at)}</div>
                </div>
              </div>
              {transaksi.paid_at && (
                <div>
                  <label className="text-sm text-gray-400">Paid At</label>
                  <div className="font-semibold">{formatDateTime(transaksi.paid_at)}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-red-500" />
              Customer Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Nama</label>
                <div className="font-semibold">{transaksi.user?.name || 'Guest'}</div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <div className="font-semibold">{transaksi.user?.email || '-'}</div>
              </div>
              {transaksi.kasir && (
                <div>
                  <label className="text-sm text-gray-400">Dilayani oleh</label>
                  <div className="font-semibold">{transaksi.kasir.name}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Detail Film & Jadwal</h2>
            <div className="flex gap-4 mb-4">
              {transaksi.jadwal?.film?.poster && (
                <img 
                  src={getStorageUrl(transaksi.jadwal.film.poster)} 
                  alt={transaksi.jadwal.film.judul}
                  className="w-24 h-32 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{transaksi.jadwal?.film?.judul}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{transaksi.jadwal?.tanggal ? new Date(transaksi.jadwal.tanggal).toLocaleDateString('id-ID') : '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{transaksi.jadwal?.jam_mulai} - {transaksi.jadwal?.jam_selesai}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{transaksi.jadwal?.studio?.nama_studio} (<span className="capitalize">{transaksi.jadwal?.studio?.tipe}</span>)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Armchair className="w-5 h-5 text-red-500" />
              Kursi yang Dipesan
            </h2>
            <div className="flex flex-wrap gap-2">
              {transaksi.detailTransaksis?.map((detail, index) => (
                <div key={index} className="px-4 py-2 bg-gray-700 rounded-lg font-mono font-semibold">
                  {detail.kursi?.kode_kursi}
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Total: {transaksi.jumlah_kursi} kursi
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" />
              Payment Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Metode Pembayaran</label>
                <div className="font-semibold uppercase">{transaksi.metode_pembayaran || '-'}</div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Harga per Kursi</span>
                  <span className="font-semibold">
                    {formatCurrency(transaksi.detailTransaksis?.[0]?.harga || 0)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Jumlah Kursi</span>
                  <span className="font-semibold">{transaksi.jumlah_kursi}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-700">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-red-500">
                    {formatCurrency(transaksi.total_harga)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransaksiDetail;
