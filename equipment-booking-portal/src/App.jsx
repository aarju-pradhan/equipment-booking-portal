import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Bookings from './pages/Bookings';

function App() {
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
