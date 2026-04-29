// import React, { useState, useMemo } from "react";
// import "./CustomerBillingSummary.css";

// const CustomerBillingSummary = ({ entries, customer }) => {
//   const [pricePerLitre, setPricePerLitre] = useState(50);

//   // Calculate metrics
//   const metrics = useMemo(() => {
//     if (!entries || entries.length === 0) {
//       return {
//         totalDays: 0,
//         totalLitres: 0,
//         totalBill: 0
//       };
//     }

//     // Total days = number of entries
//     const totalDays = entries.length;

//     // Total litres = sum of all (morning + evening)
//     const totalLitres = entries.reduce((sum, entry) => {
//       const morning = parseFloat(entry.morning) || 0;
//       const evening = parseFloat(entry.evening) || 0;
//       return sum + morning + evening;
//     }, 0);

//     // Total bill = price * total litres
//     const totalBill = totalLitres * pricePerLitre;

//     return {
//       totalDays,
//       totalLitres: totalLitres.toFixed(2),
//       totalBill: totalBill.toFixed(2)
//     };
//   }, [entries, pricePerLitre]);

//   return (
//     <div className="customer-billing-container">
//       <h3 className="billing-title">📋 Your Bill Summary</h3>

//       <div className="billing-grid">
//         {/* Total Days */}
//         <div className="billing-card">
//           <div className="billing-label">Total Days</div>
//           <div className="billing-value">{metrics.totalDays}</div>
//           <div className="billing-unit">days</div>
//         </div>

//         {/* Total Litres */}
//         <div className="billing-card">
//           <div className="billing-label">Total Litres Received</div>
//           <div className="billing-value">{metrics.totalLitres}</div>
//           <div className="billing-unit">L</div>
//         </div>

//         {/* Price per Litre */}
//         <div className="billing-card">
//           <div className="billing-label">Price per Litre</div>
//           <div className="billing-input-wrapper">
//             <span className="billing-currency">₹</span>
//             <input
//               type="number"
//               value={pricePerLitre}
//               onChange={(e) => setPricePerLitre(parseFloat(e.target.value) || 0)}
//               min="0"
//               step="1"
//               className="billing-input"
//               placeholder="Enter price"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Total Bill Amount */}
//       <div className="billing-total">
//         <div className="total-label">Total Amount Due</div>
//         <div className="total-amount">₹ {metrics.totalBill}</div>
//         <div className="total-formula">
//           {metrics.totalLitres} L × ₹{pricePerLitre} = ₹ {metrics.totalBill}
//         </div>
//         <div className="total-period">
//           For {metrics.totalDays} days of delivery
//         </div>
//       </div>

//       {/* Customer Info */}
//       {customer && (
//         <div className="billing-customer-info">
//           <h4>Billing To</h4>
//           <p className="customer-name">{customer.name}</p>
//           <p className="customer-detail">
//             <span>📞</span> {customer.mobile}
//           </p>
//           <p className="customer-detail">
//             <span>📍</span> {customer.address}
//           </p>
//         </div>
//       )}

//       {/* Note Section */}
//       <div className="billing-note">
//         <p><strong>Note:</strong> The price per litre can be adjusted to match your agreement with the milkman. The bill is calculated based on the milk entries recorded.</p>
//       </div>
//     </div>
//   );
// };

// export default CustomerBillingSummary;
