import React, { useEffect, useState } from 'react';
import EquipmentCard from '../components/features/EquipmentCard';
import Spinner from '../components/features/Spinner';
import ErrorBadge from '../components/features/ErrorBadge';

function Catalog() {
    const [items, setItems] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCatalogData = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 400));
                const response = await fetch('/equipmentData.json');
                if (!response.ok) throw new Error('Failed to load catalog data. Please try again.');
                const data = await response.json();
                setItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCatalogData();
    }, []);

    const filteredItems = items.filter((item) => {
        const matchesTab = activeFilter === 'All' || item.type === activeFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <main id="main-content" className="page">
            <h1>Equipment and facility catalog</h1>

            <div className="toolbar">
                <div className="form-field">
                    <label htmlFor="catalog-search">Search catalog</label>
                    <input
                        id="catalog-search"
                        className="search-input"
                        type="search"
                        placeholder="Search equipment and facilities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
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
                </div>
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
