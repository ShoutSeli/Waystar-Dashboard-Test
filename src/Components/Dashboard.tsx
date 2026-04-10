import React, { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import Layout from "./Layout";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const Dashboard: React.FC = () => {
  const [claimsData, setClaimsData] = useState({
    submitted: 1245,
    rejected: 320,
    approved: 925,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setClaimsData((prev) => ({
        submitted: prev.submitted + Math.floor(Math.random() * 5),
        rejected:  prev.rejected  + Math.floor(Math.random() * 2),
        approved:  prev.approved  + Math.floor(Math.random() * 3),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const approvalRate = Math.round((claimsData.approved / claimsData.submitted) * 100);

  const pieData = {
    labels: ["Submitted", "Rejected", "Approved"],
    datasets: [{
      data: [claimsData.submitted, claimsData.rejected, claimsData.approved],
      backgroundColor: ["#3B82F6", "#EF4444", "#10B981"],
      borderColor: ["#ffffff", "#ffffff", "#ffffff"],
      borderWidth: 3,
    }],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { label: "Submitted", data: [500, 700, 800, 900, 1100, claimsData.submitted], borderColor: "#3B82F6", backgroundColor: "rgba(59,130,246,0.08)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#3B82F6" },
      { label: "Approved",  data: [400, 600, 700, 800, 950,  claimsData.approved],  borderColor: "#10B981", backgroundColor: "rgba(16,185,129,0.08)",  fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#10B981" },
      { label: "Rejected",  data: [100, 120, 150, 200, 250,  claimsData.rejected],  borderColor: "#EF4444", backgroundColor: "rgba(239,68,68,0.08)",   fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#EF4444" },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" as const, labels: { boxWidth: 12, padding: 16, font: { size: 12 } } } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(0,0,0,0.04)" }, border: { dash: [4, 4] } },
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

  return (
    <Layout currentPage="Dashboard">

      {/* Live indicator */}
      <div className="flex items-center gap-2 m-10">
        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-100 shadow-sm px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live · updates every 5 seconds
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 m-10">
        {[
          { label: "Submitted Claims", value: claimsData.submitted.toLocaleString(), color: "text-blue-600",    bg: "bg-blue-50",    delta: "+5",
            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
          { label: "Approved Claims",  value: claimsData.approved.toLocaleString(),  color: "text-emerald-600", bg: "bg-emerald-50", delta: "+3",
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Rejected Claims",  value: claimsData.rejected.toLocaleString(),  color: "text-red-600",     bg: "bg-red-50",     delta: "+2",
            icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Approval Rate",    value: `${approvalRate}%`,                    color: "text-violet-600",  bg: "bg-violet-50",  delta: null,
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
        ].map(({ label, value, color, bg, icon, delta }) => (
          <div key={label} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`${bg} p-2.5 rounded-lg`}>
                <svg className={`w-5 h-5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              {delta && (
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{delta}</span>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 m-10">
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Claim Distribution</h3>
            <span className="text-xs text-gray-400">All time</span>
          </div>
          <div className="flex justify-center">
            <div className="w-56">
              <Pie data={pieData} options={{ plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 14, font: { size: 11 } } } } }} />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Monthly Claim Trends</h3>
            <span className="text-xs text-gray-400">Jan – Jun 2026</span>
          </div>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 m-10">

        {/* Top Payers */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4 m-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Top Payers</h3>
            <span className="text-xs text-gray-400">By claim volume</span>
          </div>
          <div className="space-y-4">
            {topPayers.map(({ name, count, pct }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{name}</span>
                  <span className="text-sm font-semibold text-gray-800">{count.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Rejections */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden m-10">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Recent Rejections</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
              {recentRejections.length} new
            </span>
          </div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentRejections.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">{r.id}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.reason}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs tabular-nums">{r.date}</td>
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