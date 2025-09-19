import React, { useState } from "react";
import './App.css';
import CombinedForm from "./components/CombinedForm.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh(!refresh);

  return (
    <Router>
      <div className="nav-bar">
        <Link to="/">Home</Link>
        <Link to="/vehicles">Vehicles</Link>
      </div>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<CombinedForm onVehicleAdded={triggerRefresh} />} />
          <Route path="/vehicles" element={<Vehicles refresh={refresh} />} />
        </Routes>
      </div>
    </Router>
  );
}
