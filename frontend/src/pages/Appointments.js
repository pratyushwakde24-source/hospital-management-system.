import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, CheckCircle, XCircle, MoreVertical, Plus } from 'lucide-react';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({ patientId: '', doctorName: '', date: '', time: '10:00' });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/appointments');
            setAppointments(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError('Failed to fetch appointments');
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/patients');
            setPatients(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/appointments', form);
            setIsFormOpen(false);
            setForm({ patientId: '', doctorName: '', date: '', time: '10:00' });
            fetchAppointments();
        } catch (err) {
            setError('Failed to schedule appointment');
        }
    };

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Appointments</h1>
                    <p style={{ color: '#64748b' }}>Schedule and manage patient doctor consultations</p>
                </div>
                <button onClick={() => setIsFormOpen(!isFormOpen)} className="btn btn-primary">
                    <Plus size={20} /> New Appointment
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: isFormOpen ? '1fr 350px' : '1fr', gap: '2rem', transition: 'all 0.3s' }}>
                <div className="card">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {appointments.map(appt => (
                            <div key={appt._id} style={{ 
                                padding: '1.25rem', 
                                borderRadius: '1rem', 
                                border: '1px solid var(--border)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                backgroundColor: '#f8fafc'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: 600 }}>{appt.patientId?.name || 'Unknown Patient'}</h4>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Dr. {appt.doctorName}</p>
                                        </div>
                                    </div>
                                    <MoreVertical size={16} color="#94a3b8" />
                                </div>
                                
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#475569' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Calendar size={14} /> {new Date(appt.date).toLocaleDateString()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Clock size={14} /> {appt.time || '10:00 AM'}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <button className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', color: '#10b981' }}>
                                        <CheckCircle size={14} /> Confirm
                                    </button>
                                    <button className="btn btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', color: '#ef4444' }}>
                                        <XCircle size={14} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ))}
                        {appointments.length === 0 && (
                            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '3rem', color: '#64748b' }}>
                                No appointments found. Schedule one to get started.
                            </div>
                        )}
                    </div>
                </div>

                {isFormOpen && (
                    <div className="card animate-fade-in">
                        <h3 style={{ marginBottom: '1.5rem' }}>New Appointment</h3>
                        <form onSubmit={handleSubmit}>
                            <label>Select Patient</label>
                            <select 
                                value={form.patientId} 
                                onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                                required
                            >
                                <option value="">Select Patient</option>
                                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>

                            <label>Doctor Name</label>
                            <input 
                                placeholder="Dr. Smith" 
                                value={form.doctorName}
                                onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                                required 
                            />

                            <label>Appointment Date</label>
                            <input 
                                type="date" 
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                required 
                            />

                            <label>Time Slot</label>
                            <select 
                                value={form.time}
                                onChange={(e) => setForm({ ...form, time: e.target.value })}
                            >
                                <option>09:00 AM</option>
                                <option>10:00 AM</option>
                                <option>11:00 AM</option>
                                <option>02:00 PM</option>
                                <option>03:00 PM</option>
                                <option>04:00 PM</option>
                            </select>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                                Schedule Visit
                            </button>
                            <button type="button" onClick={() => setIsFormOpen(false)} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                                Cancel
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;
