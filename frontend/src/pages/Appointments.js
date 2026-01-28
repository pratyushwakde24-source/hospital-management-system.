import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({ patientId: '', doctorName: '', date: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/appointments');
            setAppointments(Array.isArray(res.data) ? res.data : []);
            setError(null);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
            setError(errorMsg);
            console.error('Error fetching appointments:', err);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/patients');
            setPatients(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Error fetching patients:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/appointments', form);
            fetchAppointments();
            setForm({ patientId: '', doctorName: '', date: '' });
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
            setError(errorMsg);
            console.error('Error creating appointment:', err);
        }
    };

    const deleteAppointment = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/appointments/${id}`);
            fetchAppointments();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
            setError(errorMsg);
            console.error('Error deleting appointment:', err);
        }
    };

    return (
        <div>
            <h1>Appointments</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <select onChange={(e) => setForm({ ...form, patientId: e.target.value })} required>
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                <input placeholder="Doctor Name" onChange={(e) => setForm({ ...form, doctorName: e.target.value })} required />
                <input type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                <button type="submit">Schedule</button>
            </form>

            <div>
                {appointments.map(appt => (
                    <div key={appt._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>{appt.patientId?.name || 'Unknown'}</strong> with Dr. {appt.doctorName} on {new Date(appt.date).toLocaleDateString()}
                        </div>
                        <button onClick={() => deleteAppointment(appt._id)} style={{ marginLeft: '10px', color: 'white', backgroundColor: 'red', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Appointments; 