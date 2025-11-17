import React, { useState, useEffect } from 'react';
import { Film, Calendar, Clock, Star, MapPin, Users, Play, Share2, Heart, ChevronLeft, Award } from 'lucide-react';
import Footer from '../../components/Footer';
import { getFilmById } from '../../services/endpoints/film';
import { getJadwalsByFilm } from '../../services/endpoints/jadwal';
import useAuthStore from '../../stores/useAuthStore';

const FilmDetail = ({ setCurrentView, setBookingData, isLoggedIn, filmId }) => {
  const [filmDetail, setFilmDetail] = useState(null);
  const [jadwalTayang, setJadwalTayang] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!filmId) {
      setCurrentView('home');
      return;
    }
    loadFilmDetail();
  }, [filmId]);

  const loadFilmDetail = async () => {
    try {
      const [filmRes, jadwalRes] = await Promise.all([
        getFilmById(filmId),
        getJadwalsByFilm(filmId)
      ]);
      
      const film = filmRes.data.data;
      if (!film) {
        alert('Film tidak ditemukan');
        setCurrentView('home');
        return;
      }
      setFilmDetail(film);

      const jadwalsGrouped = jadwalRes.data.data.jadwals;
      const jadwalArray = Object.keys(jadwalsGrouped).map((tanggalKey, index) => {
        // Extract date only from datetime string (YYYY-MM-DD HH:mm:ss -> YYYY-MM-DD)
        const tanggalOnly = tanggalKey.split(' ')[0];
        // Parse date with T12:00:00 to avoid timezone offset
        const dateObj = new Date(tanggalOnly + 'T12:00:00');
        return {
          id: index + 1,
          tanggal: tanggalOnly,
          hari: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
          jadwal: jadwalsGrouped[tanggalKey]
        };
      });

      setJadwalTayang(jadwalArray);
      if (jadwalArray.length > 0) {
        setSelectedDate(jadwalArray[0]);
      }
    } catch (error) {
      console.error('Error loading film:', error);
      alert('Gagal memuat detail film');
      setCurrentView('home');
    }
  };

  const getAvailableSeats = (jadwal) => {
    return jadwal.studio?.kapasitas || 0;
  };

  const handleBooking = (jadwal) => {
    if (!isLoggedIn) {
      alert('Please login first to book tickets');
      setCurrentView('login');
      return;
    }
    
    // Cek role user - hanya user biasa yang bisa booking
    const { user } = useAuthStore.getState();
    const userRole = user?.roles?.[0];
    
    if (userRole && ['admin', 'kasir', 'owner'].includes(userRole)) {
      alert('Admin, Kasir, dan Owner tidak dapat melakukan booking. Silakan gunakan akun user biasa.');
      return;
    }
    
    const bookingInfo = {
      selectedJadwal: jadwal,
      selectedDate: selectedDate,
      filmDetail: filmDetail,
      bookedSeats: []
    };
    setBookingData(bookingInfo);
    setTimeout(() => {
      setCurrentView('pilihkursi');
    }, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!filmDetail) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center space-x-2 hover:text-red-500 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold">
                <span className="text-white">AMBA</span><span className="text-red-500">MAX</span>
              </span>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      <div className="relative min-h-[600px] lg:min-h-[700px]" data-aos="fade-in">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${filmDetail.poster_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12 pt-24">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img 
                src={filmDetail.poster_url} 
                alt={filmDetail.judul}
                className="w-48 h-72 md:w-64 md:h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-600 px-3 py-1 rounded text-sm font-semibold">
                  {filmDetail.rating_usia}
                </span>
                <span className="bg-blue-600 px-3 py-1 rounded text-sm font-semibold">
                  {filmDetail.status === 'now_playing' ? 'Now Playing' : 'Coming Soon'}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{filmDetail.judul}</h1>
              
              <div className="flex items-center gap-6 mb-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xl font-bold text-white">{filmDetail.rating || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{filmDetail.durasi} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{filmDetail.status === 'now_playing' ? 'Now Playing' : filmDetail.status === 'coming_soon' ? 'Coming Soon' : 'Ended'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                {filmDetail.trailer_url && (
                  <a 
                    href={filmDetail.trailer_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Trailer</span>
                  </a>
                )}
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-lg border-2 transition ${
                    isFavorite 
                      ? 'bg-red-600 border-red-600' 
                      : 'border-gray-600 hover:border-red-600'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-white' : ''}`} />
                </button>
                <button className="p-3 rounded-lg border-2 border-gray-600 hover:border-red-600 transition">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {filmDetail.genre?.split(', ').map((g, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">{filmDetail.deskripsi || 'No description available.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-500" />
                  Director
                </h3>
                <p className="text-gray-300">{filmDetail.director || 'Not available'}</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-500" />
                  Cast
                </h3>
                <p className="text-gray-300">{filmDetail.cast || 'Not available'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Select Showtime</h2>
              
              {filmDetail.status === 'ended' ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-xl font-semibold text-red-500 mb-2">Film Sudah Berakhir</p>
                  <p className="text-gray-400">Film ini sudah tidak tayang lagi di bioskop</p>
                </div>
              ) : jadwalTayang.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Belum ada jadwal tersedia untuk film ini</p>
                </div>
              ) : (
                <>
              <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {jadwalTayang.map((date) => (
                  <button
                    key={`date-${date.id}`}
                    onClick={() => setSelectedDate(date)}
                    className={`flex-shrink-0 px-6 py-4 rounded-lg border-2 transition ${
                      selectedDate?.id === date.id
                        ? 'bg-red-600 border-red-600'
                        : 'bg-gray-800 border-gray-700 hover:border-red-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm text-gray-400">{date.hari}</div>
                      <div className="text-xl font-bold">
                        {new Date(date.tanggal + 'T12:00:00').getDate()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(date.tanggal + 'T12:00:00').toLocaleDateString('id-ID', { month: 'short' })}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {selectedDate?.jadwal.map((slot) => (
                  <div 
                    key={`slot-${slot.id}`}
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition"
                    data-aos="fade-left"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-500">{slot.jam_mulai}</div>
                        </div>
                        <div className="border-l-2 border-gray-700 pl-4">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">{slot.studio?.nama_studio || 'Studio'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="px-2 py-1 bg-gray-700 rounded text-xs capitalize">
                              {slot.studio?.tipe || 'Regular'}
                            </span>
                            <span className="text-green-500">
                              {getAvailableSeats(slot)} seats available
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Price</div>
                          <div className="text-xl font-bold text-red-500">
                            {formatCurrency(slot.harga?.harga || 0)}
                          </div>
                        </div>
                        <button
                          onClick={() => handleBooking(slot)}
                          disabled={getAvailableSeats(slot) === 0}
                          className={`px-6 py-3 rounded-lg font-semibold transition ${
                            getAvailableSeats(slot) === 0
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          {getAvailableSeats(slot) === 0 ? 'Sold Out' : 'Book Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold mb-4">Movie Info</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Genre</div>
                  <div className="font-semibold">{filmDetail.genre}</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Duration</div>
                  <div className="font-semibold">{filmDetail.durasi} minutes</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Rating</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{filmDetail.rating_usia}</span>
                    {filmDetail.rating && (
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">{filmDetail.rating}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Status</div>
                  <div className="font-semibold capitalize">{filmDetail.status.replace('_', ' ')}</div>
                </div>
                {filmDetail.director && (
                  <div>
                    <div className="text-gray-400 mb-1">Director</div>
                    <div className="font-semibold">{filmDetail.director}</div>
                  </div>
                )}
                {filmDetail.trailer_url && (
                  <div className="pt-4 border-t border-gray-700">
                    <a 
                      href={filmDetail.trailer_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-semibold transition"
                    >
                      <Play className="w-4 h-4" />
                      Watch Trailer
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer setCurrentView={setCurrentView} />
    </div>
  );
};

export default FilmDetail;
