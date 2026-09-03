import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <main style={{ padding: '0', fontFamily: 'sans-serif' }}>

            {/* Hero Section with Background Image */}
            <section style={{
                backgroundImage: 'linear-gradient(rgba(17, 24, 39, 0.75), rgba(17, 24, 39, 0.75)), url("https://www.cihe.edu.au/wp-content/uploads/2026/04/Screenshot-2026-04-09-at-1.37.12-pm.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                padding: '8rem 2rem',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>University Booking Portal</h1>
                <p style={{ fontSize: '1.25rem', color: '#e5e7eb', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: '1.6', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    Reserve high-performance workstations, collaborative study rooms, and technical equipment for your academic projects.
                </p>
                <Link to="/catalog" style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                        Browse Catalog
                    </button>
                </Link>
            </section>

            {/* Features Section */}
            <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: '#374151', fontSize: '2rem' }}>How It Works</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🖥️</div>
                        <h3 style={{ color: '#111827', marginBottom: '1rem' }}>Find Equipment</h3>
                        <p style={{ color: '#6b7280', lineHeight: '1.5' }}>Search and filter through our extensive catalog of IT hardware and dedicated study spaces.</p>
                    </div>

                    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
                        <h3 style={{ color: '#111827', marginBottom: '1rem' }}>Book Instantly</h3>
                        <p style={{ color: '#6b7280', lineHeight: '1.5' }}>Select your required dates and instantly secure your reservation through our automated system.</p>
                    </div>

                    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
                        <h3 style={{ color: '#111827', marginBottom: '1rem' }}>Manage Activity</h3>
                        <p style={{ color: '#6b7280', lineHeight: '1.5' }}>Track your upcoming reservations, cancel bookings, and securely update your user profile.</p>
                    </div>

                </div>
            </section>

        </main>
    );
}

export default Home;
