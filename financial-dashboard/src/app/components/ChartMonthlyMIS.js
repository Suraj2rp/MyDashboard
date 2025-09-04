"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export default function ChartMonthlyMIS() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/charts.json")
      .then((res) => res.json())
      .then((d) => setData(d.monthlyMIS));
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="font-semibold mb-2">Monthly MIS</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="aum" stroke="#82ca9d" />
          <Line type="monotone" dataKey="sip" stroke="#8884d8" />
          <Line type="monotone" dataKey="clients" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
