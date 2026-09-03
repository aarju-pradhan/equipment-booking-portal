import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';

function Profile() {
    // Pull bookings from your global context
    const { bookings } = useContext(BookingContext);

    // Toggle state for read-only vs edit mode
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: 'Aarju Pradhan',
        email: 'CIHE251232@student.edu.au',
        studentId: 'CIHE251232'
    });

    const [feedback, setFeedback] = useState({ message: '', isError: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.studentId.trim()) {
            setFeedback({ message: 'All fields are required.', isError: true });
            return;
        }

        if (!formData.email.includes('@')) {
            setFeedback({ message: 'Please enter a valid email address.', isError: true });
            return;
        }

        setFeedback({ message: 'Profile successfully updated!', isError: false });

        // Hide success message and switch back to read-only view after 2 seconds
        setTimeout(() => {
            setFeedback({ message: '', isError: false });
            setIsEditing(false);
        }, 2000);
    };

    return (
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', color: '#111827' }}>User Profile</h1>

            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                {/* Account Details Section */}
                <section style={{ backgroundColor: '#f9fafb', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#374151' }}>Account Details</h2>

                    {!isEditing ? (
                        // Read-Only View
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <p style={{ margin: 0, fontWeight: '500', color: '#4b5563' }}>Full Name</p>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#111827', fontSize: '1.1rem' }}>{formData.name}</p>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontWeight: '500', color: '#4b5563' }}>University Email</p>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#111827', fontSize: '1.1rem' }}>{formData.email}</p>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontWeight: '500', color: '#4b5563' }}>Student ID</p>
                                <p style={{ margin: '0.25rem 0 0 0', color: '#111827', fontSize: '1.1rem' }}>{formData.studentId}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#e5e7eb', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        // Edit Form View
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4b5563' }}>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4b5563' }}>University Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4b5563' }}>Student ID</label>
                                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                            </div>
                            <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Save Changes
                            </button>

                            {feedback.message && (
                                <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', backgroundColor: feedback.isError ? '#fee2e2' : '#dcfce3', color: feedback.isError ? '#dc2626' : '#166534', textAlign: 'center', fontWeight: '500' }}>
                                    {feedback.message}
                                </div>
                            )}
                        </form>
                    )}
                </section>

                {/* Dynamic Recent Activity Section */}
                <section style={{ padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#374151' }}>Recent Activity</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {bookings && bookings.length > 0 ? (
                            bookings.map((booking, index) => (
                                <div key={index} style={{ padding: '1rem', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#f9fafb' }}>
                                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#111827' }}>{booking.name}</p>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563' }}>Booked for: {booking.date}</p>
                                </div>
                            ))
                        ) : (
                            <>
                                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No active equipment or facility reservations found.</p>
                                <Link to="/catalog" style={{ textDecoration: 'none' }}>
                                    <button style={{ width: '100%', padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>
                                        Browse Catalog
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </section>

            </div>
        </main>
    );
}

export default Profile;