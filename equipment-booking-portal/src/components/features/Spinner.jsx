import React from 'react';

function Spinner() {
    return (
        <div className="spinner" role="status" aria-live="polite">
            <div className="spinner-wheel" aria-hidden="true" />
            <span>Loading catalog…</span>
        </div>
    );
}

export default Spinner;
