import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Search, Filter, Trash2, Phone, Calendar } from 'lucide-react';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', age: '', contact: '', gender: 'Male' });

    const fetchPatients = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/patients');
            setPatients(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError('Failed to load patient records');
        }
    };

    const deletePatient = async (id) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/patients/${id}`);
            fetchPatients();
        } catch (err) {
            setError('Failed to delete patient');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/patients', newPatient);
            setNewPatient({ name: '', age: '', contact: '', gender: 'Male' });
            setIsFormOpen(false);
            fetchPatients();
        } catch (err) {
            setError('Failed to add patient');
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.contact.includes(searchTerm)
    );

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Patient Directory</h1>
                    <p style={{ color: '#64748b' }}>Manage and track all patient medical records</p>
                </div>
                <button 
                    onClick={() => setIsFormOpen(!isFormOpen)} 
                    className="btn btn-primary"
                >
                    <UserPlus size={20} /> Add New Patient
                </button>
            </header>

            {isFormOpen && (
                <div className="card animate-fade-in" style={{ marginBottom: '2rem', border: '1px solid #3b82f6' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Create Patient Profile</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <label>Full Name</label>
                            <input 
                                placeholder="Patient Name" 
                                value={newPatient.name}
                                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                required 
                            />
                        </div>
                        <div>
                            <label>Age</label>
                            <input 
                                type="number" 
                                placeholder="Age" 
                                value={newPatient.age}
                                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                                required 
                            />
                        </div>
                        <div>
                            <label>Contact Number</label>
                            <input 
                                placeholder="Phone" 
                                value={newPatient.contact}
                                onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })}
                                required 
                            />
                        </div>
                        <div>
                            <label>Gender</label>
                            <select 
                                value={newPatient.gender}
                                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary">Save Patient</button>
                            <button type="button" onClick={() => setIsFormOpen(false)} className="btn btn-outline">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} size={18} />
                        <input 
                            placeholder="Search by name or contact..." 
                            style={{ paddingLeft: '40px', marginBottom: 0 }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-outline">
                        <Filter size={18} /> Filter
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Patient Name</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Age/Gender</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Contact</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map(p => (
                                <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {p._id.slice(-8).toUpperCase()}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {p.age} Yrs • {p.gender || 'N/A'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                                            <Phone size={14} /> {p.contact}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-outline" style={{ padding: '0.4rem' }}>
                                                <Calendar size={16} color="#3b82f6" />
                                            </button>
                                            <button 
                                                onClick={() => deletePatient(p._id)} 
                                                className="btn btn-outline" 
                                                style={{ padding: '0.4rem' }}
                                            >
                                                <Trash2 size={16} color="#ef4444" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Patients;
