import React, { useState, useEffect } from 'react';
import { ChevronLeft, Armchair } from 'lucide-react';
import useKasirTransaksiStore from '../../stores/useKasirTransaksiStore';

const PilihKursi = ({ filmDetail, selectedJadwal, selectedDate, onSelect, onBack }) => {
  const { seats, loading, fetchSeats } = useKasirTransaksiStore();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [localSeats, setLocalSeats] = useState([]);

  useEffect(() => {
    if (selectedJadwal?.id) {
      fetchSeats(selectedJadwal.id).then(data => {
        setLocalSeats(data.seats);
      });
    }
  }, [selectedJadwal]);

  const handleSeatClick = (seatId) => {
    const seat = localSeats.find(s => s.id === seatId);
    if (seat && seat.status !== 'booked') {
      if (seat.status === 'available') {
        setSelectedSeats(prev => [...prev, seatId]);
        setLocalSeats(prevSeats => prevSeats.map(s => 
          s.id === seatId ? { ...s, status: 'selected' } : s
        ));
      } else {
        setSelectedSeats(prev => prev.filter(id => id !== seatId));
        setLocalSeats(prevSeats => prevSeats.map(s => 
          s.id === seatId ? { ...s, status: 'available' } : s
        ));
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalPrice = selectedSeats.length * (selectedJadwal?.harga?.harga || 0);

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

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Pilih Kursi</h2>
        <div className="flex flex-wrap gap-4 text-sm mb-6">
          <div>
            <span className="text-gray-400">Film: </span>
            <span className="font-semibold">{filmDetail.judul}</span>
          </div>
          <div>
            <span className="text-gray-400">Tanggal: </span>
            <span className="font-semibold">{selectedDate.hari}, {selectedDate.display}</span>
          </div>
          <div>
            <span className="text-gray-400">Jam: </span>
            <span className="font-semibold">{selectedJadwal.jam_mulai}</span>
          </div>
          <div>
            <span className="text-gray-400">Studio: </span>
            <span className="font-semibold">{selectedJadwal.studio?.nama_studio}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="w-full h-2 bg-gradient-to-r from-transparent via-gray-600 to-transparent rounded-full mb-2"></div>
              <div className="text-center text-gray-400 text-sm">LAYAR</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8" aria-hidden="true"></div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <div key={`col-${num}`} className="w-10 text-center text-xs font-bold text-gray-400">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
                <div key={`row-${row}`} className="flex items-center gap-2">
                  <div className="w-8 text-center font-bold text-gray-400">{row}</div>
                  <div className="flex gap-2">
                    {localSeats
                      .filter(seat => seat.row === row)
                      .map(seat => (
                        <button
                          key={`seat-${seat.id}`}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.status === 'booked'}
                          className={`w-10 h-10 rounded-lg font-semibold text-xs transition-all ${
                            seat.status === 'available'
                              ? 'bg-gray-700 hover:bg-gray-600'
                              : seat.status === 'selected'
                              ? 'bg-yellow-500 text-gray-900'
                              : 'bg-red-600 cursor-not-allowed'
                          }`}
                          aria-label={`Seat ${seat.id} - ${seat.status}`}
                          title={seat.id}
                        >
                          <Armchair className="w-5 h-5 mx-auto" />
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-8 mt-6 p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-700 border-2 border-gray-500 rounded-lg"></div>
                <span className="text-sm">Tersedia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg"></div>
                <span className="text-sm">Dipilih</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg"></div>
                <span className="text-sm">Terisi</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-700 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-4">Ringkasan</h3>
              
              <div className="space-y-3 mb-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Kursi Dipilih</div>
                  <div className="font-semibold">
                    {selectedSeats.length > 0 
                      ? selectedSeats.sort().join(', ')
                      : 'Belum ada kursi'
                    }
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">Jumlah Kursi</div>
                  <div className="font-semibold">{selectedSeats.length} kursi</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">Harga per Kursi</div>
                  <div className="font-semibold">{formatCurrency(selectedJadwal.harga?.harga || 0)}</div>
                </div>
                
                <div className="border-t border-gray-600 pt-3">
                  <div className="text-sm text-gray-400 mb-1">Total Harga</div>
                  <div className="text-2xl font-bold text-red-500">
                    {formatCurrency(totalPrice)}
                  </div>
                </div>
              </div>

              <button
                disabled={selectedSeats.length === 0 || loading}
                onClick={() => onSelect(selectedSeats)}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  selectedSeats.length === 0 || loading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? 'Loading...' : selectedSeats.length === 0 ? 'Pilih Kursi' : 'Lanjut Pembayaran'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilihKursi;
