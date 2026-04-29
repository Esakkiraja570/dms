import { useEffect, useState } from "react";
import axios from "axios";

const Billview = ({ customerId }) => {
  const [bill, setBill] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:1010/api/milk/${customerId}`)
      .then(res => setBill(res.data))
      .catch(err => console.error(err));
  }, []);

  let total = 0;

  return (
    <div>
      <h3>Bill</h3>

      {bill.map(b => {
        total += b.amount;
        return (
          <div key={b.id}>
            <p>Date: {b.date}</p>
            <p>Total Litre: {b.total}</p>            <p>Amount: ₹{b.amount}</p>
            <hr />
          </div>
        );
      })}

      <h2>Total Bill: ₹{total}</h2>
    </div>
  );
};

export default Billview;