import React from "react";
import { useNavigate } from "react-router-dom";

function AgentDashboard() {

  const nav = useNavigate();

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={() => nav("/add")}>
        Add Customer
      </button>

      <button onClick={() => nav("/list")}>
        View Customers
      </button>

    </div>
  );
}

export default Dashboard;