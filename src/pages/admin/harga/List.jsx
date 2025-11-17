import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, DollarSign, Tag, RotateCcw } from 'lucide-react';
import hargaService from '../../../services/endpoints/harga';

const HargaList = ({ onNavigate }) => {
  const [hargas, setHargas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, trashed: 0, average_price: 0, min_price: 0, max_price: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    loadStats();
  }, []);

  const loadData = async () => {
    try {
      const response = await hargaService.getAdminAll();
      setHargas(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error loading hargas:', error);
      setHargas([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await hargaService.getStatistics();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const getTipeLabel = (tipe) => {
    const labels = {
      'weekday_reguler': 'Weekday Reguler',
      'weekend_reguler': 'Weekend Reguler',
      'weekday_vip': 'Weekday VIP',
      'weekend_vip': 'Weekend VIP',
      'weekday_imax': 'Weekday IMAX',
      'weekend_imax': 'Weekend IMAX',
      'holiday_reguler': 'Holiday Reguler',
      'holiday_vip': 'Holiday VIP',
      'holiday_imax': 'Holiday IMAX'
    };
    return labels[tipe] || tipe;
  };

  const filteredHargas = Array.isArray(hargas) ? hargas.filter(harga => {
    const matchSearch = harga.tipe?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       harga.keterangan?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  }) : [];

  const handleDelete = async (harga) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus harga tiket "${harga.keterangan || harga.tipe}"?`)) {
      try {
        await hargaService.delete(harga.id);
        alert('Harga tiket berhasil dihapus!');
        loadData();
        loadStats();
      } catch (error) {
        console.error('Error deleting harga:', error);
        alert(error.response?.data?.message || 'Gagal menghapus harga');
      }
    }
  };

  const getTipeColor = (tipe) => {
    if (tipe.includes('reguler')) return 'bg-blue-600';
    if (tipe.includes('vip')) return 'bg-purple-600';
    if (tipe.includes('imax')) return 'bg-red-600';
    return 'bg-gray-600';
  };



  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Harga</span>
            <Tag className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Min Harga</span>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-lg font-bold text-blue-400">{formatRupiah(stats.min_price || 0)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Max Harga</span>
            <DollarSign className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-lg font-bold text-red-400">{formatRupiah(stats.max_price || 0)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Rata-rata</span>
            <DollarSign className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-lg font-bold text-yellow-400">{formatRupiah(stats.average_price || 0)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari tipe atau keterangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
            />
          </div>

        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('harga-restore')}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hidden sm:inline">Restore</span>
          </button>
          <button
            onClick={() => onNavigate('harga-tambah')}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      <div className="hidden lg:block bg-gray-800 rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">Tipe</th>
              <th className="px-6 py-4 text-left">Keterangan</th>
              <th className="px-6 py-4 text-left">Harga</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHargas.map((harga) => (
              <tr key={harga.id} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTipeColor(harga.tipe)}`}>
                    {getTipeLabel(harga.tipe)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{harga.keterangan}</td>
                <td className="px-6 py-4 font-bold text-green-400 text-lg">{formatRupiah(harga.harga)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onNavigate('harga-detail', harga)} className="p-2 hover:bg-gray-700 rounded-lg transition">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onNavigate('harga-edit', harga)} className="p-2 hover:bg-blue-600 rounded-lg transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(harga)} className="p-2 hover:bg-red-600 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {filteredHargas.map((harga) => (
          <div key={harga.id} className="bg-gray-800 rounded-lg p-4">
            <div className="mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTipeColor(harga.tipe)}`}>
                {getTipeLabel(harga.tipe)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{harga.keterangan}</p>
            <p className="text-2xl font-bold text-green-400 mb-3">{formatRupiah(harga.harga)}</p>
            <div className="flex gap-2">
              <button onClick={() => onNavigate('harga-detail', harga)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm">
                <Eye className="w-4 h-4" />
                <span>Detail</span>
              </button>
              <button onClick={() => onNavigate('harga-edit', harga)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button onClick={() => handleDelete(harga)} className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HargaList;
