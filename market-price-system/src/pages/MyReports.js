import React, { useState, useEffect } from 'react';
import CustDashboard from '../components/CustDashboard';
import axios from 'axios';
import Swal from 'sweetalert2';

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerPhone, setCustomerPhone] = useState('');

  const handleSearch = async () => {
    if (!customerPhone.trim()) {
      Swal.fire('Error', 'Please enter your phone number', 'error');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Searching for reports with phone:', customerPhone);
      
      const response = await axios.get(`http://localhost:8090/api/reports/customer/${customerPhone}`);
      console.log('API Response:', response.data);
      
      setReports(response.data);
      
      // Show success message with report count
      if (response.data.length > 0) {
        const repliedCount = response.data.filter(report => report.adminReply).length;
        Swal.fire({
          icon: 'success',
          title: 'Reports Found!',
          text: `Found ${response.data.length} report(s). ${repliedCount} have admin replies.`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        setError('No reports found for this phone number. Please check if you entered the correct phone number.');
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      console.error('Error details:', err.response);
      
      if (err.response?.status === 404) {
        setReports([]);
        setError('No reports found for this phone number. Please check if you entered the correct phone number.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error: Please check if the server is running on localhost:8090');
      } else {
        setError('Failed to load reports: ' + (err.response?.data || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (report) => {
    if (report.adminReply) {
      return <span style={repliedBadgeStyle}>Replied</span>;
    } else {
      return <span style={pendingBadgeStyle}>Pending</span>;
    }
  };



  if (loading) return <CustDashboard><p>Searching for your reports...</p></CustDashboard>;

  return (
    <CustDashboard>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2>My Reports</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Enter your phone number to view your submitted reports and admin replies.
        </p>
        
        <div style={instructionStyle}>
          <h4>How to check your reports:</h4>
          <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>Enter the phone number you used when submitting your report</li>
            <li>Click "Search Reports" to find your submissions</li>
            <li>View your original message and any admin replies</li>
            <li>Reports show "Pending" if no reply yet, or "Replied" if admin responded</li>
          </ol>
        </div>

        <div style={searchContainerStyle}>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Enter your phone number"
            style={searchInputStyle}
          />
          <button onClick={handleSearch} style={searchButtonStyle}>
            Search Reports
          </button>
        </div>



        {error && (
          <div style={errorStyle}>
            {error}
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Make sure you're using the same phone number you provided when submitting the report.
            </p>
          </div>
        )}

        {reports.length > 0 && (
          <div style={reportsContainerStyle}>
            <h3>Your Reports ({reports.length})</h3>
            {reports.map((report) => (
              <div key={report.id} style={reportCardStyle}>
                <div style={reportHeaderStyle}>
                  <div>
                    <h4 style={reportTitleStyle}>
                      {report.subject} {getStatusBadge(report)}
                    </h4>
                    <p style={reportMetaStyle}>
                      <strong>Submitted:</strong> {formatDate(report.reportedAt)}
                    </p>
                    {report.product && (
                      <p style={reportMetaStyle}>
                        <strong>Product:</strong> {report.product.name} 
                        {report.product.market && ` (${report.product.market.name})`}
                      </p>
                    )}
                  </div>
                </div>
                
                <div style={reportMessageStyle}>
                  <strong>Your Message:</strong>
                  <p>{report.message}</p>
                </div>
                
                {report.adminReply && (
                  <div style={adminReplyStyle}>
                    <strong>Admin Reply ({report.adminName}):</strong>
                    <p>{report.adminReply}</p>
                    <small style={{ color: '#666' }}>
                      Replied on: {formatDate(report.repliedAt)}
                    </small>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </CustDashboard>
  );
}

const searchContainerStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  alignItems: 'center',
};

const searchInputStyle = {
  flex: 1,
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '14px',
};

const searchButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#1e88e5',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
};

const errorStyle = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '1rem',
  borderRadius: '6px',
  marginBottom: '1rem',
  border: '1px solid #f5c6cb',
};

const reportsContainerStyle = {
  marginTop: '2rem',
};

const reportCardStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1.5rem',
  marginBottom: '1rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const reportHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '1rem',
};

const reportTitleStyle = {
  margin: '0 0 0.5rem 0',
  color: '#333',
  fontSize: '1.1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const reportMetaStyle = {
  margin: '0.25rem 0',
  fontSize: '0.9rem',
  color: '#666',
};

const reportMessageStyle = {
  borderTop: '1px solid #eee',
  paddingTop: '1rem',
  marginBottom: '1rem',
};

const adminReplyStyle = {
  borderTop: '1px solid #eee',
  paddingTop: '1rem',
  backgroundColor: '#f8f9fa',
  padding: '1rem',
  borderRadius: '4px',
  borderLeft: '3px solid #1e88e5',
};

const repliedBadgeStyle = {
  backgroundColor: '#28a745',
  color: '#fff',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: '500',
};

const pendingBadgeStyle = {
  backgroundColor: '#ffc107',
  color: '#212529',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: '500',
};

const instructionStyle = {
  backgroundColor: '#e3f2fd',
  border: '1px solid #bbdefb',
  borderRadius: '6px',
  padding: '1rem',
  marginBottom: '2rem',
};



export default MyReports; 