import React, { useState, useEffect } from 'react';
import { Calendar, Download } from 'lucide-react';
import useLaporanPenjualanStore from '../../../stores/useLaporanPenjualanStore';

const LaporanPenjualan = () => {
  const { laporanData, loading, fetchLaporan, exportLaporan } = useLaporanPenjualanStore();
  const [showCharts, setShowCharts] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadLaporan();
  }, [filterPeriod, selectedDate, selectedMonth, selectedYear]);

  const loadLaporan = () => {
    const params = { filter_period: filterPeriod };
    if (filterPeriod === 'date') {
      params.date = selectedDate;
    } else if (filterPeriod === 'month') {
      params.month = selectedMonth;
      params.year = selectedYear;
    } else if (filterPeriod === 'year') {
      params.year = selectedYear;
    }
    console.log('Loading laporan with params:', params);
    fetchLaporan(params);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = { filter_period: filterPeriod };
      if (filterPeriod === 'date') {
        params.date = selectedDate;
      } else if (filterPeriod === 'month') {
        params.month = selectedMonth;
        params.year = selectedYear;
      } else if (filterPeriod === 'year') {
        params.year = selectedYear;
      }
      await exportLaporan(params);
      alert('Laporan berhasil diexport!');
    } catch (error) {
      alert('Gagal export laporan: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const getPeriodLabel = () => {
    if (filterPeriod === 'today') return 'Hari Ini';
    if (filterPeriod === 'date') return selectedDate;
    if (filterPeriod === 'month') return `${months[selectedMonth - 1]} ${selectedYear}`;
    if (filterPeriod === 'year') return `Tahun ${selectedYear}`;
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

  if (loading || !laporanData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading laporan...</p>
        </div>
      </div>
    );
  }

  const { transactions, summary, film_sales, studio_sales, payment_sales, available_years } = laporanData;

  return (
    <div className="space-y-6">
      {/* Filter & Export */}
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
            onClick={() => setFilterPeriod('date')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'date' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Pilih Tanggal
          </button>
          <button
            onClick={() => setFilterPeriod('month')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'month' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Bulan
          </button>
          <button
            onClick={() => setFilterPeriod('year')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'year' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Tahun
          </button>
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition ${
              filterPeriod === 'all' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Semua
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold bg-green-600 hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>
      </div>

      {/* Date/Month/Year Selector */}
      {(filterPeriod === 'date' || filterPeriod === 'month' || filterPeriod === 'year') && (
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Calendar className="w-5 h-5 text-red-500" />
            <h3 className="text-base sm:text-lg font-bold">
              {filterPeriod === 'date' && 'Pilih Tanggal'}
              {filterPeriod === 'month' && 'Pilih Bulan & Tahun'}
              {filterPeriod === 'year' && 'Pilih Tahun'}
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {filterPeriod === 'date' && (
              <div className="flex-1 w-full sm:min-w-[200px]">
                <label className="block text-sm font-medium mb-2 text-gray-400">Tanggal</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            )}
            {filterPeriod === 'month' && (
              <>
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
              </>
            )}
            {filterPeriod === 'year' && (
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
            )}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Total Transaksi</div>
          <div className="text-2xl font-bold text-blue-500">{formatNumber(summary.total_transaksi)}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Total Tiket Terjual</div>
          <div className="text-2xl font-bold text-purple-500">{formatNumber(summary.total_tiket)}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400">Total Revenue</div>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(summary.total_revenue)}</div>
        </div>
      </div>

      {/* Data Transaksi Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4 sm:p-6 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold">Data Transaksi</h3>
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            {showCharts ? 'Sembunyikan Chart' : 'Tampilkan Chart'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm">ID</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm">Tanggal</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm">User</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm hidden md:table-cell">Email</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm">Film</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm hidden lg:table-cell">Studio</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm hidden lg:table-cell">Jam</th>
                <th className="px-3 sm:px-4 py-3 text-right text-xs sm:text-sm">Kursi</th>
                <th className="px-3 sm:px-4 py-3 text-right text-xs sm:text-sm">Total</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm hidden xl:table-cell">Metode</th>
                <th className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-3 sm:px-6 py-8 text-center text-gray-400 text-sm">
                    Belum ada data transaksi
                  </td>
                </tr>
              ) : (
                transactions.map((item) => (
                  <tr key={`trx-${item.id}`} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="px-3 sm:px-4 py-3 text-sm">{item.id}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm whitespace-nowrap">{item.tanggal}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm">{item.user}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm hidden md:table-cell">{item.email}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm font-semibold">{item.film}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm hidden lg:table-cell">{item.studio}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm hidden lg:table-cell">{item.jam_tayang}</td>
                    <td className="px-3 sm:px-4 py-3 text-right text-sm">{item.jumlah_kursi}</td>
                    <td className="px-3 sm:px-4 py-3 text-right text-sm font-bold text-green-500 whitespace-nowrap">
                      {formatCurrency(item.total_harga)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-sm hidden xl:table-cell capitalize">{item.metode_pembayaran}</td>
                    <td className="px-3 sm:px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'paid' ? 'bg-green-600' :
                        item.status === 'refunded' ? 'bg-red-600' : 'bg-gray-600'
                      }`}>
                        {item.status === 'paid' ? 'Lunas' : item.status === 'refunded' ? 'Refund' : item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts - Optional */}
      {showCharts && (
        <>
      {/* Penjualan by Film */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4 sm:p-6 border-b border-gray-700">
          <h3 className="text-lg sm:text-xl font-bold">Penjualan Per Film</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">Film</th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs sm:text-sm hidden sm:table-cell">Tiket</th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs sm:text-sm">Revenue</th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs sm:text-sm">%</th>
              </tr>
            </thead>
            <tbody>
              {film_sales.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-3 sm:px-6 py-8 text-center text-gray-400 text-sm">
                    Belum ada data penjualan
                  </td>
                </tr>
              ) : (
                film_sales.map((item, index) => (
                  <tr key={`film-sale-${index}`} className="border-t border-gray-700">
                    <td className="px-3 sm:px-6 py-4 font-semibold text-sm sm:text-base">{item.film}</td>
                    <td className="px-3 sm:px-6 py-4 text-right text-sm hidden sm:table-cell">{formatNumber(item.tiket)}</td>
                    <td className="px-3 sm:px-6 py-4 text-right text-green-500 font-bold text-xs sm:text-base break-words">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-right text-sm">{item.persentase}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Penjualan by Studio & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-4 sm:p-6 border-b border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold">Penjualan Per Studio</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {studio_sales.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Belum ada data</p>
            ) : (
              studio_sales.map((item, index) => (
                <div key={`studio-sale-${index}`} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-semibold">{item.studio}</div>
                    <div className="text-sm text-gray-400">Occupancy: {item.occupancy}%</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500 text-sm sm:text-base break-words">{formatCurrency(item.revenue)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-4 sm:p-6 border-b border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold">Metode Pembayaran</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {payment_sales.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Belum ada data</p>
            ) : (
              payment_sales.map((item, index) => (
                <div key={`payment-${index}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">{item.metode}</div>
                      <div className="text-sm text-gray-400">{formatNumber(item.jumlah)} transaksi</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm sm:text-base break-words">{formatCurrency(item.revenue)}</div>
                      <div className="text-xs text-gray-400">{item.persentase}%</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600"
                      style={{ width: `${item.persentase}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default LaporanPenjualan;
