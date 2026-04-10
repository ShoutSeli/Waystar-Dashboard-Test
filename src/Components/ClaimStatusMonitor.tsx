import React, { useState } from "react";
import Layout from "./Layout";
import { useNotifications } from "../context/NotificationContext";
import { downloadClaimEDI, downloadClaimPDF } from "../utils/downloadClaim";

interface ClaimStatus {
  claimId: string; patientName: string;
  status: "Approved" | "Rejected" | "Pending";
  reason: string; date: string;
}

const statusConfig = {
  Approved: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  Rejected: { pill: "bg-red-50 text-red-700",         dot: "bg-red-500"     },
  Pending:  { pill: "bg-amber-50 text-amber-700",     dot: "bg-amber-400"   },
};

const ClaimStatusMonitor: React.FC = () => {
  const { addNotification } = useNotifications();
  const [filter, setFilter] = useState<"All"|"Approved"|"Rejected"|"Pending">("All");
  const [search, setSearch] = useState("");

  const [claims, setClaims] = useState<ClaimStatus[]>([
    { claimId:"C-6001", patientName:"Aurelia Koomson",  status:"Rejected", reason:"Missing documentation",          date:"2026-03-20" },
    { claimId:"C-6002", patientName:"Kwabena Owusu",    status:"Approved", reason:"All requirements met",           date:"2026-03-21" },
    { claimId:"C-6003", patientName:"Zainab Alhassan",  status:"Pending",  reason:"Awaiting insurer response",      date:"2026-03-22" },
    { claimId:"C-6004", patientName:"Kojo Mensah",      status:"Rejected", reason:"Invalid patient ID",             date:"2026-03-23" },
    { claimId:"C-6005", patientName:"Ama Boateng",      status:"Approved", reason:"Verified successfully",          date:"2026-03-24" },
    { claimId:"C-6006", patientName:"Yaw Darko",        status:"Pending",  reason:"Policy expired, awaiting update",date:"2026-03-25" },
    { claimId:"C-6007", patientName:"Efua Sackey",      status:"Rejected", reason:"Incorrect billing code",         date:"2026-03-25" },
    { claimId:"C-6008", patientName:"Kwesi Adjei",      status:"Approved", reason:"Coverage confirmed",             date:"2026-03-25" },
    { claimId:"C-6009", patientName:"Akua Nkrumah",     status:"Pending",  reason:"Insurer system delay",           date:"2026-03-26" },
    { claimId:"C-6010", patientName:"Selorm Tetteh",    status:"Rejected", reason:"Duplicate claim submission",     date:"2026-03-26" },
    { claimId:"C-6011", patientName:"Kwame Agyeman",    status:"Approved", reason:"Insurer confirmed eligibility",  date:"2026-03-27" },
    { claimId:"C-6012", patientName:"Akosua Bediako",   status:"Pending",  reason:"Awaiting patient verification",  date:"2026-03-27" },
    { claimId:"C-6013", patientName:"Nii Lamptey",      status:"Rejected", reason:"Policy not active",              date:"2026-03-28" },
    { claimId:"C-6014", patientName:"Adwoa Sarpong",    status:"Approved", reason:"All documents valid",            date:"2026-03-28" },
    { claimId:"C-6015", patientName:"Kojo Antwi",       status:"Pending",  reason:"Insurer review in progress",     date:"2026-03-29" },
    { claimId:"C-6016", patientName:"Ama Ofori",        status:"Rejected", reason:"Incorrect claim format",         date:"2026-03-29" },
    { claimId:"C-6017", patientName:"Yaw Asante",       status:"Approved", reason:"Coverage confirmed",             date:"2026-03-30" },
    { claimId:"C-6018", patientName:"Efua Addo",        status:"Pending",  reason:"Awaiting insurer system update", date:"2026-03-30" },
    { claimId:"C-6019", patientName:"Kwesi Tetteh",     status:"Rejected", reason:"Duplicate submission detected",  date:"2026-03-31" },
    { claimId:"C-6020", patientName:"Akua Mensima",     status:"Approved", reason:"Verified successfully",          date:"2026-03-31" },
  ]);

  const updateStatus = (claimId: string, newStatus: "Approved"|"Rejected") => {
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

  const filterButtons: { label:string; value:typeof filter; count:number; color:string }[] = [
    { label:"All",      value:"All",      count:claims.length, color:"bg-gray-800 text-white"    },
    { label:"Approved", value:"Approved", count:approvedCount, color:"bg-emerald-600 text-white" },
    { label:"Rejected", value:"Rejected", count:rejectedCount, color:"bg-red-600 text-white"     },
    { label:"Pending",  value:"Pending",  count:pendingCount,  color:"bg-amber-500 text-white"   },
  ];

  return (
    <Layout currentPage="Claim Status Monitor">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-10">
        {[
          { label:"Approved", value:approvedCount, color:"text-emerald-600", bg:"bg-emerald-50", icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label:"Rejected", value:rejectedCount, color:"text-red-600",     bg:"bg-red-50",     icon:"M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label:"Pending",  value:pendingCount,  color:"text-amber-600",   bg:"bg-amber-50",   icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex items-center gap-4">
            <div className={`${bg} p-3 rounded-lg`}><svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg></div>
            <div><p className="text-sm text-gray-500 font-medium">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 m-10">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map(({ label, value, count, color }) => (
            <button key={value} onClick={() => setFilter(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition border ${filter === value ? `${color} border-transparent shadow-sm` : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filter === value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</span>
            </button>
          ))}
        </div>
        <div className="relative max-w-xs w-full sm:w-auto">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search patient or claim ID…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
      </div>
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden m-10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Claim ID","Patient","Status","Reason","Date","Update Status","Downloads"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClaims.length === 0 && (<tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">No claims match your current filters.</td></tr>)}
              {filteredClaims.map(c => {
                const cfg = statusConfig[c.status];
                return (
                  <tr key={c.claimId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{c.claimId}</span></td>
                    <td className="px-4 py-3 font-medium text-gray-800">{c.patientName}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.pill}`}><span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{c.status}</span></td>
                    <td className="px-4 py-3 text-gray-600">{c.reason}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs tabular-nums">{c.date}</td>
                    <td className="px-4 py-3">
                      {c.status === "Pending" ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateStatus(c.claimId, "Approved")} className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Approve
                          </button>
                          <button onClick={() => updateStatus(c.claimId, "Rejected")} className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Reject
                          </button>
                        </div>
                      ) : (<span className="text-xs text-gray-400 italic">Processed</span>)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => downloadClaimEDI(c.claimId, c.patientName)} title="Download EDI file" className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" /></svg>EDI
                        </button>
                        <button onClick={() => downloadClaimPDF(c.claimId, c.patientName, undefined, c.status)} title="Download PDF file" className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">Showing {filteredClaims.length} of {claims.length} claims</div>
      </div>
    </Layout>
  );
};

export default ClaimStatusMonitor;