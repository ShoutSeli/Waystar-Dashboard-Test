import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Layout from "./Layout";
import { useNotifications } from "../context/NotificationContext";

interface Patient { id: string; name: string; status: string; }

// ─── Shared design tokens ──────────────────────────────────────────────────
const CARD  = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200";
const TH    = "px-4 py-3 text-left text-base font-medium text-slate-800 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap";
const TD    = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-300";
const TDM   = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100";
const FOOT  = "px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 text-xs text-slate-400 dark:text-slate-500";
const INPUT = "w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 transition";

const ROW_EVEN = { backgroundColor: "#f2f2f2" };
const ROW_ODD  = { backgroundColor: "#5114961c" };

const ACTIONS_BTN = "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 bg-white border border-red-500 rounded-lg hover:bg-red-700 hover:text-white hover:border-red-700 transition-colors dark:bg-slate-800 dark:hover:bg-red-700";
const BTN_PRIMARY = "inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-opacity shadow-sm disabled:opacity-40 disabled:cursor-not-allowed";

const statusCls: Record<string, string> = {
  Eligible:       "text-slate-800 text-sm font-medium dark:bg-slate-200 dark:text-slate-800",
  "Not Eligible": "text-slate-800 text-sm font-medium dark:bg-slate-700 dark:text-slate-300",
  "Checking...":  "text-slate-800 text-sm font-medium dark:bg-slate-700 dark:text-slate-400",
  Pending:        "text-slate-800 text-sm font-medium dark:bg-slate-700 dark:text-slate-400",
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

// ── Icon components ──
const MoreDetailsIcon = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const EditIcon        = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const DeleteIcon      = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const CheckIcon       = <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;

const EligibilityCheck: React.FC = () => {
  const { addNotification } = useNotifications();
  const [patients, setPatients] = useState<Patient[]>([
    { id: "P-1001", name: "Samuel Johnson",   status: "Pending" },
    { id: "P-1002", name: "Jane Smith",        status: "Pending" },
    { id: "P-1003", name: "Ebenezer Mensah",   status: "Pending" },
    { id: "P-1004", name: "Amina Mohammed",    status: "Pending" },
    { id: "P-1005", name: "Kwame Asante",      status: "Pending" },
    { id: "P-1006", name: "Yaa Asantewaa",     status: "Pending" },
    { id: "P-1007", name: "Gabriel Goodison",  status: "Pending" },
    { id: "P-1008", name: "Grace Osei",        status: "Pending" },
    { id: "P-1009", name: "Lisa Payet",        status: "Pending" },
    { id: "P-1010", name: "Michael Thompson",  status: "Pending" },
  ]);

  const [expandedRow, setExpandedRow]         = useState<string | null>(null);
  const [editingPatient, setEditingPatient]   = useState<Patient | null>(null);
  const [editName, setEditName]               = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner]     = useState<string | null>(null);

  const showSuccess = (msg: string) => { setSuccessBanner(msg); setTimeout(() => setSuccessBanner(null), 3500); };

  const sendCheck = (id: string) => {
    const patient = patients.find(p => p.id === id);
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status: "Checking..." } : p));
    setTimeout(() => {
      const eligible = Math.random() > 0.5;
      const newStatus = eligible ? "Eligible" : "Not Eligible";
      setPatients(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      addNotification({ type: eligible ? "success" : "error",
        title: `Eligibility ${eligible ? "Confirmed" : "Denied"}`,
        message: `${patient?.name ?? id} marked as ${newStatus}.`, claimId: id });
    }, 2000);
  };

  const checkAll = () => {
    const pending = patients.filter(p => p.status === "Pending");
    pending.forEach(p => sendCheck(p.id));
    if (pending.length > 0)
      addNotification({ type: "info", title: "Bulk Check Started", message: `Checking ${pending.length} patient(s)…` });
  };

  const openEdit = (p: Patient) => { setEditingPatient(p); setEditName(p.name); };
  const saveEdit = () => {
    if (!editingPatient) return;
    setPatients(prev => prev.map(p => p.id === editingPatient.id ? { ...p, name: editName } : p));
    showSuccess(`Patient ${editingPatient.id} updated.`);
    addNotification({ type: "info", title: "Patient Updated", claimId: editingPatient.id, message: `Name updated to "${editName}".` });
    setEditingPatient(null);
  };
  const handleDelete = (id: string) => {
    const p = patients.find(p => p.id === id);
    setPatients(prev => prev.filter(p => p.id !== id));
    if (expandedRow === id) setExpandedRow(null);
    showSuccess(`Patient record ${id} deleted.`);
    addNotification({ type: "warning", title: "Record Deleted", claimId: id, message: `${p?.name ?? id} removed.` });
    setDeleteConfirmId(null);
  };

  const eligibleCount    = patients.filter(p => p.status === "Eligible").length;
  const notEligibleCount = patients.filter(p => p.status === "Not Eligible").length;
  const pendingCount     = patients.filter(p => p.status === "Pending" || p.status === "Checking...").length;

  const summaryCards = [
    { label: "Eligible",           value: eligibleCount,    color: "#f97316", icon: <><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></> },
    { label: "Not Eligible",       value: notEligibleCount, color: "#ef4444", icon: <><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></> },
    { label: "Pending / Checking", value: pendingCount,     color: "#808080", icon: <><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></> },
  ]; 

  return (
    <Layout currentPage="Eligibility Check">
      {successBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium w-[calc(100%-2rem)] max-w-md">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span className="truncate">{successBanner}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-10 mb-6 style={{ color }}">
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

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">{patients.length} patients</p>
        <button onClick={checkAll} disabled={pendingCount === 0} className={BTN_PRIMARY}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          Check All Pending
        </button>
      </div>

      {/* Desktop Table */}
      <div className={`${CARD} overflow-hidden hidden sm:block`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                {["Patient ID", "Name", "Status", "Actions"].map(h => (
                  <th key={h} className={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, idx) => {
                const pillCls    = statusCls[patient.status] ?? statusCls["Pending"];
                const label      = patient.status === "Checking..." ? "Checking…" : patient.status;
                const isChecking = patient.status === "Checking...";
                const isDone     = patient.status === "Eligible" || patient.status === "Not Eligible";
                return (
                  <React.Fragment key={patient.id}>
                    <tr style={idx % 2 === 0 ? ROW_ODD : ROW_EVEN} className="hover:opacity-90 transition-opacity">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{patient.id}</td>
                      <td className={TDM}>{patient.name}</td>
                      <td className={TD}>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium text-slate-800 ${pillCls}`}>{label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <ActionsDropdown>
                          <DropdownItem icon={MoreDetailsIcon} label="More Details" onClick={() => setExpandedRow(expandedRow === patient.id ? null : patient.id)} />
                          <DropdownItem icon={EditIcon}        label="Edit"         onClick={() => openEdit(patient)} />
                          <DropdownItem icon={DeleteIcon}      label="Delete"       onClick={() => setDeleteConfirmId(patient.id)} />
                          {!isDone && (
                            <DropdownItem
                              icon={isChecking
                                ? <svg className="w-4 h-4 text-red-500 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                : CheckIcon}
                              label={isChecking ? "Checking…" : "Check Eligibility"}
                              onClick={() => sendCheck(patient.id)}
                              disabled={isChecking}
                            />
                          )}
                          {isDone && (
                            <DropdownItem icon={<svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>} label="Verified" onClick={() => {}} disabled />
                          )}
                        </ActionsDropdown>
                      </td>
                    </tr>
                    {expandedRow === patient.id && (
                      <tr className="bg-slate-50/60 dark:bg-slate-700/20">
                        <td colSpan={4} className="px-6 py-4">
                          <div className="grid grid-cols-3 gap-6 text-sm">
                            {[{ l: "Patient ID", v: patient.id }, { l: "Name", v: patient.name }, { l: "Status", v: label }].map(({ l, v }) => (
                              <div key={l}><p className="text-sm font-medium text-slate-800 uppercase tracking-wide mb-1 dark:text-white">{l}</p><p className="text-sm font-medium text-slate-800 dark:text-slate-300">{v}</p></div>
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
        <div className={FOOT}>{patients.length} total patients</div>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {patients.map(patient => {
          const pillCls    = statusCls[patient.status] ?? statusCls["Pending"];
          const label      = patient.status === "Checking..." ? "Checking…" : patient.status;
          const isChecking = patient.status === "Checking...";
          const isDone     = patient.status === "Eligible" || patient.status === "Not Eligible";
          return (
            <div key={patient.id} className={`${CARD} p-4 space-y-3`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-800 tabular-nums">{patient.id}</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium text-slate-800 ${pillCls}`}>{label}</span>
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{patient.name}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                {isDone
                  ? <span className="text-sm font-medium text-slate-800 flex-1">Verified</span>
                  : <button onClick={() => sendCheck(patient.id)} disabled={isChecking}
                      className={`flex-1 ${BTN_PRIMARY} justify-center`}>
                      {isChecking ? "Checking…" : "Check Eligibility"}
                    </button>}
                <button onClick={() => openEdit(patient)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors border border-red-200 dark:border-slate-600">
                  {EditIcon}
                </button>
                <button onClick={() => setDeleteConfirmId(patient.id)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors border border-red-200 dark:border-slate-600">
                  {DeleteIcon}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">Delete Patient Record</h3>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-400 mb-5">Delete <span className="font-semibold dark:text-slate-200">{deleteConfirmId}</span>? This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h2 className="text-sm font-medium text-slate-800 dark:text-white">Edit Patient</h2>
                <p className="text-sm font-medium text-slate-800 dark:text-white">{editingPatient.id}</p>
              </div>
              <button onClick={() => setEditingPatient(null)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <label className="text-sm font-medium text-slate-800 uppercase tracking-wide block mb-1.5 dark:text-white">Full Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className={INPUT} />
            </div>
            <div className="flex gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-b-2xl">
              <button onClick={() => setEditingPatient(null)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg hover:bg-slate-50 transition">Cancel</button>
              <button onClick={saveEdit} className={`flex-1 ${BTN_PRIMARY} justify-center`}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EligibilityCheck;