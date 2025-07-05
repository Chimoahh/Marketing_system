import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustDashboard from '../components/CustDashboard';
import DashboardLayout from '../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selectedMarketId, setSelectedMarketId] = useState(''); // '' means all markets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    
    // Redirect to home page
    navigate('/');
  };

  // Fetch markets on mount
  useEffect(() => {
    axios.get('http://localhost:8090/api/markets')
      .then(res => setMarkets(res.data))
      .catch(() => setError('Failed to load markets'));
  }, []);

  // Fetch products (all or filtered) when component mounts or selectedMarketId changes
  useEffect(() => {
    setLoading(true);
    let url = 'http://localhost:8090/api/products';
    if (selectedMarketId) {
      url = `http://localhost:8090/api/markets/${selectedMarketId}/products`;
    }
    axios.get(url)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, [selectedMarketId]);

  if (loading) return <CustDashboard><p>Loading products...</p></CustDashboard>;
  if (error) return <CustDashboard><p style={{color: 'red'}}>{error}</p></CustDashboard>;

  return (
    <CustDashboard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Available Products</h2>
        <button onClick={handleLogout} style={logoutBtnStyle}>
          Logout
        </button>
      </div>

      <label htmlFor="marketFilter">Filter by Market:</label>
      <select
        id="marketFilter"
        value={selectedMarketId}
        onChange={(e) => setSelectedMarketId(e.target.value)}
        style={{ margin: '10px 0', padding: '5px', borderRadius: '4px' }}
      >
        <option value="">All Markets</option>
        {markets.map(market => (
          <option key={market.id} value={market.id}>
            {market.name} ({market.location})
          </option>
        ))}
      </select>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e88e5', color: '#fff' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Price (TZS)</th>
              <th style={thStyle}>Market Name</th>
              <th style={thStyle}>Market Location</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={trStyle}>
                <td style={tdStyle}>{product.name}</td>
                <td style={tdStyle}>{product.description}</td>
                <td style={tdStyle}>{product.price.toLocaleString()}</td>
                <td style={tdStyle}>{product.market?.name || 'N/A'}</td>
                <td style={tdStyle}>{product.market?.location || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CustDashboard>
  );
}

// Styling remains unchanged
const thStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'left',
};

const tdStyle = {
  padding: '10px',
  border: '1px solid #ddd',
};

const trStyle = {
  backgroundColor: '#f9f9f9',
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
