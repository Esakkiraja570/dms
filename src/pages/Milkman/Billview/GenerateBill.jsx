import { useState } from "react";
import axios from "axios";

const GenerateBill = ({ customerId }) => {

  const [price, setPrice] = useState("");

  const generateBill = async () => {
    try {
      await axios.post(
        `http://localhost:1010/api/milk/generate-bill/${customerId}?price=${price}`
      );

      alert("Bill Generated ✅");

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  return (
    <div>
      <h3>Generate Bill</h3>

      <input
        type="number"
        placeholder="Enter price per litre"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      <button onClick={generateBill}>
        Generate Bill
      </button>
    </div>
  );
};

export default GenerateBill;