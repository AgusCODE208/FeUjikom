import React, { useState, useEffect } from 'react';
import { Search, Eye, DollarSign, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import useTransaksiStore from '../../../stores/useTransaksiStore';

const TransaksiList = ({ onNavigate }) => {
  const { transaksis, statistics, loading, fetchTransaksis, fetchStatistics } = useTransaksiStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadData();
  }, [searchQuery, filterStatus]);

  const loadData = async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterStatus) params.status = filterStatus;
      await fetchTransaksis(params);
      await fetchStatistics();
    } catch (error) {
      console.error('Error loading transaksi data:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'refunded': return 'bg-purple-600';
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
      'refunded': 'Refunded',
      'expired': 'Expired',
      'cancelled': 'Cancelled',
      'used': 'Used'
    };
    return labels[status] || status;
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by booking code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
            <option value="used">Used</option>
          </select>
        </div>
      </div>

      {statistics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-2xl font-bold">{statistics.total}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Today</p>
            <p className="text-2xl font-bold text-blue-400">{statistics.today}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{statistics.pending}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Paid</p>
            <p className="text-2xl font-bold text-green-400">{statistics.paid}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Refunded</p>
            <p className="text-2xl font-bold text-purple-400">{statistics.refunded || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Cancelled</p>
            <p className="text-2xl font-bold text-red-400">{statistics.cancelled}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 col-span-2">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-xl font-bold text-green-400">{formatCurrency(statistics.total_revenue)}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : (transaksis || []).length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No transactions found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-gray-800 rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">Booking Code</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Film</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Seats</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(transaksis || []).map((transaksi) => (
                  <tr key={transaksi.id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="px-6 py-4 font-mono font-semibold">{transaksi.kode_booking}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{transaksi.user?.name || 'Guest'}</div>
                      <div className="text-xs text-gray-400">{transaksi.user?.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{transaksi.jadwal?.film?.judul}</div>
                      <div className="text-xs text-gray-400">{transaksi.jadwal?.studio?.nama_studio}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {transaksi.jadwal?.tanggal ? new Date(transaksi.jadwal.tanggal).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4">{transaksi.jumlah_kursi} seats</td>
                    <td className="px-6 py-4 font-semibold text-green-400">
                      {formatCurrency(transaksi.total_harga)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaksi.status)}`}>
                        {getStatusLabel(transaksi.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onNavigate('transaksi-detail', transaksi)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {(transaksis || []).map((transaksi) => (
              <div key={transaksi.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-mono font-semibold mb-1">{transaksi.kode_booking}</div>
                    <div className="text-sm text-gray-400">{transaksi.user?.name || 'Guest'}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaksi.status)}`}>
                    {getStatusLabel(transaksi.status)}
                  </span>
                </div>
                <div className="space-y-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-400">Film:</span>
                    <span className="ml-2 font-semibold">{transaksi.jadwal?.film?.judul}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Studio:</span>
                    <span className="ml-2">{transaksi.jadwal?.studio?.nama_studio}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Seats:</span>
                    <span className="ml-2">{transaksi.jumlah_kursi} seats</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Total:</span>
                    <span className="ml-2 font-semibold text-green-400">{formatCurrency(transaksi.total_harga)}</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('transaksi-detail', transaksi)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TransaksiList;
