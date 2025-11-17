import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Star, RotateCcw, Film } from 'lucide-react';
import { getAdminFilms, deleteFilm, togglePublish } from '../../../services/endpoints/film';
import { getStorageUrl } from '../../../utils/helpers';

const FilmList = ({ onNavigate }) => {
  const [films, setFilms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = async () => {
    try {
      const response = await getAdminFilms();
      const data = response.data.data;
      setFilms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading films:', error);
      setFilms([]);
    }
  };

  const filteredFilms = Array.isArray(films) ? films.filter(film =>
    film.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    film.genre?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleDelete = async (film) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus film "${film.judul}"?`)) {
      try {
        await deleteFilm(film.id);
        alert('Film berhasil dihapus!');
        loadFilms();
      } catch (error) {
        console.error('Error deleting film:', error);
        alert('Gagal menghapus film');
      }
    }
  };

  const handlePublishStatusChange = async (filmId) => {
    try {
      await togglePublish(filmId);
      loadFilms();
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert('Gagal mengubah status publish');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari film..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('film-restore')}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hidden sm:inline">Restore</span>
          </button>
          <button
            onClick={() => onNavigate('film-tambah')}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {filteredFilms.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Tidak ada film ditemukan</p>
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
              <th className="px-6 py-4 text-left">Poster</th>
              <th className="px-6 py-4 text-left">Judul</th>
              <th className="px-6 py-4 text-left">Genre</th>
              <th className="px-6 py-4 text-left">Durasi</th>
              <th className="px-6 py-4 text-left">Rating</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Publish</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFilms.map((film) => (
              <tr key={`film-row-${film.id}`} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="px-6 py-4">
                  <img src={getStorageUrl(film.poster)} alt={film.judul} className="w-12 h-16 object-cover rounded" />
                </td>
                <td className="px-6 py-4 font-semibold">{film.judul}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{film.genre}</td>
                <td className="px-6 py-4 text-sm">{film.durasi} min</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{film.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    film.status === 'now_playing' ? 'bg-green-600' :
                    film.status === 'coming_soon' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {film.status === 'now_playing' ? 'Now Playing' :
                     film.status === 'coming_soon' ? 'Coming Soon' : 'Ended'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handlePublishStatusChange(film.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      film.is_published ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                    }`}
                  >
                    {film.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onNavigate('film-detail', film)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate('film-edit', film)}
                      className="p-2 hover:bg-blue-600 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(film)}
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
        {filteredFilms.map((film) => (
          <div key={`film-card-${film.id}`} className="bg-gray-800 rounded-lg p-4">
            <div className="flex gap-4">
              <img src={getStorageUrl(film.poster)} alt={film.judul} className="w-20 h-28 object-cover rounded flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1">{film.judul}</h3>
                <p className="text-sm text-gray-400 mb-2 line-clamp-1">{film.genre}</p>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs text-gray-400">{film.durasi} min</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs">{film.rating}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    film.status === 'now_playing' ? 'bg-green-600' :
                    film.status === 'coming_soon' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {film.status === 'now_playing' ? 'Playing' :
                     film.status === 'coming_soon' ? 'Soon' : 'Ended'}
                  </span>
                </div>
                <div className="mb-3">
                  <button
                    onClick={() => handlePublishStatusChange(film.id)}
                    className={`w-full px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      film.is_published ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                    }`}
                  >
                    {film.is_published ? 'Published' : 'Draft'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigate('film-detail', film)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Detail</span>
                  </button>
                  <button
                    onClick={() => onNavigate('film-edit', film)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(film)}
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

export default FilmList;
