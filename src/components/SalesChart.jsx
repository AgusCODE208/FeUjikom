import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../stores/useAuthStore';

const SalesChart = () => {
  const { user } = useAuthStore();
  const userRole = user?.roles?.[0];
  const [period, setPeriod] = useState('daily');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchChartData();
  }, [period, selectedDate, selectedMonth, selectedYear]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const params = { period };
      if (period === 'daily' && selectedDate) params.date = selectedDate;
      if (period === 'monthly' && selectedMonth) params.month = selectedMonth;
      if (period === 'yearly') params.year = selectedYear;

      // Use different endpoint based on role
      const endpoint = userRole === 'owner' 
        ? '/owner/dashboard/sales-chart' 
        : '/admin/dashboard/sales-chart';
      
      const response = await api.get(endpoint, { params });
      setChartData(response.data.data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const totalRevenue = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Grafik Penjualan</h3>
            <p className="text-sm text-gray-400">Total: {formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === 'daily' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Harian
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === 'weekly' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Mingguan
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === 'monthly' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Bulanan
          </button>
          <button
            onClick={() => setPeriod('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === 'yearly' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Tahunan
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="mb-6 flex flex-wrap gap-3">
        {period === 'daily' && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-red-500"
              placeholder="Pilih tanggal"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
              >
                Reset
              </button>
            )}
          </div>
        )}

        {period === 'monthly' && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-red-500"
              placeholder="Pilih bulan"
            />
            {selectedMonth && (
              <button
                onClick={() => setSelectedMonth('')}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
              >
                Reset
              </button>
            )}
          </div>
        )}

        {period === 'yearly' && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-red-500"
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
        )}
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading chart...</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Tidak ada data untuk periode ini</p>
        </div>
      ) : (
        <div className="relative h-80 pb-8">
          {/* Bar Chart */}
          <div className="flex items-end justify-between h-full gap-1 sm:gap-2">
            {chartData.map((item, index) => {
              const barHeight = (item.value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 px-3 py-2 rounded-lg shadow-lg border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                    <div className="text-sm font-bold text-green-400">{formatCurrency(item.value)}</div>
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg transition-all duration-300 hover:from-red-500 hover:to-red-300 cursor-pointer"
                    style={{ height: `${barHeight}%` }}
                  >
                    {/* Value on top of bar for larger screens */}
                    {chartData.length <= 12 && (
                      <div className="hidden sm:block text-xs text-white font-semibold text-center pt-2">
                        {item.value > 0 ? formatCurrency(item.value).replace('Rp', '').trim() : ''}
                      </div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="text-xs text-gray-400 text-center mt-2 transform -rotate-45 origin-top-left">
                    {chartData.length > 20 && index % Math.ceil(chartData.length / 10) !== 0 ? '' : item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-t from-red-600 to-red-400 rounded"></div>
          <span className="text-gray-400">Revenue</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <BarChart3 className="w-4 h-4 text-red-500" />
          <span>{chartData.length} data points</span>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
