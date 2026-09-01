import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ margin: 0, color: '#111827' }}>University Booking Portal</h2>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                {/* Replace <a> tags with <Link> components */}
                <Link to="/" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500' }}>Home</Link>
                <Link to="/catalog" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500' }}>Catalog</Link>
                <Link to="/bookings" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500' }}>My Bookings</Link>
            </div>
        </nav>
    );
}

export default Navbar;
