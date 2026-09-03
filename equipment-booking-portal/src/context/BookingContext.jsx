import React, { createContext, useEffect, useState } from 'react';

export const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [bookings, setBookings] = useState(() => {
        const savedData = localStorage.getItem('portal_bookings');
        return savedData ? JSON.parse(savedData) : [];
    });

    const [toast, setToast] = useState(null);

    useEffect(() => {
        localStorage.setItem('portal_bookings', JSON.stringify(bookings));
    }, [bookings]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        window.setTimeout(() => setToast(null), 3200);
    };

    const isBooked = (itemId, date) => {
        return bookings.some((item) => item.id === itemId && item.date === date);
    };

    const addBooking = (item) => {
        if (!item.date) {
            showToast('Choose a date before booking.', 'error');
            return false;
        }

        if (isBooked(item.id, item.date)) {
            showToast(`${item.name} is already booked for ${item.date}.`, 'error');
            return false;
        }

        setBookings((prevBookings) => [...prevBookings, item]);
        showToast(`Booked ${item.name} for ${item.date}.`);
        return true;
    };

    const removeBooking = (itemId, date) => {
        setBookings((prevBookings) => prevBookings.filter((item) => !(item.id === itemId && item.date === date)));
        showToast('Booking cancelled.');
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, removeBooking, isBooked, toast }}>
            {children}
        </BookingContext.Provider>
    );
}
