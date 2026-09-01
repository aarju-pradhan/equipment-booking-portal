import React, { createContext, useState, useEffect} from 'react';

// Create a context for booking data
export const BookingContext = createContext();

// Create a provider component
export function BookingProvider({ children }) {
    const [bookings, setBookings] = useState(() => {
        const savedData = localStorage.getItem('portal_bookings');
        return savedData ? JSON.parse(savedData) : [];
    });

    useEffect(() => {
        localStorage.setItem('portal_bookings', JSON.stringify(bookings));
    }, [bookings]);

    // Function to check if an item is already booked on a specific date
    const isBooked = (itemId, date) => {
        return bookings.some((item) => item.id === itemId && item.date === date);
    };

    // Function to add a new booking
    const addBooking = (item) => {
        if (!isBooked(item.id, item.date)) {
            setBookings((prevBookings) => [...prevBookings, item]);
            alert(`Successfully booked: ${item.name} for ${item.date}`);
        } else {
            alert(`Failed to book: ${item.name}. It is already booked for ${item.date}.`);
        }
    };

    // Function to remove a booking
    const removeBooking = (itemId, date) => {
        setBookings((prevBookings) => prevBookings.filter((item) => !(item.id === itemId && item.date === date)));
    };

    // Provide the state and functions to the rest of the app
    return (
        <BookingContext.Provider value={{ bookings, addBooking, removeBooking, isBooked }}>
            {children}
        </BookingContext.Provider>
    );
}

