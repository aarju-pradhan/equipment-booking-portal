import React, { useContext, useState } from 'react';
import { BookingContext } from '../../context/BookingContext';

function EquipmentCard({ item, isBookingsPage }) {
    const { addBooking, removeBooking, isBooked } = useContext(BookingContext);
    const [selectedDate, setSelectedDate] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const dateFieldId = `date-${item.id}`;

    const alreadyBookedForSelected = selectedDate ? isBooked(item.id, selectedDate) : false;

    let displayStatus = 'Select a date';
    let badgeClass = 'badge badge-warn';

    if (item.status === 'Maintenance') {
        displayStatus = 'Maintenance';
        badgeClass = 'badge badge-bad';
    } else if (selectedDate) {
        if (alreadyBookedForSelected) {
            displayStatus = 'Already booked';
            badgeClass = 'badge badge-bad';
        } else {
            displayStatus = 'Available';
            badgeClass = 'badge badge-ok';
        }
    }

    const canBook = selectedDate !== '' && displayStatus === 'Available';

    return (
        <article className="equip-card">
            {item.image && (
                <img src={item.image} alt="" />
            )}
            <h3>{item.name}</h3>
            <p className="muted">{item.type} | {item.category}</p>
            <p>{item.description}</p>

            <div>
                {isBookingsPage ? (
                    <p><strong>Booked for:</strong> {item.date}</p>
                ) : (
                    <div className="form-field">
                        <label htmlFor={dateFieldId}>Reservation date</label>
                        <input
                            id={dateFieldId}
                            className="text-input"
                            type="date"
                            min={today}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            disabled={item.status === 'Maintenance'}
                        />
                    </div>
                )}
            </div>

            <div className="card-actions">
                {isBookingsPage ? (
                    <span className="badge badge-ok">Confirmed</span>
                ) : (
                    <span className={badgeClass}>{displayStatus}</span>
                )}

                {isBookingsPage ? (
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeBooking(item.id, item.date)}
                    >
                        Cancel booking
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => addBooking({ ...item, date: selectedDate })}
                        disabled={!canBook}
                    >
                        {alreadyBookedForSelected ? 'Booked' : 'Book now'}
                    </button>
                )}
            </div>
        </article>
    );
}

export default EquipmentCard;
