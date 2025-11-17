import { create } from 'zustand';

const useBookingStore = create((set) => ({
  selectedFilm: null,
  selectedJadwal: null,
  selectedSeats: [],
  bookingData: null,

  setSelectedFilm: (film) => set({ selectedFilm: film }),
  setSelectedJadwal: (jadwal) => set({ selectedJadwal: jadwal }),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  setBookingData: (data) => set({ bookingData: data }),

  clearBooking: () => set({
    selectedFilm: null,
    selectedJadwal: null,
    selectedSeats: [],
    bookingData: null
  })
}));

export default useBookingStore;
