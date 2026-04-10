import React, { useState } from "react";
import Layout from "./Layout";
import { downloadClaimEDI, downloadClaimPDF } from "../utils/downloadClaim";

interface Rejection {
  claimId: string;
  patientName: string;
  department: string;
  rejectionReason: string;
  rejectionDate: string;
  suggestedAction: string;
}

const reasonColors: Record<string, string> = {
  "Missing documentation":   "bg-orange-50 text-orange-700",
  "Invalid billing code":    "bg-red-50 text-red-700",
  "Policy expired":          "bg-rose-50 text-rose-700",
  "Duplicate claim submission": "bg-purple-50 text-purple-700",
  "Incorrect patient ID":    "bg-red-50 text-red-700",
  "Coverage not applicable": "bg-amber-50 text-amber-700",
  "Incomplete claim form":   "bg-orange-50 text-orange-700",
  "Insurer system error":    "bg-slate-50 text-slate-700",
  "Exceeded coverage limit": "bg-amber-50 text-amber-700",
  "Incorrect claim format":  "bg-red-50 text-red-700",
  "Missing physician signature": "bg-orange-50 text-orange-700",
  "Coverage limit exceeded": "bg-amber-50 text-amber-700",
  "Incorrect patient DOB":   "bg-red-50 text-red-700",
  "Claim submitted late":    "bg-rose-50 text-rose-700",
  "Invalid insurer ID":      "bg-red-50 text-red-700",
  "Incorrect billing format":"bg-red-50 text-red-700",
  "Missing lab results":     "bg-orange-50 text-orange-700",
  "Coverage not active":     "bg-rose-50 text-rose-700",
  "Duplicate patient record":"bg-purple-50 text-purple-700",
  "Incorrect insurer plan":  "bg-amber-50 text-amber-700",
};

