import React, { useState } from "react";
import Layout from "./Layout";
import { useNotifications } from "../context/NotificationContext";

interface ClaimStatus {
  claimId: string; patientName: string;
  status: "Approved" | "Rejected" | "Pending";
  reason: string; date: string;
}

const statusConfig = {
  Approved: { pill: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  Rejected: { pill: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",                dot: "bg-red-500"     },
  Pending:  { pill: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",         dot: "bg-amber-400"   },
};

const ClaimStatusMonitor: React.FC = () => {
  const { addNotification } = useNotifications();
  const [filter, setFilter] = useState<"All" | "Approved" | "Rejected" | "Pending">("All");
  const [search, setSearch] = useState("");

  const [claims, setClaims] = useState<ClaimStatus[]>([
    { claimId: "C-6001", patientName: "Aurelia Koomson",  status: "Rejected", reason: "Missing documentation",          date: "2026-03-20" },
    { claimId: "C-6002", patientName: "Kwabena Owusu",    status: "Approved", reason: "All requirements met",           date: "2026-03-21" },
    { claimId: "C-6003", patientName: "Zainab Alhassan",  status: "Pending",  reason: "Awaiting insurer response",      date: "2026-03-22" },
    { claimId: "C-6004", patientName: "Kojo Mensah",      status: "Rejected", reason: "Invalid patient ID",             date: "2026-03-23" },
    { claimId: "C-6005", patientName: "Ama Boateng",      status: "Approved", reason: "Verified successfully",          date: "2026-03-24" },
    { claimId: "C-6006", patientName: "Yaw Darko",        status: "Pending",  reason: "Policy expired, awaiting update",date: "2026-03-25" },
    { claimId: "C-6007", patientName: "Efua Sackey",      status: "Rejected", reason: "Incorrect billing code",         date: "2026-03-25" },
    { claimId: "C-6008", patientName: "Kwesi Adjei",      status: "Approved", reason: "Coverage confirmed",             date: "2026-03-25" },
    { claimId: "C-6009", patientName: "Akua Nkrumah",     status: "Pending",  reason: "Insurer system delay",           date: "2026-03-26" },
    { claimId: "C-6010", patientName: "Selorm Tetteh",    status: "Rejected", reason: "Duplicate claim submission",     date: "2026-03-26" },
    { claimId: "C-6011", patientName: "Kwame Agyeman",    status: "Approved", reason: "Insurer confirmed eligibility",  date: "2026-03-27" },
    { claimId: "C-6012", patientName: "Akosua Bediako",   status: "Pending",  reason: "Awaiting patient verification",  date: "2026-03-27" },
    { claimId: "C-6013", patientName: "Nii Lamptey",      status: "Rejected", reason: "Policy not active",              date: "2026-03-28" },
    { claimId: "C-6014", patientName: "Adwoa Sarpong",    status: "Approved", reason: "All documents valid",            date: "2026-03-28" },
    { claimId: "C-6015", patientName: "Kojo Antwi",       status: "Pending",  reason: "Insurer review in progress",     date: "2026-03-29" },
    { claimId: "C-6016", patientName: "Ama Ofori",        status: "Rejected", reason: "Incorrect claim format",         date: "2026-03-29" },
    { claimId: "C-6017", patientName: "Yaw Asante",       status: "Approved", reason: "Coverage confirmed",             date: "2026-03-30" },
    { claimId: "C-6018", patientName: "Efua Addo",        status: "Pending",  reason: "Awaiting insurer system update", date: "2026-03-30" },
    { claimId: "C-6019", patientName: "Kwesi Tetteh",     status: "Rejected", reason: "Duplicate submission detected",  date: "2026-03-31" },
    { claimId: "C-6020", patientName: "Akua Mensima",     status: "Approved", reason: "Verified successfully",          date: "2026-03-31" },
  ]);

  const updateStatus = (claimId: string, newStatus: "Approved" | "Rejected") => {
    const claim = claims.find(c => c.claimId === claimId);
    if (!claim || claim.status === newStatus) return;
    setClaims(prev => prev.map(c => c.claimId === claimId ? { ...c, status: newStatus } : c));
    addNotification({
      type: newStatus === "Approved" ? "success" : "error",
      title: `Claim ${newStatus}`,
      claimId,
      message: `Claim ${claimId} for ${claim.patientName} has been ${newStatus.toLowerCase()} by the insurer.`,
    });
  };

  const approvedCount = claims.filter(c => c.status === "Approved").length;
  const rejectedCount = claims.filter(c => c.status === "Rejected").length;
  const pendingCount  = claims.filter(c => c.status === "Pending").length;

  const filteredClaims = claims.filter(c =>
    (filter === "All" || c.status === filter) &&
    (c.patientName.toLowerCase().includes(search.toLowerCase()) || c.claimId.toLowerCase().includes(search.toLowerCase()))
  );

  const filterButtons: { label: string; value: typeof filter; count: number; color: string }[] = [
    { label: "All",      value: "All",      count: claims.length, color: "bg-gray-800 text-white"    },
    { label: "Approved", value: "Approved", count: approvedCount, color: "bg-emerald-600 text-white" },
    { label: "Rejected", value: "Rejected", count: rejectedCount, color: "bg-red-600 text-white"     },
    { label: "Pending",  value: "Pending",  count: pendingCount,  color: "bg-amber-500 text-white"   },
  ];

  return (
    <Layout currentPage="Claim Status Monitor">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 m-4 sm:m-6 lg:m-10">
        {[
          { label: "Approved", value: approvedCount, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Rejected", value: rejectedCount, color: "text-red-600",     bg: "bg-red-50 dark:bg-red-900/20",         icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Pending",  value: pendingCount,  color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20",     icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
            <div className={`${bg} p-2.5 rounded-lg shrink-0`}><svg className={`w-5 h-5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg></div>
            <div><p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p><p className={`text-lg font-bold ${color}`}>{value}</p></div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mx-4 sm:mx-6 lg:mx-10 mb-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map(({ label, value, count, color }) => (
            <button key={value} onClick={() => setFilter(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition border ${filter === value ? `${color} border-transparent shadow-sm` : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filter === value ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>{count}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search patient or claim ID…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden mx-4 sm:mx-6 lg:mx-10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                {["Claim ID", "Patient", "Status", "Reason", "Date", "Update Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredClaims.length === 0 && (<tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No claims match your current filters.</td></tr>)}
              {filteredClaims.map(c => {
                const cfg = statusConfig[c.status];
                return (
                  <tr key={c.claimId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">{c.claimId}</span></td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{c.patientName}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.pill}`}><span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{c.status}</span></td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">{c.reason}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs tabular-nums">{c.date}</td>
                    <td className="px-4 py-3">
                      {c.status === "Pending" ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateStatus(c.claimId, "Approved")} className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Approve
                          </button>
                          <button onClick={() => updateStatus(c.claimId, "Rejected")} className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Reject
                          </button>
                        </div>
                      ) : <span className="text-xs text-gray-400 dark:text-gray-500 italic">Processed</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-400 dark:text-gray-500">Showing {filteredClaims.length} of {claims.length} claims</div>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden grid grid-cols-1 gap-3 mx-4 mb-6">
        {filteredClaims.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-400 dark:text-gray-500 text-sm border border-gray-100 dark:border-gray-700">No claims match your filters.</div>
        )}
        {filteredClaims.map(c => {
          const cfg = statusConfig[c.status];
          return (
            <div key={c.claimId} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">{c.claimId}</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.pill}`}><span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{c.status}</span>
              </div>
              <p className="font-medium text-gray-800 dark:text-gray-100">{c.patientName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{c.reason}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">{c.date}</p>
              {c.status === "Pending" && (
                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={() => updateStatus(c.claimId, "Approved")} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Approve
                  </button>
                  <button onClick={() => updateStatus(c.claimId, "Rejected")} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Reject
                  </button>
                </div>
              )}
              {c.status !== "Pending" && (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic pt-1 border-t border-gray-100 dark:border-gray-700">Processed</p>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default ClaimStatusMonitor;