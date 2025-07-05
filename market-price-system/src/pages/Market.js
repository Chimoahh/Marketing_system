import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustDashboard from '../components/CustDashboard'; // Assuming this is the correct import for the customer dashboard
import { useNavigate } from 'react-router-dom';

function MarketPage() {
  const [markets, setMarkets] = useState([]);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = () => {
    axios.get('http://localhost:8090/api/markets')
      .then(response => {
        setMarkets(response.data);
      })
      .catch(error => {
        console.error("Failed to fetch markets", error);
      });
  };

  const handleSearchClick = () => {
    navigate('/products');
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8090/api/markets', formData)
      .then(() => {
        fetchMarkets(); // Refresh the list after posting
        setFormData({ name: '', location: '' }); // Reset form
      })
      .catch(err => {
        console.error("Error creating market", err);
        alert('Failed to create market.');
      });
  };

  return (
    <CustDashboard>
      <h2>Search Market</h2>
      <p>Select a market to view available products and their prices.</p>


      {/* DISPLAY MARKETS */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        {markets.length === 0 ? (
          <p>No markets available</p>
        ) : (
          markets.map((market, index) => (
            <div
              key={index}
              style={{
                border: '2px solid #1e88e5',
                borderRadius: '8px',
                padding: '1rem',
                width: '300px',
                backgroundColor: '#fefefe',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3>{market.name}</h3>
              <p><strong>Location:</strong> {market.location}</p>
              <p>{market.description || 'No description provided.'}</p>
              <button
                onClick={() => handleSearchClick()}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#1e88e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                View Products
              </button>
            </div>
          ))
        )}
      </div>
    </CustDashboard>
  );
}

export default MarketPage;
