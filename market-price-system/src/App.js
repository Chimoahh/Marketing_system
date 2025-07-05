import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Market from './pages/Market';
import Products from './pages/Products';
import AdminDashboard from './pages/AdminDashboard';
import ManageMarkets from './pages/ManageMarkets';
import ManageProducts from './pages/ManageProducts';
import ManagePrices from './pages/ManagePrices'; 
import Login from './pages/Login'; 
import ReportIssue from './pages/ReportIssue';
import ManageReports from './pages/ManageReports';
import MyReports from './pages/MyReports';

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/markets" element={<Market />} />
        <Route path="/products" element={<Products />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/markets" element={<ManageMarkets />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/prices" element={<ManagePrices />} />
        <Route path="/admin/reports" element={<ManageReports />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/my-reports" element={<MyReports />} />
       
        {/* <Route path="/market/:marketId/products" element={<MarketProducts />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
