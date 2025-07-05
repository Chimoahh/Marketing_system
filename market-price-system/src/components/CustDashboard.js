import React from 'react';
import Header from './Header';
import CustSidebar from './CustSidebar'; // Assuming this is the correct import for the customer sidebar
import Footer from './Footer';
// import './DashboardLayout.css'; // Optional CSS file if you created one

function CustDashboard({ children }) {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-body">
        <CustSidebar />
        <main style={{ flex: 1, padding: '2rem', background: '#f9f9f9' }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default CustDashboard;
