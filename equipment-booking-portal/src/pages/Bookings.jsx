import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext'; 
import EquipmentCard from '../components/features/EquipmentCard';

function Bookings() {

    //pull booking list from global vault
    const { bookings } = useContext(BookingContext);
    console.log("Current bookings in vault:", bookings);

    return (
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', color: '#111827' }}>My Bookings</h1>

            {/*when no bookings*/ }
            {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                    <p>You have no bookings yet!</p>
                    <p>Go to the <Link to="/catalog" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Catalog</Link> to make a booking.</p>  
                </div>
            ) : (

            //display bookings in a grid
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {bookings.map((booking) => (
                            <EquipmentCard key={booking.id} item={booking} isBookingsPage={true} /> 
                        ))}
                </div>
            )
            }
        </main>
    );
}

export default Bookings;
