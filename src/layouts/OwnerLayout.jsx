import React, { useState } from 'react';
import { 
  LayoutDashboard, BarChart3, User,
  ChevronLeft, Menu, LogOut, Film
} from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';
import { authService } from '../services/endpoints/auth';
import Dashboard from '../pages/owner/Dashboard';
import LaporanPenjualan from '../pages/owner/laporan/penjualan';
import OwnerProfile from '../pages/owner/Profile';

const OwnerLayout = ({ onLogout }) => {
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      try {
        await authService.logout();
      } catch (err) {
        // Silent fail
      } finally {
        useAuthStore.getState().clearAuth();
        onLogout();
      }
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'penjualan', label: 'Laporan Penjualan', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Overlay for mobile */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`bg-gray-800 transition-all duration-300 fixed lg:relative h-screen z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } w-64 flex flex-col overflow-hidden`}>
        {/* Sidebar Header - Fixed */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700 bg-gray-800 shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <Film className="w-8 h-8 text-red-500 shrink-0" />
            <span className="text-xl font-bold whitespace-nowrap">
              Owner Panel
            </span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition shrink-0"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={`menu-${item.id}`}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  currentPage === item.id ? 'bg-red-600' : 'hover:bg-gray-700'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer - Fixed */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 px-4 sm:px-8 py-4 flex items-center justify-between border-b border-gray-700 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition mr-2"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
              {currentPage === 'dashboard' && 'Dashboard Overview'}
              {currentPage === 'penjualan' && 'Laporan Penjualan'}
              {currentPage === 'profile' && 'My Profile'}
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">Welcome back, Owner!</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-right hidden sm:block">
              <div className="font-semibold text-sm">{user?.name || 'Owner'}</div>
              <div className="text-xs text-gray-400">{user?.email || 'owner@cinema.com'}</div>
            </div>
            <button
              onClick={() => handleNavigate('profile')}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-600 hover:border-red-500 transition-all cursor-pointer"
              title="View Profile"
            >
              {user?.photo ? (
                <img 
                  src={`http://127.0.0.1:8000/storage/${user.photo}`} 
                  alt={user?.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-red-600 flex items-center justify-center font-bold text-sm sm:text-base">
                  {user?.name?.charAt(0).toUpperCase() || 'O'}
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {currentPage === 'penjualan' && <LaporanPenjualan />}
          {currentPage === 'profile' && <OwnerProfile onNavigate={handleNavigate} />}
        </div>
      </main>
    </div>
  );
};

export default OwnerLayout;
