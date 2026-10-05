import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';
import { apiRequest } from '../api/client.js';

function Profile() {
    const { bookings } = useContext(BookingContext);
    const { profile, updateProfile } = useContext(AuthContext);
    const isAdmin = profile.role === 'admin';
    const [catalogItems, setCatalogItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);
    const [feedback, setFeedback] = useState({ message: '', isError: false });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isAdmin) return;
        apiRequest('/equipment')
            .then(setCatalogItems)
            .catch(() => setCatalogItems([]));
    }, [isAdmin]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.studentId.trim()) {
            setFeedback({ message: 'All fields are required.', isError: true });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setFeedback({ message: 'Enter a valid email address.', isError: true });
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile(formData);
            setFeedback({ message: 'Profile updated successfully.', isError: false });
            window.setTimeout(() => {
                setFeedback({ message: '', isError: false });
                setIsEditing(false);
            }, 1600);
        } catch (err) {
            setFeedback({ message: err.message, isError: true });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main id="main-content" className="page">
            <h1>User profile</h1>

            <div className="profile-grid">
                <section className="card">
                    <h2>Account details</h2>

                    {!isEditing ? (
                        <div className="stack">
                            <div>
                                <p className="muted">Full name</p>
                                <p>{profile.name}</p>
                            </div>
                            <div>
                                <p className="muted">University email</p>
                                <p>{profile.email}</p>
                            </div>
                            <div>
                                <p className="muted">Student ID</p>
                                <p>{profile.studentId}</p>
                            </div>
                            <div>
                                <p className="muted">Role</p>
                                <p>{profile.role === 'admin' ? 'Admin' : 'Student'}</p>
                            </div>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setFormData(profile);
                                    setIsEditing(true);
                                }}
                            >
                                Edit profile
                            </button>
                        </div>
                    ) : (
                        <form className="stack" onSubmit={handleSubmit} noValidate>
                            <div className="form-field">
                                <label htmlFor="name">Full name</label>
                                <input id="name" className="text-input" type="text" name="name" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="email">University email</label>
                                <input id="email" className="text-input" type="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="studentId">Student ID</label>
                                <input id="studentId" className="text-input" type="text" name="studentId" value={formData.studentId} onChange={handleChange} />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                {isSaving ? 'Saving…' : 'Save changes'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setFormData(profile);
                                    setFeedback({ message: '', isError: false });
                                    setIsEditing(false);
                                }}
                            >
                                Cancel
                            </button>
                            {feedback.message && (
                                <div className={`feedback ${feedback.isError ? 'feedback-error' : 'feedback-success'}`} role="status">
                                    {feedback.message}
                                </div>
                            )}
                        </form>
                    )}
                </section>

                <section className="card">
                    <h2>{isAdmin ? 'Catalog overview' : 'Recent activity'}</h2>
                    <div className="stack">
                        {isAdmin ? (
                            catalogItems.length > 0 ? (
                                <>
                                    {catalogItems.slice(0, 6).map((item) => (
                                        <article key={item.id} className="feature-card" style={{ textAlign: 'left' }}>
                                            <h3>{item.name}</h3>
                                            <p className="muted">{item.code} · {item.type} · {item.status}</p>
                                            {item.campusName && <p className="muted">{item.campusName}</p>}
                                        </article>
                                    ))}
                                    <Link to="/admin" className="btn btn-secondary">Open admin catalog</Link>
                                </>
                            ) : (
                                <>
                                    <p className="muted">No catalog items found.</p>
                                    <Link to="/admin" className="btn btn-secondary">Manage catalog</Link>
                                </>
                            )
                        ) : bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <article key={booking.bookingId} className="feature-card" style={{ textAlign: 'left' }}>
                                    <h3>{booking.name}</h3>
                                    <p className="muted">Booked for {booking.date}</p>
                                </article>
                            ))
                        ) : (
                            <>
                                <p className="muted">No active equipment or facility reservations.</p>
                                <Link to="/catalog" className="btn btn-secondary">Browse catalog</Link>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Profile;
