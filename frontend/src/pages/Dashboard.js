import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({ patients: 0, appointments: 0, bills: 0 });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pRes = await axios.get('http://localhost:5000/api/patients');
                const aRes = await axios.get('http://localhost:5000/api/appointments');
                const bRes = await axios.get('http://localhost:5000/api/billing');
                
                const billsTotal = Array.isArray(bRes.data) ? bRes.data.reduce((acc, curr) => acc + (curr.amount || 0), 0) : 0;
                
                setStats({
                    patients: Array.isArray(pRes.data) ? pRes.data.length : 0,
                    appointments: Array.isArray(aRes.data) ? aRes.data.length : 0,
                    bills: billsTotal
                });
            } catch (err) {
                const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
                setError(errorMsg);
                console.error('Error fetching dashboard data:', err);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 style={{ animation: 'fadeIn 0.6s ease-out' }}>Dashboard</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeIn 0.8s ease-out' }}>
                <div className="card" style={{ animation: 'scaleIn 0.5s ease-out' }}>
                    <h3>Total Patients</h3>
                    <p>{stats.patients}</p>
                </div>
                <div className="card" style={{ animation: 'scaleIn 0.5s ease-out 0.1s both' }}>
                    <h3>Appointments</h3>
                    <p>{stats.appointments}</p>
                </div>
                <div className="card" style={{ animation: 'scaleIn 0.5s ease-out 0.2s both' }}>
                    <h3>Total Earnings</h3>
                    <p>₹{stats.bills}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;