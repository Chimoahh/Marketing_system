import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DashboardLayout from '../components/DashboardLayout';

function AdminMarketManager() {
  const [markets, setMarkets] = useState([]);

  const fetchMarkets = () => {
    axios.get('http://localhost:8090/api/markets')
      .then(response => setMarkets(response.data))
      .catch(error => {
        console.error('Failed to fetch markets', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load markets.',
          background: '#f4faff',
          confirmButtonColor: '#1e88e5',
        });
      });
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const handleAddMarketModal = () => {
    Swal.fire({
      title: 'Add Market',
      html:
        `<input id="swal-name" class="swal2-input" placeholder="Market Name">` +
        `<input id="swal-location" class="swal2-input" placeholder="Location">`,
      confirmButtonText: 'Add',
      showCancelButton: true,
      confirmButtonColor: '#1e88e5',
      background: '#f4faff',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value;
        const location = document.getElementById('swal-location').value;

        if (!name || !location) {
          Swal.showValidationMessage('Please enter all fields');
          return false;
        }

        return { name, location };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        axios.post('http://localhost:8090/api/markets', result.value)
          .then(() => {
            fetchMarkets();
            Swal.fire({
              icon: 'success',
              title: 'Market added',
              background: '#f4faff',
              confirmButtonColor: '#1e88e5',
            });
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to create market.',
              background: '#f4faff',
              confirmButtonColor: '#1e88e5',
            });
          });
      }
    });
  };

  const handleEditModal = (market) => {
    Swal.fire({
      title: 'Edit Market',
      html:
        `<input id="swal-name" class="swal2-input" value="${market.name}" placeholder="Market Name">` +
        `<input id="swal-location" class="swal2-input" value="${market.location}" placeholder="Location">`,
      confirmButtonText: 'Update',
      showCancelButton: true,
      confirmButtonColor: '#1e88e5',
      background: '#f4faff',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value;
        const location = document.getElementById('swal-location').value;

        if (!name || !location) {
          Swal.showValidationMessage('Please enter all fields');
          return false;
        }

        return { name, location };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        axios.put(`http://localhost:8090/api/markets/${market.id}`, result.value)
          .then(() => {
            fetchMarkets();
            Swal.fire({
              icon: 'success',
              title: 'Market updated',
              background: '#f4faff',
              confirmButtonColor: '#1e88e5',
            });
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update market.',
              background: '#f4faff',
              confirmButtonColor: '#1e88e5',
            });
          });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This market will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e88e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#f4faff'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8090/api/markets/${id}`)
          .then(() => {
            fetchMarkets();
            Swal.fire({
              title: 'Deleted!',
              text: 'Market has been deleted.',
              icon: 'success',
              confirmButtonColor: '#1e88e5',
              background: '#f4faff',
            });
          })
          .catch(() => {
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete market.',
              icon: 'error',
              confirmButtonColor: '#1e88e5',
              background: '#f4faff',
            });
          });
      }
    });
  };

  // Inline styles for buttons
  const styles = {
    primaryBtn: {
      marginBottom: '1.5rem',
      padding: '10px 20px',
      backgroundColor: '#1e88e5',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    primaryBtnHover: {
      backgroundColor: '#1565c0',
    },
    secondaryBtn: {
      marginRight: '1rem',
      padding: '6px 12px',
      backgroundColor: 'transparent',
      color: '#1e88e5',
      border: '2px solid #1e88e5',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    dangerBtn: {
      padding: '6px 12px',
      backgroundColor: '#e53935',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <DashboardLayout>
      <h2>Admin: Manage Markets</h2>

      <button
        onClick={handleAddMarketModal}
        style={styles.primaryBtn}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#1565c0'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = '#1e88e5'}
      >
        Add New Market
      </button>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {markets.length === 0 ? (
          <p>No markets available.</p>
        ) : (
          markets.map(market => (
            <div
              key={market.id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                width: '300px',
                backgroundColor: '#fff',
              }}
            >
              <h3>{market.name}</h3>
              <p><strong>Location:</strong> {market.location}</p>
              <button
                onClick={() => handleEditModal(market)}
                style={styles.secondaryBtn}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#1e88e5';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#1e88e5';
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(market.id)}
                style={styles.dangerBtn}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#ab000d'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#e53935'}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminMarketManager;
