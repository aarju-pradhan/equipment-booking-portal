import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [isResetMode, setIsResetMode] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [feedbackIsError, setFeedbackIsError] = useState(false);
    const { login } = useContext(AuthContext);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setFeedback('');
        setFeedbackIsError(false);

        if (!studentId.trim() || !password.trim()) {
            setFeedback('Enter both your student ID and password.');
            setFeedbackIsError(true);
            return;
        }

        const success = login(studentId.trim(), password);
        if (!success) {
            setFeedback('Unable to sign in. Check your details and try again.');
            setFeedbackIsError(true);
        }
    };

    const handleResetSubmit = (e) => {
        e.preventDefault();
        if (!studentId.trim()) {
            setFeedback('Enter your student ID to request a reset link.');
            setFeedbackIsError(true);
            return;
        }
        setFeedbackIsError(false);
        setFeedback(`A password reset link would be sent to the university email for ${studentId}.`);
        setPassword('');
    };

    return (
        <main className="login-screen">
            <div className="login-card">
                <h1>{isResetMode ? 'Reset password' : 'University portal login'}</h1>

                {isResetMode ? (
                    <form className="stack" onSubmit={handleResetSubmit} noValidate>
                        <p className="muted">
                            Enter your student ID and we will send a recovery link to your university email.
                        </p>
                        <div className="form-field">
                            <label htmlFor="reset-student-id">Student ID</label>
                            <input
                                id="reset-student-id"
                                className="text-input"
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                autoComplete="username"
                                placeholder="e.g. s1234567"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Send reset link</button>
                        <button
                            type="button"
                            className="inline-link"
                            onClick={() => {
                                setIsResetMode(false);
                                setFeedback('');
                                setFeedbackIsError(false);
                            }}
                        >
                            Back to sign in
                        </button>
                        {feedback && (
                            <div className={`feedback ${feedbackIsError ? 'feedback-error' : 'feedback-success'}`} role="status">
                                {feedback}
                            </div>
                        )}
                    </form>
                ) : (
                    <form className="stack" onSubmit={handleLoginSubmit} noValidate>
                        <div className="form-field">
                            <label htmlFor="student-id">Student ID</label>
                            <input
                                id="student-id"
                                className="text-input"
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                autoComplete="username"
                                placeholder="e.g. s1234567"
                            />
                        </div>
                        <div className="form-field">
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                                <label htmlFor="password">Password</label>
                                <button
                                    type="button"
                                    className="inline-link"
                                    onClick={() => {
                                        setIsResetMode(true);
                                        setFeedback('');
                                        setFeedbackIsError(false);
                                    }}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <input
                                id="password"
                                className="text-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Sign in</button>
                        <p className="muted">Demo login: any student ID and password will sign you in.</p>
                        {feedback && (
                            <div className={`feedback ${feedbackIsError ? 'feedback-error' : 'feedback-success'}`} role="alert">
                                {feedback}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </main>
    );
}

export default Login;
