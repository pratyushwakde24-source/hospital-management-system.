import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  LogOut, 
  HeartPulse,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/patients', icon: <Users size={20} />, label: 'Patients' },
        { path: '/appointments', icon: <Calendar size={20} />, label: 'Appointments' },
        { path: '/billing', icon: <CreditCard size={20} />, label: 'Billing' },
    ];

    if (!user) return <>{children}</>;

    return (
        <div style={{ display: 'flex' }}>
            <div className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', color: '#60a5fa' }}>
                    <HeartPulse size={32} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>MedFlow</h2>
                </div>

                <nav>
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                color: location.pathname === item.path ? 'white' : '#94a3b8',
                                backgroundColor: location.pathname === item.path ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                textDecoration: 'none',
                                marginBottom: '0.5rem',
                                transition: 'all 0.2s',
                                fontWeight: location.pathname === item.path ? 600 : 400
                            }}
                        >
                            {React.cloneElement(item.icon, { 
                                color: location.pathname === item.path ? '#3b82f6' : '#94a3b8' 
                            })}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', position: 'absolute', bottom: '2rem', width: '210px' }}>
                    <div style={{ padding: '0.75rem 10px', marginBottom: '1rem', borderTop: '1px solid #1e293b' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>{user.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>{user.role}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="btn btn-outline"
                        style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444', borderColor: 'transparent' }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
