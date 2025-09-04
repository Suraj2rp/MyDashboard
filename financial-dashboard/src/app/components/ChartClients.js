"use client";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export default function ChartClients() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/charts.json")
      .then((res) => res.json())
      .then((d) => setData(d.clients));
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="font-semibold mb-2">Clients</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <XAxis dataKey="name" />
          <YAxis dataKey="value" />
          <Tooltip />
          <Scatter data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
