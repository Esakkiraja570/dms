import React, { useState, useEffect } from "react";
import axios from "axios";
import AddCustomer from "./Coustomer/AddCustomer";
import "./MilkmanDashboard.css";

const MilkmanDashboard = () => {
  const [activeView, setActiveView] = useState('customers'); // 'customers' or 'entry'
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [entries, setEntries] = useState([]);
  const [pricePerLiter, setPricePerLiter] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const mobile = localStorage.getItem("mobile");
  const today = new Date().toISOString().split('T')[0];

  // Load customers on mount and refresh
  useEffect(() => {
    loadCustomers();
  }, [refreshTrigger]);

  const loadCustomers = async () => {
    try {
      const res = await axios.get(`http://localhost:1010/api/customer/my/${mobile}`);
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Error loading customers:', err);
    }
  };

  const loadCustomerEntries = async (customerId) => {
    try {
      const res = await axios.get(`http://localhost:1010/api/milk/${customerId}`);
      setEntries(res.data || []);
    } catch (err) {
      console.error('Error loading entries:', err);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile.includes(searchTerm) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setActiveView('entry');
    loadCustomerEntries(customer.id);
  };

  const handleBackToCustomers = () => {
    setSelectedCustomer(null);
    setActiveView('customers');
    setEntries([]);
  };

  const reloadCustomers = () => {
    setRefreshTrigger(prev => !prev);
  };

  return (
    <div className="milkman-dashboard">
      <div className="dashboard-header">
        <h1>🥛 Milkman Dashboard</h1>
        <div className="header-actions">
          <button
            className={`view-toggle ${activeView === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveView('customers')}
          >
            Customers ({customers.length})
          </button>
          {selectedCustomer && (
            <button
              className="back-btn"
              onClick={handleBackToCustomers}
            >
              ← Back to Customers
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-content">
        {activeView === 'customers' && !showAddCustomer && (
          <div className="customers-view">
            <div className="customers-header">
              <div className="search-section">
                <input
                  type="text"
                  placeholder="Search customers by name, mobile, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="customer-search"
                />
              </div>
              <button
                className="add-customer-btn"
                onClick={() => setShowAddCustomer(true)}
              >
                + Add Customer
              </button>
            </div>

            <div className="customers-grid">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  className="customer-card"
                  onClick={() => handleCustomerSelect(customer)}
                >
                  <h3>{customer.name}</h3>
                  <p>📱 {customer.mobile}</p>
                  <p>📍 {customer.address}</p>
                  <div className="customer-status">
                    <span className="select-indicator">Click to enter milk data</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredCustomers.length === 0 && (
              <div className="no-customers">
                <p>No customers found. Add your first customer to get started!</p>
              </div>
            )}
          </div>
        )}

        {showAddCustomer && (
          <div className="add-customer-view">
            <AddCustomer
              onAdd={() => {
                reloadCustomers();
                setShowAddCustomer(false);
              }}
              customers={customers}
            />
            <button
              className="cancel-add-btn"
              onClick={() => setShowAddCustomer(false)}
            >
              Cancel
            </button>
          </div>
        )}

        {activeView === 'entry' && selectedCustomer && (
          <DailyEntryView
            customer={selectedCustomer}
            entries={entries}
            onEntriesUpdate={loadCustomerEntries}
            onBack={handleBackToCustomers}
          />
        )}
      </div>
    </div>
  );
};

// Daily Entry View Component
const DailyEntryView = ({ customer, entries, onEntriesUpdate, onBack }) => {
  const [entryForm, setEntryForm] = useState({
    date: new Date().toISOString().split('T')[0],
    morning: '',
    evening: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [milkmanData, setMilkmanData] = useState(null);

  const mobile = localStorage.getItem("mobile");
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadMilkmanData();
  }, []);

  const loadMilkmanData = async () => {
    try {
      const res = await axios.get(`http://localhost:1010/api/milkman/me/${mobile}`);
      setMilkmanData(res.data);
      setPricePerLiter(Number(res.data?.price || 0));
      setEntryForm(prev => ({
        ...prev,
        price: res.data?.price || ''
      }));
    } catch (err) {
      console.error('Error loading milkman data:', err);
    }
  };

  // Check if entry already exists for today
  const todayEntry = entries.find(entry => entry.date === today);
  const hasTodayEntry = !!todayEntry;
  const currentMonthKey = today.slice(0, 7);
  const monthEntries = entries.filter(entry => entry.date.startsWith(currentMonthKey));
  const monthTotal = monthEntries.reduce((sum, entry) => sum + (Number(entry.total) || 0), 0);
  const monthAmount = monthTotal * pricePerLiter;

  const sendMonthlyBill = async () => {
    if (monthEntries.length === 0) {
      alert('No month entries to bill.');
      return;
    }

    const message = `Hello ${customer.name}, your milk bill for ${currentMonthKey} is ₹${monthAmount.toFixed(2)} for ${monthTotal.toFixed(2)}L. Please pay soon.`;
    if (!window.confirm(message)) return;

    try {
      await axios.post(`http://localhost:1010/api/sms/send`, null, {
        params: {
          mobile: customer.mobile,
          message
        }
      });
      alert('Monthly bill SMS sent successfully!');
    } catch (err) {
      console.error('Error sending bill SMS:', err);
      alert('Failed to send bill SMS.');
    }
  };

  const handleInputChange = (e) => {
    setEntryForm({
      ...entryForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasTodayEntry) {
      alert("Entry already exists for today. You can only edit existing entries.");
      return;
    }

    if (!entryForm.morning && !entryForm.evening) {
      alert("Please enter at least morning or evening milk quantity.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `http://localhost:1010/api/milk/add/${customer.id}`,
        {
          date: entryForm.date,
          morning: entryForm.morning || 0,
          evening: entryForm.evening || 0
        }
      );

      alert("Milk entry saved successfully! ✅");
      setEntryForm({
        date: new Date().toISOString().split('T')[0],
        morning: '',
        evening: '',
        price: milkmanData?.price || ''
      });
      onEntriesUpdate(customer.id);

    } catch (err) {
      console.error('Error saving entry:', err);
      alert("Error saving entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (entryId, field, value) => {
    try {
      await axios.put(`http://localhost:1010/api/milk/edit/${entryId}`, {
        [field]: value,
        edited: true
      });

      alert("Entry updated successfully!");
      onEntriesUpdate(customer.id);
    } catch (err) {
      console.error('Error updating entry:', err);
      alert("Error updating entry.");
    }
  };

  return (
    <div className="daily-entry-view">
      <div className="customer-info">
        <h2>Milk Entry for {customer.name}</h2>
        <p>📱 {customer.mobile} | 📍 {customer.address}</p>
      </div>

      {!hasTodayEntry ? (
        <form className="entry-form" onSubmit={handleSubmit}>
          <h3>Add Today's Milk Entry</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={entryForm.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Milk Price per Liter (₹)</label>
              <input
                type="number"
                name="price"
                value={entryForm.price}
                onChange={handleInputChange}
                step="0.01"
                placeholder="Enter price"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Morning Milk (Liters)</label>
              <input
                type="number"
                name="morning"
                value={entryForm.morning}
                onChange={handleInputChange}
                step="0.5"
                min="0"
                placeholder="0.0"
              />
            </div>

            <div className="form-group">
              <label>Evening Milk (Liters)</label>
              <input
                type="number"
                name="evening"
                value={entryForm.evening}
                onChange={handleInputChange}
                step="0.5"
                min="0"
                placeholder="0.0"
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-entry-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Entry"}
          </button>
        </form>
      ) : (
        <div className="today-entry-exists">
          <h3>Today's Entry Already Exists</h3>
          <p>You can only make one entry per day. You can edit the existing entry if needed.</p>
        </div>
      )}

      <div className="entries-history">
        <h3>Milk Entry History</h3>
        {entries.length === 0 ? (
          <p>No entries yet for this customer.</p>
        ) : (
          <div className="entries-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Morning (L)</th>
                  <th>Evening (L)</th>
                  <th>Total (L)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td>
                      {entry.date === today ? (
                        <input
                          type="number"
                          defaultValue={entry.morning}
                          step="0.5"
                          onBlur={(e) => handleEdit(entry.id, 'morning', e.target.value)}
                        />
                      ) : (
                        entry.morning
                      )}
                    </td>
                    <td>
                      {entry.date === today ? (
                        <input
                          type="number"
                          defaultValue={entry.evening}
                          step="0.5"
                          onBlur={(e) => handleEdit(entry.id, 'evening', e.target.value)}
                        />
                      ) : (
                        entry.evening
                      )}
                    </td>
                    <td>{entry.total}</td>
                    <td>
                      {entry.edited && <span className="edited-badge">Edited</span>}
                    </td>
                    <td>
                      {entry.date === today && (
                        <span className="editable-note">Click values to edit</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="monthly-bill-summary">
        <div className="summary-card">
          <h3>Monthly Summary ({currentMonthKey})</h3>
          <div className="summary-grid">
            <div>
              <strong>Total Entries:</strong>
              <p>{monthEntries.length}</p>
            </div>
            <div>
              <strong>Total Milk:</strong>
              <p>{monthTotal.toFixed(2)} L</p>
            </div>
            <div>
              <strong>Rate:</strong>
              <p>₹{pricePerLiter.toFixed(2)} / L</p>
            </div>
            <div>
              <strong>Amount Due:</strong>
              <p>₹{monthAmount.toFixed(2)}</p>
            </div>
          </div>
          <button
            className="send-bill-btn"
            onClick={sendMonthlyBill}
            disabled={monthEntries.length === 0}
          >
            Send Monthly Bill SMS
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilkmanDashboard;