import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import { AuthContext } from './context/AuthContext';
function App() {
    const { isLoggedIn } = useContext(AuthContext);
    if (!isLoggedIn) {
        return <Login />;
    }

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/bookings" element={<Bookings />} />
            </Routes>
        </div>
    );
}

export default App;
