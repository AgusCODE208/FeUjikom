import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Clock } from 'lucide-react';
import useKasirTransaksiStore from '../../stores/useKasirTransaksiStore';

const PilihFilmJadwal = ({ onSelect, onBack }) => {
  const { films, jadwals, loading, fetchFilms, fetchJadwals } = useKasirTransaksiStore();
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    fetchFilms();
  }, []);

  useEffect(() => {
    if (selectedFilm) {
      loadAvailableDates();
    }
  }, [selectedFilm]);

  useEffect(() => {
    if (selectedFilm && selectedDate) {
      const loadJadwals = async () => {
        try {
          console.log('Loading jadwals for:', selectedFilm.id, selectedDate.tanggal);
          await fetchJadwals(selectedFilm.id, selectedDate.tanggal);
          console.log('Jadwals loaded:', jadwals);
        } catch (error) {
          console.error('Failed to load jadwals:', error);
        }
      };
      loadJadwals();
    }
  }, [selectedFilm, selectedDate]);

  const loadAvailableDates = async () => {
    console.log('🔄 loadAvailableDates called for film:', selectedFilm.id);
    setAvailableDates([]);
    setSelectedDate(null);
    
    try {
      // Fetch semua jadwal yang masih valid (tanpa filter tanggal spesifik)
      const response = await useKasirTransaksiStore.getState().fetchJadwals(selectedFilm.id, null);
      
      console.log('✅ Raw jadwals response:', response);
      console.log('📊 Response length:', response?.length);
      
      if (response && response.length > 0) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        
        const uniqueDates = [...new Set(response.map(j => {
          // Ekstrak tanggal dari berbagai format
          let tanggalStr = j.tanggal;
          if (typeof tanggalStr === 'string') {
            // Format: 2025-11-17 20:00:00 atau 2025-11-17T20:00:00
            tanggalStr = tanggalStr.split('T')[0].split(' ')[0];
          }
          return tanggalStr;
        }))];
        
        console.log('📅 Unique dates:', uniqueDates);
        
        const dateList = uniqueDates.map(tanggal => {
          // Parse tanggal dengan format YYYY-MM-DD
          const dateObj = new Date(tanggal + 'T12:00:00');
          const dayIndex = dateObj.getDay();
          const day = dateObj.getDate();
          const monthIndex = dateObj.getMonth();
          
          console.log(`🔍 Processing ${tanggal}:`, { dayIndex, day, monthIndex, hari: days[dayIndex], display: `${day} ${months[monthIndex]}` });
          
          return {
            hari: days[dayIndex],
            tanggal: tanggal,
            display: `${day} ${months[monthIndex]}`
          };
        }).filter(d => d.tanggal && d.hari && d.display);
        
        console.log('✨ Processed dates:', dateList);
        console.log('🎯 Setting availableDates with', dateList.length, 'dates');
        
        setAvailableDates(dateList);
        if (dateList.length > 0) {
          console.log('🎯 Auto-selecting first date:', dateList[0]);
          setSelectedDate(dateList[0]);
        }
      } else {
        console.warn('⚠️ No jadwals found in response');
        setAvailableDates([]);
      }
    } catch (error) {
      console.error('❌ Error loading dates:', error);
      setAvailableDates([]);
    }
  };



  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Pilih Film */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Pilih Film</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {films.map(film => (
            <button
              key={`film-${film.id}`}
              onClick={() => setSelectedFilm(film)}
              className={`rounded-lg overflow-hidden transition ${
                selectedFilm?.id === film.id ? 'ring-4 ring-red-500' : 'hover:ring-2 hover:ring-gray-600'
              }`}
            >
              <img 
                src={film.poster_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400"%3E%3Crect fill="%23333" width="300" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'} 
                alt={film.judul} 
                className="w-full h-64 object-cover"
              />
              <div className="p-2 bg-gray-700">
                <p className="text-sm font-semibold truncate">{film.judul}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pilih Tanggal */}
      {selectedFilm && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Pilih Tanggal</h2>
          {loading ? (
            <p className="text-gray-400 text-center py-4">Loading tanggal...</p>
          ) : availableDates.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Tidak ada jadwal tersedia</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {availableDates.map((date, idx) => (
                <button
                  key={`date-${idx}`}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 px-6 py-3 rounded-lg transition ${
                    selectedDate?.tanggal === date.tanggal ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-sm font-medium">{date.hari}</div>
                  <div className="text-lg font-bold">{date.display}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pilih Jadwal */}
      {selectedFilm && selectedDate && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Pilih Jadwal</h2>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : jadwals.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Tidak ada jadwal tersedia</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jadwals.map(jadwal => (
                <button
                  key={`jadwal-${jadwal.id}`}
                  onClick={() => onSelect(selectedFilm, jadwal, selectedDate)}
                  className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-lg">{jadwal.jam_mulai}</span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>Studio: {jadwal.studio?.nama_studio} ({jadwal.studio?.tipe})</div>
                    <div className="text-red-500 font-semibold">{formatCurrency(jadwal.harga?.harga)}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PilihFilmJadwal;
