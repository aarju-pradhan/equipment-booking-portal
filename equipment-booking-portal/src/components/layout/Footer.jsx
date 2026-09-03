import React from 'react';

function Footer() {
    return (
        <footer style={{
            backgroundColor: '#041436',
            color: '#9ca3af',
            padding: '2rem',
            marginTop: 'auto',
            borderTop: '1px solid #374151',
            fontSize: '0.9rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
                        <span>🌐</span>
                        <a href="https://www.cihe.edu.au" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                            https://www.cihe.edu.au
                        </a>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
                        <span>✉️</span>
                        <a href="mailto:info@cihe.edu.au" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                            info@cihe.edu.au
                        </a>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
                        <span>📞</span>
                        <span>1300 171 094</span>
                    </div>

                </div>

                <hr style={{ borderColor: '#374151', borderTop: 'none', margin: '0.5rem 0' }} />

                <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
                    © 2018-2026 CIHE Australia
                </div>
            </div>
        </footer>
    );
}

export default Footer;