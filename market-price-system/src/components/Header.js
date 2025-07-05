import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user data (if you're using localStorage or sessionStorage)
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    // Clear any auth tokens if you have them
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <header style={headerStyle}>
      <h2 style={titleStyle}>Market Price System</h2>
      <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
      </button>
    </header>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#1e88e5',
  color: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const titleStyle = {
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

const logoutButtonStyle = {
  padding: '8px 16px',
  backgroundColor: 'rgba(255,255,255,0.2)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'background-color 0.2s',
};

export default Header;
