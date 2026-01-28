import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({ patientId: '', doctorName: '', date: '' });

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
    }, []);

    const fetchAppointments = async () => {
        const res = await axios.get('http://localhost:5000/api/appointments');
        setAppointments(res.data);
    };

    const fetchPatients = async () => {
        const res = await axios.get('http://localhost:5000/api/patients');
        setPatients(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/appointments', form);
        fetchAppointments();
    };

    return (
        <div>
            <h1>Appointments</h1>
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
                    <div key={appt._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px 0' }}>
                        <strong>{appt.patientId?.name || 'Unknown'}</strong> with Dr. {appt.doctorName} on {new Date(appt.date).toLocaleDateString()}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Appointments;