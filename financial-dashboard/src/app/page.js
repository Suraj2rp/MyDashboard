"use client";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import ChartClients from "./components/ChartClients";
import ChartSIP from "./components/ChartSIP";
import ChartMonthlyMIS from "./components/ChartMonthlyMIS";

export default function Dashboard() {
  const [aum, setAum] = useState(null);
  const [sip, setSip] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/aum.json").then(res => res.json()).then(setAum);
    fetch("/api/sip.json").then(res => res.json()).then(setSip);
    fetch("/api/stats.json").then(res => res.json()).then(setStats);
  }, []);

  return (
    <div>
      <Navbar />

      <div className="p-6 space-y-6">
        {/* Main AUM + SIP Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">AUM</h2>
            {aum ? (
              <>
                <p className="text-2xl font-bold">{aum.value} Cr</p>
                <p className="text-sm text-green-600">MoM: {aum.change}%</p>
              </>
            ) : <p>Loading...</p>}
          </div>

          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">SIP</h2>
            {sip ? (
              <>
                <p className="text-2xl font-bold">{sip.value} Cr</p>
                <p className="text-sm text-gray-600">MoM: {sip.change}%</p>
              </>
            ) : <p>Loading...</p>}
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard title="Purchases" value={stats.purchases} />
            <StatCard title="Redemptions" value={stats.redemptions} />
            <StatCard title="Rejected Txns" value={stats.rejected} />
            <StatCard title="SIP Rejections" value={stats.sipRejected} />
            <StatCard title="New SIP" value={stats.newSip} />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartClients />
          <ChartSIP />
        </div>
        <ChartMonthlyMIS />
      </div>
    </div>
  );
}
