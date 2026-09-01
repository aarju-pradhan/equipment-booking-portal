import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [isResetMode, setIsResetMode] = useState(false);

    // Pull the login function from our Auth vault
    const { login } = useContext(AuthContext);

    const handleLoginSubmit = (e) => {
        e.preventDefault(); // Prevents the page from refreshing on submit

        // Try to log in (accepts anything as long as both fields are typed)
        const success = login(studentId, password);
        if (!success) {
            alert("Please enter both your Student ID and Password.");
        }
    };

    const handleResetSubmit = (e) => {
        e.preventDefault();
        if (studentId) {
            alert(`A password reset link has been sent to the university email associated with ${studentId}.`);
            setIsResetMode(false); // Return to login screen
            setPassword(''); // Clear the password field for security
        } else {
            alert("Please enter your Student ID to reset your password.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
            <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>

                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#111827' }}>
                    {isResetMode ? 'Reset Password' : 'University Portal Login'}
                </h2>

                {isResetMode ? (
                    // --- FORGOT PASSWORD VIEW ---
                    <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: '0 0 -0.5rem 0' }}>
                            Enter your Student ID and we will send a recovery link to your university email.
                        </p>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Student ID</label>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="e.g. s1234567"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                            />
                        </div>
                        <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>
                            Send Reset Link
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsResetMode(false)}
                            style={{ background: 'none', border: 'none', color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer', marginTop: '-0.5rem' }}
                        >
                            Back to Sign In
                        </button>
                    </form>
                ) : (
                    // --- STANDARD LOGIN VIEW ---
                    <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Student ID</label>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="e.g. s1234567"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                <label style={{ fontWeight: '500' }}>Password</label>
                                {/* NEW: The toggle button */}
                                <button
                                    type="button"
                                    onClick={() => setIsResetMode(true)}
                                    style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                            />
                        </div>
                        <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>
                            Sign In
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login; 