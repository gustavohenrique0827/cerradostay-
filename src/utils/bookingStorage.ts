import { BookingRequest } from '../types';

const STORAGE_KEY = 'cerrado_stays_user_bookings_prod_v1';

export const getSavedBookings = (): BookingRequest[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading bookings from localStorage', error);
    return [];
  }
};

export const saveBooking = (booking: BookingRequest): void => {
  try {
    const existing = getSavedBookings();
    const filtered = existing.filter((b) => b.id !== booking.id);
    const updated = [booking, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving booking to localStorage', error);
  }
};

export const updateBookingStatus = (id: string, status: BookingRequest['status']): void => {
  try {
    const existing = getSavedBookings();
    const updated = existing.map((b) => {
      if (b.id === id) {
        return {
          ...b,
          status,
          payment: b.payment ? { ...b.payment, status: status === 'paid' ? 'paid' : b.payment.status } : undefined,
        };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating booking in localStorage', error);
  }
};

export const findBookingByCode = (code: string): BookingRequest | null => {
  const normalized = code.trim().toUpperCase();
  const userBookings = getSavedBookings();
  return userBookings.find((b) => b.id?.toUpperCase() === normalized) || null;
};

