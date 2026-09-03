import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import EquipmentCard from '../components/features/EquipmentCard';

function Bookings() {
    const { bookings } = useContext(BookingContext);

    return (
        <main id="main-content" className="page">
            <h1>My bookings</h1>

            {bookings.length === 0 ? (
                <div className="empty-state">
                    <p>You have no bookings yet.</p>
                    <p>
                        Go to the <Link to="/catalog">catalog</Link> to make a booking.
                    </p>
                </div>
            ) : (
                <div className="card-grid">
                    {bookings.map((booking) => (
                        <EquipmentCard
                            key={`${booking.id}-${booking.date}`}
                            item={booking}
                            isBookingsPage
                        />
                    ))}
                </div>
            )}
        </main>
    );
}

export default Bookings;
