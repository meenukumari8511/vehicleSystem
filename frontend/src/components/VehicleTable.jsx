import React, { useEffect, useState } from "react";

export default function VehicleTable({ refresh }) {
  const [vehicles, setVehicles] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterFuel, setFilterFuel] = useState("");
  const [sortField, setSortField] = useState("");

  const fetchVehicles = () => {
    fetch("http://127.0.0.1:5000/cars")
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchVehicles();
  }, [refresh]);

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return -1;
    if (a[sortField] > b[sortField]) return 1;
    return 0;
  });

  const filteredVehicles = sortedVehicles.filter(v => 
    (filterType ? v.vehicle_type === filterType : true) &&
    (filterFuel ? v.fuel_type === filterFuel : true)
  );

  const currentYear = new Date().getFullYear();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Vehicles List</h2>

      <div className="flex gap-4 mb-4 flex-wrap">
        <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
          <option value="">All Types</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Truck">Truck</option>
          <option value="Bus">Bus</option>
        </select>
        <select onChange={(e) => setFilterFuel(e.target.value)} value={filterFuel}>
          <option value="">All Fuel</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>
        <select onChange={(e) => setSortField(e.target.value)} value={sortField}>
          <option value="">No Sort</option>
          <option value="vehicle_type">Sort by Type</option>
          <option value="fuel_type">Sort by Fuel</option>
          <option value="registration_year">Sort by Reg Year</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Holder ID</th>
            <th>Vehicle Number</th>
            <th>Type</th>
            <th>Fuel</th>
            <th>Reg Year</th>
            <th>Expiry Year</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.map(v => {
            const expiryYear = parseInt(v.registration_year) + 10; // 10 years rule
            const expired = expiryYear < currentYear;
            return (
              <tr key={v.car_id} className={expired ? "expired" : ""}>
                <td>{v.car_id}</td>
                <td>{v.holder_id}</td>
                <td>{v.vehicle_number}</td>
                <td>{v.vehicle_type}</td>
                <td>{v.fuel_type}</td>
                <td>{v.registration_year}</td>
                <td>{expiryYear}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
