import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Plus, Receipt, User } from 'lucide-react';

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ patientId: '', amount: '', description: '', status: 'unpaid' });

    useEffect(() => {
        fetchBills();
        fetchPatients();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/billing');
            setBills(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError('Failed to fetch billing records');
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
            await axios.post('http://localhost:5001/api/billing', form);
            setForm({ patientId: '', amount: '', description: '', status: 'unpaid' });
            fetchBills();
        } catch (err) {
            setError('Failed to generate bill');
        }
    };

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Billing & Invoices</h1>
                    <p style={{ color: '#64748b' }}>Manage hospital revenue and patient payments</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Receipt size={20} /> Recent Invoices
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Patient</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Description</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Amount</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map(bill => (
                                    <tr key={bill._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={16} color="#64748b" />
                                            </div>
                                            {bill.patientId?.name || 'Deleted Patient'}
                                        </td>
                                        <td style={{ padding: '1rem' }}>{bill.description}</td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>₹{bill.amount}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                padding: '0.25rem 0.75rem', 
                                                borderRadius: '1rem', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 600,
                                                backgroundColor: bill.status === 'paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: bill.status === 'paid' ? '#10b981' : '#f59e0b'
                                            }}>
                                                {bill.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {bills.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No billing records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={20} /> Create New Bill
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Select Patient</label>
                            <select 
                                value={form.patientId} 
                                onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                                required
                            >
                                <option value="">Select Patient</option>
                                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Amount (₹)</label>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea 
                                placeholder="Consultation Fee, Lab Tests, etc."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                                style={{ minHeight: '100px' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            <CreditCard size={20} /> Generate Invoice
                        </button>
                    </form>
                    {error && <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.875rem' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Billing;
