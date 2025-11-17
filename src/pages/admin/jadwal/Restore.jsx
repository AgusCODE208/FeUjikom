import React, { useEffect } from 'react';
import { ArrowLeft, RotateCcw, Calendar, Clock, Trash2 } from 'lucide-react';
import useJadwalStore from '../../../stores/useJadwalStore';

const JadwalRestore = ({ onNavigate }) => {
  const { trashedJadwals, loading, fetchTrashedJadwals, restoreJadwal: restore, forceDeleteJadwal: forceDelete } = useJadwalStore();

  useEffect(() => {
    fetchTrashedJadwals();
  }, []);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const handleRestore = async (jadwal) => {
    if (window.confirm(`Restore jadwal "${jadwal.film?.judul}"?`)) {
      try {
        await restore(jadwal.id);
        alert('Jadwal berhasil direstore!');
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal restore jadwal');
      }
    }
  };

  const handleForceDelete = async (jadwal) => {
    if (window.confirm(`Hapus PERMANEN jadwal "${jadwal.film?.judul}"? Tindakan ini tidak dapat dibatalkan!`)) {
      try {
        await forceDelete(jadwal.id);
        alert('Jadwal berhasil dihapus permanen!');
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus jadwal permanen');
      }
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => onNavigate('jadwal-list')}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali</span>
      </button>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Restore Jadwal</h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : (trashedJadwals || []).length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Tidak ada jadwal yang dihapus</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">Film</th>
                    <th className="px-6 py-4 text-left">Studio</th>
                    <th className="px-6 py-4 text-left">Tanggal</th>
                    <th className="px-6 py-4 text-left">Jam</th>
                    <th className="px-6 py-4 text-left">Harga</th>
                    <th className="px-6 py-4 text-left">Dihapus</th>
                    <th className="px-6 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(trashedJadwals || []).map((jadwal) => (
                      <tr key={jadwal.id} className="border-t border-gray-700">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img src={jadwal.film?.poster_url} alt={jadwal.film?.judul} className="w-12 h-16 object-cover rounded" />
                            <div>
                              <div className="font-semibold">{jadwal.film?.judul}</div>
                              <div className="text-xs text-gray-400">{jadwal.film?.durasi} menit</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">{jadwal.studio?.nama_studio}</div>
                            <div className="text-xs text-gray-400 capitalize">{jadwal.studio?.tipe}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(jadwal.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{jadwal.jam_mulai} - {jadwal.jam_selesai}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-green-400">
                            {formatRupiah(jadwal.harga?.harga)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {jadwal.deleted_at ? new Date(jadwal.deleted_at).toLocaleDateString('id-ID') : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRestore(jadwal)}
                              className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition text-sm"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Restore</span>
                            </button>
                            <button
                              onClick={() => handleForceDelete(jadwal)}
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

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {(trashedJadwals || []).map((jadwal) => (
                  <div key={jadwal.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex gap-4 mb-3">
                      <img src={jadwal.film?.poster_url} alt={jadwal.film?.judul} className="w-20 h-28 object-cover rounded flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{jadwal.film?.judul}</h3>
                        <p className="text-sm text-gray-400 mb-2">{jadwal.studio?.nama_studio} ({jadwal.studio?.tipe})</p>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(jadwal.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                          <Clock className="w-4 h-4" />
                          <span>{jadwal.jam_mulai} - {jadwal.jam_selesai}</span>
                        </div>
                        <div className="font-semibold text-green-400 mb-2">{formatRupiah(jadwal.harga?.harga)}</div>
                        <p className="text-xs text-gray-500">Dihapus: {jadwal.deleted_at ? new Date(jadwal.deleted_at).toLocaleDateString('id-ID') : '-'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestore(jadwal)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => handleForceDelete(jadwal)}
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
    </div>
  );
};

export default JadwalRestore;
