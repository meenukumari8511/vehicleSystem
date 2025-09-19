import React, { useState } from "react";
import CombinedForm from "../components/CombinedForm.jsx";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="app-container">
      <div className="hero-section">
        <h1>Vehicle Management Dashboard 🚀</h1>
        <p>Add new holders and vehicles efficiently.</p>
      </div>

      <div className="forms-grid">
        <CombinedForm onVehicleAdded={() => setRefresh(!refresh)} />
      </div>
    </div>
  );
}
