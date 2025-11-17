import React, { useState, useEffect } from 'react';
import { Film, ChevronLeft, Armchair } from 'lucide-react';
import { getKursiByStudio } from '../../services/endpoints/studio';
import { getBookedSeats } from '../../services/endpoints/transaksi';

const PilihKursi = ({ setCurrentView, selectedJadwal, selectedDate, filmDetail, setCheckoutData, bookedSeats }) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedKursiIds, setBookedKursiIds] = useState([]);

  useEffect(() => {
    if (selectedJadwal?.studio?.id && selectedJadwal?.id) {
      fetchSeatsData();
    }
  }, [selectedJadwal]);

  const fetchSeatsData = async () => {
    try {
      setLoading(true);
      const kursiResponse = await getKursiByStudio(selectedJadwal.studio.id);
      const allKursi = kursiResponse.data.data;

      const bookedResponse = await getBookedSeats(selectedJadwal.id);
      const bookedSeats = bookedResponse.data.data;
      const bookedIds = bookedSeats.map(k => k.id);
      setBookedKursiIds(bookedIds);

      const seatsWithStatus = allKursi.map(kursi => ({
        ...kursi,
        status: bookedIds.includes(kursi.id) ? 'booked' : 'available'
      }));

      setSeats(seatsWithStatus);
    } catch (error) {
      console.error('Error fetching seats:', error);
      alert('Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedJadwal || !selectedDate || !filmDetail) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Armchair className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Data booking tidak lengkap</p>
          <button
            onClick={() => setCurrentView('home')}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  const handleSeatClick = (kursiId) => {
    const seat = seats.find(s => s.id === kursiId);
    if (seat && seat.status !== 'booked') {
      if (seat.status === 'available') {
        setSelectedSeats(prev => [...prev, kursiId]);
        setSeats(prevSeats => prevSeats.map(s => 
          s.id === kursiId ? { ...s, status: 'selected' } : s
        ));
      } else {
        setSelectedSeats(prev => prev.filter(id => id !== kursiId));
        setSeats(prevSeats => prevSeats.map(s => 
          s.id === kursiId ? { ...s, status: 'available' } : s
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

  const seatsByRow = seats.reduce((acc, seat) => {
    const rowLabel = String.fromCharCode(65 + seat.row_number - 1);
    if (!acc[rowLabel]) acc[rowLabel] = [];
    acc[rowLabel].push(seat);
    return acc;
  }, {});

  const rows = Object.keys(seatsByRow).sort();
  const maxCols = Math.max(...Object.values(seatsByRow).map(row => row.length), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading seats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => setCurrentView('filmdetail')}
              className="flex items-center space-x-2 hover:text-red-500 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Schedule</span>
            </button>
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold">
                <span className="text-white">AMBA</span><span className="text-red-500">MAX</span>
              </span>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-lg p-6 mb-8" data-aos="fade-down">
          <h2 className="text-2xl font-bold mb-4">Select Your Seats</h2>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-gray-400">Movie: </span>
              <span className="font-semibold">{filmDetail.judul}</span>
            </div>
            <div>
              <span className="text-gray-400">Date: </span>
              <span className="font-semibold">{selectedDate.hari}, {selectedDate.tanggal}</span>
            </div>
            <div>
              <span className="text-gray-400">Time: </span>
              <span className="font-semibold">{selectedJadwal.jam_mulai || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-400">Studio: </span>
              <span className="font-semibold">{selectedJadwal.studio?.nama_studio || 'N/A'} (<span className="capitalize">{selectedJadwal.studio?.tipe || 'Regular'}</span>)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3" data-aos="fade-right">
            <div className="mb-8">
              <div className="w-full h-2 bg-gradient-to-r from-transparent via-gray-600 to-transparent rounded-full mb-2"></div>
              <div className="text-center text-gray-400 text-sm">SCREEN</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8" aria-hidden="true"></div>
                <div className="flex gap-2">
                  {Array.from({ length: maxCols }, (_, i) => i + 1).map(num => (
                    <div key={`col-${num}`} className="w-10 text-center text-xs font-bold text-gray-400">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              
              {rows.map(row => (
                <div key={`row-${row}`} className="flex items-center gap-2">
                  <div className="w-8 text-center font-bold text-gray-400">{row}</div>
                  <div className="flex gap-2">
                    {seatsByRow[row]
                      .sort((a, b) => a.col_number - b.col_number)
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
                          aria-label={`Seat ${seat.kode_kursi} - ${seat.status}`}
                          title={seat.kode_kursi}
                        >
                          <Armchair className="w-5 h-5 mx-auto" />
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-8 mt-8 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg"></div>
                <span className="text-sm">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg"></div>
                <span className="text-sm">Booked</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1" data-aos="fade-left">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Selected Seats</div>
                  <div className="font-semibold">
                    {selectedSeats.length > 0 
                      ? selectedSeats.map(id => seats.find(s => s.id === id)?.kode_kursi).filter(Boolean).sort().join(', ')
                      : 'No seats selected'
                    }
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">Number of Seats</div>
                  <div className="font-semibold">{selectedSeats.length} seat(s)</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">Price per Seat</div>
                  <div className="font-semibold">{formatCurrency(selectedJadwal.harga?.harga || 0)}</div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="text-sm text-gray-400 mb-1">Total Price</div>
                  <div className="text-2xl font-bold text-red-500">
                    {formatCurrency(totalPrice)}
                  </div>
                </div>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                onClick={() => {
                  setCheckoutData({
                    filmDetail: filmDetail,
                    selectedDate: selectedDate,
                    selectedJadwal: selectedJadwal,
                    selectedSeats: selectedSeats,
                    selectedSeatCodes: selectedSeats.map(id => seats.find(s => s.id === id)?.kode_kursi).filter(Boolean)
                  });
                  setCurrentView('checkout');
                }}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  selectedSeats.length === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {selectedSeats.length === 0 ? 'Select Seats' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilihKursi;
