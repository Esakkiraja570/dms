import React from 'react'

const MilkPrice = () => {  const [price, setPrice] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("milkPrice");
    if (saved) setPrice(saved);
  }, []);

  const handleSave = () => {
    if (!price || price <= 0) {
      alert("Enter valid price ❌");
      return;
    }

    localStorage.setItem("milkPrice", price);
    alert("Price saved ✅");
  };

  return (
    <div>
      <h3>Set Milk Price</h3>

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter price per litre"
      />

      <button onClick={handleSave}>Save</button>
    </div>
  );
};



export default MilkPrice