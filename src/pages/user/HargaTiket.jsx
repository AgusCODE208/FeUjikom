import React, { useState, useEffect } from 'react';
import { DollarSign, Tag, Calendar, Clock } from 'lucide-react';
import hargaService from '../../services/endpoints/harga';

const HargaTiket = () => {
  const [hargas, setHargas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHargas();
  }, []);

  const loadHargas = async () => {
    try {
      const response = await hargaService.getAll();
      setHargas(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error loading hargas:', error);
      setHargas([]);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const getTipeLabel = (tipe) => {
    const labels = {
      'weekday_reguler': 'Weekday Reguler',
      'weekend_reguler': 'Weekend Reguler',
      'weekday_vip': 'Weekday VIP',
      'weekend_vip': 'Weekend VIP',
      'weekday_imax': 'Weekday IMAX',
      'weekend_imax': 'Weekend IMAX',
      'holiday_reguler': 'Holiday Reguler',
      'holiday_vip': 'Holiday VIP',
      'holiday_imax': 'Holiday IMAX'
    };
    return labels[tipe] || tipe;
  };

  const getTipeIcon = (tipe) => {
    if (tipe.includes('weekday')) return <Calendar className="w-5 h-5" />;
    if (tipe.includes('weekend')) return <Clock className="w-5 h-5" />;
    return <Tag className="w-5 h-5" />;
  };

  const getTipeColor = (tipe) => {
    if (tipe.includes('reguler')) return 'from-blue-600 to-blue-800';
    if (tipe.includes('vip')) return 'from-purple-600 to-purple-800';
    if (tipe.includes('imax')) return 'from-red-600 to-red-800';
    return 'from-gray-600 to-gray-800';
  };

  const groupedHargas = {
    reguler: hargas.filter(h => h.tipe.includes('reguler')),
    vip: hargas.filter(h => h.tipe.includes('vip')),
    imax: hargas.filter(h => h.tipe.includes('imax'))
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Harga Tiket</h1>
          <p className="text-gray-400">Daftar harga tiket bioskop berdasarkan tipe studio dan waktu</p>
        </div>

        {/* Reguler Studio */}
        {groupedHargas.reguler.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-8 bg-blue-600 rounded"></div>
              Studio Reguler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedHargas.reguler.map((harga) => (
                <div key={harga.id} className={`bg-gradient-to-br ${getTipeColor(harga.tipe)} rounded-lg p-6 hover:scale-105 transition`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getTipeIcon(harga.tipe)}
                      <span className="font-semibold">{getTipeLabel(harga.tipe)}</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">{formatRupiah(harga.harga)}</div>
                  {harga.keterangan && (
                    <p className="text-sm text-gray-200">{harga.keterangan}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIP Studio */}
        {groupedHargas.vip.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-8 bg-purple-600 rounded"></div>
              Studio VIP
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedHargas.vip.map((harga) => (
                <div key={harga.id} className={`bg-gradient-to-br ${getTipeColor(harga.tipe)} rounded-lg p-6 hover:scale-105 transition`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getTipeIcon(harga.tipe)}
                      <span className="font-semibold">{getTipeLabel(harga.tipe)}</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">{formatRupiah(harga.harga)}</div>
                  {harga.keterangan && (
                    <p className="text-sm text-gray-200">{harga.keterangan}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IMAX Studio */}
        {groupedHargas.imax.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-8 bg-red-600 rounded"></div>
              Studio IMAX
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedHargas.imax.map((harga) => (
                <div key={harga.id} className={`bg-gradient-to-br ${getTipeColor(harga.tipe)} rounded-lg p-6 hover:scale-105 transition`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getTipeIcon(harga.tipe)}
                      <span className="font-semibold">{getTipeLabel(harga.tipe)}</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">{formatRupiah(harga.harga)}</div>
                  {harga.keterangan && (
                    <p className="text-sm text-gray-200">{harga.keterangan}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {hargas.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Belum ada data harga tiket</p>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-bold mb-4">Informasi</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Weekday: Senin - Jumat</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Weekend: Sabtu - Minggu</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Holiday: Hari libur nasional</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HargaTiket;
