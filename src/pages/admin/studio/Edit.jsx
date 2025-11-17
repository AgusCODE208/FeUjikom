import React, { useState } from 'react';
import { Save } from 'lucide-react';
import useStudioStore from '../../../stores/useStudioStore';

const StudioEdit = ({ onNavigate, selectedStudio }) => {
  const { editStudio } = useStudioStore();
  const [formData, setFormData] = useState({
    nama_studio: selectedStudio?.nama_studio || '',
    tipe: selectedStudio?.tipe || 'reguler',
    kapasitas: selectedStudio?.kapasitas || 100,
    rows: selectedStudio?.layout_rows || 10,
    cols: selectedStudio?.layout_cols || 10,
    status: selectedStudio?.status || 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nama_studio) {
      alert('Nama studio harus diisi!');
      return;
    }

    const layoutChanged = 
      formData.rows !== selectedStudio.layout_rows || 
      formData.cols !== selectedStudio.layout_cols;

    try {
      const payload = {
        nama_studio: formData.nama_studio,
        tipe: formData.tipe,
        kapasitas: parseInt(formData.kapasitas),
        layout_rows: parseInt(formData.rows),
        layout_cols: parseInt(formData.cols),
        status: formData.status
      };

      await editStudio(selectedStudio.id, payload);
      
      if (layoutChanged) {
        alert('Studio berhasil diupdate dan kursi di-regenerate otomatis!');
      } else {
        alert('Studio berhasil diupdate!');
      }
      
      onNavigate('studio-list');
    } catch (error) {
      console.error('Error updating studio:', error);
      alert(error.response?.data?.message || 'Gagal mengupdate studio');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Studio</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nama Studio</label>
            <input
              type="text"
              value={formData.nama_studio}
              onChange={(e) => setFormData({...formData, nama_studio: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipe Studio</label>
              <select
                value={formData.tipe}
                onChange={(e) => setFormData({...formData, tipe: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="reguler">Reguler</option>
                <option value="vip">VIP</option>
                <option value="imax">IMAX</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="active">Aktif</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kapasitas Total Kursi</label>
            <input
              type="number"
              min="1"
              value={formData.kapasitas}
              onChange={(e) => setFormData({...formData, kapasitas: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Layout Kursi</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Jumlah Baris</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.rows}
                  onChange={(e) => setFormData({...formData, rows: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Jumlah Kolom</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.cols}
                  onChange={(e) => setFormData({...formData, cols: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Total layout: {formData.rows} x {formData.cols} = {formData.rows * formData.cols} kursi
            </p>
            {selectedStudio && (formData.rows != selectedStudio.layout_rows || formData.cols != selectedStudio.layout_cols) && (
              <div className="mt-2 bg-yellow-900 border border-yellow-700 rounded p-2">
                <p className="text-xs text-yellow-200">
                  ⚠️ Layout berubah! Kursi akan di-regenerate setelah update.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
            >
              <Save className="w-5 h-5" />
              <span>Update Studio</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('studio-list')}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudioEdit;
