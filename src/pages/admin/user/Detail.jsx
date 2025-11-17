import React from 'react';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Shield, CheckCircle, XCircle } from 'lucide-react';

const UserDetail = ({ onNavigate, selectedData }) => {
  if (!selectedData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Data user tidak ditemukan</p>
        <button
          onClick={() => onNavigate('user-list')}
          className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          Kembali
        </button>
      </div>
    );
  }

  const getRoleBadge = (roles) => {
    const role = roles[0] || 'user';
    const colors = {
      admin: 'bg-red-600',
      kasir: 'bg-blue-600',
      owner: 'bg-purple-600',
      user: 'bg-green-600'
    };
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${colors[role]}`}>{role}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('user-list')}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <button
          onClick={() => onNavigate('user-edit', selectedData)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          <Edit className="w-5 h-5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{selectedData.name}</h2>
            <div className="flex items-center gap-3">
              {getRoleBadge(selectedData.roles)}
              {selectedData.status === 'active' ? (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Aktif
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gray-600">
                  <XCircle className="w-4 h-4" />
                  Nonaktif
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-semibold">{selectedData.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="font-semibold">{selectedData.phone || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Role</p>
                <p className="font-semibold capitalize">{selectedData.roles[0] || 'user'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Alamat</p>
                <p className="font-semibold">{selectedData.alamat || '-'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Terdaftar</p>
              <p className="font-semibold">
                {new Date(selectedData.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
