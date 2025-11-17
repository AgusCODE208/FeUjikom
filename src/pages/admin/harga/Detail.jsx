import React from 'react';
import { ArrowLeft, Edit, DollarSign, Tag, Calendar } from 'lucide-react';

const HargaDetail = ({ onNavigate, selectedHarga }) => {
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

  const getTipeColor = (tipe) => {
    if (tipe.includes('reguler')) return 'bg-blue-600';
    if (tipe.includes('vip')) return 'bg-purple-600';
    if (tipe.includes('imax')) return 'bg-red-600';
    return 'bg-gray-600';
  };

  if (!selectedHarga) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Harga tiket tidak ditemukan</p>
        <button onClick={() => onNavigate('harga-list')} className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
          Kembali ke List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button onClick={() => onNavigate('harga-list')} className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <button onClick={() => onNavigate('harga-edit', selectedHarga)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
          <Edit className="w-5 h-5" />
          <span>Edit Harga</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
            <DollarSign className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{getTipeLabel(selectedHarga.tipe)}</h2>
          <p className="text-gray-400">{selectedHarga.keterangan}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2 text-gray-400">
              <DollarSign className="w-5 h-5" />
              <h3 className="font-semibold">Harga Tiket</h3>
            </div>
            <p className="text-4xl font-bold text-green-400">{formatRupiah(selectedHarga.harga)}</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2 text-gray-400">
              <Tag className="w-5 h-5" />
              <h3 className="font-semibold">Status</h3>
            </div>
            <span className={`inline-block px-6 py-2 rounded-full text-lg font-semibold mt-2 ${
              (selectedHarga.status || 'active') === 'active' ? 'bg-green-600' : 'bg-gray-600'
            }`}>
              {(selectedHarga.status || 'active') === 'active' ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center space-x-2">
              <Tag className="w-5 h-5 text-purple-500" />
              <span>Tipe Harga</span>
            </h3>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getTipeColor(selectedHarga.tipe)}`}>
              {getTipeLabel(selectedHarga.tipe)}
            </span>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Informasi Waktu</span>
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Dibuat pada: {new Date(selectedHarga.created_at).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              {selectedHarga.updated_at && (
                <p>Terakhir diupdate: {new Date(selectedHarga.updated_at).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              )}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Catatan</h3>
            <p className="text-sm text-gray-400">
              Harga tiket ini akan diterapkan pada jadwal film yang menggunakan tipe harga ini.
              Perubahan harga tidak akan mempengaruhi transaksi yang sudah selesai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HargaDetail;
