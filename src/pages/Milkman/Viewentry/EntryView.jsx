import { useEffect, useState } from "react";
import axios from "axios";

const EntryView = () => {
  const [data, setData] = useState(null);
  const mobile = localStorage.getItem("customerMobile");

  useEffect(() => {
    axios.get(`http://localhost:1010/api/customer/find/${mobile}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome {data.name}</h2>
      <p>Mobile: {data.mobile}</p>

      <h3>Your Bill</h3>

      {data.milkEntries.map(e => (
        <div key={e.id}>
          <p>{e.date}</p>
          <p>{e.total} litre</p>
          <p>₹{e.amount}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default EntryView;