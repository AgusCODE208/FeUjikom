import React, { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Ticket, Film, Calendar, Printer, TrendingUp } from 'lucide-react';
import useKasirStore from '../../stores/useKasirStore';

const Dashboard = ({ onNavigate }) => {
  const { dashboard, loading, fetchDashboard } = useKasirStore();
  const [filterPeriod, setFilterPeriod] = useState('today');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadDashboard();
  }, [filterPeriod, selectedMonth, selectedYear]);

  const loadDashboard = async () => {
    try {
      const params = { filter: filterPeriod };
      if (filterPeriod === 'custom') {
        params.month = selectedMonth;
        params.year = selectedYear;
      }
      await fetchDashboard(params);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const getAvailableYears = () => {
    if (!dashboard?.available_years || dashboard.available_years.length === 0) {
      return [new Date().getFullYear()];
    }
    return dashboard.available_years;
  };

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const stats = dashboard?.stats || {
    transaksi: 0,
    pendapatan: 0,
    tiket_terjual: 0,
    film_tayang: 0
  };

  const todayJadwals = dashboard?.today_jadwals || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getPeriodLabel = () => {
    if (filterPeriod === 'today') return 'Hari Ini';
    if (filterPeriod === 'month') return 'Bulan Ini';
    if (filterPeriod === 'custom') return `${months[selectedMonth]} ${selectedYear}`;
    return 'Semua Waktu';
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Dashboard Kasir</h1>
          <p className="text-sm sm:text-base text-gray-400">Ringkasan {getPeriodLabel().toLowerCase()}</p>
        </div>
        
        {/* Filter Period */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterPeriod('today')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'today' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setFilterPeriod('month')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'month' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Bulan Ini
          </button>
          <button
            onClick={() => setFilterPeriod('custom')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'custom' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Pilih
          </button>
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'all' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Semua
          </button>
        </div>
      </div>

      {/* Custom Month/Year Selector */}
      {filterPeriod === 'custom' && (
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Pilih Periode</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-400">Bulan</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                {months.map((month, index) => (
                  <option key={`month-${index}`} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-400">Tahun</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                {getAvailableYears().map((year) => (
                  <option key={`year-${year}`} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white opacity-80" />
            <div className="text-right">
              <p className="text-blue-100 text-xs sm:text-sm">Transaksi</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stats.transaksi}</p>
            </div>
          </div>
          <p className="text-blue-100 text-xs sm:text-sm truncate">{getPeriodLabel()}</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white opacity-80" />
            <div className="text-right min-w-0">
              <p className="text-green-100 text-xs sm:text-sm">Pendapatan</p>
              <p className="text-sm sm:text-lg md:text-2xl font-bold text-white truncate">{formatRupiah(stats.pendapatan)}</p>
            </div>
          </div>
          <p className="text-green-100 text-xs sm:text-sm truncate">{getPeriodLabel()}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <Ticket className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white opacity-80" />
            <div className="text-right">
              <p className="text-purple-100 text-xs sm:text-sm">Tiket</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stats.tiket_terjual}</p>
            </div>
          </div>
          <p className="text-purple-100 text-xs sm:text-sm truncate">{getPeriodLabel()}</p>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <Film className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white opacity-80" />
            <div className="text-right">
              <p className="text-red-100 text-xs sm:text-sm">Film</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{stats.film_tayang}</p>
            </div>
          </div>
          <p className="text-red-100 text-xs sm:text-sm truncate">Hari ini</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <button 
            onClick={() => onNavigate('transaksi')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500 mb-1 sm:mb-2" />
            <span className="text-white font-medium text-xs sm:text-sm md:text-base">Jual Tiket</span>
          </button>
          <button 
            onClick={() => onNavigate('jadwal')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-500 mb-1 sm:mb-2" />
            <span className="text-white font-medium text-xs sm:text-sm md:text-base">Jadwal</span>
          </button>
          <button className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
            <Printer className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500 mb-1 sm:mb-2" />
            <span className="text-white font-medium text-xs sm:text-sm md:text-base">Cetak</span>
          </button>
          <button 
            onClick={() => onNavigate('laporan')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-500 mb-1 sm:mb-2" />
            <span className="text-white font-medium text-xs sm:text-sm md:text-base">Laporan</span>
          </button>
        </div>
      </div>

      {/* Jadwal Hari Ini */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">Jadwal Hari Ini</h2>
        {todayJadwals.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-400">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
            <p className="text-sm sm:text-base">Tidak ada jadwal untuk hari ini</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {todayJadwals.slice(0, 6).map((jadwal) => {
              const film = jadwal.film;
              return (
                <div key={`jadwal-${jadwal.id}`} className="bg-gray-700 rounded-lg p-3 sm:p-4 hover:bg-gray-600 transition">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    {film?.poster && (
                      <img src={`http://127.0.0.1:8000/storage/${film.poster}`} alt={film.judul} className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm sm:text-base truncate">{film?.judul || 'Film'}</p>
                      <p className="text-xs text-gray-400 truncate">{film?.genre}</p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">
                    <p>🕐 {jadwal.jam_mulai} - {jadwal.jam_selesai}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">Studio: {jadwal.studio?.nama_studio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
