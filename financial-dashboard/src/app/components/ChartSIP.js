"use client";
import { BarChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export default function ChartSIP() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/charts.json")
      .then((res) => res.json())
      .then((d) => setData(d.sipBusiness));
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="font-semibold mb-2">SIP Business</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sip" fill="#82ca9d" />
          <Line type="monotone" dataKey="growth" stroke="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
