import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [mode, setMode] = useState('login');
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackIsError, setFeedbackIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, register } = useContext(AuthContext);

    const showError = (message) => {
        setFeedback(message);
        setFeedbackIsError(true);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setFeedback('');
        setFeedbackIsError(false);

        if (!studentId.trim() || !password.trim()) {
            showError('Enter both your student ID and password.');
            return;
        }

        setIsSubmitting(true);
        try {
            await login(studentId.trim(), password);
        } catch (err) {
            showError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setFeedback('');
        setFeedbackIsError(false);

        if (!name.trim() || !email.trim() || !studentId.trim() || !password.trim()) {
            showError('All fields are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            await register({
                name: name.trim(),
                email: email.trim(),
                studentId: studentId.trim(),
                password
            });
        } catch (err) {
            showError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="login-screen">
            <div className="login-card">
                <h1>{mode === 'register' ? 'Create account' : 'University portal login'}</h1>

                {mode === 'register' ? (
                    <form className="stack" onSubmit={handleRegisterSubmit} noValidate>
                        <div className="form-field">
                            <label htmlFor="reg-name">Full name</label>
                            <input id="reg-name" className="text-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-field">
                            <label htmlFor="reg-email">University email</label>
                            <input id="reg-email" className="text-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-field">
                            <label htmlFor="reg-student-id">Student ID</label>
                            <input id="reg-student-id" className="text-input" type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. s1234567" />
                        </div>
                        <div className="form-field">
                            <label htmlFor="reg-password">Password</label>
                            <input id="reg-password" className="text-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating account…' : 'Register'}
                        </button>
                        <button type="button" className="inline-link" onClick={() => { setMode('login'); setFeedback(''); }}>
                            Back to sign in
                        </button>
                        {feedback && (
                            <div className={`feedback ${feedbackIsError ? 'feedback-error' : 'feedback-success'}`} role="alert">
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
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                className="text-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in…' : 'Sign in'}
                        </button>
                        <button type="button" className="inline-link" onClick={() => { setMode('register'); setFeedback(''); }}>
                            Create an account
                        </button>
                        <p className="muted">Demo student: s1234567 / Student123! · Admin: admin01 / Admin123!</p>
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
