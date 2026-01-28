import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientForm from '../components/PatientForm';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);

    const fetchPatients = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/patients');
            setPatients(Array.isArray(res.data) ? res.data : []);
            setError(null);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
            setError(errorMsg);
            console.error('Error fetching patients:', err);
        }
    };

    const deletePatient = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/patients/${id}`);
            fetchPatients();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
            setError(errorMsg);
            console.error('Error deleting patient:', err);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div>
            <h1>Patient Records</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <PatientForm refreshPatients={fetchPatients} />
            <ul>
                {patients.map(p => (
                    <li key={p._id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                        {p.name} - Age: {p.age} - Contact: {p.contact}
                        <button onClick={() => deletePatient(p._id)} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Patients;