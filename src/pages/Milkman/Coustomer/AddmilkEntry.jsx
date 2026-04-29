import axios from "axios";
import { useState } from "react";

const AddmilkEntry = ({ customerId, onAdd }) => {

  const [form, setForm] = useState({
    date: "",
    morning: "",
    evening: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      `http://localhost:1010/api/milk/add/${customerId}`,
      form
    );

    alert("Milk Entry Added ✅");

    onAdd(); // refresh

    setForm({ date: "", morning: "", evening: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Milk Entry</h3>

      <input type="date" name="date" value={form.date} onChange={handleChange} /><br />

      <input name="morning" placeholder="Morning" value={form.morning} onChange={handleChange} /><br />

      <input name="evening" placeholder="Evening" value={form.evening} onChange={handleChange} /><br />

      <button>Add</button>
    </form>
  );
};

export default AddmilkEntry;