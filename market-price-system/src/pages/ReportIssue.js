import React, { useState, useEffect } from 'react';
import CustDashboard from '../components/CustDashboard';
import axios from 'axios';
import Swal from 'sweetalert2';

function ReportIssue() {
  const [form, setForm] = useState({
    subject: '',
    message: '',
    customerName: '',
    customerPhone: '',
    productId: ''
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products for the dropdown
  useEffect(() => {
    axios.get('http://localhost:8090/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to load products:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reportData = {
        subject: form.subject,
        message: form.message,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        product: form.productId ? { id: parseInt(form.productId) } : null
      };

      await axios.post('http://localhost:8090/api/reports', reportData);
      
      Swal.fire({
        icon: 'success',
        title: 'Report Submitted!',
        text: 'Thank you for your report. We will review it and take appropriate action.',
        confirmButtonColor: '#1e88e5'
      });

      // Reset form
      setForm({
        subject: '',
        message: '',
        customerName: '',
        customerPhone: '',
        productId: ''
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'There was an error submitting your report. Please try again.',
        confirmButtonColor: '#1e88e5'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustDashboard>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Report Issue</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Found a price discrepancy or have a suggestion? Please report it below and we'll investigate.
        </p>

        <form onSubmit={handleSubmit} style={formContainerStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Subject/Issue Type:</label>
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              style={inputStyle}
              required
            >
              <option value="">-- Select Issue Type --</option>
              <option value="Price Discrepancy">Price Discrepancy</option>
              <option value="Wrong Information">Wrong Information</option>
              <option value="Missing Product">Missing Product</option>
              <option value="Suggestion">Suggestion</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Product (Optional):</label>
            <select
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              style={inputStyle}
            >
              <option value="">-- Select Product (Optional) --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.market?.name || 'Unknown Market'}
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Your Name:</label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              placeholder="Enter your full name"
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Your Phone Number:</label>
            <input
              type="tel"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              placeholder="Enter your phone number"
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Detailed Message:</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Please provide detailed information about the issue, including specific prices, dates, and any other relevant details..."
              style={{ ...inputStyle, height: '120px', resize: 'vertical' }}
              required
            />
          </div>

          <button 
            type="submit" 
            style={buttonStyle}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </CustDashboard>
  );
}

const formContainerStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
};

const formGroupStyle = {
  marginBottom: '1.5rem',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
  color: '#333',
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '14px',
  transition: 'border-color 0.2s',
};

const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: '#1e88e5',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '500',
  width: '100%',
  transition: 'background-color 0.2s',
};

export default ReportIssue;
