import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Admin Dashboard</h2>
          <p>Welcome, Admin. Manage your system below:</p>
        </div>
        <button onClick={handleLogout} style={logoutBtnStyle}>
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/admin/markets')} style={btnStyle}>
          Manage Markets
        </button>
        <button onClick={() => navigate('/admin/products')} style={btnStyle}>
          Manage Products
        </button>
        <button onClick={() => navigate('/admin/reports')} style={btnStyle}>
          View Reports
        </button>
      </div>
    </DashboardLayout>
  );
}

const btnStyle = {
  padding: '16px 24px',
  backgroundColor: '#1e88e5',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer',
};

const logoutBtnStyle = {
  padding: '10px 20px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  cursor: 'pointer',
  fontWeight: '500',
};

export default AdminDashboard;
