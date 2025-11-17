import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-react';
import useUserStore from '../../../stores/useUserStore';

const UserList = ({ onNavigate }) => {
  const { users, statistics, fetchUsers, fetchStatistics, deleteUser } = useUserStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await fetchUsers();
      await fetchStatistics();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Hapus user "${name}"?`)) {
      try {
        await deleteUser(id);
        alert('User berhasil dihapus');
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus user');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                       user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || user.roles.includes(roleFilter);
    const matchStatus = !statusFilter || user.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const getRoleBadge = (roles) => {
    const role = roles[0] || 'user';
    const colors = {
      admin: 'bg-red-600',
      kasir: 'bg-blue-600',
      owner: 'bg-purple-600',
      user: 'bg-green-600'
    };
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[role]}`}>{role}</span>;
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-600">Aktif</span>
    ) : (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-600">Nonaktif</span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manage Users</h2>
          <p className="text-gray-400 text-sm">Kelola data pengguna sistem</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('user-restore')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            <Trash2 className="w-5 h-5" />
            <span>Trash</span>
          </button>
          <button
            onClick={() => onNavigate('user-tambah')}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      {statistics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-sm">Total</h3>
            </div>
            <p className="text-2xl font-bold">{statistics.total}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">Admin</h3>
            <p className="text-2xl font-bold text-red-500">{statistics.by_role.admin}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">Kasir</h3>
            <p className="text-2xl font-bold text-blue-500">{statistics.by_role.kasir}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">User</h3>
            <p className="text-2xl font-bold text-green-500">{statistics.by_role.user}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="kasir">Kasir</option>
            <option value="owner">Owner</option>
            <option value="user">User</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-red-500 focus:outline-none"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Nama</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Phone</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    Tidak ada data user
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4 font-semibold">{user.name}</td>
                    <td className="py-3 px-4 text-gray-400">{user.email}</td>
                    <td className="py-3 px-4 text-gray-400">{user.phone || '-'}</td>
                    <td className="py-3 px-4">{getRoleBadge(user.roles)}</td>
                    <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onNavigate('user-detail', user)}
                          className="p-2 hover:bg-gray-600 rounded-lg transition"
                          title="Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onNavigate('user-edit', user)}
                          className="p-2 hover:bg-blue-600 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-2 hover:bg-red-600 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
