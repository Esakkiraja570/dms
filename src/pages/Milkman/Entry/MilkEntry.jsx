import axios from "axios";
import { useState } from "react";

const MilkEntry = ({ customers }) => {

  const [customerId, setCustomerId] = useState("");
  const [data, setData] = useState({
    date: "",
    morning: "",
    evening: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    try {
      await axios.post(
        `http://localhost:1010/api/milk/add/${customerId}`,
        data
      );

      alert("Entry Saved ✅");

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  return (
    <div>

      <h3>Milk Entry</h3>

      {/* Select Customer */}
      <select onChange={(e) => setCustomerId(e.target.value)}>
        <option>Select Customer</option>
        {customers.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <br /><br />

      {/* Date */}
      <input type="date" name="date" onChange={handleChange} />

      <br /><br />

      {/* Morning */}
      <input
        type="number"
        name="morning"
        placeholder="Morning Milk"
        onChange={handleChange}
      />

      <br /><br />

      {/* Evening */}
      <input
        type="number"
        name="evening"
        placeholder="Evening Milk"
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={handleSubmit}>Save Entry</button>

    </div>
  );
};

export default MilkEntry;