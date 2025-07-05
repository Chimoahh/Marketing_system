import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Dashboard.css'; // Import the CSS file

function Dashboard({ children }) {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
