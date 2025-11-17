import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Ticket, Users, Film, ArrowUpRight, Calendar
} from 'lucide-react';
import useOwnerStore from '../../stores/useOwnerStore';
import SalesChart from '../../components/SalesChart';

const Dashboard = () => {
  const { dashboardData, loading, fetchDashboard } = useOwnerStore();
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadDashboard();
  }, [filterPeriod, selectedMonth, selectedYear]);

  const loadDashboard = () => {
    const params = { filter_period: filterPeriod };
    if (filterPeriod === 'custom') {
      params.month = selectedMonth;
      params.year = selectedYear;
    }
    console.log('Loading dashboard with params:', params);
    fetchDashboard(params);
  };

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { stats, revenue_trend, top_films, studio_stats, available_years } = dashboardData;

  const getPeriodLabel = () => {
    if (filterPeriod === 'today') return 'Hari Ini';
    if (filterPeriod === 'month') return 'Bulan Ini';
    if (filterPeriod === 'custom') return `${months[selectedMonth - 1]} ${selectedYear}`;
    return 'Semua Waktu';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Filter Period */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg md:text-xl font-bold truncate">Periode: {getPeriodLabel()}</h2>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setFilterPeriod('today')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'today' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setFilterPeriod('month')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'month' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Bulan Ini
          </button>
          <button
            onClick={() => setFilterPeriod('custom')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'custom' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Pilih Periode
          </button>
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'all' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Semua
          </button>
        </div>
      </div>

      {/* Custom Month/Year Selector */}
      {filterPeriod === 'custom' && (
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Calendar className="w-5 h-5 text-red-500" />
            <h3 className="text-base sm:text-lg font-bold">Pilih Bulan & Tahun</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 w-full sm:min-w-[200px]">
              <label className="block text-sm font-medium mb-2 text-gray-400">Bulan</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                {months.map((month, index) => (
                  <option key={`month-${index}`} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full sm:min-w-[200px]">
              <label className="block text-sm font-medium mb-2 text-gray-400">Tahun</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                {available_years.map((year) => (
                  <option key={`year-${year}`} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {/* Revenue Card */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
            <div className="p-2 sm:p-2.5 md:p-3 bg-green-600 rounded-lg">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex items-center text-green-500 text-xs sm:text-sm">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Live</span>
            </div>
          </div>
          <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 break-words truncate">{formatCurrency(stats.total_revenue)}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Revenue</div>
          <div className="mt-2 sm:mt-3 text-xs text-gray-500 truncate">
            {formatCurrency(stats.today_revenue)}
          </div>
        </div>

        {/* Transactions Card */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
            <div className="p-2 sm:p-2.5 md:p-3 bg-blue-600 rounded-lg">
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex items-center text-green-500 text-xs sm:text-sm">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>+{stats.today_transactions}</span>
            </div>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold mb-1">{formatNumber(stats.total_transactions)}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Transaksi</div>
          <div className="mt-2 sm:mt-3 text-xs text-green-500">
            +{stats.today_transactions} hari ini
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
            <div className="p-2 sm:p-2.5 md:p-3 bg-purple-600 rounded-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex items-center text-green-500 text-xs sm:text-sm">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>+{stats.new_users_this_month}</span>
            </div>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold mb-1">{formatNumber(stats.total_users)}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Users</div>
          <div className="mt-2 sm:mt-3 text-xs text-gray-500">
            +{stats.new_users_this_month} bulan ini
          </div>
        </div>

        {/* Films Card */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
            <div className="p-2 sm:p-2.5 md:p-3 bg-red-600 rounded-lg">
              <Film className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex items-center text-gray-400 text-xs sm:text-sm">
              <span>Stable</span>
            </div>
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold mb-1">{stats.total_films}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Film</div>
          <div className="mt-2 sm:mt-3 text-xs text-gray-500">
            {stats.active_films} tayang
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <SalesChart />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Revenue Trend (7 Hari)</h3>
          <div className="space-y-2">
            {revenue_trend.map((item, index) => {
              const maxRevenue = Math.max(...revenue_trend.map(r => r.revenue), 1);
              const percentage = (item.revenue / maxRevenue) * 100;
              return (
                <div key={`trend-${index}`} className="flex items-center space-x-3">
                  <div className="w-12 sm:w-16 text-xs sm:text-sm text-gray-400">{item.date}</div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-700 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-end px-3"
                        style={{ width: `${percentage}%` }}
                      >
                        {item.revenue > 0 && percentage > 30 && (
                          <span className="text-xs font-semibold hidden sm:inline">{formatCurrency(item.revenue)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Studio Performance */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Studio Performance</h3>
          <div className="space-y-4">
            {studio_stats.map(studio => (
              <div key={`studio-${studio.id}`} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{studio.nama_studio}</div>
                    <div className="text-xs sm:text-sm text-gray-400 capitalize">{studio.tipe} • {studio.kapasitas} kursi</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-bold text-green-500">{studio.occupancy}%</div>
                    <div className="text-xs text-gray-400">Occupancy</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-400">Revenue</span>
                  <span className="font-semibold break-words">{formatCurrency(studio.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Films Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4 sm:p-6 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold">Top 5 Film Terlaris</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Rank</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Film</th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold">Revenue</th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold hidden sm:table-cell">Tiket</th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {top_films.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 sm:px-6 py-8 text-center text-gray-400 text-sm">
                    Belum ada data transaksi film
                  </td>
                </tr>
              ) : (
                top_films.map((film, index) => (
                  <tr key={`film-${film.id}`} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center font-bold text-xs sm:text-base">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 font-semibold text-sm sm:text-base">{film.judul || 'N/A'}</td>
                    <td className="px-3 sm:px-6 py-4 text-right text-green-500 font-semibold text-xs sm:text-base break-words">
                      {formatCurrency(film.revenue)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-right text-sm hidden sm:table-cell">{formatNumber(film.tickets)}</td>
                    <td className="px-3 sm:px-6 py-4 text-right">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        film.status === 'Now_playing' ? 'bg-green-600' :
                        film.status === 'Comming_soon' ? 'bg-yellow-600' : 'bg-gray-600'
                      }`}>
                        {film.status === 'Now_playing' ? 'Tayang' : 
                         film.status === 'Comming_soon' ? 'Segera' : 'Selesai'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
