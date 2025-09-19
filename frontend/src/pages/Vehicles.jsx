import React, { useEffect, useState } from "react";
import DashboardWidgets from "../components/DashboardWidgets.jsx";

export default function Vehicles({ refresh }) {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchVehicles = () => {
    fetch("http://127.0.0.1:5000/cars")
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchVehicles(); }, [refresh]);

  const filtered = vehicles.filter(v =>
    v.car_number.toLowerCase().includes(search.toLowerCase()) ||
    v.holder_id.toString().includes(search) ||
    v.vehicle_type.toLowerCase().includes(search.toLowerCase()) ||
    v.fuel_type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const displayed = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="app-container">
      <div className="hero-section">
        <h1>Vehicles Dashboard 📊</h1>
        <p>Monitor all vehicles and registration expiry status.</p>
      </div>

      <DashboardWidgets vehicles={vehicles} />

      <input
        type="text"
        placeholder="Search by number, holder, type, fuel..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        style={{ width:"100%", padding:"12px", borderRadius:"12px", border:"1px solid #cbd5e1", fontSize:"16px", margin:"20px 0" }}
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Holder ID</th>
            <th>Vehicle Number</th>
            <th>Vehicle Type</th>
            <th>Fuel Type</th>
            <th>Registration Year</th>
            <th>Expiry Year</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map(v => {
            const expired = parseInt(v.registration_year)+10 < new Date().getFullYear();
            return (
              <tr key={v.car_id} className={expired?"expired":""}>
                <td>{v.car_id}</td>
                <td>{v.holder_id}</td>
                <td>{v.car_number}</td>
                <td>{v.vehicle_type}</td>
                <td>{v.fuel_type}</td>
                <td>{v.registration_year}</td>
                <td>{parseInt(v.registration_year)+10}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ display:"flex", justifyContent:"center", marginTop:"20px", gap:"10px" }}>
        <button disabled={currentPage===1} onClick={()=>setCurrentPage(prev=>prev-1)}>Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(prev=>prev+1)}>Next</button>
      </div>
    </div>
  )
}
