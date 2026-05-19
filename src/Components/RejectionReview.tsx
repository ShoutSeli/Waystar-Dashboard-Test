import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Layout from "./Layout";

interface Rejection {
  claimId: string; patientName: string; department: string;
  rejectionReason: string; rejectionDate: string; suggestedAction: string;
}

// ─── Shared design tokens ──────────────────────────────────────────────────
const CARD       = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200";
const TH         = "px-4 py-3 text-left text-base font-medium text-slate-800 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap";
const TD         = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-300";
const TDM        = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100";
const FOOT       = "px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 text-xs text-slate-400 dark:text-slate-500";

// Row stripe colors from table_stripe_style
const ROW_EVEN = { backgroundColor: "#f2f2f2" };
const ROW_ODD  = { backgroundColor: "#5114961c" };

// Actions dropdown button
const ACTIONS_BTN = "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 bg-white border border-red-500 rounded-lg hover:bg-red-700 hover:text-white hover:border-red-700 transition-colors dark:bg-slate-800 dark:hover:bg-red-700";
// ──────────────────────────────────────────────────────────────────────────

/** Dropdown menu that closes when clicking outside */
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

/** A single item inside the dropdown */
const DropdownItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
  >
    {icon}
    {label}
  </button>
);

const RejectionReview: React.FC = () => {
  const [search, setSearch]         = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [rejections] = useState<Rejection[]>([
    { claimId:"R-7001", patientName:"Aurelia Koomson",  department:"Cardiology",  rejectionReason:"Missing documentation",      rejectionDate:"2026-03-20", suggestedAction:"Upload required medical records" },
    { claimId:"R-7002", patientName:"Kwabena Owusu",    department:"Orthopedics", rejectionReason:"Invalid billing code",        rejectionDate:"2026-03-21", suggestedAction:"Correct CPT code and resubmit" },
    { claimId:"R-7003", patientName:"Zainab Alhassan",  department:"Neurology",   rejectionReason:"Policy expired",              rejectionDate:"2026-03-22", suggestedAction:"Update insurance policy details" },
    { claimId:"R-7004", patientName:"Kojo Mensah",      department:"Dermatology", rejectionReason:"Duplicate claim submission",  rejectionDate:"2026-03-23", suggestedAction:"Remove duplicate and resubmit once" },
    { claimId:"R-7005", patientName:"Ama Boateng",      department:"Pediatrics",  rejectionReason:"Incorrect patient ID",        rejectionDate:"2026-03-24", suggestedAction:"Verify patient demographics" },
    { claimId:"R-7006", patientName:"Yaw Darko",        department:"Oncology",    rejectionReason:"Coverage not applicable",     rejectionDate:"2026-03-25", suggestedAction:"Confirm coverage with insurer" },
    { claimId:"R-7007", patientName:"Efua Sackey",      department:"Gynecology",  rejectionReason:"Incomplete claim form",       rejectionDate:"2026-03-25", suggestedAction:"Fill missing fields and resubmit" },
    { claimId:"R-7008", patientName:"Kwesi Adjei",      department:"Orthopedics", rejectionReason:"Insurer system error",        rejectionDate:"2026-03-26", suggestedAction:"Retry submission after 24 hours" },
    { claimId:"R-7009", patientName:"Akua Nkrumah",     department:"Cardiology",  rejectionReason:"Exceeded coverage limit",     rejectionDate:"2026-03-26", suggestedAction:"Request prior authorization" },
    { claimId:"R-7010", patientName:"Selorm Tetteh",    department:"Neurology",   rejectionReason:"Incorrect claim format",      rejectionDate:"2026-03-27", suggestedAction:"Use correct claim template" },
    { claimId:"R-7011", patientName:"Kwame Agyeman",    department:"Radiology",   rejectionReason:"Missing physician signature", rejectionDate:"2026-03-27", suggestedAction:"Obtain signature and resubmit" },
    { claimId:"R-7012", patientName:"Akosua Bediako",   department:"Pediatrics",  rejectionReason:"Coverage limit exceeded",     rejectionDate:"2026-03-28", suggestedAction:"Request insurer override" },
    { claimId:"R-7013", patientName:"Nii Lamptey",      department:"Orthopedics", rejectionReason:"Incorrect patient DOB",       rejectionDate:"2026-03-28", suggestedAction:"Correct demographics and resubmit" },
    { claimId:"R-7014", patientName:"Adwoa Sarpong",    department:"Cardiology",  rejectionReason:"Claim submitted late",        rejectionDate:"2026-03-29", suggestedAction:"File appeal for late submission" },
    { claimId:"R-7015", patientName:"Kojo Antwi",       department:"Neurology",   rejectionReason:"Invalid insurer ID",          rejectionDate:"2026-03-29", suggestedAction:"Update insurer details" },
    { claimId:"R-7016", patientName:"Ama Ofori",        department:"Oncology",    rejectionReason:"Incorrect billing format",    rejectionDate:"2026-03-30", suggestedAction:"Use correct billing template" },
    { claimId:"R-7017", patientName:"Yaw Asante",       department:"Dermatology", rejectionReason:"Missing lab results",         rejectionDate:"2026-03-30", suggestedAction:"Attach lab results" },
    { claimId:"R-7018", patientName:"Efua Addo",        department:"Gynecology",  rejectionReason:"Coverage not active",         rejectionDate:"2026-03-31", suggestedAction:"Verify active coverage" },
    { claimId:"R-7019", patientName:"Kwesi Tetteh",     department:"Orthopedics", rejectionReason:"Duplicate patient record",    rejectionDate:"2026-03-31", suggestedAction:"Merge records and resubmit" },
    { claimId:"R-7020", patientName:"Akua Mensima",     department:"Cardiology",  rejectionReason:"Incorrect insurer plan",      rejectionDate:"2026-03-31", suggestedAction:"Update plan details" },
  ]);

  const reasonCounts = rejections.reduce<Record<string, number>>((acc, r) => {
    acc[r.rejectionReason] = (acc[r.rejectionReason] || 0) + 1;
    return acc;
  }, {});
  const topReason  = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const deptCount  = new Set(rejections.map(r => r.department)).size;
  const departments = ["All", ...new Set(rejections.map(r => r.department))];

  const filtered = rejections.filter(r =>
    (deptFilter === "All" || r.department === deptFilter) &&
    (r.patientName.toLowerCase().includes(search.toLowerCase()) ||
     r.claimId.toLowerCase().includes(search.toLowerCase()) ||
     r.rejectionReason.toLowerCase().includes(search.toLowerCase()))
  );

  const summaryCards = [
    { label: "Total Rejections",    value: rejections.length, color: "#ef4444", icon: <><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></> },
    { label: "Departments Affected", value: deptCount,        color: "#f97316", icon: <><path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-4.5A.75.75 0 019 19.5z" clipRule="evenodd" /></> },
    { label: "Top Reason",          value: topReason,         color: "#808080", icon: <><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></>, small: true },
  ];

  // Shared icon components
  const MoreDetailsIcon = (
    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <Layout currentPage="Rejection Review">

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-10 mb-6">
        {summaryCards.map(({ label, value, icon, color, small }) => (
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
              <p className="text-sm font-medium text-white" title={String(value)}>
                {small ? <span className="line-clamp-2">{value}</span> : value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search patient, ID, or reason…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 dark:placeholder-slate-500" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <p className="text-xs text-slate-400 self-center sm:ml-auto">Showing {filtered.length} of {rejections.length}</p>
      </div>

      {/* Desktop Table */}
      <div className={`${CARD} overflow-hidden hidden sm:block`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                {["Claim ID", "Patient", "Department", "Rejection Reason", "Date", "Actions"].map(h => (
                  <th key={h} className={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm font-medium text-slate-800">No rejections match your current filters.</td></tr>
              )}
              {filtered.map((r, idx) => (
                <React.Fragment key={r.claimId}>
                  <tr style={idx % 2 === 0 ? ROW_ODD : ROW_EVEN} className="hover:opacity-90 transition-opacity">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{r.claimId}</td>
                    <td className={TDM}>{r.patientName}</td>
                    <td className={TD}>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium dark:bg-slate-700 text-slate-800 dark:text-slate-300">
                        {r.department}
                      </span>
                    </td>
                    <td className={TD}>{r.rejectionReason}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{r.rejectionDate}</td>
                    <td className="px-4 py-3">
                      <ActionsDropdown>
                        <DropdownItem
                          icon={MoreDetailsIcon}
                          label="More Details"
                          onClick={() => setExpandedRow(expandedRow === r.claimId ? null : r.claimId)}
                        />
                      </ActionsDropdown>
                    </td>
                  </tr>
                  {expandedRow === r.claimId && (
                    <tr className="bg-slate-50/60 dark:bg-slate-700/20">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 uppercase tracking-wide mb-1 dark:text-white">Suggested Action</p>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-300">{r.suggestedAction}</p>
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
        <div className={FOOT}>Showing {filtered.length} of {rejections.length} records</div>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 && (
          <div className={`${CARD} p-8 text-center text-sm font-medium text-slate-800`}>No rejections match your filters.</div>
        )}
        {filtered.map(r => (
          <div key={r.claimId} className={`${CARD} p-4 space-y-3`}>
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-slate-800 tabular-nums">{r.claimId}</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
                {r.department}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{r.patientName}</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-300">{r.rejectionReason}</p>
            <p className="text-sm font-medium text-slate-800 tabular-nums">{r.rejectionDate}</p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-400 uppercase tracking-wide mb-1">Suggested Action</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-300">{r.suggestedAction}</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default RejectionReview;