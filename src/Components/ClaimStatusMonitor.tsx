import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Layout from "./Layout";
import { useNotifications } from "../context/NotificationContext";

interface ClaimStatus {
  claimId: string; patientName: string;
  status: "Approved" | "Rejected" | "Pending";
  reason: string; date: string;
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

const statusPill: Record<string, string> = {
  Approved: "text-sm text-slate-800 font-medium dark:bg-slate-200 dark:text-slate-800",
  Rejected: "text-sm text-slate-800 font-medium dark:bg-slate-700 dark:text-slate-300",
  Pending:  "text-sm text-slate-800 font-medium dark:bg-slate-700 dark:text-slate-400",
};
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

const DropdownItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }> = ({ icon, label, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
    {icon}{label}
  </button>
);

const ApproveIcon    = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const RejectIcon     = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

const ClaimStatusMonitor: React.FC = () => {
  const { addNotification } = useNotifications();
  const [filter, setFilter] = useState<"All" | "Approved" | "Rejected" | "Pending">("All");
  const [search, setSearch] = useState("");

  const [claims, setClaims] = useState<ClaimStatus[]>([
    { claimId:"C-6001", patientName:"Aurelia Koomson",  status:"Rejected", reason:"Missing documentation",           date:"2026-03-20" },
    { claimId:"C-6002", patientName:"Kwabena Owusu",    status:"Approved", reason:"All requirements met",            date:"2026-03-21" },
    { claimId:"C-6003", patientName:"Zainab Alhassan",  status:"Pending",  reason:"Awaiting insurer response",       date:"2026-03-22" },
    { claimId:"C-6004", patientName:"Kojo Mensah",      status:"Rejected", reason:"Invalid patient ID",              date:"2026-03-23" },
    { claimId:"C-6005", patientName:"Ama Boateng",      status:"Approved", reason:"Verified successfully",           date:"2026-03-24" },
    { claimId:"C-6006", patientName:"Yaw Darko",        status:"Pending",  reason:"Policy expired, awaiting update", date:"2026-03-25" },
    { claimId:"C-6007", patientName:"Efua Sackey",      status:"Rejected", reason:"Incorrect billing code",          date:"2026-03-25" },
    { claimId:"C-6008", patientName:"Kwesi Adjei",      status:"Approved", reason:"Coverage confirmed",              date:"2026-03-25" },
    { claimId:"C-6009", patientName:"Akua Nkrumah",     status:"Pending",  reason:"Insurer system delay",            date:"2026-03-26" },
    { claimId:"C-6010", patientName:"Selorm Tetteh",    status:"Rejected", reason:"Duplicate claim submission",      date:"2026-03-26" },
    { claimId:"C-6011", patientName:"Kwame Agyeman",    status:"Approved", reason:"Insurer confirmed eligibility",   date:"2026-03-27" },
    { claimId:"C-6012", patientName:"Akosua Bediako",   status:"Pending",  reason:"Awaiting patient verification",   date:"2026-03-27" },
    { claimId:"C-6013", patientName:"Nii Lamptey",      status:"Rejected", reason:"Policy not active",               date:"2026-03-28" },
    { claimId:"C-6014", patientName:"Adwoa Sarpong",    status:"Approved", reason:"All documents valid",             date:"2026-03-28" },
    { claimId:"C-6015", patientName:"Kojo Antwi",       status:"Pending",  reason:"Insurer review in progress",      date:"2026-03-29" },
    { claimId:"C-6016", patientName:"Ama Ofori",        status:"Rejected", reason:"Incorrect claim format",          date:"2026-03-29" },
    { claimId:"C-6017", patientName:"Yaw Asante",       status:"Approved", reason:"Coverage confirmed",              date:"2026-03-30" },
    { claimId:"C-6018", patientName:"Efua Addo",        status:"Pending",  reason:"Awaiting insurer system update",  date:"2026-03-30" },
    { claimId:"C-6019", patientName:"Kwesi Tetteh",     status:"Rejected", reason:"Duplicate submission detected",   date:"2026-03-31" },
    { claimId:"C-6020", patientName:"Akua Mensima",     status:"Approved", reason:"Verified successfully",           date:"2026-03-31" },
  ]);

  const updateStatus = (claimId: string, newStatus: "Approved" | "Rejected") => {
    const claim = claims.find(c => c.claimId === claimId);
    if (!claim || claim.status === newStatus) return;
    setClaims(prev => prev.map(c => c.claimId === claimId ? { ...c, status: newStatus } : c));
    addNotification({ type: newStatus === "Approved" ? "success" : "error", title: `Claim ${newStatus}`, claimId,
      message: `Claim ${claimId} for ${claim.patientName} has been ${newStatus.toLowerCase()}.` });
  };

  const approvedCount = claims.filter(c => c.status === "Approved").length;
  const rejectedCount = claims.filter(c => c.status === "Rejected").length;
  const pendingCount  = claims.filter(c => c.status === "Pending").length;

  const filteredClaims = claims.filter(c =>
    (filter === "All" || c.status === filter) &&
    (c.patientName.toLowerCase().includes(search.toLowerCase()) ||
     c.claimId.toLowerCase().includes(search.toLowerCase()))
  );

  const filterButtons: { label: string; value: typeof filter; count: number }[] = [
    { label: "All",      value: "All",      count: claims.length },
    { label: "Approved", value: "Approved", count: approvedCount },
    { label: "Rejected", value: "Rejected", count: rejectedCount },
    { label: "Pending",  value: "Pending",  count: pendingCount },
  ];

  const summaryCards = [
    { label: "Approved", value: approvedCount, color: "#f97316", icon: <><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></> },
    { label: "Rejected", value: rejectedCount, color: "#ef4444", icon: <><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></> },
    { label: "Pending",  value: pendingCount,  color: "#808080", icon: <><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></> },
  ];

  return (
    <Layout currentPage="Claim Status Monitor">
      <div className="grid grid-cols-3 gap-4 mb-6">
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

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map(({ label, value, count }) => (
            <button key={value} onClick={() => setFilter(value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border
                ${filter === value
                  ? "bg-red-500 dark:bg-slate-200 text-white dark:text-slate-800 border-transparent shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"}`}>
              {label}
              <span className={`text-sm px-1.5 py-0.5 rounded-full font-medium
                ${filter === value ? "bg-white/20 text-white dark:bg-slate-800/20 dark:text-slate-800" : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-500"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search patient or claim ID…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 dark:placeholder-slate-500" />
        </div>
      </div>

      {/* Desktop Table */}
      <div className={`${CARD} overflow-hidden hidden sm:block`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                {["Claim ID", "Patient", "Status", "Reason", "Date", "Actions"].map(h => (
                  <th key={h} className={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredClaims.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm font-medium text-slate-800">No claims match your current filters.</td></tr>
              )}
              {filteredClaims.map((c, idx) => (
                <tr key={c.claimId} style={idx % 2 === 0 ? ROW_ODD : ROW_EVEN} className="hover:opacity-90 transition-opacity">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{c.claimId}</td>
                  <td className={TDM}>{c.patientName}</td>
                  <td className={TD}>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium text-slate-800 ${statusPill[c.status]}`}>{c.status}</span>
                  </td>
                  <td className={TD}>{c.reason}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{c.date}</td>
                  <td className="px-4 py-3">
                    {c.status === "Pending" ? (
                      <ActionsDropdown>
                        <DropdownItem icon={ApproveIcon} label="Approve" onClick={() => updateStatus(c.claimId, "Approved")} />
                        <DropdownItem icon={RejectIcon}  label="Reject"  onClick={() => updateStatus(c.claimId, "Rejected")} />
                      </ActionsDropdown>
                    ) : (
                      <span className="text-sm text-slate-800 dark:text-white italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={FOOT}>Showing {filteredClaims.length} of {claims.length} claims</div>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {filteredClaims.length === 0 && <div className={`${CARD} p-8 text-center text-sm font-medium text-slate-800`}>No claims match your filters.</div>}
        {filteredClaims.map(c => (
          <div key={c.claimId} className={`${CARD} p-4 space-y-3`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-800 tabular-nums">{c.claimId}</span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium text-slate-800 ${statusPill[c.status]}`}>{c.status}</span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{c.patientName}</p>
            <p className="text-sm text-slate-800 dark:text-slate-400">{c.reason}</p>
            <p className="text-sm text-slate-800 tabular-nums">{c.date}</p>
            {c.status === "Pending" && (
              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => updateStatus(c.claimId, "Approved")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-white border border-red-500 rounded-lg hover:bg-red-700 hover:text-white transition">
                  {ApproveIcon} Approve
                </button>
                <button onClick={() => updateStatus(c.claimId, "Rejected")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-white border border-red-500 rounded-lg hover:bg-red-700 hover:text-white transition">
                  {RejectIcon} Reject
                </button>
              </div>
            )}
            {c.status !== "Pending" && <p className="text-sm text-slate-800 italic pt-1 border-t border-slate-100 dark:border-slate-700">Processed</p>}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default ClaimStatusMonitor;