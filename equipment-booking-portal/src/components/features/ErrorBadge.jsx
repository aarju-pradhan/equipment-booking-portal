import React from 'react';

function ErrorBadge({ message }) {
    return (
        <div className="error-banner" role="alert">
            {message}
        </div>
    );
}

export default ErrorBadge;
