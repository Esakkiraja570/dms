import React, { useMemo, useState } from "react";
import axios from "axios";
import { publishEmiUpdate, pushActivity } from "../emiRealtime";
import { formatCurrency } from "../emiUtils";

const initialForm = {
  name: "",
  mobile: "",
  address: "",
  productName: "",
  productPrice: "",
  downPayment: "",
  dueDate: "",
  interest: "",
  months: ""
};

const AddCustomer = ({ agentId, existingCustomers = [], onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(initialForm);

  const calculateEMI = (principal, rate, months) => {
    if (!principal || !months) return 0;

    const monthlyRate = rate / 12 / 100;

    if (monthlyRate === 0) {
      return (principal / months).toFixed(2);
    }

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return Number.isFinite(emi) ? emi.toFixed(2) : 0;
  };

  const preview = useMemo(() => {
    const price = Number(form.productPrice) || 0;
    const down = Number(form.downPayment) || 0;
    const rate = Number(form.interest) || 0;
    const months = Number(form.months) || 0;

    const loanAmount = Math.max(price - down, 0);
    const emiAmount = Number(calculateEMI(loanAmount, rate, months)) || 0;

    return { loanAmount, emiAmount };
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedValue = name === "mobile" ? value.replace(/\D/g, "") : value;

    setForm((prev) => ({ ...prev, [name]: updatedValue }));
    setMessage("");
  };

  const validate = () => {
    if (!agentId) return "Agent not found. Please login again.";
    if (!form.name.trim() || !form.mobile.trim() || !form.address.trim()) {
      return "Name, mobile, and address are required.";
    }
    if (!form.productName.trim()) return "Product name is required.";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return "Invalid mobile number.";

    if (existingCustomers.some((customer) => customer.mobile === form.mobile)) {
      return "Customer already exists.";
    }

    const price = Number(form.productPrice);
    const down = Number(form.downPayment);
    const months = Number(form.months);
    const dueDate = Number(form.dueDate);

    if (!price || price <= 0) return "Enter a valid product price.";
    if (down < 0 || down >= price) return "Invalid down payment.";
    if (!months || months <= 0) return "Invalid months.";
    if (!dueDate || dueDate < 1 || dueDate > 31) return "Invalid due date.";

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const error = validate();
    if (error) {
      setMessage(error);
      return;
    }

    const price = Number(form.productPrice);
    const down = Number(form.downPayment);
    const rate = Number(form.interest) || 0;
    const months = Number(form.months);
    const dueDate = Number(form.dueDate);
    const loanAmount = Math.max(price - down, 0);
    const emiAmount = Number(calculateEMI(loanAmount, rate, months));
    const totalAmount = Number((emiAmount * months).toFixed(2));

    const payload = {
      name: form.name,
      mobile: form.mobile,
      address: form.address,
      productName: form.productName,
      productPrice: price,
      downPayment: down,
      interest: rate,
      months,
      dueDate,
      loanAmount,
      emiAmount,
      totalAmount,
      totalPaid: 0,
      balance: totalAmount,
      status: "ACTIVE"
    };

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`http://localhost:1010/customer/add/${agentId}`, payload);
      const createdCustomer = response.data || payload;

      setMessage(`Customer added successfully. EMI set to ${formatCurrency(createdCustomer.emiAmount || emiAmount)}.`);
      setForm(initialForm);

      pushActivity({
        type: "customer-added",
        title: `Customer added: ${createdCustomer.name || payload.name}`,
        meta: `${payload.productName} • ${formatCurrency(createdCustomer.emiAmount || emiAmount)} / month`
      });
      publishEmiUpdate({
        type: "customer-added",
        agentId,
        customerId: createdCustomer.id || null
      });

      if (onAdd) {
        await onAdd();
      }
    } catch (err) {
      console.error("Add customer failed:", err);
      setMessage("Failed to add customer.");
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message.toLowerCase().includes("successfully");

  return (
    <div className="emi-section-card">
      <h3>Add Customer</h3>
      <p className="emi-subtitle">Create a customer EMI plan and billing schedule.</p>

      {message && <div className={`emi-alert ${isSuccess ? "success" : "error"}`}>{message}</div>}

      <form onSubmit={handleSubmit} className="emi-form-grid">
        <div className="emi-field">
          <label>Customer Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="emi-field">
          <label>Mobile</label>
          <input name="mobile" value={form.mobile} onChange={handleChange} maxLength="10" />
        </div>

        <div className="emi-field" style={{ gridColumn: "1 / -1" }}>
          <label>Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} />
        </div>

        <div className="emi-field">
          <label>Product</label>
          <input name="productName" value={form.productName} onChange={handleChange} />
        </div>

        <div className="emi-field">
          <label>Price</label>
          <input name="productPrice" type="number" value={form.productPrice} onChange={handleChange} />
        </div>

        <div className="emi-field">
          <label>Down Payment</label>
          <input name="downPayment" type="number" value={form.downPayment} onChange={handleChange} />
        </div>

        <div className="emi-field">
          <label>Interest %</label>
          <input name="interest" type="number" value={form.interest} onChange={handleChange} />
        </div>

        <div className="emi-field">
          <label>Months</label>
          <input name="months" type="number" value={form.months} onChange={handleChange} />
        </div>

        <div className="emi-field">
          <label>Due Date</label>
          <input name="dueDate" type="number" value={form.dueDate} onChange={handleChange} />
        </div>

        <div className="emi-stat-grid" style={{ gridColumn: "1 / -1" }}>
          <div className="emi-stat-card">
            <h4>Loan</h4>
            <p>{formatCurrency(preview.loanAmount)}</p>
          </div>
          <div className="emi-stat-card">
            <h4>EMI</h4>
            <p>{formatCurrency(preview.emiAmount)}</p>
          </div>
        </div>

        <div className="emi-actions" style={{ gridColumn: "1 / -1" }}>
          <button type="submit" className="emi-button success" disabled={loading}>
            {loading ? "Saving..." : "Add Customer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
