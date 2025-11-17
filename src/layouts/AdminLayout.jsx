import React, { useState } from 'react';
import { Film, Users, Calendar, DollarSign, Ticket, LayoutDashboard, Armchair, LogOut, Menu, ChevronLeft } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';
import { authService } from '../services/endpoints/auth';
import Dashboard from '../pages/admin/Dashboard';
import FilmList from '../pages/admin/film/List';
import FilmTambah from '../pages/admin/film/Tambah';
import FilmEdit from '../pages/admin/film/Edit';
import FilmDetail from '../pages/admin/film/Detail';
import FilmRestore from '../pages/admin/film/Restore';
import UserList from '../pages/admin/user/List';
import UserTambah from '../pages/admin/user/Tambah';
import UserEdit from '../pages/admin/user/Edit';
import UserDetail from '../pages/admin/user/Detail';
import UserRestore from '../pages/admin/user/Restore';
import StudioList from '../pages/admin/studio/List';
import StudioTambah from '../pages/admin/studio/Tambah';
import StudioEdit from '../pages/admin/studio/Edit';
import StudioDetail from '../pages/admin/studio/Detail';
import StudioRestore from '../pages/admin/studio/Restore';
import JadwalList from '../pages/admin/jadwal/List';
import JadwalTambah from '../pages/admin/jadwal/Tambah';
import JadwalEdit from '../pages/admin/jadwal/Edit';
import JadwalDetail from '../pages/admin/jadwal/Detail';
import JadwalRestore from '../pages/admin/jadwal/Restore';
import HargaList from '../pages/admin/harga/List';
import HargaTambah from '../pages/admin/harga/Tambah';
import HargaEdit from '../pages/admin/harga/Edit';
import HargaDetail from '../pages/admin/harga/Detail';
import HargaRestore from '../pages/admin/harga/Restore';
import TransaksiList from '../pages/admin/transaksi/List';
import TransaksiDetail from '../pages/admin/transaksi/Detail';
import AdminProfile from '../pages/admin/Profile';

