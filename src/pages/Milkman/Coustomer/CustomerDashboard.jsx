import axios from "axios";
import { useEffect, useState } from "react";

const CustomerDashboard = () => {

  const [customer, setCustomer] = useState(null);
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);

  const mobile = localStorage.getItem("mobile");

  useEffect(() => {

    // ✅ Step 1: get customer
    axios.get(`http://localhost:1010/api/customer/login/${mobile}`)
      .then(res => {

        setCustomer(res.data);

        const customerId = res.data.id;

        // ✅ Step 2: get milk entries
        axios.get(`http://localhost:1010/api/milk/customer/${customerId}`)
          .then(res2 => {

            setEntries(res2.data);

            // ✅ calculate total
            let sum = 0;
            res2.data.forEach(e => {
              sum += e.total;
            });

            setTotal(sum);
          });

      })
      .catch(err => {
        console.error(err);
        alert("Customer not found ❌");
      });

  }, []);

  return (
    <div>
      <h2>Customer Dashboard</h2>

      {customer && (
        <div>
          <p><b>Name:</b> {customer.name}</p>
          <p><b>Mobile:</b> {customer.mobile}</p>
        </div>
      )}

      <h3>Milk Entries</h3>

      {entries.length === 0 ? (
        <p>No entries ❌</p>
      ) : (
        entries.map(e => (
          <div key={e.id}>
            <p>
              {e.date} | Morning: {e.morning} | Evening: {e.evening} | Total: {e.total}
            </p>
          </div>
        ))
      )}

      <h2>Total Milk: {total} Litres 🥛</h2>
    </div>
  );
};

export default CustomerDashboard;