import React, { useState } from 'react';
import axios from 'axios';

const PatientForm = ({ refreshPatients }) => {
    const [patient, setPatient] = useState({ name: '', age: '', gender: '', contact: '' });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/patients', patient);
            refreshPatients();
            setPatient({ name: '', age: '', gender: '', contact: '' });
            setError(null);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
            setError(errorMsg);
            console.error('Error adding patient:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <h3>Add New Patient</h3>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <input placeholder="Name" value={patient.name} onChange={(e) => setPatient({...patient, name: e.target.value})} required />
            <input placeholder="Age" type="number" value={patient.age} onChange={(e) => setPatient({...patient, age: e.target.value})} required />
            <select value={patient.gender} onChange={(e) => setPatient({...patient, gender: e.target.value})} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            <input placeholder="Contact" type="tel" value={patient.contact} onChange={(e) => setPatient({...patient, contact: e.target.value.replace(/[^0-9]/g, '')})} required />
            <button type="submit">Add Patient</button>
        </form>
    );
};

export default PatientForm; 
