import React, { useState, useEffect } from 'react';
import { Film, Ticket, User, TrendingUp, Clock, Star } from 'lucide-react';
import { getNowPlaying, getComingSoon } from '../../services/endpoints/film';
import { getStorageUrl } from '../../utils/helpers';

const Dashboard = ({ setCurrentView }) => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = async () => {
    try {
      const [nowPlayingRes, comingSoonRes] = await Promise.all([
        getNowPlaying(),
        getComingSoon()
      ]);
      setNowPlaying(nowPlayingRes.data.data || []);
      setComingSoon(comingSoonRes.data.data || []);
    } catch (error) {
      console.error('Error loading films:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: <Ticket className="w-8 h-8" />, label: 'Total Bookings', value: '12', color: 'bg-blue-600' },
    { icon: <Film className="w-8 h-8" />, label: 'Now Playing', value: nowPlaying.length, color: 'bg-purple-600' },
    { icon: <Clock className="w-8 h-8" />, label: 'Coming Soon', value: comingSoon.length, color: 'bg-green-600' },
    { icon: <TrendingUp className="w-8 h-8" />, label: 'Points', value: '450', color: 'bg-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6">
              <div className={`${stat.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Now Playing Films */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Now Playing</h2>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : nowPlaying.length === 0 ? (
            <p className="text-gray-400">Tidak ada film yang sedang tayang</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nowPlaying.slice(0, 4).map(film => (
                <div key={film.id} className="bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer">
                  <img 
                    src={getStorageUrl(film.poster)} 
                    alt={film.judul} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{film.judul}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{film.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{film.durasi} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Films */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Coming Soon</h2>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : comingSoon.length === 0 ? (
            <p className="text-gray-400">Tidak ada film yang akan datang</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {comingSoon.slice(0, 4).map(film => (
                <div key={film.id} className="bg-gray-700 rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer">
                  <img 
                    src={getStorageUrl(film.poster)} 
                    alt={film.judul} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{film.judul}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{film.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{film.durasi} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
