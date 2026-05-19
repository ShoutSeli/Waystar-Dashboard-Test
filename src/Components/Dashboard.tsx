import React, { useState, useEffect } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  LineElement, PointElement, CategoryScale, LinearScale,
} from "chart.js";
import Layout from "./Layout";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const CARD = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200";

const ROW_EVEN = { backgroundColor: "#f2f2f2" };
const ROW_ODD  = { backgroundColor: "#5114961c" };

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
    if (newHidden.has(index)) newHidden.delete(index); else newHidden.add(index);
    setHiddenSegments(newHidden);
  };

  const approvalRate = Math.round((claimsData.approved / claimsData.submitted) * 100);
  const allLabels = ["Submitted", "Rejected", "Approved"];
  const allColors = ["#808080", "#FF0000", "#FFA500"];

  const pieDataValues = [claimsData.submitted, claimsData.rejected, claimsData.approved];
  const filteredLabels = allLabels.filter((_, i) => !hiddenSegments.has(i));
  const filteredData   = pieDataValues.filter((_, i) => !hiddenSegments.has(i));
  const filteredColors = allColors.filter((_, i) => !hiddenSegments.has(i));

  const pieData = {
    labels: filteredLabels,
    datasets: [{ data: filteredData, backgroundColor: filteredColors, borderColor: ["#fff","#fff","#fff"], borderWidth: 1 }],
  };

  const lineData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets: [
      { label: "Submitted", data: [500,700,800,900,1100,claimsData.submitted], borderColor: "#808080", backgroundColor: "rgba(139,134,191,0.06)", fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: "#8B86BF" },
      { label: "Approved",  data: [400,600,700,800,950, claimsData.approved],  borderColor: "#FFA500", backgroundColor: "rgba(91,89,153,0.06)",    fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: "#5B5999" },
      { label: "Rejected",  data: [100,120,150,200,250, claimsData.rejected],  borderColor: "#FF0000", backgroundColor: "rgba(61,59,91,0.06)",     fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: "#3D3B5B" },
    ],
  };

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
    { label: "Submitted Claims", value: claimsData.submitted.toLocaleString(), color: "#808080", icon: <><path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 14.25a.75.75 0 000 1.5H15a.75.75 0 000-1.5H9.75zm0-3a.75.75 0 000 1.5H15a.75.75 0 000-1.5H9.75zM9 10.5a.75.75 0 01.75-.75H15a.75.75 0 010 1.5H9.75A.75.75 0 019 10.5z" clipRule="evenodd" /><path d="M12 .75a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01.22.53V6a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75V1.5A.75.75 0 0112 .75z" /></> },
    { label: "Approved Claims",  value: claimsData.approved.toLocaleString(),  color: "#FFA500", icon: <><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></> },
    { label: "Rejected Claims",  value: claimsData.rejected.toLocaleString(),  color: "#FF0000", icon: <><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></> },
    { label: "Approval Rate",    value: `${approvalRate}%`,                    color: "#a855f7", icon: <><path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" /><path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" /></> },
  ];

  return (
    <Layout currentPage="Dashboard">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 bg-white dark:bg-slate-800 border border-slate-200 dark:text-white dark:border-slate-700 shadow-sm px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
          Live · updates every 5 seconds
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map(({ label, value, icon, color }) => (
          <div key={label} className={`${CARD} p-5 flex items-center gap-4`}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" style={{ color }}>
                {icon}
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-base font-medium mb-1" style={{ color }}>{label}</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 shadow border border-slate-100 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-slate-800 dark:text-slate-100">Claim Distribution</h3>
            <span className="text-base font-medium text-slate-800 dark:text-slate-400">All time</span>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="relative w-80 h-64">
              <div style={{ position: "absolute", inset: 0 }}>
                <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
              </div>
              {[
                { style: { right: "-25px", top: "50%", transform: "translateY(-50%)" }, idx: 0 },
                { style: { left: "-5px", bottom: "-5px" }, idx: 1 },
                { style: { left: "-5px", top: "-5px" }, idx: 2 },
              ].map(({ style, idx }) => (
                <div key={idx} className="absolute flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ ...style, opacity: hiddenSegments.has(idx) ? 0.5 : 1 }} onClick={() => toggleSegment(idx)}>
                  <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: allColors[idx] }} />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{allLabels[idx]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:hidden">
            <div className="flex justify-center mb-6">
              <div className="relative w-64 h-48">
                <div style={{ position: "absolute", inset: 0 }}>
                  <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 px-2">
              {allLabels.map((label, index) => (
                <div key={label} className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ opacity: hiddenSegments.has(index) ? 0.5 : 1 }} onClick={() => toggleSegment(index)}>
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
                {["Claim ID","Reason","Date"].map(h => <th key={h} className="px-6 py-3 text-left text-base font-medium text-slate-800 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {recentRejections.map((r, idx) => (
                <tr key={r.id} style={idx % 2 === 0 ? ROW_ODD : ROW_EVEN} className="hover:opacity-90 transition-opacity">
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