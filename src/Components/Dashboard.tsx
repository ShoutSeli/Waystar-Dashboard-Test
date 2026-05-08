import React, { useState, useEffect } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  LineElement, PointElement, CategoryScale, LinearScale,
} from "chart.js";
import Layout from "./Layout";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

// ─── Shared design tokens (used identically across all pages) ───────────────
const CARD = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200";
// ────────────────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const [claimsData, setClaimsData] = useState({ submitted: 1245, rejected: 320, approved: 925 });
  const [hiddenSegments, setHiddenSegments] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setClaimsData(prev => ({
        submitted: prev.submitted + Math.floor(Math.random() * 5),
        rejected:  prev.rejected  + Math.floor(Math.random() * 2),
        approved:  prev.approved  + Math.floor(Math.random() * 3),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleSegment = (index: number) => {
    const newHidden = new Set(hiddenSegments);
    if (newHidden.has(index)) {
      newHidden.delete(index);
    } else {
      newHidden.add(index);
    }
    setHiddenSegments(newHidden);
  };

  const approvalRate = Math.round((claimsData.approved / claimsData.submitted) * 100);

  const allLabels = ["Submitted", "Rejected", "Approved"];
  const allColors = ["#8B86BF", "#5B5999", "#3D3B5B"];

  const pieDataValues = [claimsData.submitted, claimsData.rejected, claimsData.approved];
  const filteredLabels = allLabels.filter((_, i) => !hiddenSegments.has(i));
  const filteredData = pieDataValues.filter((_, i) => !hiddenSegments.has(i));
  const filteredColors = allColors.filter((_, i) => !hiddenSegments.has(i));

  const pieData = {
    labels: filteredLabels,
    datasets: [{
      data: filteredData,
      backgroundColor: filteredColors,
      borderColor: ["#fff", "#fff", "#fff"],
      borderWidth: 3,
    }],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { label: "Submitted", data: [500, 700, 800, 900, 1100, claimsData.submitted], borderColor: "#8B86BF", backgroundColor: "rgba(139,134,191,0.06)", fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: "#8B86BF" },
      { label: "Approved",  data: [400, 600, 700, 800, 950,  claimsData.approved],  borderColor: "#5B5999", backgroundColor: "rgba(91,89,153,0.06)",    fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: "#5B5999" },
      { label: "Rejected",  data: [100, 120, 150, 200, 250,  claimsData.rejected],  borderColor: "#3D3B5B", backgroundColor: "rgba(61,59,91,0.06)",     fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: "#3D3B5B" },
    ],
  };

{/*  Line Chart styling */}
  const lineOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" as const, labels: { boxWidth: 10, padding: 14, font: { size: 14 } } } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 14 }, color: "#94A3B8" } },
      y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 14 }, color: "#94A3B8" } },
    },
  };

  const topPayers = [
    { name: "BlueCross",    count: 540, pct: 43 },
    { name: "Aetna",        count: 420, pct: 34 },
    { name: "UnitedHealth", count: 310, pct: 25 },
  ];

  const recentRejections = [
    { id: "C-10234", reason: "Missing documentation", date: "2026-03-20" },
    { id: "C-10235", reason: "Invalid patient ID",     date: "2026-03-21" },
    { id: "C-10236", reason: "Policy expired",         date: "2026-03-22" },
  ];

  const summaryCards = [
    { label: "Submitted Claims", value: claimsData.submitted.toLocaleString(), icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label: "Approved Claims",  value: claimsData.approved.toLocaleString(),  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Rejected Claims",  value: claimsData.rejected.toLocaleString(),  icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Approval Rate",    value: `${approvalRate}%`,                    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ];

  return (
    <Layout currentPage="Dashboard">

      {/* Live badge */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 bg-white dark:bg-slate-800 border border-slate-200 dark:text-white dark:border-slate-700 shadow-sm px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
          Live · updates every 5 seconds
        </span>
      </div>

      {/* Summary Cards — canonical sizing used on every page */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map(({ label, value, icon }) => (
          <div key={label} className={`${CARD} p-5`}>
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
            </div>
            <p className="text-base font-medium text-slate-800 dark:text-slate-400 mb-1">{label}</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 shadow border border-slate-100 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-slate-800 dark:text-slate-100">Claim Distribution</h3>
            <span className="text-base font-medium text-slate-800 dark:text-slate-400">All time</span>
          </div>

          {/* Large screen chart with positioned legend */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-80 h-64">
              <div style={{ position: 'absolute', inset: 0 }}>
                <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
              </div>

              {/* Submitted - right side */}
              <div
                className="absolute flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                style={{
                  right: '-25px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: hiddenSegments.has(0) ? 0.5 : 1,
                }}
                onClick={() => toggleSegment(0)}
              >
                <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: allColors[0] }} />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{allLabels[0]}</span>
              </div>

              {/* Rejected - bottom-left */}
              <div
                className="absolute flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                style={{
                  left: '-5px',
                  bottom: '-5px',
                  opacity: hiddenSegments.has(1) ? 0.5 : 1,
                }}
                onClick={() => toggleSegment(1)}
              >
                <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: allColors[1] }} />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{allLabels[1]}</span>
              </div>

              {/* Approved - top-left */}
              <div
                className="absolute flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                style={{
                  left: '-5px',
                  top: '-5px',
                  opacity: hiddenSegments.has(2) ? 0.5 : 1,
                }}
                onClick={() => toggleSegment(2)}
              >
                <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: allColors[2] }} />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{allLabels[2]}</span>
              </div>
            </div>
          </div>

          {/* Small and medium screen chart with bottom legend */}
          <div className="lg:hidden">
            <div className="flex justify-center mb-6">
              <div className="relative w-64 h-48">
                <div style={{ position: 'absolute', inset: 0 }}>
                  <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
                </div>
              </div>
            </div>

            {/* Legend boxes */}
            <div className="flex flex-wrap justify-center gap-4 px-2">
              {allLabels.map((label, index) => (
                <div
                  key={label}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ opacity: hiddenSegments.has(index) ? 0.5 : 1 }}
                  onClick={() => toggleSegment(index)}
                >
                  <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: allColors[index] }} />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 shadow border border-slate-100 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-slate-800 dark:text-slate-100">Monthly Trends</h3>
            <span className="text-base font-medium text-slate-800 dark:text-slate-400">Jan – Jun 2026</span>
          </div>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 shadow border border-slate-100 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-slate-800 dark:text-slate-100">Top Payers</h3>
            <span className="text-base font-medium text-slate-800 dark:text-slate-400">By volume</span>
          </div>
          <div className="space-y-4">
            {topPayers.map(({ name, count, pct }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-300">{name}</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{count.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                  <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow border border-slate-100 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-base font-medium text-slate-800 dark:text-slate-100">Recent Rejections</h3>
            <span className="text-base font-medium text-slate-800 dark:text-slate-400">{recentRejections.length} new</span>
          </div>
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                {["Claim ID", "Reason", "Date"].map(h => <th key={h} className="px-6 py-3 text-left text-base font-medium text-slate-800 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentRejections.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-slate-800 dark:text-slate-300">{r.id}</td>
                  <td className="px-6 py-3 text-sm font-medium text-slate-800 dark:text-slate-300">{r.reason}</td>
                  <td className="px-6 py-3 text-sm font-medium text-slate-800 dark:text-slate-300">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;