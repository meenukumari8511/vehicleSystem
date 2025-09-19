import React, { useState } from "react";

export default function CombinedForm({ onVehicleAdded }) {
  const [holderId, setHolderId] = useState("");
  const [holderName, setHolderName] = useState("");
  const [holderAddress, setHolderAddress] = useState("");

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [registrationYear, setRegistrationYear] = useState("");

  const [holderAdded, setHolderAdded] = useState(false);

  const handleHolderSubmit = (e) => {
    e.preventDefault();
    if (!holderName || !holderAddress) return alert("Enter holder details");

    fetch("http://127.0.0.1:5000/holders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: holderName, address: holderAddress }),
    })
      .then(res => res.json())
      .then(data => {
        alert(`Holder Added! ID: ${data.holder_id}`);
        setHolderId(data.holder_id);
        setHolderAdded(true);
      })
      .catch(err => alert("Error adding holder"));
  };

  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    if (!vehicleNumber || !vehicleType || !fuelType || !registrationYear) return alert("Enter vehicle details");

    fetch("http://127.0.0.1:5000/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        holder_id: holderId,
        vehicle_number: vehicleNumber,
        vehicle_type: vehicleType,
        fuel_type: fuelType,
        registration_year: registrationYear,
      }),
    })
      .then(() => {
        alert("Vehicle Added!");
        onVehicleAdded();
        setVehicleNumber(""); setVehicleType(""); setFuelType(""); setRegistrationYear("");
      })
      .catch(err => alert("Error adding vehicle"));
  };

  return (
    <div className="forms-grid">
      <div className="form-card">
        <h3>Add Holder</h3>
        <form onSubmit={handleHolderSubmit}>
          <input value={holderName} onChange={(e) => setHolderName(e.target.value)} placeholder="Holder Name" />
          <input value={holderAddress} onChange={(e) => setHolderAddress(e.target.value)} placeholder="Holder Address" />
          <button type="submit" className="add-holder" disabled={holderAdded}>
            {holderAdded ? "Holder Added ✅" : "Add Holder"}
          </button>
        </form>
      </div>

      <div className="form-card">
        <h3>Add Vehicle</h3>
        <form onSubmit={handleVehicleSubmit}>
          <input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="Vehicle Number" disabled={!holderAdded} />
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} disabled={!holderAdded}>
            <option value="">Select Vehicle Type</option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Truck">Truck</option>
            <option value="Bus">Bus</option>
          </select>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} disabled={!holderAdded}>
            <option value="">Select Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>
          <input value={registrationYear} onChange={(e) => setRegistrationYear(e.target.value)} placeholder="Registration Year" disabled={!holderAdded} />
          <button type="submit" className="add-car" disabled={!holderAdded}>Add Vehicle</button>
        </form>
      </div>
    </div>
  );
}
