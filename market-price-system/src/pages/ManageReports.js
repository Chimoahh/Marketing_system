import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';
import Swal from 'sweetalert2';

function ManageReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyForm, setReplyForm] = useState({
    adminReply: '',
    adminName: 'Admin'
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      console.log('Fetching reports...');
      const response = await axios.get('http://localhost:8090/api/reports');
      console.log('Reports response:', response.data);
      setReports(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to load reports: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8090/api/reports/${reportId}`);
        Swal.fire(
          'Deleted!',
          'Report has been deleted.',
          'success'
        );
        fetchReports(); // Refresh the list
      } catch (error) {
        Swal.fire(
          'Error!',
          'Failed to delete report.',
          'error'
        );
      }
    }
  };

  const handleReply = async (reportId) => {
    if (!replyForm.adminReply.trim()) {
      Swal.fire('Error', 'Please enter a reply message', 'error');
      return;
    }

    try {
      await axios.post(`http://localhost:8090/api/reports/${reportId}/reply`, replyForm);
      Swal.fire('Success', 'Reply sent successfully!', 'success');
      setReplyingTo(null);
      setReplyForm({ adminReply: '', adminName: 'Admin' });
      fetchReports(); // Refresh the list
    } catch (error) {
      Swal.fire('Error', 'Failed to send reply: ' + (error.response?.data || error.message), 'error');
    }
  };

  const openReplyModal = (report) => {
    setReplyingTo(report);
    setReplyForm({ adminReply: '', adminName: 'Admin' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <DashboardLayout><p>Loading reports...</p></DashboardLayout>;
  if (error) return <DashboardLayout><p style={{color: 'red'}}>{error}</p></DashboardLayout>;

  console.log('Rendering ManageReports with', reports.length, 'reports');

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Customer Reports</h2>
        <button onClick={fetchReports} style={refreshButtonStyle}>
          Refresh
        </button>
      </div>

      {reports.length === 0 ? (
        <div style={emptyStateStyle}>
          <h3>No Reports Yet</h3>
          <p>No customer reports have been submitted yet.</p>
        </div>
      ) : (
        <div style={reportsContainerStyle}>
          {reports.map((report) => (
            <div key={report.id} style={reportCardStyle}>
              <div style={reportHeaderStyle}>
                <div>
                  <h3 style={reportTitleStyle}>{report.subject}</h3>
                  <p style={reportMetaStyle}>
                    <strong>Customer:</strong> {report.customerName} | 
                    <strong> Phone:</strong> {report.customerPhone} | 
                    <strong> Date:</strong> {formatDate(report.reportedAt)}
                  </p>
                  {report.product && (
                    <p style={reportMetaStyle}>
                      <strong>Product:</strong> {report.product.name} 
                      {report.product.market && ` (${report.product.market.name})`}
                    </p>
                  )}
                </div>
                <div style={actionButtonsStyle}>
                  <button 
                    onClick={() => openReplyModal(report)}
                    style={replyButtonStyle}
                    title="Reply to Report"
                  >
                    Reply
                  </button>
                  <button 
                    onClick={() => handleDeleteReport(report.id)}
                    style={deleteButtonStyle}
                    title="Delete Report"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div style={reportMessageStyle}>
                <strong>Message:</strong>
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

      {/* Reply Modal */}
      {replyingTo && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3>Reply to Report</h3>
            <p><strong>From:</strong> {replyingTo.customerName}</p>
            <p><strong>Subject:</strong> {replyingTo.subject}</p>
            <p><strong>Message:</strong> {replyingTo.message}</p>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Your Reply:</label>
              <textarea
                value={replyForm.adminReply}
                onChange={(e) => setReplyForm({ ...replyForm, adminReply: e.target.value })}
                placeholder="Enter your reply to the customer..."
                style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                required
              />
            </div>

            <div style={modalButtonsStyle}>
              <button 
                onClick={() => handleReply(replyingTo.id)}
                style={submitButtonStyle}
              >
                Send Reply
              </button>
              <button 
                onClick={() => setReplyingTo(null)}
                style={cancelButtonStyle}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

const refreshButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#1e88e5',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};

const reportsContainerStyle = {
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
};

const reportCardStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1.5rem',
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
  fontSize: '1.2rem',
};

const reportMetaStyle = {
  margin: '0.25rem 0',
  fontSize: '0.9rem',
  color: '#666',
};

const reportMessageStyle = {
  borderTop: '1px solid #eee',
  paddingTop: '1rem',
};

const deleteButtonStyle = {
  background: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  cursor: 'pointer',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '3rem',
  color: '#666',
};

const actionButtonsStyle = {
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
};

const replyButtonStyle = {
  background: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '500',
};

const adminReplyStyle = {
  borderTop: '1px solid #eee',
  paddingTop: '1rem',
  marginTop: '1rem',
  backgroundColor: '#f8f9fa',
  padding: '1rem',
  borderRadius: '4px',
  borderLeft: '3px solid #1e88e5',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '90%',
  maxHeight: '80vh',
  overflowY: 'auto',
};

const formGroupStyle = {
  marginBottom: '1rem',
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
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
};

const modalButtonsStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end',
  marginTop: '1rem',
};

const submitButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#1e88e5',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};

const cancelButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#6c757d',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};

export default ManageReports; 