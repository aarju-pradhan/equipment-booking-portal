import React, { useContext } from 'react';
import { BookingContext } from '../../context/BookingContext';

function EquipmentCard({ item, isBookingsPage }) {
    const { addBooking, removeBooking, isBooked } = useContext(BookingContext);
    const alreadyBooked = isBooked(item.id);
    const canBook = item.status === 'Available' && !alreadyBooked;
    const badgeColor = item.status === 'Available' ? '#d1fae5' : '#fee2e2';
    const badgeTextColor = item.status === 'Available' ? '#065f46' : '#991b1b';

    return (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#111827' }}>{item.name}</h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                {item.type} | {item.category}
            </p>
            <p style={{ margin: '0 0 1.5rem 0', flexGrow: 1, color: '#374151' }}>
                {item.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    backgroundColor: badgeColor,
                    color: badgeTextColor
                }}>
                    {item.status}
                </span>

                {isBookingsPage ? (
                    <button
                        onClick={() => removeBooking(item.id)}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cancel Booking
                    </button>
                ) : (
                    <button
                        onClick={() => addBooking(item)}
                        style={{ padding: '0.5rem 1rem', backgroundColor: canBook ? '#2563eb' : '#9ca3af', color: 'white', border: 'none', borderRadius: '4px', cursor: canBook ? 'pointer' : 'not-allowed', opacity: canBook ? 1 : 0.5 }}
                        disabled={!canBook}
                    >
                        {alreadyBooked ? 'Booked' : 'Book Now'}
                    </button>
                )}

            </div>
        </div>
    );
}

export default EquipmentCard;