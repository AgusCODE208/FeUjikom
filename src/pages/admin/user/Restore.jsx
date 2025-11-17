import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import useUserStore from '../../../stores/useUserStore';

const UserRestore = ({ onNavigate }) => {
  const { users, fetchTrashed, restoreUser, forceDeleteUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrashed();
  }, []);

  const loadTrashed = async () => {
    try {
      setLoading(true);
      await fetchTrashed();
    } catch (error) {
      console.error('Error loading trashed users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id, name) => {
    if (window.confirm(`Restore user "${name}"?`)) {
      try {
        await restoreUser(id);
        alert('User berhasil direstore');
        loadTrashed();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal restore user');
      }
    }
  };

  const handleForceDelete = async (id, name) => {
    if (window.confirm(`HAPUS PERMANEN user "${name}"? Tindakan ini tidak dapat dibatalkan!`)) {
      try {
        await forceDeleteUser(id);
        alert('User berhasil dihapus permanen');
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus user');
      }
    }
  };

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
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">User yang Dihapus</h3>
        
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Tidak ada user yang dihapus
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Nama</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Dihapus</th>
                  <th className="text-right py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4 font-semibold">{user.name}</td>
                    <td className="py-3 px-4 text-gray-400">{user.email}</td>
                    <td className="py-3 px-4">{getRoleBadge(user.roles)}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {new Date(user.deleted_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleRestore(user.id, user.name)}
                          className="p-2 hover:bg-green-600 rounded-lg transition"
                          title="Restore"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleForceDelete(user.id, user.name)}
                          className="p-2 hover:bg-red-600 rounded-lg transition"
                          title="Hapus Permanen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRestore;
