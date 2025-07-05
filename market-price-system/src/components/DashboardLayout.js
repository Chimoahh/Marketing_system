import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
// import './DashboardLayout.css'; // Optional CSS file if you created one

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', background: '#f9f9f9' }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardLayout;
