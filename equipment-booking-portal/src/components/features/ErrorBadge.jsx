import React from 'react';

function ErrorBadge({ message }) {
    return (
        <div style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            border: '1px solid #f87171',
            textAlign: 'center',
            margin: '2rem 0',
            fontWeight: '500'
        }}>
            ⚠️ {message}
        </div>
    );
}

export default ErrorBadge;