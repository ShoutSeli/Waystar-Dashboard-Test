import React, { useState } from "react";
import Layout from "./Layout";
import { downloadClaimEDI, downloadClaimPDF } from "../utils/downloadClaim";

interface BillingDetail {
  claimId: string; patientName: string; encounterId: string; serviceDate: string;
  amount: number; status: string; insurance: string; department: string;
  paymentMethod: string; transactionId?: string; payer: string;
  coveragePercent: number; notes: string;
}

// ─── Shared design tokens ──────────────────────────────────────────────────
const CARD       = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200";
const TH         = "px-4 py-3 text-left text-base font-medium text-slate-800 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap";
const TD         = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-300";
const TDM        = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100";
const FOOT       = "px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 text-xs text-slate-400 dark:text-slate-500";
const BTN_ICON   = "inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors";
//const BTN_PRIMARY = "inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-color-3 to-color-4 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-40 disabled:cursor-not-allowed";
// ──────────────────────────────────────────────────────────────────────────

const BillingDetails: React.FC = () => {
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [expandedRow, setExpandedRow]     = useState<string | null>(null);

  const [details] = useState<BillingDetail[]>([
    { claimId:"C-5001", patientName:"Aurelia Koomson", encounterId:"E-701", serviceDate:"2026-03-15", amount:1200, status:"Pending",   insurance:"BlueCross",    department:"Cardiology",   paymentMethod:"Credit Card",         transactionId:"TXN-987654", payer:"BlueCross Insurance",    coveragePercent:80, notes:"Awaiting insurance verification" },
    { claimId:"C-5002", patientName:"Kwabena Owusu",   encounterId:"E-702", serviceDate:"2026-03-16", amount:850,  status:"Submitted", insurance:"Aetna",        department:"Orthopedics",  paymentMethod:"Bank Transfer",        transactionId:"TXN-123456", payer:"Aetna Insurance",        coveragePercent:75, notes:"Submitted successfully" },
    { claimId:"C-5003", patientName:"Zainab Alhassan", encounterId:"E-703", serviceDate:"2026-03-17", amount:1500, status:"Pending",   insurance:"UnitedHealth", department:"Neurology",    paymentMethod:"Cash",                                             payer:"UnitedHealth Insurance", coveragePercent:70, notes:"Pending approval" },
    { claimId:"C-5004", patientName:"Kojo Mensah",     encounterId:"E-704", serviceDate:"2026-03-18", amount:975,  status:"Pending",   insurance:"BlueCross",    department:"Dermatology",  paymentMethod:"Check",               transactionId:"CHK-445566", payer:"BlueCross Insurance",    coveragePercent:65, notes:"Awaiting check clearance" },
    { claimId:"C-5005", patientName:"Ama Boateng",     encounterId:"E-705", serviceDate:"2026-03-19", amount:1100, status:"Submitted", insurance:"Aetna",        department:"Pediatrics",   paymentMethod:"Debit Card",           transactionId:"TXN-778899", payer:"Aetna Insurance",        coveragePercent:85, notes:"Processed" },
    { claimId:"C-5006", patientName:"Yaw Darko",       encounterId:"E-706", serviceDate:"2026-03-20", amount:1320, status:"Pending",   insurance:"UnitedHealth", department:"Oncology",     paymentMethod:"Insurance Direct Pay", transactionId:"INS-223344", payer:"UnitedHealth Insurance", coveragePercent:90, notes:"Pending insurer confirmation" },
    { claimId:"C-5007", patientName:"Efua Sackey",     encounterId:"E-707", serviceDate:"2026-03-21", amount:890,  status:"Submitted", insurance:"BlueCross",    department:"Gynecology",   paymentMethod:"Credit Card",          transactionId:"TXN-556677", payer:"BlueCross Insurance",    coveragePercent:78, notes:"Approved" },
    { claimId:"C-5008", patientName:"Kwesi Adjei",     encounterId:"E-708", serviceDate:"2026-03-22", amount:1450, status:"Pending",   insurance:"Aetna",        department:"Orthopedics",  paymentMethod:"Bank Transfer",        transactionId:"TXN-889900", payer:"Aetna Insurance",        coveragePercent:72, notes:"Awaiting insurance" },
    { claimId:"C-5009", patientName:"Akua Nkrumah",    encounterId:"E-709", serviceDate:"2026-03-23", amount:1025, status:"Submitted", insurance:"UnitedHealth", department:"Cardiology",   paymentMethod:"Check",               transactionId:"CHK-112233", payer:"UnitedHealth Insurance", coveragePercent:68, notes:"Submitted successfully" },
    { claimId:"C-5010", patientName:"Selorm Tetteh",   encounterId:"E-710", serviceDate:"2026-03-24", amount:1180, status:"Pending",   insurance:"BlueCross",    department:"Neurology",    paymentMethod:"Debit Card",           transactionId:"TXN-334455", payer:"BlueCross Insurance",    coveragePercent:82, notes:"Pending approval" },
  ]);

  const totalBilled    = details.reduce((s, d) => s + d.amount, 0);
  const submittedCount = details.filter(d => d.status === "Submitted").length;
  const pendingCount   = details.filter(d => d.status === "Pending").length;

  const filtered = details.filter(d =>
    (statusFilter === "All" || d.status === statusFilter) &&
    (d.patientName.toLowerCase().includes(search.toLowerCase()) ||
     d.claimId.toLowerCase().includes(search.toLowerCase()) ||
     d.insurance.toLowerCase().includes(search.toLowerCase()))
  );

  const summaryCards = [
    { label: "Total Billed", value: `$${totalBilled.toLocaleString()}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Submitted",    value: submittedCount,                     icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Pending",      value: pendingCount,                       icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <Layout currentPage="Billing Details">

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {summaryCards.map(({ label, value, icon }) => (
          <div key={label} className={`${CARD} p-5`}>
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
            </div>
            <p className="text-base font-medium text-slate-800 dark:text-slate-400 mb-1">{label}</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search patient, claim, insurer…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none font-medium focus:ring-2 focus:ring-slate-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 dark:placeholder-slate-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-sm focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
          {["All", "Submitted", "Pending"].map(s => <option key={s}>{s}</option>)}
        </select>
        <p className="text-sm font-medium text-slate-800 self-center sm:ml-auto">Showing {filtered.length} of {details.length}</p>
      </div>

      {/* Desktop Table */}
      <div className={`${CARD} overflow-hidden hidden md:block`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                {["Claim ID","Patient","Service Date","Amount","Status","Insurance","Department","Payment",""].map((h,i) => (
                  <th key={i} className={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm font-medium text-slate-800">No billing records match your filters.</td></tr>
              )}
              {filtered.map(d => (
                <React.Fragment key={d.claimId}>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{d.claimId}</td>
                    <td className={TDM}>{d.patientName}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{d.serviceDate}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">${d.amount.toLocaleString()}</td>
                    <td className={TD}>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium
                        ${d.status === "Submitted" ? "text-slate-800 dark:bg-slate-200 dark:text-slate-800" : "text-slate-800 dark:bg-slate-700 dark:text-slate-300"}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className={TD}>{d.insurance}</td>
                    <td className={TD}>{d.department}</td>
                    <td className={TD}>{d.paymentMethod}</td>
                    <td className="px-4 py-3">
                      {/* Expand */}
                      <button title="View details" onClick={() => setExpandedRow(expandedRow === d.claimId ? null : d.claimId)} className={BTN_ICON}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedRow === d.claimId ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} /></svg>
                      </button>
                    </td>
                  </tr>
                  {expandedRow === d.claimId && (
                    <tr className="bg-slate-50/60 dark:bg-slate-700/20">
                      <td colSpan={9} className="px-6 py-4">
                        <div className="grid grid-cols-4 gap-6 text-sm mb-4">
                          {[
                            { l: "Encounter ID",   v: d.encounterId },
                            { l: "Transaction ID", v: d.paymentMethod !== "Cash" ? d.transactionId ?? "—" : "—" },
                            { l: "Payer",          v: d.payer },
                            { l: "Coverage",       v: `${d.coveragePercent}%` },
                          ].map(({ l, v }) => (
                            <div key={l}><p className="text-sm font-medium text-slate-800 uppercase tracking-wide mb-1">{l}</p><p className="text-sm font-medium text-slate-800 dark:text-slate-300">{v}</p></div>
                          ))}
                          <div className="col-span-4"><p className="text-sm font-medium text-slate-800 uppercase tracking-wide mb-1">Notes</p><p className="text-sm font-medium text-slate-800 dark:text-slate-300">{d.notes}</p></div>
                        </div>
                        <div className="flex gap-2">
                          {/* Download EDI */}
                          <button title="Download EDI file" onClick={() => downloadClaimEDI(d.claimId, d.patientName, d.amount)}
                            className="bg-slate-200 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" /></svg>EDI
                          </button>
                          {/* Download PDF */}
                          <button title="Download PDF file" onClick={() => downloadClaimPDF(d.claimId, d.patientName, d.amount, d.status)}
                            className="bg-slate-200 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className={FOOT}>Showing {filtered.length} of {details.length} records</div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && <div className={`${CARD} p-8 text-center text-sm font-medium text-slate-800`}>No billing records match your filters.</div>}
        {filtered.map(d => (
          <div key={d.claimId} className={`${CARD} p-4 space-y-3`}>
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-slate-800 tabular-nums">{d.claimId}</span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${d.status === "Submitted" ? "text-slate-800" : "text-slate-800 dark:bg-slate-700"}`}>{d.status}</span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{d.patientName}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-slate-800 font-medium mb-0.5">Amount</p><p className="font-medium text-slate-800 dark:text-slate-200">${d.amount.toLocaleString()}</p></div>
              <div><p className="text-slate-800 font-medium mb-0.5">Insurance</p><p className="font-medium text-slate-800 dark:text-slate-300">{d.insurance}</p></div>
              <div><p className="text-slate-800 font-medium mb-0.5">Department</p><p className="font-medium text-slate-800 dark:text-slate-300">{d.department}</p></div>
              <div><p className="text-slate-800 font-medium mb-0.5">Date</p><p className="font-medium text-slate-800 dark:text-slate-300">{d.serviceDate}</p></div>
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button title="Download EDI" onClick={() => downloadClaimEDI(d.claimId, d.patientName, d.amount)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" /></svg>EDI
              </button>
              <button title="Download PDF" onClick={() => downloadClaimPDF(d.claimId, d.patientName, d.amount, d.status)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default BillingDetails;