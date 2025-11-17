import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Film, Users, RotateCcw } from 'lucide-react';
import useStudioStore from '../../../stores/useStudioStore';

const StudioList = ({ onNavigate }) => {
  const { studios, statistics, loading, fetchStudios, fetchStatistics, removeStudio } = useStudioStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudios({ search: searchQuery });
    fetchStatistics();
  }, [searchQuery]);

  const filteredStudios = (studios || []).filter(studio =>
    studio.nama_studio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    studio.tipe.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (studio) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus studio "${studio.nama_studio}"?`)) {
      try {
        await removeStudio(studio.id);
        alert('Studio berhasil dihapus!');
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus studio');
      }
    }
  };

  const getTipeColor = (tipe) => {
    switch(tipe) {
      case 'reguler': return 'bg-blue-600';
      case 'vip': return 'bg-purple-600';
      case 'imax': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-600';
      case 'maintenance': return 'bg-yellow-600';
      case 'inactive': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari studio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('studio-restore')}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hidden sm:inline">Restore</span>
          </button>
          <button
            onClick={() => onNavigate('studio-tambah')}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {statistics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Studio</p>
            <p className="text-2xl font-bold">{statistics.total}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Aktif</p>
            <p className="text-2xl font-bold text-green-400">{statistics.active}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Maintenance</p>
            <p className="text-2xl font-bold text-yellow-400">{statistics.maintenance}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Total Kursi</p>
            <p className="text-2xl font-bold">{statistics.total_kursi}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : filteredStudios.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Tidak ada studio ditemukan</p>
          {searchQuery && (
            <p className="text-gray-500 text-sm mt-2">Coba kata kunci lain</p>
          )}
        </div>
      ) : (
        <>
      {/* Desktop Table */}
      <div className="hidden lg:block bg-gray-800 rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">Nama Studio</th>
              <th className="px-6 py-4 text-left">Tipe</th>
              <th className="px-6 py-4 text-left">Kapasitas</th>
              <th className="px-6 py-4 text-left">Layout</th>
              <th className="px-6 py-4 text-left">Kursi</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudios.map((studio) => (
                <tr key={studio.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-6 py-4 font-semibold">{studio.nama_studio}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTipeColor(studio.tipe)}`}>
                      {studio.tipe}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{studio.kapasitas}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {studio.layout_rows} x {studio.layout_cols}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${studio.kursis_count > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {studio.kursis_count} kursi
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(studio.status)}`}>
                      {studio.status === 'active' ? 'Aktif' : 
                       studio.status === 'maintenance' ? 'Maintenance' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onNavigate('studio-detail', studio)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onNavigate('studio-edit', studio)}
                        className="p-2 hover:bg-blue-600 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(studio)}
                        className="p-2 hover:bg-red-600 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden space-y-4">
        {filteredStudios.map((studio) => (
            <div key={studio.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{studio.nama_studio}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTipeColor(studio.tipe)}`}>
                      {studio.tipe}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(studio.status)}`}>
                      {studio.status === 'active' ? 'Aktif' : 
                       studio.status === 'maintenance' ? 'Maintenance' : 'Nonaktif'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-gray-400">Kapasitas:</span>
                  <span className="ml-2 font-semibold">{studio.kapasitas}</span>
                </div>
                <div>
                  <span className="text-gray-400">Layout:</span>
                  <span className="ml-2 font-semibold">{studio.layout_rows}x{studio.layout_cols}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">Kursi:</span>
                  <span className={`ml-2 font-semibold ${studio.kursis_count > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {studio.kursis_count} kursi
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigate('studio-detail', studio)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Detail</span>
                </button>
                <button
                  onClick={() => onNavigate('studio-edit', studio)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(studio)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
};

export default StudioList;
