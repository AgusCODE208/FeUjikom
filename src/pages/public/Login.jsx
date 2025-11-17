import React, { useState } from 'react';
import { Film, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService } from '../../services/endpoints/auth';
import useAuthStore from '../../stores/useAuthStore';
import { ROLE_ROUTES } from '../../constants/role';

const Login = ({ setCurrentView, previousView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        const { user, token } = response.data;
        setAuth(user, token);

        // Redirect berdasarkan role
        const userRole = user.roles[0];
        if (userRole === 'admin') {
          setCurrentView('admin');
        } else if (userRole === 'kasir') {
          setCurrentView('kasir');
        } else if (userRole === 'owner') {
          setCurrentView('owner');
        } else {
          // User biasa ke home
          setCurrentView('home');
        }
      } else {
        setError(response.message || 'Login gagal');
      }
    } catch (err) {
      // Handle validation errors (422)
      if (err.response?.status === 422) {
        const errors = err.response?.data?.errors;
        if (errors?.email) {
          setError(errors.email[0]);
        } else {
          setError('Email atau password salah');
        }
      } else if (err.response?.status === 403) {
        setError(err.response?.data?.message || 'Akun Anda tidak aktif');
      } else {
        const errorMsg = err.response?.data?.message || 'Email atau password salah';
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <Film className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Login to book your tickets</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-red-500 focus:outline-none pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentView('register')}
            className="text-red-500 hover:text-red-400 font-semibold"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
