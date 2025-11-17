import React, { useState, useEffect } from 'react';
import { Film, Calendar, Clock, Star, Search, History } from 'lucide-react';
import { getFilms } from '../../services/endpoints/film';
import { getStorageUrl } from '../../utils/helpers';
import Footer from '../../components/Footer';

const Home = ({ setCurrentView, setSelectedFilmId }) => {
  const [selectedTab, setSelectedTab] = useState('now_playing');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = async () => {
    try {
      const response = await getFilms();
      setFilms(response.data.data || []);
    } catch (error) {
      console.error('Error loading films:', error);
    }
  };

  const heroImages = films.slice(0, 5).map(film => film.poster);

  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const filteredFilms = films.filter(film => {
    const matchStatus = film.status === selectedTab;
    const matchSearch = film.judul.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Hero Section with Carousel */}
      <div className="relative h-[500px] md:h-96 overflow-hidden" data-aos="fade-down">
        {/* Carousel Background */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={`hero-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${getStorageUrl(image)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to <span className="text-white">AMBA</span><span className="text-red-500">MAX</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Book your favorite movies with ease
          </p>
          
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            <button
              onClick={() => setSelectedTab('now_playing')}
              className={`flex-1 flex items-center justify-center space-x-2 px-2 py-4 border-b-2 transition ${
                selectedTab === 'now_playing'
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-400'
              }`}
            >
              <Film className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Now Playing</span>
            </button>
            <button
              onClick={() => setSelectedTab('coming_soon')}
              className={`flex-1 flex items-center justify-center space-x-2 px-2 py-4 border-b-2 transition ${
                selectedTab === 'coming_soon'
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-400'
              }`}
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Coming Soon</span>
            </button>
            <button
              onClick={() => setSelectedTab('ended')}
              className={`flex-1 flex items-center justify-center space-x-2 px-2 py-4 border-b-2 transition ${
                selectedTab === 'ended'
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-400'
              }`}
            >
              <History className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">
          {selectedTab === 'now_playing' ? 'Now Playing' : selectedTab === 'coming_soon' ? 'Coming Soon' : 'History'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFilms.map((film, index) => (
            <div 
              key={film.id} 
              onClick={() => {
                setSelectedFilmId(film.id);
                setCurrentView('filmdetail');
              }}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-80">
                <img
                  src={getStorageUrl(film.poster)}
                  alt={film.judul}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 px-2 py-1 rounded flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{film.rating}</span>
                </div>
                <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-sm font-semibold">
                  {film.rating_usia}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{film.judul}</h3>
                <p className="text-gray-400 text-sm mb-3">{film.genre}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{film.durasi} min</span>
                  </div>
                  
                  {film.status === 'now_playing' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFilmId(film.id);
                        setCurrentView('filmdetail');
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm font-semibold transition"
                    >
                      Book Now
                    </button>
                  )}
                  
                  {film.status === 'coming_soon' && (
                    <span className="bg-blue-600 px-3 py-1 rounded text-sm font-semibold">
                      Soon
                    </span>
                  )}
                  
                  {film.status === 'ended' && (
                    <span className="bg-gray-600 px-3 py-1 rounded text-sm font-semibold">
                      Ended
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer setCurrentView={setCurrentView} setFilterStatus={setSelectedTab} />
    </div>
  );
};

export default Home;
