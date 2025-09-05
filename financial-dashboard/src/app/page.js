"use client";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import ChartClients from "./components/ChartClient";
import ChartSIP from "./components/ChartSIP";
import ChartMonthlyMIS from "./components/ChartMonthlyMIS";
import FilterBar from "./components/FilterBar";
import { downloadPDF } from "./utils/downloadPDF";


export default function Dashboard() {
  const [aum, setAum] = useState(null);
  const [sip, setSip] = useState(null);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("stats");

  useEffect(() => {
    fetch("/api/aum.json").then(res => res.json()).then(setAum);
    fetch("/api/sip.json").then(res => res.json()).then(setSip);

    // Fetch stats depending on filter
    fetch(`/api/${filter}.json`).then((res) => res.json()).then(setStats);
  }, [filter]);

  return (
    <div>
      <Navbar />
      <div id="dashboard" className="p-6 space-y-6">
        
        {/* Download PDF button */}
        <button onClick={() => downloadPDF()}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">
          Download PDF
        </button>


        {/* Main AUM + SIP Cards */}
        <div  className="pdf-section grid grid-cols-1 md:grid-cols-2 gap-6" data-title="AUM / SIP">
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

        {/* Filter */}
        <FilterBar onFilter={(f) => setFilter(`stats-${f}`)} />

        {/* Stats Cards */}
        <div className="pdf-section space-y-6" data-title="Stats Overview">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard title="Purchases" value={stats.purchases} />
            <StatCard title="Redemptions" value={stats.redemptions} />
            <StatCard title="Rejected Txns" value={stats.rejected} />
            <StatCard title="SIP Rejections" value={stats.sipRejected} />
            <StatCard title="New SIP" value={stats.newSip} />
          </div>
        )}
        </div>

        {/* Charts */}
        <div className="pdf-section grid grid-cols-1 md:grid-cols-2 gap-6" data-title="Charts">
          <div className="pdf-chart" data-title="Client Distribution Chart">
            <ChartClients />
          </div>
          <div className="pdf-chart" data-title="SIP Trend Chart">
            <ChartSIP />
          </div>
        </div>
        <div className="pdf-chart" data-title="Monthly MIS Chart">
          <ChartMonthlyMIS />
        </div>
      </div>
    </div>
  );
}