const AdminLayout = ({ onLogout }) => {
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState(null);

  const handleNavigate = (page, data = null) => {
    setCurrentPage(page);
    if (data) setSelectedFilm(data);
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
      } ${
        sidebarOpen ? 'w-64' : 'w-64 lg:w-20'
      } flex flex-col overflow-hidden`}>
        {/* Sidebar Header - Fixed */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700 bg-gray-800 shrink-0">
          <div className="flex items-center space-x-2 min-w-0">
            <Film className="w-8 h-8 text-red-500 shrink-0" />
            <span className={`text-xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:opacity-100 lg:w-0'
            }`}>
              Admin Panel
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
          
          {/* Toggle button for desktop */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block p-2 hover:bg-gray-700 rounded-lg transition shrink-0"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg transition ${
              currentPage === 'dashboard' ? 'bg-red-600' : 'hover:bg-gray-700'
            }`}
            title="Dashboard"
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>Dashboard</span>
          </button>

          {/* URUTAN SESUAI ALUR SETUP */}
          <button
            onClick={() => handleNavigate('harga-list')}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg transition ${
              currentPage.startsWith('harga') ? 'bg-red-600' : 'hover:bg-gray-700'
            }`}
            title="Harga Tiket"
          >
            <DollarSign className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>Harga Tiket</span>
          </button>

          <button
            onClick={() => handleNavigate('studio-list')}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg transition ${
              currentPage.startsWith('studio') ? 'bg-red-600' : 'hover:bg-gray-700'
            }`}
            title="Studio & Kursi"
          >
            <Armchair className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>Studio & Kursi</span>
          </button>

          <button
            onClick={() => handleNavigate('film-list')}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg transition ${
              currentPage.startsWith('film') ? 'bg-red-600' : 'hover:bg-gray-700'
            }`}
            title="Film"
          >
            <Film className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>Film</span>
          </button>

          <button
            onClick={() => handleNavigate('jadwal-list')}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg transition ${
              currentPage.startsWith('jadwal') ? 'bg-red-600' : 'hover:bg-gray-700'
            }`}
            title="Jadwal Film"
          >
            <Calendar className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>Jadwal Film</span>
          </button>

          <div className="border-t border-gray-700 my-2"></div>

          <button 
            onClick={() => handleNavigate('transaksi-list')}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg transition ${
              currentPage.startsWith('transaksi') ? 'bg-red-600' : 'hover:bg-gray-700'
            }`}
            title="Transaksi"
          >
            <Ticket className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>Transaksi</span>
          </button>

          <button
            onClick={() => handleNavigate('user-list')}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg transition ${
              currentPage.startsWith('user') ? 'bg-red-600' : 'hover:bg-gray-700'
            }`}
            title="User"
          >
            <Users className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>User</span>
          </button>
        </nav>

        {/* Sidebar Footer - Fixed */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg hover:bg-red-600 transition`}
            title="Logout"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Header - Sticky */}
        <header className="bg-gray-800 px-4 sm:px-8 py-4 flex items-center justify-between border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
              {currentPage === 'dashboard' && 'Dashboard'}
              {currentPage === 'film-list' && 'Manajemen Film'}
              {currentPage === 'film-tambah' && 'Tambah Film Baru'}
              {currentPage === 'film-edit' && 'Edit Film'}
              {currentPage === 'film-detail' && 'Detail Film'}
              {currentPage === 'film-restore' && 'Restore Film'}
              {currentPage === 'user-list' && 'Manajemen User'}
              {currentPage === 'user-tambah' && 'Tambah User Baru'}
              {currentPage === 'user-edit' && 'Edit User'}
              {currentPage === 'user-detail' && 'Detail User'}
              {currentPage === 'user-restore' && 'Restore User'}
              {currentPage === 'studio-list' && 'Manajemen Studio'}
              {currentPage === 'studio-tambah' && 'Tambah Studio Baru'}
              {currentPage === 'studio-edit' && 'Edit Studio'}
              {currentPage === 'studio-detail' && 'Detail Studio'}
              {currentPage === 'studio-restore' && 'Restore Studio'}
              {currentPage === 'jadwal-list' && 'Manajemen Jadwal Film'}
              {currentPage === 'jadwal-tambah' && 'Tambah Jadwal Baru'}
              {currentPage === 'jadwal-edit' && 'Edit Jadwal'}
              {currentPage === 'jadwal-detail' && 'Detail Jadwal'}
              {currentPage === 'jadwal-restore' && 'Restore Jadwal'}
              {currentPage === 'harga-list' && 'Manajemen Harga Tiket'}
              {currentPage === 'harga-tambah' && 'Tambah Harga Baru'}
              {currentPage === 'harga-edit' && 'Edit Harga'}
              {currentPage === 'harga-detail' && 'Detail Harga'}
              {currentPage === 'harga-restore' && 'Restore Harga'}
              {currentPage === 'transaksi-list' && 'Manajemen Transaksi'}
              {currentPage === 'transaksi-detail' && 'Detail Transaksi'}
              {currentPage === 'profile' && 'My Profile'}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">Welcome back, Admin!</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-right hidden sm:block">
              <div className="font-semibold text-sm">{user?.name || 'Admin'}</div>
              <div className="text-xs text-gray-400">{user?.email || 'admin@cinema.com'}</div>
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
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {currentPage === 'film-list' && <FilmList onNavigate={handleNavigate} />}
          {currentPage === 'film-tambah' && <FilmTambah onNavigate={handleNavigate} />}
          {currentPage === 'film-edit' && <FilmEdit onNavigate={handleNavigate} selectedFilm={selectedFilm} />}
          {currentPage === 'film-detail' && <FilmDetail onNavigate={handleNavigate} selectedFilm={selectedFilm} />}
          {currentPage === 'film-restore' && <FilmRestore onNavigate={handleNavigate} />}
          {currentPage === 'user-list' && <UserList onNavigate={handleNavigate} />}
          {currentPage === 'user-tambah' && <UserTambah onNavigate={handleNavigate} />}
          {currentPage === 'user-edit' && <UserEdit onNavigate={handleNavigate} selectedData={selectedFilm} />}
          {currentPage === 'user-detail' && <UserDetail onNavigate={handleNavigate} selectedData={selectedFilm} />}
          {currentPage === 'user-restore' && <UserRestore onNavigate={handleNavigate} />}
          {currentPage === 'studio-list' && <StudioList onNavigate={handleNavigate} />}
          {currentPage === 'studio-tambah' && <StudioTambah onNavigate={handleNavigate} />}
          {currentPage === 'studio-edit' && <StudioEdit onNavigate={handleNavigate} selectedStudio={selectedFilm} />}
          {currentPage === 'studio-detail' && <StudioDetail onNavigate={handleNavigate} selectedStudio={selectedFilm} />}
          {currentPage === 'studio-restore' && <StudioRestore onNavigate={handleNavigate} />}
          {currentPage === 'jadwal-list' && <JadwalList onNavigate={handleNavigate} />}
          {currentPage === 'jadwal-tambah' && <JadwalTambah onNavigate={handleNavigate} />}
          {currentPage === 'jadwal-edit' && <JadwalEdit onNavigate={handleNavigate} selectedJadwal={selectedFilm} />}
          {currentPage === 'jadwal-detail' && <JadwalDetail onNavigate={handleNavigate} selectedJadwal={selectedFilm} />}
          {currentPage === 'jadwal-restore' && <JadwalRestore onNavigate={handleNavigate} />}
          {currentPage === 'harga-list' && <HargaList onNavigate={handleNavigate} />}
          {currentPage === 'harga-tambah' && <HargaTambah onNavigate={handleNavigate} />}
          {currentPage === 'harga-edit' && <HargaEdit onNavigate={handleNavigate} selectedHarga={selectedFilm} />}
          {currentPage === 'harga-detail' && <HargaDetail onNavigate={handleNavigate} selectedHarga={selectedFilm} />}
          {currentPage === 'harga-restore' && <HargaRestore onNavigate={handleNavigate} />}
          {currentPage === 'transaksi-list' && <TransaksiList onNavigate={handleNavigate} />}
          {currentPage === 'transaksi-detail' && <TransaksiDetail onNavigate={handleNavigate} selectedData={selectedFilm} />}
          {currentPage === 'profile' && <AdminProfile onNavigate={handleNavigate} />}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
