import React from 'react';
import { ArrowLeft, Edit, Star, Clock, Film } from 'lucide-react';
import { getStorageUrl } from '../../../utils/helpers';

const FilmDetail = ({ onNavigate, selectedFilm }) => {
  if (!selectedFilm) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Film tidak ditemukan</p>
      </div>
    );
  }

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
        <button
          onClick={() => onNavigate('film-edit', selectedFilm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          <Edit className="w-5 h-5" />
          <span>Edit Film</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div>
            <img src={getStorageUrl(selectedFilm.poster)} alt={selectedFilm.judul} className="w-full rounded-lg" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{selectedFilm.judul}</h2>
              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span>{selectedFilm.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-5 h-5" />
                  <span>{selectedFilm.durasi} menit</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedFilm.status === 'now_playing' ? 'bg-green-600' :
                  selectedFilm.status === 'coming_soon' ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  {selectedFilm.status === 'now_playing' ? 'Now Playing' :
                   selectedFilm.status === 'coming_soon' ? 'Coming Soon' : 'Ended'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Genre</h3>
              <p className="text-gray-400">{selectedFilm.genre}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Rating Usia</h3>
              <p className="text-gray-400">{selectedFilm.rating_usia}</p>
            </div>

            {selectedFilm.director && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Director</h3>
                <p className="text-gray-400">{selectedFilm.director}</p>
              </div>
            )}

            {selectedFilm.cast && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Cast</h3>
                <p className="text-gray-400">{selectedFilm.cast}</p>
              </div>
            )}

            {selectedFilm.trailer_url && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Trailer</h3>
                <a 
                  href={selectedFilm.trailer_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-500 hover:text-red-400 underline"
                >
                  {selectedFilm.trailer_url}
                </a>
              </div>
            )}

            {selectedFilm.deskripsi && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                <p className="text-gray-400">{selectedFilm.deskripsi}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmDetail;
