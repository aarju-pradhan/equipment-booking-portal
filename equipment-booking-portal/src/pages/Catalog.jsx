import React, { useContext, useEffect, useMemo, useState } from 'react';
import EquipmentCard from '../components/features/EquipmentCard';
import Spinner from '../components/features/Spinner';
import ErrorBadge from '../components/features/ErrorBadge';
import { apiRequest } from '../api/client.js';
import { BookingContext } from '../context/BookingContext.jsx';
import { NSW_CAMPUSES } from '../data/campuses.js';

function distanceKm(lat1, lng1, lat2, lng2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function Catalog() {
    const { bookings } = useContext(BookingContext);
    const [items, setItems] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [campusFilter, setCampusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationMessage, setLocationMessage] = useState('');
    const [locationIsError, setLocationIsError] = useState(false);

    useEffect(() => {
        const fetchCatalogData = async () => {
            try {
                const data = await apiRequest('/equipment');
                setItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCatalogData();
    }, [bookings]);

    const useMyLocation = () => {
        if (userLocation) {
            setUserLocation(null);
            setLocationMessage('Location sorting turned off.');
            setLocationIsError(false);
            return;
        }

        if (!navigator.geolocation) {
            setLocationMessage('Location is not supported in this browser.');
            setLocationIsError(true);
            return;
        }

        setIsLocating(true);
        setLocationIsError(false);
        setLocationMessage('Waiting for location permission… Allow location if the browser asks.');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setCampusFilter('all');
                setIsLocating(false);
                setLocationIsError(false);
                setLocationMessage('Showing all NSW campuses, nearest first. Distance is listed on each item.');
            },
            (err) => {
                setIsLocating(false);
                setLocationIsError(true);
                if (err.code === 1) {
                    setLocationMessage('Location permission was denied. Allow location in the browser address bar, then try again.');
                } else {
                    setLocationMessage('Could not read your location. Catalog is shown in the default order.');
                }
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
    };

    const filteredItems = useMemo(() => {
        const next = items
            .filter((item) => {
                const matchesTab = activeFilter === 'All' || item.type === activeFilter;
                const matchesCampus = campusFilter === 'all' || item.campusId === campusFilter;
                const query = searchQuery.toLowerCase();
                const matchesSearch = item.name.toLowerCase().includes(query)
                    || (item.campusName || '').toLowerCase().includes(query)
                    || (item.address || '').toLowerCase().includes(query);
                return matchesTab && matchesCampus && matchesSearch;
            })
            .map((item) => {
                if (!userLocation || item.lat == null || item.lng == null) return item;
                return {
                    ...item,
                    distanceKm: distanceKm(userLocation.lat, userLocation.lng, item.lat, item.lng)
                };
            });

        if (userLocation) {
            next.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
        }
        return next;
    }, [items, activeFilter, campusFilter, searchQuery, userLocation]);

    return (
        <main id="main-content" className="page">
            <h1>Equipment and facility catalog</h1>

            <div className="toolbar">
                <div className="toolbar-row">
                    <div className="form-field">
                        <label htmlFor="catalog-search">Search catalog</label>
                        <input
                            id="catalog-search"
                            className="search-input"
                            type="search"
                            placeholder="Search by name, campus, or address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="catalog-campus">Campus</label>
                        <select
                            id="catalog-campus"
                            className="text-input"
                            value={campusFilter}
                            onChange={(e) => setCampusFilter(e.target.value)}
                        >
                            <option value="all">All NSW campuses</option>
                            {NSW_CAMPUSES.map((campus) => (
                                <option key={campus.id} value={campus.id}>
                                    {campus.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="filters" role="group" aria-label="Filter by type">
                    {['All', 'Equipment', 'Facility'].map((filterType) => (
                        <button
                            key={filterType}
                            type="button"
                            className="chip"
                            aria-pressed={activeFilter === filterType}
                            onClick={() => setActiveFilter(filterType)}
                        >
                            {filterType === 'Facility' ? 'Facilities' : filterType}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="chip"
                        aria-pressed={Boolean(userLocation)}
                        onClick={useMyLocation}
                        disabled={isLocating}
                    >
                        {isLocating ? 'Finding location…' : userLocation ? 'Nearest first' : 'Use my location'}
                    </button>
                </div>
                {locationMessage && (
                    <p className={`feedback ${locationIsError ? 'feedback-error' : 'feedback-success'}`} role="status">
                        {locationMessage}
                    </p>
                )}
            </div>

            {error && <ErrorBadge message={error} />}

            {isLoading && !error ? (
                <Spinner />
            ) : !error && (
                <div className="card-grid">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <EquipmentCard key={item.id} item={item} />
                        ))
                    ) : (
                        <p className="muted">No items found matching your search and filter.</p>
                    )}
                </div>
            )}
        </main>
    );
}

export default Catalog;
