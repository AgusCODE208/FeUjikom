import React, { useState, useEffect } from 'react';
import { Film, Ticket, DollarSign, Users, TrendingUp, Plus, Calendar } from 'lucide-react';
import { getDashboardData } from '../../services/endpoints/dashboard';
import SalesChart from '../../components/SalesChart';

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [topFilms, setTopFilms] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [nowPlayingFilms, setNowPlayingFilms] = useState([]);
  const [comingSoonFilms, setComingSoonFilms] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getDashboardData();
      const data = response.data.data;
      setStats(data.statistics);
      setTopFilms(data.top_films);
      setRecentTransactions(data.recent_transactions);
      setNowPlayingFilms(data.now_playing_films || []);
      setComingSoonFilms(data.coming_soon_films || []);
      setTodaySchedule(data.today_schedule || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="p-2 sm:p-2.5 md:p-3 bg-red-600 rounded-lg">
                <Film className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500" />
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{ stats.total_films}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Total Film</div>
            <div className="mt-2 sm:mt-3 text-xs text-gray-500 truncate">
              {stats.now_playing} Playing • {stats.coming_soon} Soon
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="p-2 sm:p-2.5 md:p-3 bg-blue-600 rounded-lg">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500" />
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{stats.total_transactions}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Transaksi</div>
            <div className="mt-2 sm:mt-3 text-xs text-green-500">
              +{stats.today_transactions} hari ini
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="p-2 sm:p-2.5 md:p-3 bg-green-600 rounded-lg">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500" />
            </div>
            <div className="text-sm sm:text-lg md:text-2xl font-bold mb-1 truncate">{formatCurrency(stats.total_revenue)}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Revenue</div>
            <div className="mt-2 sm:mt-3 text-xs text-gray-500 truncate">
              {formatCurrency(stats.today_revenue)}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div className="p-2 sm:p-2.5 md:p-3 bg-purple-600 rounded-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500" />
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{stats.total_users}</div>
            <div className="text-gray-400 text-xs sm:text-sm">Users</div>
            <div className="mt-2 sm:mt-3 text-xs text-green-500">
              +{stats.new_users_this_month} bulan ini
            </div>
          </div>
        </div>
      )}

      {/* Now Playing Films */}
      {nowPlayingFilms.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Now Playing</h3>
            <button 
              onClick={() => onNavigate('film-list')}
              className="text-sm text-red-500 hover:text-red-400"
            >
              Lihat Semua
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {nowPlayingFilms.map((film) => (
              <div key={film.id} className="group cursor-pointer" onClick={() => onNavigate('film-detail', film)}>
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                  <img 
                    src={film.poster_url} 
                    alt={film.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-semibold">View Details</span>
                  </div>
                </div>
                <h4 className="font-semibold text-sm line-clamp-1">{film.judul}</h4>
                <p className="text-xs text-gray-400">{film.genre}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Films */}
      {comingSoonFilms.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Coming Soon</h3>
            <button 
              onClick={() => onNavigate('film-list')}
              className="text-sm text-red-500 hover:text-red-400"
            >
              Lihat Semua
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {comingSoonFilms.map((film) => (
              <div key={film.id} className="group cursor-pointer" onClick={() => onNavigate('film-detail', film)}>
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                  <img 
                    src={film.poster_url} 
                    alt={film.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded text-xs font-semibold">
                    Soon
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-semibold">View Details</span>
                  </div>
                </div>
                <h4 className="font-semibold text-sm line-clamp-1">{film.judul}</h4>
                <p className="text-xs text-gray-400">{film.genre}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      {todaySchedule.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Jadwal Hari Ini</h3>
            <button 
              onClick={() => onNavigate('jadwal-list')}
              className="text-sm text-red-500 hover:text-red-400"
            >
              Lihat Semua
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {todaySchedule.map((jadwal) => (
              <div key={jadwal.id} className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition cursor-pointer" onClick={() => onNavigate('jadwal-detail', jadwal)}>
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={jadwal.film.poster_url} 
                    alt={jadwal.film.judul}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-1">{jadwal.film.judul}</h4>
                    <p className="text-xs text-gray-400">{jadwal.studio.nama_studio}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-500 font-semibold">{jadwal.jam_mulai}</span>
                  <span className="text-gray-400">{jadwal.jam_selesai}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Chart */}
      <SalesChart />

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Transaksi Terbaru</h3>
            <button 
              onClick={() => onNavigate('transaksi-list')}
              className="text-sm text-red-500 hover:text-red-400"
            >
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((transaksi) => (
              <div key={transaksi.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="font-mono font-semibold text-sm">{transaksi.kode_booking}</div>
                  <div className="text-xs text-gray-400">
                    {transaksi.user?.name} • {transaksi.jadwal?.film?.judul}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-400">
                    {formatCurrency(transaksi.total_harga)}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    transaksi.status === 'paid' ? 'bg-green-600' :
                    transaksi.status === 'pending' ? 'bg-yellow-600' :
                    transaksi.status === 'cancelled' ? 'bg-red-600' : 'bg-gray-600'
                  }`}>
                    {transaksi.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions & Top Films */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('film-tambah')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Film Baru</span>
            </button>
            <button
              onClick={() => onNavigate('jadwal-tambah')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              <Calendar className="w-5 h-5" />
              <span>Buat Jadwal Baru</span>
            </button>
            <button 
              onClick={() => onNavigate('transaksi-list')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              <Ticket className="w-5 h-5" />
              <span>Lihat Transaksi ({stats?.pending_transactions || 0} Pending)</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Top Films by Revenue</h3>
          <div className="space-y-3">
            {topFilms.slice(0, 5).map((item, index) => (
              <div key={item.film_id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-full font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.film?.judul || 'Unknown'}</div>
                  <div className="text-sm text-gray-400">{item.total_transactions} transaksi</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-400">{formatCurrency(item.revenue)}</div>
                </div>
              </div>
            ))}
            {topFilms.length === 0 && (
              <p className="text-gray-400 text-center py-4">Belum ada data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
