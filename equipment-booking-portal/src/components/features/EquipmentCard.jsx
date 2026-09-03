import React, { useContext, useState } from 'react';
import { BookingContext } from '../../context/BookingContext';

function EquipmentCard({ item, isBookingsPage }) {
    const { bookings, addBooking, removeBooking, isBooked } = useContext(BookingContext);
    const [selectedDate, setSelectedDate] = useState('');
    const today = new Date().toISOString().split('T')[0];

    let displayStatus = 'Select Date';
    let badgeColor = '#f3f4f6';
    let badgeTextColor = '#6b7280';

    const alreadyBookedForSelected = selectedDate ? isBooked(item.id, selectedDate) : false;

    //If it's broken in the database, lock it permanently
    if (item.status === 'Maintenance') {
        displayStatus = 'Maintenance';
        badgeColor = '#fee2e2';
        badgeTextColor = '#991b1b';
    }
    //If a date is chosen, check if it's already in the vault for that day
    else if (selectedDate) {
        if (alreadyBookedForSelected) {
            displayStatus = 'Already Booked';
            badgeColor = '#fee2e2'; // Red
            badgeTextColor = '#991b1b';
        } else {
            displayStatus = 'Available';
            badgeColor = '#d1fae5'; // Green
            badgeTextColor = '#065f46';
        }
    }

    const canBook = selectedDate !== '' && displayStatus === 'Available';

    return (
        <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#111827' }}>{item.name}</h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                {item.type} | {item.category}
            </p>
            <p style={{ margin: '0 0 1.5rem 0', flexGrow: 1, color: '#374151' }}>
                {item.description}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
                {isBookingsPage ? (
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#4b5563' }}>
                        Booked for: {item.date}
                    </p>
                ) : (
                    <input
                        type="date"
                        min={today}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                    />
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                {isBookingsPage ? (
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold', backgroundColor: '#d1fae5', color: '#065f46' }}>
                        Confirmed
                    </span>
                ) : (
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold', backgroundColor: badgeColor, color: badgeTextColor }}>
                        {displayStatus}
                    </span>
                )}

                {isBookingsPage ? (
                    <button
                        onClick={() => removeBooking(item.id, item.date)}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cancel Booking
                    </button>
                ) : (
                    <button
                        onClick={() => addBooking({ ...item, date: selectedDate })}
                        style={{ padding: '0.5rem 1rem', backgroundColor: canBook ? '#2563eb' : '#9ca3af', color: 'white', border: 'none', borderRadius: '4px', cursor: canBook ? 'pointer' : 'not-allowed', opacity: canBook ? 1 : 0.5 }}
                        disabled={!canBook}
                    >
                        {alreadyBookedForSelected ? 'Booked' : 'Book Now'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default EquipmentCard;
