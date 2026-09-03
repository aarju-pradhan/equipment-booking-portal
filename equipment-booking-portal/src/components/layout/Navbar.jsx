import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Navbar() {
    const { logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="site-header">
            <a className="skip-link" href="#main-content">Skip to main content</a>
            <nav className="nav-bar" aria-label="Main">
                <NavLink to="/" className="brand" onClick={closeMenu}>
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGTrFZExGdzuMjItxAx97A0XmvoV9ifSjVUYc0DemYLM18SZg8iWCL0Lb_&s=10"
                        alt="CIHE logo"
                        width="40"
                        height="40"
                    />
                    <h1>University Booking Portal</h1>
                </NavLink>

                <button
                    type="button"
                    className="nav-toggle"
                    aria-expanded={menuOpen}
                    aria-controls="site-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? 'Close' : 'Menu'}
                </button>

                <div id="site-navigation" className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
                    <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
                    <NavLink to="/catalog" onClick={closeMenu}>Catalog</NavLink>
                    <NavLink to="/bookings" onClick={closeMenu}>My Bookings</NavLink>
                    <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
                    <button type="button" className="btn btn-ghost" onClick={() => { closeMenu(); logout(); }}>
                        Log out
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
