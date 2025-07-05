import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

function ManagePrices() {
  const [prices, setPrices] = useState([]);
  const [formData, setFormData] = useState({ market: '', product: '', price: '' });
  const [editIndex, setEditIndex] = useState(null); // Track item being edited

  const markets = ['Mwanakwerekwe Souk', 'Jumbi Souk', 'Darajani Souk'];
  const products = ['Tomatoes', 'Onions', 'Beef', 'Cabbage', 'Bananas'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.market || !formData.product || !formData.price) return;

    if (editIndex !== null) {
      // Update existing
      const updated = [...prices];
      updated[editIndex] = formData;
      setPrices(updated);
      setEditIndex(null);
    } else {
      // Add new
      setPrices([...prices, formData]);
    }

    setFormData({ market: '', product: '', price: '' });
  };

  const handleEdit = (index) => {
    setFormData(prices[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = prices.filter((_, i) => i !== index);
    setPrices(updated);
    setEditIndex(null);
  };

  return (
    <DashboardLayout>
      <h2>Set Product Prices</h2>

      {/* Price Input Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <select
          value={formData.market}
          onChange={(e) => setFormData({ ...formData, market: e.target.value })}
          style={inputStyle}
        >
          <option value="">Select Market</option>
          {markets.map((mkt, idx) => (
            <option key={idx} value={mkt}>{mkt}</option>
          ))}
        </select>

        <select
          value={formData.product}
          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          style={inputStyle}
        >
          <option value="">Select Product</option>
          {products.map((prod, idx) => (
            <option key={idx} value={prod}>{prod}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter Price (e.g. 2,000 TZS/kg)"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          {editIndex !== null ? 'Update Price' : 'Add Price'}
        </button>
      </form>

      {/* Price Table */}
      <h3>Prices Set:</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Market</th>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((entry, index) => (
            <tr key={index}>
              <td style={tdStyle}>{entry.market}</td>
              <td style={tdStyle}>{entry.product}</td>
              <td style={tdStyle}>{entry.price}</td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(index)} style={editBtn}>Edit</button>
                <button onClick={() => handleDelete(index)} style={deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}

// Styling
const inputStyle = {
  padding: '10px',
  marginRight: '10px',
  marginBottom: '10px',
  width: '220px',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#1e88e5',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#e0e0e0',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px',
};

const editBtn = {
  marginRight: '8px',
  padding: '6px 12px',
  backgroundColor: '#ffb300',
  border: 'none',
  borderRadius: '4px',
  color: 'white',
  cursor: 'pointer',
};

const deleteBtn = {
  padding: '6px 12px',
  backgroundColor: '#e53935',
  border: 'none',
  borderRadius: '4px',
  color: 'white',
  cursor: 'pointer',
};

export default ManagePrices;
