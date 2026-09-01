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

    // Function to check if an item is already booked
    const isBooked = (itemId) => {
        return bookings.some((item) => item.id === itemId);
    };

    // Function to add a new booking
    const addBooking = (item) => {
        if (!isBooked(item.id)) {
            setBookings((prevBookings) => [...prevBookings, item]);
            alert(`Successfully booked: ${item.name}`);
        } else {
            alert(`Failed to book: ${item.name}. It is already in your bookings.`);
        }
    };

    // Function to remove a booking
    const removeBooking = (itemId) => {
        setBookings(bookings.filter((item) => item.id !== itemId));
    };

    // Provide the state and functions to the rest of the app
    return (
        <BookingContext.Provider value={{ bookings, addBooking, removeBooking, isBooked }}>
            {children}
        </BookingContext.Provider>
    );
}

