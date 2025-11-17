import React, { useState, useEffect } from 'react';
import { Search, Calendar, DollarSign, Ticket, Eye, Filter, RefreshCw } from 'lucide-react';
import useKasirStore from '../../stores/useKasirStore';

const RiwayatTransaksi = ({ onNavigate }) => {
  const { riwayatTransaksi, loading, fetchRiwayatTransaksi, refundTransaksi } = useKasirStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    loadTransaksi();
  }, [filterType, filterDate, filterMonth, filterYear, statusFilter]);

  const loadTransaksi = async () => {
    try {
      const params = {
        search: searchTerm,
        filter_type: filterType,
        status: statusFilter,
      };

      if (filterType === 'day' && filterDate) {
        params.day = filterDate;
      } else if (filterType === 'month') {
        params.month = filterMonth;
        params.year = filterYear;
      } else if (filterType === 'year') {
        params.year = filterYear;
      }

      await fetchRiwayatTransaksi(params);
    } catch (error) {
      console.error('Error loading transaksi:', error);
    }
  };

  const handleSearch = () => {
    loadTransaksi();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: 'Tunai',
      bank_transfer: 'Transfer Bank',
      gopay: 'GoPay',
      qris: 'QRIS',
      credit_card: 'Kartu Kredit',
      shopeepay: 'ShopeePay',
    };
    return labels[method] || method;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pending', class: 'bg-yellow-600' },
      paid: { text: 'Paid', class: 'bg-green-600' },
      cancelled: { text: 'Cancelled', class: 'bg-red-600' },
      expired: { text: 'Expired', class: 'bg-gray-600' },
      refunded: { text: 'Refunded', class: 'bg-purple-600' },
    };
    return badges[status] || { text: status, class: 'bg-gray-600' };
  };

  const handleRefund = async () => {
    if (!refundReason.trim()) {
      alert('Alasan refund harus diisi');
      return;
    }

    try {
      const result = await refundTransaksi(selectedTransaksi.id, { alasan: refundReason });
      alert(result.message);
      setShowRefundModal(false);
      setRefundReason('');
      setSelectedTransaksi(null);
      loadTransaksi();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal memproses refund');
    }
  };

  const transaksiList = riwayatTransaksi?.data || [];
  const totalTransaksi = transaksiList.filter(t => ['paid', 'refunded'].includes(t.status)).length;
  const totalPendapatan = transaksiList.reduce((sum, t) => {
    if (t.status === 'paid') return sum + parseFloat(t.total_harga || 0);
    if (t.status === 'refunded') return sum + parseFloat(t.total_harga || 0) - parseFloat(t.refund_amount || 0);
    return sum;
  }, 0);
  const totalTiket = transaksiList.filter(t => ['paid', 'refunded'].includes(t.status)).reduce((sum, t) => sum + parseInt(t.jumlah_kursi || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading transaksi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Transaksi</p>
              <p className="text-3xl font-bold text-white">{totalTransaksi}</p>
            </div>
            <Ticket className="w-12 h-12 text-white opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Pendapatan</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalPendapatan)}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-white opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Tiket Terjual</p>
              <p className="text-3xl font-bold text-white">
                {totalTiket}
              </p>
            </div>
            <Ticket className="w-12 h-12 text-white opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-2">Filter Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="all">Semua</option>
              <option value="day">Hari</option>
              <option value="month">Bulan</option>
              <option value="year">Tahun</option>
            </select>
          </div>

          {filterType === 'day' && (
            <div>
              <label className="block text-sm mb-2">Tanggal</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          )}

          {filterType === 'month' && (
            <>
              <div>
                <label className="block text-sm mb-2">Bulan</label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>{new Date(2000, i).toLocaleString('id-ID', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Tahun</label>
                <input
                  type="number"
                  value={filterYear}
                  onChange={(e) => setFilterYear(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </>
          )}

          {filterType === 'year' && (
            <div>
              <label className="block text-sm mb-2">Tahun</label>
              <input
                type="number"
                value={filterYear}
                onChange={(e) => setFilterYear(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kode booking, nama, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Cari
          </button>
          <button
            onClick={loadTransaksi}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Kode Booking</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Film</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Kursi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Pembayaran</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {transaksiList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                    <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Tidak ada transaksi ditemukan</p>
                  </td>
                </tr>
              ) : (
                transaksiList.map((t) => {
                  const statusBadge = getStatusBadge(t.status);
                  const seats = t.detail_transaksis?.map(d => d.kursi?.kode_kursi).filter(Boolean) || [];
                  return (
                    <tr key={t.id} className="hover:bg-gray-750 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-red-500">{t.kode_booking}</div>
                        <div className="text-xs text-gray-400">{formatDateTime(t.created_at)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{t.user?.name || 'Guest'}</div>
                        <div className="text-xs text-gray-400">{t.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{t.jadwal?.film?.judul || 'N/A'}</div>
                        <div className="text-xs text-gray-400">{t.jadwal?.studio?.nama_studio}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{t.jadwal?.tanggal ? new Date(t.jadwal.tanggal).toLocaleDateString('id-ID') : 'N/A'}</div>
                        <div className="text-xs text-gray-400">{t.jadwal?.jam_mulai}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{seats.join(', ') || 'N/A'}</div>
                        <div className="text-xs text-gray-400">{t.jumlah_kursi} tiket</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-green-500">{formatCurrency(t.total_harga)}</div>
                        {t.refund_amount && (
                          <div className="text-xs text-purple-400">Refund: {formatCurrency(t.refund_amount)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 ${statusBadge.class} rounded-full text-xs font-semibold`}>
                          {statusBadge.text}
                        </span>
                        {t.metode_pembayaran && (
                          <div className="text-xs text-gray-400 mt-1">{getPaymentMethodLabel(t.metode_pembayaran)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedTransaksi(t)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                            title="Lihat Detail"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {t.status === 'paid' && (
                            <button
                              onClick={() => {
                                setSelectedTransaksi(t);
                                setShowRefundModal(true);
                              }}
                              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                              title="Refund"
                            >
                              <RefreshCw className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTransaksi && !showRefundModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTransaksi(null)}>
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Detail Transaksi</h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Kode Booking</div>
                  <div className="font-bold text-red-500 text-xl">{selectedTransaksi.kode_booking}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Status</div>
                  <span className={`px-4 py-2 ${getStatusBadge(selectedTransaksi.status).class} rounded-lg font-semibold inline-block`}>
                    {getStatusBadge(selectedTransaksi.status).text}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="text-sm text-gray-400 mb-2">Customer</div>
                <div className="font-semibold">{selectedTransaksi.user?.name || 'Guest'}</div>
                <div className="text-sm text-gray-400">{selectedTransaksi.user?.email}</div>
                <div className="text-sm text-gray-400">{selectedTransaksi.user?.phone}</div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="text-sm text-gray-400 mb-2">Detail Film</div>
                <div className="font-semibold">{selectedTransaksi.jadwal?.film?.judul}</div>
                <div className="text-sm text-gray-400">
                  {selectedTransaksi.jadwal?.tanggal ? new Date(selectedTransaksi.jadwal.tanggal).toLocaleDateString('id-ID') : 'N/A'} - {selectedTransaksi.jadwal?.jam_mulai}
                </div>
                <div className="text-sm text-gray-400">Studio: {selectedTransaksi.jadwal?.studio?.nama_studio}</div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="text-sm text-gray-400 mb-2">Kursi</div>
                <div className="font-semibold">
                  {selectedTransaksi.detail_transaksis?.map(d => d.kursi?.kode_kursi).filter(Boolean).join(', ') || 'N/A'}
                </div>
                <div className="text-sm text-gray-400">{selectedTransaksi.jumlah_kursi} tiket</div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-green-500">{formatCurrency(selectedTransaksi.total_harga)}</span>
                </div>
                {selectedTransaksi.refund_amount && (
                  <div className="flex justify-between items-center text-lg mt-2 text-purple-400">
                    <span>Refund (50%)</span>
                    <span>{formatCurrency(selectedTransaksi.refund_amount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="text-sm text-gray-400 mb-2">Metode Pembayaran</div>
                <span className="px-4 py-2 bg-blue-600 rounded-lg font-semibold">
                  {getPaymentMethodLabel(selectedTransaksi.metode_pembayaran)}
                </span>
              </div>

              {selectedTransaksi.refund_reason && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="text-sm text-gray-400 mb-2">Alasan Refund</div>
                  <div className="text-sm">{selectedTransaksi.refund_reason}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Refunded at: {formatDateTime(selectedTransaksi.refunded_at)}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTransaksi(null)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedTransaksi && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowRefundModal(false)}>
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Refund Transaksi</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">Kode Booking</div>
                <div className="font-bold text-red-500">{selectedTransaksi.kode_booking}</div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Total Harga</div>
                <div className="font-bold">{formatCurrency(selectedTransaksi.total_harga)}</div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Jumlah Refund (50%)</div>
                <div className="font-bold text-purple-500">{formatCurrency(selectedTransaksi.total_harga * 0.5)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alasan Refund *</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Contoh: Customer tidak jadi menonton"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundReason('');
                }}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
              >
                Batal
              </button>
              <button
                onClick={handleRefund}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
              >
                Proses Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatTransaksi;
