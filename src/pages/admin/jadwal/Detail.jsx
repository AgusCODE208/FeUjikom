import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import useFilmStore from '../../../stores/useFilmStore';
import useStudioStore from '../../../stores/useStudioStore';
import useHargaStore from '../../../stores/useHargaStore';

const JadwalDetail = ({ onNavigate, selectedJadwal }) => {
  const { films, fetchFilms } = useFilmStore();
  const { studios, fetchStudios } = useStudioStore();
  const { hargas, fetchHargas } = useHargaStore();
  
  const [film, setFilm] = useState(null);
  const [studio, setStudio] = useState(null);
  const [harga, setHarga] = useState(null);

  useEffect(() => {
    fetchFilms();
    fetchStudios();
    fetchHargas();
  }, []);

  useEffect(() => {
    if (selectedJadwal && films.length && studios.length && hargas.length) {
      setFilm(films.find(f => f.id == selectedJadwal.film_id));
      setStudio(studios.find(s => s.id == selectedJadwal.studio_id));
      setHarga(hargas.find(h => h.id == selectedJadwal.harga_id));
    }
  }, [selectedJadwal, films, studios, hargas]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!selectedJadwal) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Jadwal tidak ditemukan</p>
        <button
          onClick={() => onNavigate('jadwal-list')}
          className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          Kembali ke List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('jadwal-list')}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <button
          onClick={() => onNavigate('jadwal-edit', selectedJadwal)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          <Edit className="w-5 h-5" />
          <span>Edit Jadwal</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Film Info */}
          <div>
            <img src={film?.poster} alt={film?.judul} className="w-full rounded-lg mb-4" />
            <h3 className="font-semibold text-lg mb-2">{film?.judul}</h3>
            <p className="text-sm text-gray-400 mb-1">{film?.genre}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{film?.durasi} menit</span>
            </div>
          </div>

          {/* Jadwal Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Detail Jadwal Tayang</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2 text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <h3 className="font-semibold">Tanggal</h3>
                </div>
                <p className="text-lg font-bold">{formatTanggal(selectedJadwal.tanggal)}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2 text-gray-400">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-semibold">Waktu</h3>
                </div>
                <p className="text-lg font-bold">{selectedJadwal.jam_mulai} - {selectedJadwal.jam_selesai}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-semibold">Studio</h3>
                </div>
                <p className="text-lg font-bold">{studio?.nama_studio}</p>
                <p className="text-sm text-gray-400 capitalize">{studio?.tipe}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2 text-gray-400">
                  <DollarSign className="w-5 h-5" />
                  <h3 className="font-semibold">Harga Tiket</h3>
                </div>
                <p className="text-lg font-bold text-green-400">{formatRupiah(harga?.harga)}</p>
                <p className="text-xs text-gray-400">{harga?.keterangan}</p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Status Jadwal</h3>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-block ${
                selectedJadwal.status === 'available' ? 'bg-green-600' :
                selectedJadwal.status === 'full' ? 'bg-red-600' : 'bg-gray-600'
              }`}>
                {selectedJadwal.status === 'available' ? 'Tersedia' :
                 selectedJadwal.status === 'full' ? 'Penuh' : 'Dibatalkan'}
              </span>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Informasi Tambahan</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Kapasitas Studio: {studio?.kapasitas} kursi</p>
                <p>Dibuat pada: {new Date(selectedJadwal.created_at).toLocaleString('id-ID')}</p>
                {selectedJadwal.updated_at && (
                  <p>Diupdate pada: {new Date(selectedJadwal.updated_at).toLocaleString('id-ID')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JadwalDetail;
