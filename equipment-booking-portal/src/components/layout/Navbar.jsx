import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Navbar() {
    const { logout } = useContext(AuthContext);

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGTrFZExGdzuMjItxAx97A0XmvoV9ifSjVUYc0DemYLM18SZg8iWCL0Lb_&s=10"
                    alt="Portal Logo"
                    style={{ height: '40px', borderRadius: '4px' }}
                />
                <h2 style={{ margin: 0, color: '#111827', fontSize: '1.25rem' }}>University Booking Portal</h2>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>Home</Link>
                <Link to="/catalog" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>Catalog</Link>
                <Link to="/bookings" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>My Bookings</Link>
                <Link to="/profile" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>Profile</Link>

                <button
                    onClick={logout}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', padding: 0, fontSize: '1rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center' }}
                >
                    Log Out
                </button>
            </div>

        </nav>
    );
}

export default Navbar;





