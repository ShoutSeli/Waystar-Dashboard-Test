import React, { useState } from "react";
import Layout from "./Layout";
import { downloadClaimEDI, downloadClaimPDF } from "../utils/downloadClaim";

interface BillingDetail {
  claimId: string;
  patientName: string;
  encounterId: string;
  serviceDate: string;
  amount: number;
  status: string;
  insurance: string;
  department: string;
  paymentMethod: string;
  transactionId?: string;
  payer: string;
  coveragePercent: number;
  notes: string;
}

const statusConfig: Record<string, { pill: string; dot: string }> = {
  Submitted: { pill: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  Pending:   { pill: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",     dot: "bg-amber-400" },
};

const BillingDetails: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [details] = useState<BillingDetail[]>([
    { claimId: "C-5001", patientName: "Aurelia Koomson",  encounterId: "E-701", serviceDate: "2026-03-15", amount: 1200, status: "Pending",   insurance: "BlueCross",    department: "Cardiology",   paymentMethod: "Credit Card",          transactionId: "TXN-987654", payer: "BlueCross Insurance",    coveragePercent: 80, notes: "Awaiting insurance verification" },
    { claimId: "C-5002", patientName: "Kwabena Owusu",    encounterId: "E-702", serviceDate: "2026-03-16", amount: 850,  status: "Submitted", insurance: "Aetna",        department: "Orthopedics",  paymentMethod: "Bank Transfer",         transactionId: "TXN-123456", payer: "Aetna Insurance",        coveragePercent: 75, notes: "Submitted successfully" },
    { claimId: "C-5003", patientName: "Zainab Alhassan",  encounterId: "E-703", serviceDate: "2026-03-17", amount: 1500, status: "Pending",   insurance: "UnitedHealth", department: "Neurology",    paymentMethod: "Cash",                                       payer: "UnitedHealth Insurance", coveragePercent: 70, notes: "Pending approval" },
    { claimId: "C-5004", patientName: "Kojo Mensah",      encounterId: "E-704", serviceDate: "2026-03-18", amount: 975,  status: "Pending",   insurance: "BlueCross",    department: "Dermatology",  paymentMethod: "Check",                 transactionId: "CHK-445566", payer: "BlueCross Insurance",    coveragePercent: 65, notes: "Awaiting check clearance" },
    { claimId: "C-5005", patientName: "Ama Boateng",      encounterId: "E-705", serviceDate: "2026-03-19", amount: 1100, status: "Submitted", insurance: "Aetna",        department: "Pediatrics",   paymentMethod: "Debit Card",            transactionId: "TXN-778899", payer: "Aetna Insurance",        coveragePercent: 85, notes: "Processed" },
    { claimId: "C-5006", patientName: "Yaw Darko",        encounterId: "E-706", serviceDate: "2026-03-20", amount: 1320, status: "Pending",   insurance: "UnitedHealth", department: "Oncology",     paymentMethod: "Insurance Direct Pay",  transactionId: "INS-223344", payer: "UnitedHealth Insurance", coveragePercent: 90, notes: "Pending insurer confirmation" },
    { claimId: "C-5007", patientName: "Efua Sackey",      encounterId: "E-707", serviceDate: "2026-03-21", amount: 890,  status: "Submitted", insurance: "BlueCross",    department: "Gynecology",   paymentMethod: "Credit Card",           transactionId: "TXN-556677", payer: "BlueCross Insurance",    coveragePercent: 78, notes: "Approved" },
    { claimId: "C-5008", patientName: "Kwesi Adjei",      encounterId: "E-708", serviceDate: "2026-03-22", amount: 1450, status: "Pending",   insurance: "Aetna",        department: "Orthopedics",  paymentMethod: "Bank Transfer",         transactionId: "TXN-889900", payer: "Aetna Insurance",        coveragePercent: 72, notes: "Awaiting insurance" },
    { claimId: "C-5009", patientName: "Akua Nkrumah",     encounterId: "E-709", serviceDate: "2026-03-23", amount: 1025, status: "Submitted", insurance: "UnitedHealth", department: "Cardiology",   paymentMethod: "Check",                 transactionId: "CHK-112233", payer: "UnitedHealth Insurance", coveragePercent: 68, notes: "Submitted successfully" },
    { claimId: "C-5010", patientName: "Selorm Tetteh",    encounterId: "E-710", serviceDate: "2026-03-24", amount: 1180, status: "Pending",   insurance: "BlueCross",    department: "Neurology",    paymentMethod: "Debit Card",            transactionId: "TXN-334455", payer: "BlueCross Insurance",    coveragePercent: 82, notes: "Pending approval" },
  ]);

  const totalBilled    = details.reduce((s, d) => s + d.amount, 0);
  const submittedCount = details.filter((d) => d.status === "Submitted").length;
  const pendingCount   = details.filter((d) => d.status === "Pending").length;

  const filtered = details.filter(
    (d) =>
      (statusFilter === "All" || d.status === statusFilter) &&
      (d.patientName.toLowerCase().includes(search.toLowerCase()) ||
        d.claimId.toLowerCase().includes(search.toLowerCase()) ||
        d.insurance.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout currentPage="Billing Details">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-4 sm:m-6 md:m-8 lg:m-10">
        {[
          { label: "Total Billed",  value: `$${totalBilled.toLocaleString()}`, color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/20",
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Submitted",     value: submittedCount, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20",
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Pending",       value: pendingCount,   color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20",
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-5 flex items-center gap-4">
            <div className={`${bg} p-3 rounded-lg`}>
              <svg className={`w-6 h-6 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
              <p className={`text-base font-bold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 m-4 sm:m-6 md:m-8 lg:m-10">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative max-w-xs w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patient, claim, insurer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {["All", "Submitted", "Pending"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">Showing {filtered.length} of {details.length} records</p>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden md:block bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden m-4 sm:m-6 md:m-8 lg:m-10">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
              {["Claim ID","Patient","Service Date","Amount","Status","Insurance","Department","Payment","Details"].map((h) => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No billing records match your filters.</td></tr>
            )}
            {filtered.map((d) => {
              const cfg = statusConfig[d.status] ?? { pill: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300", dot: "bg-gray-400" };
              return (
                <React.Fragment key={d.claimId}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 whitespace-nowrap">{d.claimId}</span>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-800 dark:text-gray-200 text-xs">{d.patientName}</td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">{d.serviceDate}</td>
                    <td className="px-3 py-2 font-semibold text-blue-700 dark:text-blue-300 text-xs">${d.amount.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {d.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300 text-xs">{d.insurance}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{d.department}</span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300 text-xs">{d.paymentMethod}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => setExpandedRow(expandedRow === d.claimId ? null : d.claimId)}
                        className="p-1 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d={expandedRow === d.claimId ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  {expandedRow === d.claimId && (
                    <tr className="bg-blue-50/40 dark:bg-blue-900/20 border-b border-gray-100 dark:border-gray-700">
                      <td colSpan={9} className="px-6 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          {[
                            { label: "Encounter ID", value: d.encounterId },
                            { label: "Transaction ID", value: d.paymentMethod !== "Cash" ? d.transactionId ?? "—" : "—" },
                            { label: "Payer",          value: d.payer },
                            { label: "Coverage",       value: `${d.coveragePercent}%` },
                            { label: "Notes",          value: d.notes, fullWidth: true },
                          ].map(({ label, value, fullWidth }) => (
                            <div key={label} className={fullWidth ? "col-span-2 sm:col-span-4" : ""}>
                              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">{value}</p>
                            </div>
                          ))}
                          <div className="col-span-2 sm:col-span-4 flex items-center gap-1.5 pt-2">
                            <button onClick={() => downloadClaimEDI(d.claimId, d.patientName, d.amount)} title="Download EDI file" className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" /></svg>EDI
                            </button>
                            <button onClick={() => downloadClaimPDF(d.claimId, d.patientName, d.amount, d.status)} title="Download PDF file" className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>PDF
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-400 dark:text-gray-500">
          Showing {filtered.length} of {details.length} records
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-3 m-4 sm:m-6">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
            No billing records match your filters.
          </div>
        ) : (
          filtered.map((d) => {
            const cfg = statusConfig[d.status] ?? { pill: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300", dot: "bg-gray-400" };
            return (
              <div key={d.claimId} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">{d.claimId}</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {d.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">Patient</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{d.patientName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">Amount</p>
                      <p className="text-gray-700 dark:text-gray-300 font-semibold">${d.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">Insurance</p>
                      <p className="text-gray-700 dark:text-gray-300">{d.insurance}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">Department</p>
                      <p className="text-gray-700 dark:text-gray-300">{d.department}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">Service Date</p>
                      <p className="text-gray-700 dark:text-gray-300 text-xs">{d.serviceDate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={() => downloadClaimEDI(d.claimId, d.patientName, d.amount)} title="Download EDI" className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" /></svg>EDI
                  </button>
                  <button onClick={() => downloadClaimPDF(d.claimId, d.patientName, d.amount, d.status)} title="Download PDF" className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>PDF
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
};

export default BillingDetails;