const RejectionReview: React.FC = () => {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [rejections] = useState<Rejection[]>([
    { claimId: "R-7001", patientName: "Aurelia Koomson",  department: "Cardiology",    rejectionReason: "Missing documentation",      rejectionDate: "2026-03-20", suggestedAction: "Upload required medical records" },
    { claimId: "R-7002", patientName: "Kwabena Owusu",    department: "Orthopedics",   rejectionReason: "Invalid billing code",        rejectionDate: "2026-03-21", suggestedAction: "Correct CPT code and resubmit" },
    { claimId: "R-7003", patientName: "Zainab Alhassan",  department: "Neurology",     rejectionReason: "Policy expired",              rejectionDate: "2026-03-22", suggestedAction: "Update insurance policy details" },
    { claimId: "R-7004", patientName: "Kojo Mensah",      department: "Dermatology",   rejectionReason: "Duplicate claim submission",  rejectionDate: "2026-03-23", suggestedAction: "Remove duplicate and resubmit once" },
    { claimId: "R-7005", patientName: "Ama Boateng",      department: "Pediatrics",    rejectionReason: "Incorrect patient ID",        rejectionDate: "2026-03-24", suggestedAction: "Verify patient demographics" },
    { claimId: "R-7006", patientName: "Yaw Darko",        department: "Oncology",      rejectionReason: "Coverage not applicable",     rejectionDate: "2026-03-25", suggestedAction: "Confirm coverage with insurer" },
    { claimId: "R-7007", patientName: "Efua Sackey",      department: "Gynecology",    rejectionReason: "Incomplete claim form",       rejectionDate: "2026-03-25", suggestedAction: "Fill missing fields and resubmit" },
    { claimId: "R-7008", patientName: "Kwesi Adjei",      department: "Orthopedics",   rejectionReason: "Insurer system error",        rejectionDate: "2026-03-26", suggestedAction: "Retry submission after 24 hours" },
    { claimId: "R-7009", patientName: "Akua Nkrumah",     department: "Cardiology",    rejectionReason: "Exceeded coverage limit",     rejectionDate: "2026-03-26", suggestedAction: "Request prior authorization" },
    { claimId: "R-7010", patientName: "Selorm Tetteh",    department: "Neurology",     rejectionReason: "Incorrect claim format",      rejectionDate: "2026-03-27", suggestedAction: "Use correct claim template" },
    { claimId: "R-7011", patientName: "Kwame Agyeman",    department: "Radiology",     rejectionReason: "Missing physician signature", rejectionDate: "2026-03-27", suggestedAction: "Obtain signature and resubmit" },
    { claimId: "R-7012", patientName: "Akosua Bediako",   department: "Pediatrics",    rejectionReason: "Coverage limit exceeded",     rejectionDate: "2026-03-28", suggestedAction: "Request insurer override" },
    { claimId: "R-7013", patientName: "Nii Lamptey",      department: "Orthopedics",   rejectionReason: "Incorrect patient DOB",       rejectionDate: "2026-03-28", suggestedAction: "Correct demographics and resubmit" },
    { claimId: "R-7014", patientName: "Adwoa Sarpong",    department: "Cardiology",    rejectionReason: "Claim submitted late",        rejectionDate: "2026-03-29", suggestedAction: "File appeal for late submission" },
    { claimId: "R-7015", patientName: "Kojo Antwi",       department: "Neurology",     rejectionReason: "Invalid insurer ID",          rejectionDate: "2026-03-29", suggestedAction: "Update insurer details" },
    { claimId: "R-7016", patientName: "Ama Ofori",        department: "Oncology",      rejectionReason: "Incorrect billing format",    rejectionDate: "2026-03-30", suggestedAction: "Use correct billing template" },
    { claimId: "R-7017", patientName: "Yaw Asante",       department: "Dermatology",   rejectionReason: "Missing lab results",         rejectionDate: "2026-03-30", suggestedAction: "Attach lab results" },
    { claimId: "R-7018", patientName: "Efua Addo",        department: "Gynecology",    rejectionReason: "Coverage not active",         rejectionDate: "2026-03-31", suggestedAction: "Verify active coverage" },
    { claimId: "R-7019", patientName: "Kwesi Tetteh",     department: "Orthopedics",   rejectionReason: "Duplicate patient record",    rejectionDate: "2026-03-31", suggestedAction: "Merge records and resubmit" },
    { claimId: "R-7020", patientName: "Akua Mensima",     department: "Cardiology",    rejectionReason: "Incorrect insurer plan",      rejectionDate: "2026-03-31", suggestedAction: "Update plan details" },
  ]);

  // Compute most common reason
  const reasonCounts = rejections.reduce<Record<string, number>>((acc, r) => {
    acc[r.rejectionReason] = (acc[r.rejectionReason] || 0) + 1;
    return acc;
  }, {});
  const topReason = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const deptCount = new Set(rejections.map((r) => r.department)).size;
  const departments = ["All", ...new Set(rejections.map((r) => r.department))];

  const filtered = rejections.filter(
    (r) =>
      (deptFilter === "All" || r.department === deptFilter) &&
      (r.patientName.toLowerCase().includes(search.toLowerCase()) ||
        r.claimId.toLowerCase().includes(search.toLowerCase()) ||
        r.rejectionReason.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout currentPage="Rejection Review">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-10">
        {[
          { label: "Total Rejections", value: rejections.length, color: "text-red-600", bg: "bg-red-50",
            icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
          { label: "Departments Affected", value: deptCount, color: "text-blue-600", bg: "bg-blue-50",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex items-center gap-4">
            <div className={`${bg} p-3 rounded-lg`}>
              <svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
        {/* Top reason card */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex items-center gap-4">
          <div className="bg-orange-50 p-3 rounded-lg">
            <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-500 font-medium">Top Rejection Reason</p>
            <p className="text-sm font-semibold text-gray-800 truncate" title={topReason}>{topReason}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 m-10">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative max-w-xs w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patient, ID, or reason…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <p className="text-xs text-gray-400 shrink-0">
          Showing {filtered.length} of {rejections.length} rejections
        </p>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden m-10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rejection Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Downloads</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No rejections match your current filters.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <React.Fragment key={r.claimId}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                        {r.claimId}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.patientName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {r.department}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${reasonColors[r.rejectionReason] ?? "bg-gray-100 text-gray-700"}`}>
                        {r.rejectionReason}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs tabular-nums">{r.rejectionDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => downloadClaimEDI(r.claimId, r.patientName)} title="Download EDI file" className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" /></svg>EDI
                        </button>
                        <button onClick={() => downloadClaimPDF(r.claimId, r.patientName, undefined, "Rejected")} title="Download PDF file" className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>PDF
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedRow(expandedRow === r.claimId ? null : r.claimId)}
                        className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d={expandedRow === r.claimId ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                        {expandedRow === r.claimId ? "Hide" : "Suggested Fix"}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === r.claimId && (
                    <tr className="bg-blue-50/40">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-1.5 rounded-lg shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-0.5">Suggested Action</p>
                            <p className="text-sm text-gray-700">{r.suggestedAction}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {rejections.length} records
        </div>
      </div>
    </Layout>
  );
};

export default RejectionReview;