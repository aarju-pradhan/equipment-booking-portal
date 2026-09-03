import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <main id="main-content" className="page empty-state">
            <h1>Page not found</h1>
            <p>The page you requested does not exist.</p>
            <p>
                <Link to="/" className="btn btn-primary">Back to home</Link>
            </p>
        </main>
    );
}

export default NotFound;
