import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import hargaService from '../../../services/endpoints/harga';

const HargaEdit = ({ onNavigate, selectedHarga }) => {
  const [formData, setFormData] = useState({
    tipe: selectedHarga?.tipe || '',
    harga: selectedHarga?.harga || '',
    keterangan: selectedHarga?.keterangan || ''
  });
  const [loading, setLoading] = useState(false);

  const tipeOptions = [
    { value: 'weekday_reguler', label: 'Weekday - Studio Reguler' },
    { value: 'weekend_reguler', label: 'Weekend - Studio Reguler' },
    { value: 'weekday_vip', label: 'Weekday - Studio VIP' },
    { value: 'weekend_vip', label: 'Weekend - Studio VIP' },
    { value: 'weekday_imax', label: 'Weekday - Studio IMAX' },
    { value: 'weekend_imax', label: 'Weekend - Studio IMAX' },
    { value: 'holiday_reguler', label: 'Holiday - Studio Reguler' },
    { value: 'holiday_vip', label: 'Holiday - Studio VIP' },
    { value: 'holiday_imax', label: 'Holiday - Studio IMAX' }
  ];

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const handleSubmit = async () => {
    if (!formData.tipe || !formData.harga) {
      alert('Tipe dan harga harus diisi!');
      return;
    }

    if (formData.harga < 1000) {
      alert('Harga minimal Rp 1.000!');
      return;
    }

    setLoading(true);
    try {
      await hargaService.update(selectedHarga.id, {
        tipe: formData.tipe,
        harga: parseInt(formData.harga),
        keterangan: formData.keterangan || ''
      });
      alert('Harga tiket berhasil diupdate!');
      onNavigate('harga-list');
    } catch (error) {
      console.error('Error updating harga:', error);
      alert(error.response?.data?.message || 'Gagal mengupdate harga');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedHarga) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Harga tiket tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => onNavigate('harga-list')} className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali</span>
      </button>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Harga Tiket</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipe Harga</label>
            <select value={formData.tipe} onChange={(e) => setFormData({...formData, tipe: e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none" required>
              <option value="">-- Pilih Tipe Harga --</option>
              {tipeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Harga (Rp)</label>
            <input type="number" min="1000" step="1000" value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none" required />
            {formData.harga && (
              <p className="text-sm text-green-400 mt-1">Preview: {formatRupiah(parseInt(formData.harga))}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Keterangan</label>
            <textarea value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})} rows="3" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none resize-none" required />
          </div>



          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button onClick={handleSubmit} disabled={loading} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="w-5 h-5" />
              <span>{loading ? 'Menyimpan...' : 'Update Harga Tiket'}</span>
            </button>
            <button onClick={() => onNavigate('harga-list')} className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition">Batal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HargaEdit;
