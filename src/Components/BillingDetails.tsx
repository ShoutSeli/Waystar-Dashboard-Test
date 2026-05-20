import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Layout from "./Layout";
import { downloadClaimEDI, downloadClaimPDF } from "../utils/downloadClaim";

interface BillingDetail {
  claimId: string; patientName: string; encounterId: string; serviceDate: string;
  amount: number; status: string; insurance: string; department: string;
  paymentMethod: string; transactionId?: string; payer: string;
  coveragePercent: number; notes: string;
}

// ─── Shared design tokens ──────────────────────────────────────────────────
const CARD  = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200";
const TH    = "px-4 py-3 text-left text-base font-medium text-slate-800 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap";
const TD    = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-300";
const TDM   = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100";
const FOOT  = "px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 text-xs text-slate-400 dark:text-slate-500";

const ROW_EVEN = { backgroundColor: "#f2f2f2" };
const ROW_ODD  = { backgroundColor: "#5114961c" };

const ACTIONS_BTN = "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 bg-white border border-red-500 rounded-lg hover:bg-red-700 hover:text-white hover:border-red-700 transition-colors dark:bg-slate-800 dark:hover:bg-red-700";
// ──────────────────────────────────────────────────────────────────────────

const ActionsDropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
    }
    setOpen(o => !o);
  };

  return (
    <div className="relative inline-block">
      <button ref={btnRef} onClick={handleOpen} className={ACTIONS_BTN}>
        Actions
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && ReactDOM.createPortal(
        <div
          ref={menuRef}
          onClick={() => setOpen(false)}
          style={{ position: "absolute", top: coords.top, left: coords.left, minWidth: coords.width, zIndex: 9999 }}
          className="w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1"
        >
          {children}
        </div>,
        document.body
      )}
    </div>
  );
};

const DropdownItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors">
    {icon}{label}
  </button>
);

const MoreDetailsIcon = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const EdiIcon         = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" /></svg>;
const PdfIcon         = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;

const BillingDetails: React.FC = () => {
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedRow, setExpandedRow]   = useState<string | null>(null);

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
    { label: "Total Billed", value: `$${totalBilled.toLocaleString()}`, color: "#ef4444", icon: <><path d="M12 1.5a.75.75 0 01.75.75V7.5h-1.5V2.25A.75.75 0 0112 1.5zM11.25 7.5v5.69l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" /></> },
    { label: "Submitted",    value: submittedCount,                     color: "#f97316", icon: <><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></> },
    { label: "Pending",      value: pendingCount,                       color: "#808080", icon: <><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></> },
  ];

  return (
    <Layout currentPage="Billing Details">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-6">
        {summaryCards.map(({ label, value, icon, color }) => (
<div
            key={label}
            className={`${CARD} p-8 flex items-center gap-4 border-transparent`}
            style={{ backgroundColor: color }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/15">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#fff' }}>
                {icon}
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-base font-medium mb-1 text-white">{label}</p>
              <p className="text-sm font-medium text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search patient, claim, insurer…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none font-medium focus:ring-2 focus:ring-slate-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 dark:placeholder-slate-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
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
                {["Claim ID","Patient","Service Date","Amount","Status","Insurance","Department","Payment","Actions"].map((h,i) => (
                  <th key={i} className={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm font-medium text-slate-800">No billing records match your filters.</td></tr>
              )}
              {filtered.map((d, idx) => (
                <React.Fragment key={d.claimId}>
                  <tr style={idx % 2 === 0 ? ROW_ODD : ROW_EVEN} className="hover:opacity-90 transition-opacity">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{d.claimId}</td>
                    <td className={TDM}>{d.patientName}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{d.serviceDate}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">${d.amount.toLocaleString()}</td>
                    <td className={TD}>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${d.status === "Submitted" ? "text-slate-800 dark:bg-slate-200 dark:text-slate-800" : "text-slate-800 dark:bg-slate-700 dark:text-slate-300"}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className={TD}>{d.insurance}</td>
                    <td className={TD}>{d.department}</td>
                    <td className={TD}>{d.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <ActionsDropdown>
                        <DropdownItem icon={MoreDetailsIcon} label="More Details" onClick={() => setExpandedRow(expandedRow === d.claimId ? null : d.claimId)} />
                        <DropdownItem icon={EdiIcon}         label="Download EDI" onClick={() => downloadClaimEDI(d.claimId, d.patientName, d.amount)} />
                        <DropdownItem icon={PdfIcon}         label="Download PDF" onClick={() => downloadClaimPDF(d.claimId, d.patientName, d.amount, d.status)} />
                      </ActionsDropdown>
                    </td>
                  </tr>
                  {expandedRow === d.claimId && (
                    <tr className="bg-slate-50/60 dark:bg-slate-700/20">
                      <td colSpan={9} className="px-6 py-4">
                        <div className="grid grid-cols-4 gap-6 text-sm mb-2">
                          {[
                            { l: "Encounter ID",   v: d.encounterId },
                            { l: "Transaction ID", v: d.paymentMethod !== "Cash" ? d.transactionId ?? "—" : "—" },
                            { l: "Payer",          v: d.payer },
                            { l: "Coverage",       v: `${d.coveragePercent}%` },
                          ].map(({ l, v }) => (
                            <div key={l}><p className="text-sm font-medium text-slate-800 uppercase tracking-wide mb-1 dark:text-white">{l}</p><p className="text-sm font-medium text-slate-800 dark:text-slate-300">{v}</p></div>
                          ))}
                          <div className="col-span-4"><p className="text-sm font-medium text-slate-800 uppercase tracking-wide mb-1 dark:text-white">Notes</p><p className="text-sm font-medium text-slate-800 dark:text-slate-300">{d.notes}</p></div>
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
              <button onClick={() => downloadClaimEDI(d.claimId, d.patientName, d.amount)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-white border border-red-500 rounded-lg hover:bg-red-700 hover:text-white transition">
                {EdiIcon} EDI
              </button>
              <button onClick={() => downloadClaimPDF(d.claimId, d.patientName, d.amount, d.status)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-white border border-red-500 rounded-lg hover:bg-red-700 hover:text-white transition">
                {PdfIcon} PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default BillingDetails;