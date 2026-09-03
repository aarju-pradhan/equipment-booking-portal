import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <main id="main-content">
            <section className="hero">
                <h1>University Booking Portal</h1>
                <p>
                    Reserve high-performance workstations, collaborative study rooms,
                    and technical equipment for your academic projects.
                </p>
                <Link to="/catalog" className="btn btn-primary">Browse catalog</Link>
            </section>

            <section className="page">
                <h2 className="section-title">How it works</h2>
                <div className="feature-grid">
                    <article className="feature-card">
                        <h3>1. Find equipment</h3>
                        <p className="muted">Search and filter the catalog of IT hardware and campus study spaces.</p>
                    </article>
                    <article className="feature-card">
                        <h3>2. Book a date</h3>
                        <p className="muted">Choose an available date and confirm the reservation instantly.</p>
                    </article>
                    <article className="feature-card">
                        <h3>3. Manage activity</h3>
                        <p className="muted">Track upcoming reservations, cancel bookings, and update your profile.</p>
                    </article>
                </div>
            </section>
        </main>
    );
}

export default Home;
