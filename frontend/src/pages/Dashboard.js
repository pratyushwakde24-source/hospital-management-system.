import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  UserPlus,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({ patients: 0, appointments: 0, bills: 0 });
    const [recentPatients, setRecentPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pRes, aRes, bRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/patients'),
                    axios.get('http://localhost:5001/api/appointments'),
                    axios.get('http://localhost:5001/api/billing')
                ]);
                
                const billsTotal = Array.isArray(bRes.data) ? bRes.data.reduce((acc, curr) => acc + (curr.amount || 0), 0) : 0;
                
                setStats({
                    patients: Array.isArray(pRes.data) ? pRes.data.length : 0,
                    appointments: Array.isArray(aRes.data) ? aRes.data.length : 0,
                    revenue: billsTotal
                });

                setRecentPatients(Array.isArray(pRes.data) ? pRes.data.slice(-5).reverse() : []);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartData = [
        { name: 'Jan', appointments: 40 },
        { name: 'Feb', appointments: 30 },
        { name: 'Mar', appointments: 60 },
        { name: 'Apr', appointments: 45 },
        { name: 'May', appointments: 90 },
        { name: 'Jun', appointments: stats.appointments },
    ];

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>Loading...</div>;

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>Hospital Overview</h1>
                <p style={{ color: '#64748b' }}>Welcome back! Here's what's happening at MedFlow today.</p>
            </header>

            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon"><Users size={24} /></div>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Patients</p>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.patients}</h2>
                    </div>
                    <div style={{ marginLeft: 'auto', color: '#10b981', display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                        <TrendingUp size={14} /> +12%
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Appointments</p>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.appointments}</h2>
                    </div>
                    <div style={{ marginLeft: 'auto', color: '#10b981', display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                        <ArrowUpRight size={14} /> Active
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                        <Activity size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Revenue</p>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{stats.revenue.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Activity Trends
                    </h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAppt)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserPlus size={20} /> Latest Patients
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentPatients.map(p => (
                            <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#f8fafc' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                                    {p.name.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{p.name}</h4>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Age: {p.age} • Joined Recently</p>
                                </div>
                                <div style={{ color: '#64748b' }}>
                                    <Clock size={16} />
                                </div>
                            </div>
                        ))}
                        {recentPatients.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No patients found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
