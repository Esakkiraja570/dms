import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Distributors.css';

const Distributors = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [newspapers, setNewspapers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  const distributorMobile = localStorage.getItem("distributorMobile") || "1234567890";

  // Check authentication and load initial data
  useEffect(() => {
    const checkAuth = () => {
      const mobile = localStorage.getItem("distributorMobile");
      if (!mobile) {
        window.location.href = "/distributor-login";
        return;
      }
    };

    checkAuth();
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const mobile = localStorage.getItem("distributorMobile");
    if (!mobile) return;

    setLoading(true);
    try {
      await Promise.all([
        loadCustomers(),
        loadNewspapers(),
        loadWorkers(),   // ✅ FIXED
        loadEntries()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await axios.get(`http://localhost:1010/api/distributor/customers/${distributorMobile}`);
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Error loading customers:', err);
    }
  };

  const loadNewspapers = async () => {
    try {
      const res = await axios.get(`http://localhost:1010/api/distributor/newspapers/${distributorMobile}`);
      setNewspapers(res.data || []);
    } catch (err) {
      console.error('Error loading newspapers:', err);
    }
  };

  // ✅ FIX ADDED HERE
  const loadWorkers = async () => {
    try {
      const res = await axios.get(`http://localhost:1010/api/distributor/workers/${distributorMobile}`);
      setWorkers(res.data || []);
    } catch (err) {
      console.error('Error loading workers:', err);
    }
  };

  const loadEntries = async () => {
    try {
      const res = await axios.get(`http://localhost:1010/api/distributor/entries/today/${distributorMobile}`);
      setEntries(res.data || []);
    } catch (err) {
      console.error('Error loading entries:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("distributorMobile");
    window.location.href = "/distributor-login";
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'customers':
        return <CustomerManagement customers={customers} onUpdate={loadCustomers} />;
      case 'newspapers':
        return <NewspaperManagement newspapers={newspapers} onUpdate={loadNewspapers} />;
      case 'daily-entry':
        return <DailyEntry customers={customers} newspapers={newspapers} workers={workers} onUpdate={loadEntries} />;
      case 'billing':
        return <BillingManagement customers={customers} />;
      case 'workers':
        return <WorkerManagement workers={workers} onUpdate={loadWorkers} />;
      default:
        return <DashboardOverview customers={customers} newspapers={newspapers} entries={entries} />;
    }
  };

  if (loading) {
    return (
      <div className="distributors-container">
        <div className="loading-screen">
          <h2>Loading your dashboard...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="distributors-container">
      <div className="distributors-header">
        <div className="header-content">
          <h1>📰 Newspaper Distributor Management</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="distributors-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </button>
          <button className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}>
            Customers ({customers.length})
          </button>
          <button className={activeTab === 'newspapers' ? 'active' : ''} onClick={() => setActiveTab('newspapers')}>
            Newspapers ({newspapers.length})
          </button>
          <button className={activeTab === 'daily-entry' ? 'active' : ''} onClick={() => setActiveTab('daily-entry')}>
            Daily Entry
          </button>
          <button className={activeTab === 'billing' ? 'active' : ''} onClick={() => setActiveTab('billing')}>
            Billing & Payments
          </button>
          <button className={activeTab === 'workers' ? 'active' : ''} onClick={() => setActiveTab('workers')}>
            Workers ({workers.length})
          </button>
        </div>
      </div>

      <div className="distributors-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Distributors;