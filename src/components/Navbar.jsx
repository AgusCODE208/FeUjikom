import React from 'react';
import { Film, LogIn, User, LogOut, Ticket } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';
import { authService } from '../services/endpoints/auth';

const Navbar = React.memo(({ setCurrentView }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const clearAuth = useAuthStore(state => state.clearAuth);
  const getRole = useAuthStore(state => state.getRole);
  const userRole = getRole();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Silent fail, tetap logout di frontend
    } finally {
      clearAuth();
      setCurrentView('home');
    }
  };

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <Film className="w-8 h-8 text-red-500" />
            <span className="text-xl font-bold">
              <span className="text-white">AMBA</span><span className="text-red-500">MAX</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setCurrentView('login')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-gray-300 hover:text-white"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition shadow-lg"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Register</span>
                </button>
              </>
            ) : (
              <>
                {(userRole === 'user' || userRole === 'admin') && (
                  <button
                    onClick={() => setCurrentView('myticket')}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition text-gray-300 hover:text-white"
                    title="My Tickets"
                  >
                    <Ticket className="w-5 h-5" />
                    <span className="hidden md:inline">My Tickets</span>
                  </button>
                )}
                
                {/* User Profile Dropdown */}
                <div className="flex items-center space-x-3">
                  <div className="hidden lg:flex flex-col items-end">
                    <span className="text-sm font-semibold text-white">{user?.name}</span>
                    <span className="text-xs text-gray-400">{user?.email}</span>
                  </div>
                  
                  <button
                    onClick={() => setCurrentView('profile')}
                    className="relative group"
                    title="Profile"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-red-500 transition-all">
                      {user?.photo ? (
                        <img 
                          src={`http://127.0.0.1:8000/storage/${user.photo}`} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition border border-red-600/20"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
