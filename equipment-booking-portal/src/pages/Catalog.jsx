import React, { useState, useEffect } from 'react';
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
                // Simulate network delay for loading state visibility
                await new Promise(resolve => setTimeout(resolve, 500));

                // Fetching from the public folder satisfies async requirements
                const response = await fetch('/equipmentData.json');
                if (!response.ok) throw new Error("Failed to load catalog data.");

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

    //filter the items array before mapping in to screen
    const filteritems = items.filter((item) => {
        const matchesTab = activeFilter === 'All' || item.type === activeFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    return (
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1.5rem', color: '#111827' }}>Equipment & Facility Catalog</h1>

            {/*search bar and tabs container*/}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>

                {/*Search bar*/}
                <input 
                    type="text"
                    aria-label="Search equipment and facilities"
                    placeholder="Search equipment and facilities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '9px',
                        border: '1px solid #d1d5db',
                        width: '100%',
                        maxWidth: '400px',
                        fontSize: '1rem'
                    }}
                />

                {/*filter tabs*/}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {['All', 'Equipment', 'Facility'].map((filterType) => (
                        <button
                            key={filterType}
                            onClick={() => setActiveFilter(filterType)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '9999px',
                                border: '1px solid #d1d5db',
                                backgroundColor: activeFilter === filterType ? '#2563eb' : '#ffffff',
                                color: activeFilter === filterType ? '#ffffff' : '#374151',
                                cursor: 'pointer',
                                fontWeight: activeFilter === filterType ? 'bold' : 'normal',
                                transition: 'all 0.2s'
                            }}
                        >
                            {filterType === 'Facility' ? 'Facilities' : filterType}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error and Loading States */}
            {error && <ErrorBadge message={error} />}

            {isLoading && !error ? (
                <Spinner />
            ) : !error && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {filteritems.length > 0 ? (
                        filteritems.map((item) => (
                            <EquipmentCard key={item.id} item={item} />
                        ))
                    ) : (
                        <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>No items found matching your search and filter criteria.</p>
                    )}
                </div>
            )}

        </main>
    );
}

export default Catalog;
