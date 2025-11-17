import React, { useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trash2, Film } from 'lucide-react';
import useStudioStore from '../../../stores/useStudioStore';

const StudioRestore = ({ onNavigate }) => {
  const { trashedStudios, loading, fetchTrashedStudios, restoreStudio: restore, forceDeleteStudio: forceDelete } = useStudioStore();

  useEffect(() => {
    fetchTrashedStudios();
  }, []);

  const handleRestore = async (studio) => {
    if (window.confirm(`Apakah Anda yakin ingin restore studio "${studio.nama_studio}"?`)) {
      try {
        await restore(studio.id);
        alert('Studio berhasil di-restore!');
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal restore studio');
      }
    }
  };

  const handlePermanentDelete = async (studio) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus PERMANEN studio "${studio.nama_studio}"? Tindakan ini tidak dapat dibatalkan!`)) {
      try {
        await forceDelete(studio.id);
        alert('Studio berhasil dihapus permanen!');
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus studio permanen');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('studio-list')}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold">Restore Studio</h2>
      </div>

      {loading ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : (trashedStudios || []).length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Tidak ada studio yang dihapus</p>
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
                <th className="px-6 py-4 text-left">Dihapus Pada</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(trashedStudios || []).map((studio) => (
                <tr key={studio.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-6 py-4 font-semibold">{studio.nama_studio}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTipeColor(studio.tipe)}`}>
                      {studio.tipe}
                    </span>
                  </td>
                  <td className="px-6 py-4">{studio.kapasitas}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {studio.deleted_at ? new Date(studio.deleted_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRestore(studio)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition text-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(studio)}
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
          {(trashedStudios || []).map((studio) => (
            <div key={studio.id} className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">{studio.nama_studio}</h3>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTipeColor(studio.tipe)}`}>
                  {studio.tipe}
                </span>
                <span className="text-sm text-gray-400">Kapasitas: {studio.kapasitas}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Deleted: {studio.deleted_at ? new Date(studio.deleted_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }) : '-'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore(studio)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore</span>
                </button>
                <button
                  onClick={() => handlePermanentDelete(studio)}
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

export default StudioRestore;
