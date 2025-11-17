import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import FilmDetail from './pages/public/FilmDetail';
import PilihKursi from './pages/user/PilihKursi';
import Checkout from './pages/user/Checkout';
import MyTicket from './pages/user/MyTicket';
import Profile from './pages/user/Profile';
import AdminLayout from './layouts/AdminLayout';
import KasirLayout from './layouts/KasirLayout';
import OwnerLayout from './layouts/OwnerLayout';
import useAuthStore from './stores/useAuthStore';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [previousView, setPreviousView] = useState('home');
  const [selectedFilmId, setSelectedFilmId] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const { isAuthenticated, getRole } = useAuthStore();

  // Handle payment redirect from Midtrans
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const orderIdParam = urlParams.get('order_id');
    const transactionStatus = urlParams.get('transaction_status');
    
    if (paymentStatus === 'success' || (orderIdParam && transactionStatus === 'settlement')) {
      if (isAuthenticated) {
        setCurrentView('myticket');
      }
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isAuthenticated]);

  const handleViewChange = (view) => {
    setPreviousView(currentView);
    setCurrentView(view);
  };

  // Proteksi user pages untuk kasir dan owner (admin boleh akses)
  useEffect(() => {
    const userPages = ['home', 'profile', 'myticket', 'checkout', 'pilihkursi', 'filmdetail'];
    const role = getRole();
    
    if (userPages.includes(currentView) && role) {
      // Kasir dan Owner tidak boleh akses user pages
      if (role === 'kasir') {
        setCurrentView('kasir');
        window.history.pushState({}, '', '/kasir');
      } else if (role === 'owner') {
        setCurrentView('owner');
        window.history.pushState({}, '', '/owner');
      }
      // Admin boleh akses user pages (tidak di-redirect)
    }
  }, [currentView, getRole]);



  useEffect(() => {
    const path = window.location.pathname;
    const role = getRole();
    
    // Redirect ke panel yang sesuai dengan role
    if (path === '/admin') {
      if (role === 'admin') {
        setCurrentView('admin');
      } else {
        // Redirect ke panel role masing-masing
        if (role === 'kasir') {
          setCurrentView('kasir');
          window.history.pushState({}, '', '/kasir');
        } else if (role === 'owner') {
          setCurrentView('owner');
          window.history.pushState({}, '', '/owner');
        } else {
          setCurrentView('home');
          window.history.pushState({}, '', '/');
        }
      }
    } else if (path === '/kasir') {
      if (role === 'kasir') {
        setCurrentView('kasir');
      } else {
        // Redirect ke panel role masing-masing
        if (role === 'admin') {
          setCurrentView('admin');
          window.history.pushState({}, '', '/admin');
        } else if (role === 'owner') {
          setCurrentView('owner');
          window.history.pushState({}, '', '/owner');
        } else {
          setCurrentView('home');
          window.history.pushState({}, '', '/');
        }
      }
    } else if (path === '/owner') {
      if (role === 'owner') {
        setCurrentView('owner');
      } else {
        // Redirect ke panel role masing-masing
        if (role === 'admin') {
          setCurrentView('admin');
          window.history.pushState({}, '', '/admin');
        } else if (role === 'kasir') {
          setCurrentView('kasir');
          window.history.pushState({}, '', '/kasir');
        } else {
          setCurrentView('home');
          window.history.pushState({}, '', '/');
        }
      }
    }
  }, [getRole]);

  const handleAdminLogout = () => {
    setCurrentView('home');
    window.history.pushState({}, '', '/');
  };

  const handleKasirLogout = () => {
    setCurrentView('home');
    window.history.pushState({}, '', '/');
  };

  const handleOwnerLogout = () => {
    setCurrentView('home');
    window.history.pushState({}, '', '/');
  };

  // Proteksi akses berdasarkan role
  const userRole = getRole();
  
  if (currentView === 'admin') {
    if (userRole !== 'admin') {
      // Redirect ke panel role masing-masing
      setTimeout(() => {
        if (userRole === 'kasir') {
          setCurrentView('kasir');
          window.history.pushState({}, '', '/kasir');
        } else if (userRole === 'owner') {
          setCurrentView('owner');
          window.history.pushState({}, '', '/owner');
        } else {
          setCurrentView('home');
          window.history.pushState({}, '', '/');
        }
      }, 0);
      return null;
    }
    return <AdminLayout onLogout={handleAdminLogout} />;
  }

  if (currentView === 'kasir') {
    if (userRole !== 'kasir') {
      // Redirect ke panel role masing-masing
      setTimeout(() => {
        if (userRole === 'admin') {
          setCurrentView('admin');
          window.history.pushState({}, '', '/admin');
        } else if (userRole === 'owner') {
          setCurrentView('owner');
          window.history.pushState({}, '', '/owner');
        } else {
          setCurrentView('home');
          window.history.pushState({}, '', '/');
        }
      }, 0);
      return null;
    }
    return <KasirLayout onLogout={handleKasirLogout} />;
  }

  if (currentView === 'owner') {
    if (userRole !== 'owner') {
      // Redirect ke panel role masing-masing
      setTimeout(() => {
        if (userRole === 'admin') {
          setCurrentView('admin');
          window.history.pushState({}, '', '/admin');
        } else if (userRole === 'kasir') {
          setCurrentView('kasir');
          window.history.pushState({}, '', '/kasir');
        } else {
          setCurrentView('home');
          window.history.pushState({}, '', '/');
        }
      }, 0);
      return null;
    }
    return <OwnerLayout onLogout={handleOwnerLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {currentView !== 'filmdetail' && currentView !== 'pilihkursi' && currentView !== 'checkout' && currentView !== 'myticket' && currentView !== 'profile' && (
        <Navbar key={isAuthenticated ? 'auth' : 'guest'} setCurrentView={handleViewChange} />
      )}
      
      {currentView === 'home' && (!userRole || userRole === 'user' || userRole === 'admin') && <Home setCurrentView={handleViewChange} setSelectedFilmId={setSelectedFilmId} />}
      {currentView === 'login' && <Login setCurrentView={handleViewChange} previousView={previousView} />}
      {currentView === 'register' && <Register setCurrentView={handleViewChange} />}
      {currentView === 'filmdetail' && (!userRole || userRole === 'user' || userRole === 'admin') && <FilmDetail setCurrentView={handleViewChange} setBookingData={setBookingData} isLoggedIn={isAuthenticated} filmId={selectedFilmId} />}
      {currentView === 'pilihkursi' && bookingData && (userRole === 'user' || userRole === 'admin') && (
        <PilihKursi 
          setCurrentView={handleViewChange} 
          selectedJadwal={bookingData.selectedJadwal}
          selectedDate={bookingData.selectedDate}
          filmDetail={bookingData.filmDetail}
          setCheckoutData={setCheckoutData}
          bookedSeats={bookingData.bookedSeats || []}
        />
      )}
      {currentView === 'checkout' && checkoutData && isAuthenticated && (userRole === 'user' || userRole === 'admin') && (
        <Checkout 
          setCurrentView={handleViewChange}
          checkoutData={checkoutData}
          setBookedSeats={setBookedSeats}
          setUserTickets={setUserTickets}
        />
      )}
      {currentView === 'myticket' && isAuthenticated && (userRole === 'user' || userRole === 'admin') && (
        <MyTicket 
          setCurrentView={handleViewChange}
          userTickets={userTickets}
        />
      )}
      {currentView === 'profile' && isAuthenticated && (userRole === 'user' || userRole === 'admin') && (
        <Profile 
          setCurrentView={handleViewChange}
        />
      )}
    </div>
  );
}

export default App;
