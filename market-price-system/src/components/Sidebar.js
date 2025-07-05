import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
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
    <div className="sidebar">
      <ul>
        <li><Link to="/admin">Home</Link></li>
        <li><Link to="/admin/markets">Manage Markets</Link></li>
        <li><Link to="/admin/products">Manage Products</Link></li>
        <li><Link to="/admin/reports">Manage Reports</Link></li>
        <li style={{ marginTop: 'auto', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
          <button onClick={handleLogout} style={logoutStyle}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

const logoutStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};

export default Sidebar;
