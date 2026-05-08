import React, { useState } from "react";
import Layout from "./Layout";
import { useNotifications } from "../context/NotificationContext";

interface Patient { id: string; name: string; status: string; }

// ─── Shared design tokens ──────────────────────────────────────────────────
const CARD = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200";
const TH   = "px-4 py-3 text-left text-base font-medium text-slate-800 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap";
const TD   = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-300";
const TDM  = "px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100";
const FOOT = "px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 text-xs text-slate-400 dark:text-slate-500";
const BTN_ICON = "inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-800 dark:text-white hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors";
const BTN_PRIMARY = "inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-opacity shadow-sm disabled:opacity-40 disabled:cursor-not-allowed";
// ──────────────────────────────────────────────────────────────────────────

const statusCls: Record<string, string> = {
  Eligible:       "text-slate-800 text-sm font-medium dark:bg-slate-200 dark:text-slate-800",
  "Not Eligible": "text-slate-800 text-sm font-medium dark:bg-slate-700 dark:text-slate-300",
  "Checking...":  "text-slate-800 text-sm font-medium dark:bg-slate-700 dark:text-slate-400",
  Pending:        "text-slate-800 text-sm font-medium dark:bg-slate-700 dark:text-slate-400",
};

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

  const [expandedRow, setExpandedRow]       = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editName, setEditName]             = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner]   = useState<string | null>(null);

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

  const openEdit  = (p: Patient) => { setEditingPatient(p); setEditName(p.name); };
  const saveEdit  = () => {
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
    { label: "Eligible",           value: eligibleCount,    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Not Eligible",       value: notEligibleCount, icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Pending / Checking", value: pendingCount,     icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
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
                {["Patient ID", "Name", "Status", "Actions"].map(h => <th key={h} className={h === "Actions" ? `${TH} translate-x-25` : TH}>{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {patients.map(patient => {
                const pillCls = statusCls[patient.status] ?? statusCls["Pending"];
                const label   = patient.status === "Checking..." ? "Checking…" : patient.status;
                const isChecking = patient.status === "Checking...";
                const isDone     = patient.status === "Eligible" || patient.status === "Not Eligible";
                return (
                  <React.Fragment key={patient.id}>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800 tabular-nums">{patient.id}</td>
                      <td className={TDM}>{patient.name}</td>
                      <td className={TD}>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium text-slate-800 ${pillCls}`}>{label}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 translate-x-25">
                          {/* Expand */}
                          <button title="View details" onClick={() => setExpandedRow(expandedRow === patient.id ? null : patient.id)} className={BTN_ICON}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedRow === patient.id ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} /></svg>
                          </button>
                          {/* Edit */}
                          <button title="Edit patient" onClick={() => openEdit(patient)} className={BTN_ICON}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          {/* Delete */}
                          <button title="Delete patient" onClick={() => setDeleteConfirmId(patient.id)} className={BTN_ICON}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                          {/* Check / Verified */}
                          {isDone
                            ? <span className="text-sm font-medium text-slate-800 ml-1 dark:text-white">Verified</span>
                            : <button title="Check eligibility" onClick={() => sendCheck(patient.id)} disabled={isChecking}
                                className={`translate-x-10 ml-8 ${BTN_PRIMARY} py-1.5 text-sm font-medium text-slate-800`}>
                                {isChecking
                                  ? <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Checking…</>
                                  : "Check"}
                              </button>}
                        </div>
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
          const pillCls = statusCls[patient.status] ?? statusCls["Pending"];
          const label   = patient.status === "Checking..." ? "Checking…" : patient.status;
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
                {isDone ? <span className="text-sm font-medium text-slate-800 flex-1">Verified</span>
                  : <button onClick={() => sendCheck(patient.id)} disabled={isChecking} className={`flex-1 ${BTN_PRIMARY} justify-center`}>
                      {isChecking ? "Checking…" : "Check Eligibility"}
                    </button>}
                <button title="Edit patient" onClick={() => openEdit(patient)} className={BTN_ICON}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button title="Delete patient" onClick={() => setDeleteConfirmId(patient.id)} className={BTN_ICON}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
            <p className="text-sm font-medium text-slate-800 dark:text-slate-400 mb-5">Delete <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{deleteConfirmId}</span>? This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-slate-700 dark:bg-slate-700 rounded-lg hover:bg-slate-900 transition">Delete</button>
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
              <button title="Close" onClick={() => setEditingPatient(null)} className={BTN_ICON}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <label className="text-sm font-medium text-slate-800 uppercase tracking-wide block mb-1.5 dark:text-white">Full Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 transition" />
            </div>
            <div className="flex gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-b-2xl">
              <button onClick={() => setEditingPatient(null)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:hover:bg-slate-800 rounded-lg hover:bg-slate-50 transition">Cancel</button>
              <button onClick={saveEdit} className={`flex-1 ${BTN_PRIMARY} justify-center`}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EligibilityCheck;