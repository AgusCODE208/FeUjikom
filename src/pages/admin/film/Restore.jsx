import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trash2, Film } from 'lucide-react';
import { getTrashedFilms, restoreFilm, forceDeleteFilm } from '../../../services/endpoints/film';
import { getStorageUrl } from '../../../utils/helpers';

const FilmRestore = ({ onNavigate }) => {
  const [deletedFilms, setDeletedFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeletedFilms();
  }, []);

  const loadDeletedFilms = async () => {
    try {
      const response = await getTrashedFilms();
      setDeletedFilms(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error loading trashed films:', error);
      setDeletedFilms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (film) => {
    if (window.confirm(`Apakah Anda yakin ingin restore film "${film.judul}"?`)) {
      try {
        await restoreFilm(film.id);
        alert('Film berhasil di-restore!');
        loadDeletedFilms();
      } catch (error) {
        console.error('Error restoring film:', error);
        alert(error.response?.data?.message || 'Gagal restore film');
      }
    }
  };

  const handlePermanentDelete = async (film) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus PERMANEN film "${film.judul}"? Tindakan ini tidak dapat dibatalkan!`)) {
      try {
        await forceDeleteFilm(film.id);
        alert('Film berhasil dihapus permanen!');
        loadDeletedFilms();
      } catch (error) {
        console.error('Error force deleting film:', error);
        alert(error.response?.data?.message || 'Gagal menghapus film');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('film-list')}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold">Restore Film</h2>
      </div>

      {loading ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : deletedFilms.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Tidak ada film yang dihapus</p>
        </div>
      ) : (
        <>
        {/* Desktop Table */}
        <div className="hidden lg:block bg-gray-800 rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">Poster</th>
                <th className="px-6 py-4 text-left">Judul</th>
                <th className="px-6 py-4 text-left">Genre</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Dihapus Pada</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deletedFilms.map((film) => (
                <tr key={film.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <img src={getStorageUrl(film.poster)} alt={film.judul} className="w-12 h-16 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 font-semibold">{film.judul}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{film.genre}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      film.status === 'now_playing' ? 'bg-green-600' :
                      film.status === 'coming_soon' ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {film.status === 'now_playing' ? 'Now Playing' :
                       film.status === 'coming_soon' ? 'Coming Soon' : 'Ended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {film.deleted_at ? new Date(film.deleted_at).toLocaleDateString('id-ID', {
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
                        onClick={() => handleRestore(film)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition text-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(film)}
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
          {deletedFilms.map((film) => (
            <div key={film.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex gap-4">
                <img src={getStorageUrl(film.poster)} alt={film.judul} className="w-20 h-28 object-cover rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{film.judul}</h3>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-1">{film.genre}</p>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      film.status === 'now_playing' ? 'bg-green-600' :
                      film.status === 'coming_soon' ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {film.status === 'now_playing' ? 'Playing' :
                       film.status === 'coming_soon' ? 'Soon' : 'Ended'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Deleted: {film.deleted_at ? new Date(film.deleted_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : '-'}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(film)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(film)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

export default FilmRestore;
