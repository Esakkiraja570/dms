// import { useEffect, useState } from "react";
// import axios from "axios";

// const CustomerView = () => {
//   const [data, setData] = useState(null);
//   const mobile = localStorage.getItem("customerMobile");

//   useEffect(() => {
//     axios.get(`http://localhost:1010/api/customer/find/${mobile}`)
//       .then(res => setData(res.data));
//   }, []);

//   if (!data) return <p>Loading...</p>;

//   let total = 0;

//   return (
//     <div>
//       <h2>{data.name}</h2>

//       {data.milkEntries.map(e => {
//         total += e.amount;

//         return (
//           <div key={e.id}>
//             <p>Date: {e.date}</p>
//             <p>{e.total} litre</p>
//             <p>₹{e.amount}</p>
//             <hr />
//           </div>
//         );
//       })}

//       <h2>Total Bill: ₹{total}</h2>
//     </div>
//   );
// };

// export default CustomerView;