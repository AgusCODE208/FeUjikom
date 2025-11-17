import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Users, Maximize, Film, Check, Armchair } from 'lucide-react';
import { getKursiByStudio } from '../../../services/endpoints/studio';

const StudioDetail = ({ onNavigate, selectedStudio }) => {
  const [kursis, setKursis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedStudio) {
      loadKursi();
    }
  }, [selectedStudio]);

  const loadKursi = async () => {
    try {
      setLoading(true);
      const response = await getKursiByStudio(selectedStudio.id);
      setKursis(response.data.data || []);
    } catch (error) {
      console.error('Error loading kursi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedStudio) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Studio tidak ditemukan</p>
        <button
          onClick={() => onNavigate('studio-list')}
          className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          Kembali ke List
        </button>
      </div>
    );
  }

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

  const renderSeatLayout = () => {
    const rows = selectedStudio.layout_rows;
    const cols = selectedStudio.layout_cols;
    const rowLabels = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));
    const seats = [];
    
    // Header dengan nomor kolom
    seats.push(
      <div key="header" className="flex items-center gap-2 mb-2">
        <div className="w-8"></div>
        <div className="flex gap-2">
          {Array.from({ length: cols }, (_, i) => (
            <div key={i} className="w-8 sm:w-10 text-center text-xs font-bold text-gray-400">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    );
    
    // Baris kursi
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const kursi = kursis.find(k => k.row_number === (i + 1) && k.col_number === (j + 1));
        const seatColor = kursi && kursi.status === 'tidak_tersedia' ? 'bg-red-600' : 'bg-gray-700';
        
        row.push(
          <div
            key={`${i}-${j}`}
            className={`w-8 h-8 sm:w-10 sm:h-10 ${seatColor} rounded-lg flex items-center justify-center transition-all`}
            title={kursi ? `${kursi.kode_kursi} - ${kursi.status}` : 'Tidak ada'}
          >
            <Armchair className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        );
      }
      seats.push(
        <div key={i} className="flex items-center gap-2">
          <div className="w-8 text-center font-bold text-gray-400">{rowLabels[i]}</div>
          <div className="flex gap-2">
            {row}
          </div>
        </div>
      );
    }
    
    return seats;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('studio-list')}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <button
          onClick={() => onNavigate('studio-edit', selectedStudio)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          <Edit className="w-5 h-5" />
          <span>Edit Studio</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{selectedStudio.nama_studio}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTipeColor(selectedStudio.tipe)}`}>
              {selectedStudio.tipe}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(selectedStudio.status)}`}>
              {selectedStudio.status === 'active' ? 'Aktif' : 
               selectedStudio.status === 'maintenance' ? 'Maintenance' : 'Nonaktif'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-sm">Kapasitas</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{selectedStudio.kapasitas}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Maximize className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-sm">Layout</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{selectedStudio.layout_rows}x{selectedStudio.layout_cols}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Film className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-sm">Tipe</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold capitalize">{selectedStudio.tipe}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Check className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-sm">Kursi</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{kursis.length}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Preview Layout Kursi</h3>
          {loading ? (
            <div className="bg-gray-700 rounded-lg p-12 text-center">
              <p className="text-gray-400">Loading kursi...</p>
            </div>
          ) : (
          <div className="bg-gray-700 rounded-lg p-4 sm:p-6">
            <div className="mb-6">
              <div className="w-full h-2 bg-gradient-to-r from-transparent via-gray-600 to-transparent rounded-full mb-2"></div>
              <div className="text-center text-gray-400 text-sm">LAYAR</div>
            </div>
            <div className="flex justify-center overflow-x-auto">
              <div className="inline-block space-y-3">
                {renderSeatLayout()}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 sm:gap-8 p-4 bg-gray-800 rounded-lg flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Armchair className="w-5 h-5" />
                </div>
                <span className="text-sm">Tersedia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Armchair className="w-5 h-5" />
                </div>
                <span className="text-sm">Tidak Tersedia</span>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioDetail;
