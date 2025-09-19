import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function DashboardWidgets({ vehicles }) {
  const currentYear = new Date().getFullYear();
  const totalVehicles = vehicles.length;
  const expiredCount = vehicles.filter(v=>parseInt(v.registration_year)+10<currentYear).length;

  const vehicleTypeCount = vehicles.reduce((acc,v)=>{
    acc[v.vehicle_type] = (acc[v.vehicle_type]||0)+1; return acc;
  },{});

  const fuelTypeCount = vehicles.reduce((acc,v)=>{
    acc[v.fuel_type] = (acc[v.fuel_type]||0)+1; return acc;
  },{});

  const typeData = {
    labels: Object.keys(vehicleTypeCount),
    datasets:[{
      label:"Vehicle Type Count",
      data:Object.values(vehicleTypeCount),
      backgroundColor:["#3b82f6","#10b981","#f59e0b","#ef4444"],
      borderRadius:5,
    }]
  }

  const fuelData = {
    labels: Object.keys(fuelTypeCount),
    datasets:[{
      label:"Fuel Type Count",
      data:Object.values(fuelTypeCount),
      backgroundColor:["#3b82f6","#fbbf24","#22d3ee"]
    }]
  }

  return (
    <div>
      <div className="widgets-grid">
        <div className="widget-card">
          <h3>Total Vehicles</h3>
          <p>{totalVehicles}</p>
        </div>
        <div className="widget-card expired-widget">
          <h3>Expired Vehicles</h3>
          <p>{expiredCount}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Vehicles by Type</h3>
          <Bar data={typeData} options={{ responsive:true, plugins:{legend:{display:false}}}} />
        </div>
        <div className="chart-card">
          <h3>Vehicles by Fuel Type</h3>
          <Pie data={fuelData} options={{responsive:true}}/>
        </div>
      </div>
    </div>
  )
}
