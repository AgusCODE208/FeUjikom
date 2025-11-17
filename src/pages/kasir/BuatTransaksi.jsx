import React, { useState } from 'react';
import { User, Film, Armchair, CreditCard } from 'lucide-react';
import PilihFilmJadwal from './PilihFilmJadwal';
import PilihKursi from './PilihKursi';
import KonfirmasiPembayaran from './KonfirmasiPembayaran';

const BuatTransaksi = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const steps = [
    { number: 1, title: 'Info Customer', icon: User },
    { number: 2, title: 'Pilih Jadwal', icon: Film },
    { number: 3, title: 'Pilih Kursi', icon: Armchair },
    { number: 4, title: 'Pembayaran', icon: CreditCard }
  ];

  const handleCustomerSubmit = (data) => {
    setCustomerInfo(data);
    setStep(2);
  };

  const handleJadwalSelect = (film, jadwal, date) => {
    setSelectedFilm(film);
    setSelectedJadwal(jadwal);
    setSelectedDate(date);
    setStep(3);
  };

  const handleSeatsSelect = (seats) => {
    setSelectedSeats(seats);
    setStep(4);
  };

  const handlePaymentComplete = () => {
    setStep(1);
    setCustomerInfo(null);
    setSelectedFilm(null);
    setSelectedJadwal(null);
    setSelectedDate(null);
    setSelectedSeats([]);
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <React.Fragment key={`step-${s.number}`}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                    step === s.number ? 'bg-red-600' : step > s.number ? 'bg-green-600' : 'bg-gray-700'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    step === s.number ? 'text-white' : 'text-gray-400'
                  }`}>{s.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded transition ${
                    step > s.number ? 'bg-green-600' : 'bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && <CustomerInfoForm onSubmit={handleCustomerSubmit} />}
      {step === 2 && <PilihFilmJadwal onSelect={handleJadwalSelect} onBack={() => setStep(1)} />}
      {step === 3 && (
        <PilihKursi 
          filmDetail={selectedFilm}
          selectedJadwal={selectedJadwal}
          selectedDate={selectedDate}
          onSelect={handleSeatsSelect}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <KonfirmasiPembayaran
          customerInfo={customerInfo}
          filmDetail={selectedFilm}
          selectedJadwal={selectedJadwal}
          selectedDate={selectedDate}
          selectedSeats={selectedSeats}
          onComplete={handlePaymentComplete}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  );
};

const CustomerInfoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ nama: '', email: '', telepon: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Informasi Customer</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
          <input
            type="text"
            required
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Masukkan nama customer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="customer@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">No. Telepon</label>
          <input
            type="tel"
            required
            value={formData.telepon}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setFormData({ ...formData, telepon: value });
            }}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="08xxxxxxxxxx"
            pattern="[0-9]*"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
        >
          Lanjut ke Pilih Jadwal
        </button>
      </form>
    </div>
  );
};

export default BuatTransaksi;
