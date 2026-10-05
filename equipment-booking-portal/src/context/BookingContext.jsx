import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { AuthContext } from './AuthContext.jsx';

export const BookingContext = createContext();

export function BookingProvider({ children }) {
    const { isLoggedIn } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        window.setTimeout(() => setToast(null), 3200);
    }, []);

    const refreshBookings = useCallback(async () => {
        if (!isLoggedIn) {
            setBookings([]);
            return [];
        }
        const data = await apiRequest('/bookings');
        setBookings(data);
        return data;
    }, [isLoggedIn]);

    useEffect(() => {
        refreshBookings().catch((err) => {
            showToast(err.message, 'error');
        });
    }, [refreshBookings, showToast]);

    const isBooked = (itemId, date) => {
        return bookings.some((item) => item.id === itemId && item.date === date);
    };

    const addBooking = async (item) => {
        if (!item.date) {
            showToast('Choose a date before booking.', 'error');
            return false;
        }

        try {
            const created = await apiRequest('/bookings', {
                method: 'POST',
                body: JSON.stringify({ id: item.id, date: item.date })
            });
            setBookings((prev) => [...prev, created]);
            showToast(`Booked ${created.name} for ${created.date}.`);
            return true;
        } catch (err) {
            showToast(err.message, 'error');
            return false;
        }
    };

    const removeBooking = async (bookingId) => {
        try {
            await apiRequest(`/bookings/${bookingId}`, { method: 'DELETE' });
            setBookings((prev) => prev.filter((item) => item.bookingId !== bookingId));
            showToast('Booking cancelled.');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    return (
        <BookingContext.Provider value={{
            bookings,
            addBooking,
            removeBooking,
            isBooked,
            refreshBookings,
            toast
        }}>
            {children}
        </BookingContext.Provider>
    );
}
