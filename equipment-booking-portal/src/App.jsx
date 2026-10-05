import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/layout/Toast';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { AuthContext } from './context/AuthContext';
import { BookingContext } from './context/BookingContext';

function App() {
    const { isLoggedIn, authReady, profile } = useContext(AuthContext);
    const { toast } = useContext(BookingContext);

    if (!authReady) {
        return <main className="login-screen"><p className="muted">Loading session…</p></main>;
    }

    if (!isLoggedIn) {
        return <Login />;
    }

    return (
        <div className="app-shell">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                {profile.role === 'admin' ? (
                    <Route path="/admin" element={<Admin />} />
                ) : (
                    <>
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="/bookings" element={<Bookings />} />
                    </>
                )}
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
}

export default App;
