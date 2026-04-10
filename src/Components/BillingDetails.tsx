import React, { useState } from "react";
import Layout from "./Layout";

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
  Submitted: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  Pending:   { pill: "bg-amber-50 text-amber-700",     dot: "bg-amber-400" },
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-10">
        {[
          { label: "Total Billed",  value: `$${totalBilled.toLocaleString()}`, color: "text-blue-600",    bg: "bg-blue-50",
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Submitted",     value: submittedCount, color: "text-emerald-600", bg: "bg-emerald-50",
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Pending",       value: pendingCount,   color: "text-amber-600",   bg: "bg-amber-50",
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
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
              placeholder="Search patient, claim, insurer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            {["All", "Submitted", "Pending"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <p className="text-xs text-gray-400 shrink-0">Showing {filtered.length} of {details.length} records</p>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden m-10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Claim ID","Patient","Encounter","Service Date","Amount","Status","Insurance","Department","Payment","Details"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400 text-sm">No billing records match your filters.</td></tr>
              )}
              {filtered.map((d) => {
                const cfg = statusConfig[d.status] ?? { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };
                return (
                  <React.Fragment key={d.claimId}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{d.claimId}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{d.patientName}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{d.encounterId}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs tabular-nums">{d.serviceDate}</td>
                      <td className="px-4 py-3 font-semibold text-blue-700">${d.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {d.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{d.insurance}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{d.department}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{d.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpandedRow(expandedRow === d.claimId ? null : d.claimId)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d={expandedRow === d.claimId ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {expandedRow === d.claimId && (
                      <tr className="bg-blue-50/40">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            {[
                              { label: "Transaction ID", value: d.paymentMethod !== "Cash" ? d.transactionId ?? "—" : "—" },
                              { label: "Payer",          value: d.payer },
                              { label: "Coverage",       value: `${d.coveragePercent}%` },
                              { label: "Notes",          value: d.notes },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                                <p className="text-gray-700">{value}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {details.length} records
        </div>
      </div>
    </Layout>
  );
};

export default BillingDetails;