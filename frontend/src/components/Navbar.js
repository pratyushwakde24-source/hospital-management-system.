import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <h1>Hospital Manager</h1>
            <div style={{ display: 'flex', listStyle: 'none', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/" style={navLinkStyle}>
                    📊 Dashboard
                </Link>
                <Link to="/patients" style={navLinkStyle}>
                    👥 Patients
                </Link>
                <Link to="/appointments" style={navLinkStyle}>
                    📅 Appointments
                </Link>
            </div>
        </nav>
    );
};

const navLinkStyle = {
    color: 'black',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '700',
    padding: '12px 24px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
};

export default Navbar; 
